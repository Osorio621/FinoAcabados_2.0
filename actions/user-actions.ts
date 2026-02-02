"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

/**
 * Verifica si el usuario actual es SUPER_ADMIN
 */
const checkSuperAdmin = async () => {
    const session = await auth()
    // @ts-ignore
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Acceso denegado: Se requieren permisos de Super Administrador")
    }
    return session
}

/**
 * Obtiene todos los usuarios del sistema
 */
export async function getUsers() {
    try {
        await checkSuperAdmin()

        const users = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        })

        return { success: true, data: users }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Cambia el rol de un usuario
 */
export async function updateUserRole(userId: string, newRole: Role) {
    try {
        const session = await checkSuperAdmin()

        // Evitar que un Super Admin se quite permisos a sí mismo por accidente
        // @ts-ignore
        if (userId === session.user.id && newRole !== "SUPER_ADMIN") {
            return { success: false, error: "No puedes quitarte los permisos de Super Admin a ti mismo" }
        }

        await db.user.update({
            where: { id: userId },
            data: { role: newRole }
        })

        revalidatePath("/admin/users")
        return { success: true, message: "Rol actualizado correctamente" }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Restablece la contraseña de un usuario
 */
export async function resetUserPassword(userId: string, newPassword: string) {
    try {
        await checkSuperAdmin()

        if (newPassword.length < 6) {
            return { success: false, error: "La contraseña debe tener al menos 6 caracteres" }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return { success: true, message: "Contraseña restablecida correctamente" }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Elimina un usuario (opcional, usar con precaución)
 */
export async function deleteUser(userId: string) {
    try {
        const session = await checkSuperAdmin()

        if (userId === session.user.id) {
            return { success: false, error: "No puedes eliminar tu propia cuenta" }
        }

        await db.user.delete({
            where: { id: userId }
        })

        revalidatePath("/admin/users")
        return { success: true, message: "Usuario eliminado" }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

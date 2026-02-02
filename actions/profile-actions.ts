"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(values: { name: string }) {
    try {
        const session = await auth()
        
        if (!session?.user?.email) {
            return { error: "No autorizado" }
        }

        await db.user.update({
            where: { email: session.user.email },
            data: { 
                name: values.name 
            }
        })

        revalidatePath("/admin/settings")
        return { success: "Perfil actualizado correctamente" }
    } catch (error: any) {
        return { error: error.message || "Error al actualizar el perfil" }
    }
}

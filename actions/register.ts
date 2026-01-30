"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { registerSchema } from "@/schemas"

export const register = async (values: z.infer<typeof registerSchema>) => {
    const validatedFields = registerSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Campos inválidos" }
    }

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await db.user.findUnique({
        where: {
            email,
        }
    })

    if (existingUser) {
        return { error: "El correo ya está en uso" }
    }

    try {
        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return { success: "Usuario creado exitosamente" }
    } catch (error) {
        console.error("REGISTRATION_ERROR", error)
        return { error: "Algo salió mal al crear el usuario" }
    }
}

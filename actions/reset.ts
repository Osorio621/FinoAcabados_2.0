"use server"

import * as z from "zod"
import { resetSchema } from "@/schemas"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

export const reset = async (values: z.infer<typeof resetSchema>) => {
    const validatedFields = resetSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Correo inválido" }
    }

    const { email } = validatedFields.data

    const existingUser = await db.user.findUnique({
        where: { email }
    })

    if (!existingUser) {
        return { error: "El correo no existe" }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return { success: "Correo de recuperación enviado" }
}

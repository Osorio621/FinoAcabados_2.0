"use server"

import * as z from "zod"
import { signIn } from "@/lib/auth"
import { loginSchema } from "@/schemas"
import { AuthError } from "next-auth"

export const login = async (values: z.infer<typeof loginSchema>) => {
    console.log('DEBUG: Login Action Received', values.email)
    const validatedFields = loginSchema.safeParse(values)

    if (!validatedFields.success) {
        console.log('DEBUG: Login Action Validation Failed')
        return { error: "Campos inválidos" }
    }

    const { email, password } = validatedFields.data

    try {
        console.log('DEBUG: Login Action Calling signIn')
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/", // Redirect to home after login
        })
        console.log('DEBUG: Login Action signIn SUCCESS (should have redirected)')
        return { success: "Ingreso exitoso" }
    } catch (error) {
        console.log('DEBUG: Login Action Error', error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas" }
                default:
                    return { error: "Algo salió mal" }
            }
        }

        throw error
    }
}

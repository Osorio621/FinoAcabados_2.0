import NextAuth from "next-auth"
import { Role } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "@/auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/schemas"

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await db.user.findUnique({
                        where: { email }
                    })

                    if (!user || !user.password) return null

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    )

                    if (passwordsMatch) return user
                }

                return null
            }
        }),
    ],
})

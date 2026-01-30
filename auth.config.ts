import type { NextAuthConfig } from "next-auth"

export default {
    providers: [],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role
            }

            if (token.name && session.user) {
                session.user.name = token.name
            }

            return session
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role
                token.name = user.name
            }
            return token
        }
    }
} satisfies NextAuthConfig

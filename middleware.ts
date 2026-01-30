import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const role = req.auth?.user?.role

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const publicRoutes = ["/", "/nosotros", "/contacto", "/auth/login", "/auth/register", "/auth/reset", "/auth/new-password"]
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/productos") || nextUrl.pathname.startsWith("/categoria") || nextUrl.pathname.startsWith("/api/debug-slugs")
    const isAdminRoute = nextUrl.pathname.startsWith("/admin")

    if (isApiAuthRoute) return NextResponse.next()

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/login", nextUrl))
        }
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", nextUrl))
        }
        return NextResponse.next()
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth/login", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

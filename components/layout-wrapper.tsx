"use client"

import { usePathname } from "next/navigation"
import { useSidebar } from "@/lib/context/sidebar-context"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
    children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname()
    const { isSidebarOpen } = useSidebar()
    const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/auth/admin")

    return (
        <>
            <Navbar />
            <main
                className={cn(
                    "min-h-screen pt-24 transition-all duration-300",
                    isAdmin && (isSidebarOpen ? "md:pl-72" : "md:pl-20")
                )}
            >
                {children}
            </main>
            <Footer />
        </>
    )
}

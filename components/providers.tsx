"use client"

import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/lib/context/sidebar-context"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </SessionProvider>
    )
}

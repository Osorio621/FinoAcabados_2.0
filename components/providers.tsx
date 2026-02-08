"use client"

import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/lib/context/sidebar-context"
import { CartProvider } from "@/lib/context/cart-context"
import { Toaster } from "sonner"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <SidebarProvider>
                <CartProvider>
                    {children}
                    <Toaster position="top-center" richColors />
                </CartProvider>
            </SidebarProvider>
        </SessionProvider>
    )
}

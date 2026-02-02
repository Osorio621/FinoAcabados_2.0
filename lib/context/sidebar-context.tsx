"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface SidebarContextType {
    isSidebarOpen: boolean
    setIsSidebarOpen: (open: boolean) => void
    toggleSidebar: () => void
    isMobileOpen: boolean
    setIsMobileOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    // Cerrar sidebar móvil al cambiar de ruta
    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    return (
        <SidebarContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
                toggleSidebar,
                isMobileOpen,
                setIsMobileOpen
            }}
        >
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}

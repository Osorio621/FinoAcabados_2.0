"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/lib/context/sidebar-context"
import {
    LayoutDashboard,
    Package,
    Tags,
    Settings,
    ChevronLeft,
    Boxes,
    BadgePercent,
    Menu,
    X,
    Users
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

const staticRoutes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        color: "text-sky-500",
    },
    {
        label: "Productos",
        icon: Package,
        href: "/admin/products",
        color: "text-violet-500",
    },
    {
        label: "Inventario",
        icon: Boxes,
        href: "/admin/inventory",
        color: "text-orange-500",
    },
    {
        label: "Promociones",
        icon: BadgePercent,
        href: "/admin/promotions",
        color: "text-pink-700",
    },
    {
        label: "Categorías",
        icon: Tags,
        href: "/admin/categories",
        color: "text-emerald-500",
    },
]

const settingsRoute = {
    label: "Configuración",
    icon: Settings,
    href: "/admin/settings",
    color: "text-zinc-500",
}

const superAdminRoute = {
    label: "Usuarios",
    icon: Users,
    href: "/admin/users",
    color: "text-red-500",
}

interface AdminShellProps {
    children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
    const { isSidebarOpen, setIsSidebarOpen, toggleSidebar, isMobileOpen, setIsMobileOpen } = useSidebar()
    const pathname = usePathname()
    const { data: session } = useSession()

    const routes = [...staticRoutes]

    // @ts-ignore
    if (session?.user?.role === "SUPER_ADMIN") {
        routes.push(superAdminRoute)
    }

    routes.push(settingsRoute)

    return (
        <div className="h-full relative flex bg-zinc-50 dark:bg-zinc-950">
            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-[60] flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-72" : "w-20",
                    // Mobile behavior
                    "md:translate-x-0", // Always visible on desktop (width changes)
                    isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0" // Hidden on mobile unless open
                )}
            >
                {/* Sidebar Header */}
                <div className={cn(
                    "flex items-center border-b border-zinc-100 dark:border-zinc-800/50 h-20",
                    isSidebarOpen ? "px-6 justify-between" : "justify-center px-0"
                )}>
                    <div className={cn("flex items-center gap-3 overflow-hidden", !isSidebarOpen && "justify-center")}>
                        <div className="min-w-10 w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <Boxes className="text-white h-6 w-6" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-xl tracking-tight text-primary dark:text-white whitespace-nowrap">
                                Admin Panel
                            </span>
                        )}
                    </div>

                    {/* Toggle Button (Desktop only) */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden md:flex p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                    >
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 space-y-1 overflow-x-hidden">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex items-center relative py-3 transition-all",
                                isSidebarOpen ? "px-4 mx-2 rounded-xl" : "justify-center px-2",
                                pathname === route.href
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-primary dark:text-white"
                                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-primary dark:hover:text-white"
                            )}
                            title={!isSidebarOpen ? route.label : undefined}
                        >
                            <div className={cn("flex items-center", !isSidebarOpen && "justify-center w-full")}>
                                <route.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    route.color,
                                    !isSidebarOpen && "h-6 w-6"
                                )} />

                                <span className={cn(
                                    "ml-3 font-medium transition-all duration-300 overflow-hidden whitespace-nowrap",
                                    isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                                )}>
                                    {route.label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer / Back to Site */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center transition-colors rounded-xl text-zinc-500 hover:text-primary dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                            isSidebarOpen ? "px-4 py-3 gap-3" : "justify-center p-3"
                        )}
                        title={!isSidebarOpen ? "Volver al Sitio" : undefined}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className={cn(
                            "text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300",
                            isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                        )}>
                            Volver al Sitio
                        </span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header (Hamburger) - Solo si sidebar no está abierto */}
            {!isMobileOpen && (
                <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="font-bold text-lg text-primary dark:text-white">Admin Panel</span>
                    </div>
                </div>
            )}

            {/* Content area */}
            <div className="flex-1 w-full">
                <main className="h-full p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

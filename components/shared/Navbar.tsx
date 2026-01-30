"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
    ShoppingCart,
    User,
    Search,
    Menu,
    X,
    ChevronDown,
    LogOut,
    LayoutDashboard
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const categories = [
    {
        title: "Productos",
        href: "/categoria/pinturas",
        items: ["Pinturas", "Herramientas", "Complementos", "Acabados"]
    },
    {
        title: "Sobre Nosotros",
        href: "/nosotros",
        items: []
    },
    {
        title: "Encuéntranos",
        href: "/contacto",
        items: [
            { label: "Ubicación", href: "/contacto#ubicacion" },
            { label: "Contacto", href: "/contacto#contacto" }
        ]
    }
]

export const Navbar = () => {
    const { data: session } = useSession()
    const [scrolled, setScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 px-6 py-4",
                scrolled ? "bg-white/95 backdrop-blur border-b border-zinc-200 text-zinc-900"
                    : "bg-transparent text-white"
            )}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-14 w-14 relative transition-transform group-hover:scale-110">
                        <Image
                            src="/finoacabadologo.png"
                            alt="Fino Acabados Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="flex flex-col leading-tight">
                        <span
                            className={cn(
                                "text-xl font-bold tracking-tight uppercase transition-colors",
                                scrolled ? "bg-white/95 backdrop-blur border-b border-zinc-200 text-zinc-900"
                                    : "bg-transparent text-white"
                            )}
                        >
                            Fino Acabados
                        </span>
                        <span className="text-[10px] text-accent font-medium tracking-[0.2em] uppercase">
                            Premium Store
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {categories.map((cat) => {
                        const hasItems = cat.items.length > 0

                        return (
                            <div
                                key={cat.title}
                                className={cn("relative py-2", hasItems && "group")}
                            >
                                <Link
                                    href={cat.href}
                                    className={cn(
                                        "flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent",
                                        scrolled ? "text-muted-foreground" : "text-zinc-300"
                                    )}
                                >
                                    {cat.title}
                                    {hasItems && (
                                        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                                    )}
                                </Link>

                                {/* Dropdown */}
                                {hasItems && (
                                    <div className="invisible absolute top-full left-0 w-64 pt-4 opacity-0 group-hover:visible group-hover:opacity-100 transition-all">
                                        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-zinc-100 dark:border-zinc-800 p-4">
                                            <ul className="space-y-2">
                                                {cat.items.map((item) => {
                                                    const label = typeof item === "string" ? item : item.label
                                                    const href = typeof item === "string" ? "#" : item.href

                                                    return (
                                                        <li key={label}>
                                                            <Link
                                                                href={href}
                                                                className="block text-sm text-muted-foreground hover:text-accent transition-colors"
                                                            >
                                                                {label}
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Icons */}
                <div className="flex items-center gap-5">
                    <Search className={cn("h-5 w-5", scrolled ? "text-muted-foreground" : "text-white")} />

                    <div
                        onClick={() => {
                            if (!session) {
                                window.location.href = "/auth/login"
                            } else {
                                window.location.href = "/cart"
                            }
                        }}
                        className="relative cursor-pointer"
                    >
                        <ShoppingCart className={cn("h-5 w-5", scrolled ? "text-muted-foreground" : "text-white")} />
                        <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">0</span>
                    </div>

                    {session ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-3 py-1.5 rounded-full hover:bg-accent hover:text-primary transition-all"
                            >
                                <User className="h-4 w-4" />
                                <span className="text-sm font-bold">
                                    {session.user?.name?.split(" ")[0] || "Usuario"}
                                </span>
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border p-2 z-20"
                                    >
                                        {session.user?.role === "ADMIN" && (
                                            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50 rounded-lg">
                                                <LayoutDashboard className="h-4 w-4 text-accent" />
                                                Panel Administrador
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/auth/login" })}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Cerrar Sesión
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="bg-primary text-white px-4 py-2 rounded-full font-bold">
                            Ingresar
                        </Link>
                    )}

                    <button
                        className="lg:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>
    )
}

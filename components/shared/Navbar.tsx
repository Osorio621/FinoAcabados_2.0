"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

// Definir tipos para los items
type ProductCategory = {
    name: string
    slug: string
    type: "product"
}

type ContactCategory = {
    name: string
    href: string
    type: "contact"
}

type NavItem = ProductCategory | ContactCategory

// Función type guard para verificar el tipo
const isProductCategory = (item: NavItem): item is ProductCategory => {
    return item.type === "product"
}

const isContactCategory = (item: NavItem): item is ContactCategory => {
    return item.type === "contact"
}

// Mapeo de categorías y sus slugs
const productCategories: ProductCategory[] = [
    { name: "Pinturas", slug: "pinturas", type: "product" },
    { name: "Herramientas", slug: "herramientas", type: "product" },
    { name: "Complementos", slug: "complementos", type: "product" },
    { name: "Acabados", slug: "acabados", type: "product" }
]

const contactCategories: ContactCategory[] = [
    { name: "Ubicación", href: "/contacto#ubicacion", type: "contact" },
    { name: "Contacto", href: "/contacto#contacto", type: "contact" }
]

const navCategories = [
    {
        title: "Productos",
        href: "/productos",
        items: productCategories
    },
    {
        title: "Sobre Nosotros",
        href: "/nosotros",
        items: []
    },
    {
        title: "Encuéntranos",
        href: "/contacto",
        items: contactCategories
    }
]

import { useSidebar } from "@/lib/context/sidebar-context"
import { usePathname } from "next/navigation"

export const Navbar = () => {
    const { data: session } = useSession()
    const { isSidebarOpen } = useSidebar()
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const router = useRouter()

    const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/auth/admin")

    // Función para navegar a productos con categoría
    const handleProductCategoryClick = (categorySlug: string) => {
        router.push(`/productos?categoria=${categorySlug}`)
        setIsOpen(false) // Cerrar menú móvil si está abierto
    }

    // Función para manejar clic en "Productos" (ver todos)
    const handleAllProductsClick = () => {
        router.push("/productos")
        setIsOpen(false)
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 px-6 py-4",
                scrolled ? "bg-white/95 backdrop-blur shadow-sm border-b border-zinc-200 text-zinc-900"
                    : "bg-transparent text-white",
                isAdmin && (isSidebarOpen ? "md:pl-[312px]" : "md:pl-24") // 72px + 24px padding or 20px + 24px padding
            )}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between relative">
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
                                scrolled ? "text-zinc-900" : "text-white"
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
                    {navCategories.map((cat) => {
                        const hasItems = cat.items.length > 0

                        return (
                            <div
                                key={cat.title}
                                className={cn("relative py-2", hasItems && "group")}
                            >
                                {cat.title === "Productos" ? (
                                    // Menú desplegable para Productos
                                    <div className="flex items-center gap-1 text-sm font-medium cursor-pointer">
                                        <button
                                            onClick={handleAllProductsClick}
                                            className={cn(
                                                "transition-colors hover:text-accent",
                                                scrolled ? "text-muted-foreground" : "text-zinc-300"
                                            )}
                                        >
                                            {cat.title}
                                        </button>
                                        {hasItems && (
                                            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                                        )}
                                    </div>
                                ) : (
                                    // Enlace normal para otras categorías
                                    <Link
                                        href={cat.href}
                                        className={cn(
                                            "flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent",
                                            scrolled ? "text-zinc-900" : "text-zinc-300"
                                        )}
                                    >
                                        {cat.title}
                                    </Link>
                                )}

                                {/* Dropdown para Productos */}
                                {cat.title === "Productos" && hasItems && (
                                    <div className="invisible absolute top-full left-0 w-64 pt-4 opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                                        <div className="bg-white shadow-xl rounded-xl border border-zinc-200 p-4">
                                            <ul className="space-y-2">
                                                {/* Ver todos */}
                                                <li>
                                                    <button
                                                        onClick={handleAllProductsClick}
                                                        className="block w-full text-left text-sm text-zinc-800 hover:text-accent transition-colors font-medium mb-2 pb-2 border-b border-zinc-100"
                                                    >
                                                        Ver todos los productos
                                                    </button>
                                                </li>

                                                {/* Categorías */}
                                                {cat.items.map((item) => {
                                                    if (isProductCategory(item)) {
                                                        return (
                                                            <li key={item.slug}>
                                                                <button
                                                                    onClick={() => handleProductCategoryClick(item.slug)}
                                                                    className="block w-full text-left text-sm text-zinc-700 hover:text-accent transition-colors"
                                                                >
                                                                    {item.name}
                                                                </button>
                                                            </li>
                                                        )
                                                    }
                                                    return null
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                )}


                                {/* Dropdown para otros menús */}
                                {cat.title !== "Productos" && hasItems && (
                                    <div className="invisible absolute top-full left-0 w-64 pt-4 opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                                        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-zinc-100 dark:border-zinc-800 p-4">
                                            <ul className="space-y-2">
                                                {cat.items.map((item) => {
                                                    if (isContactCategory(item)) {
                                                        return (
                                                            <li key={item.href}>
                                                                <Link
                                                                    href={item.href}
                                                                    className="block text-sm text-zinc-600 dark:text-zinc-300 hover:text-accent dark:hover:text-accent transition-colors"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        )
                                                    }
                                                    return null
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
                    <button
                        onClick={() => router.push("/productos")}
                        className={cn("h-5 w-5 cursor-pointer", scrolled ? "text-zinc-900" : "text-white")}
                    >
                        <Search className="h-5 w-5" />
                    </button>

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
                        <ShoppingCart className={cn("h-5 w-5", scrolled ? "text-zinc-900" : "text-white")} />
                        <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">0</span>
                    </div>

                    {/* Botón hamburguesa */}
                    <button
                        className="lg:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className={scrolled ? "text-zinc-900" : "text-white"} />
                        ) : (
                            <Menu className={scrolled ? "text-zinc-900" : "text-white"} />
                        )}
                    </button>

                    {/* User menu (solo desktop) */}
                    {session ? (
                        <div className="hidden lg:block relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-3 py-1.5 rounded-full hover:bg-accent hover:text-primary transition-all"
                            >
                                <User className="h-4 w-4" />
                                <span className="text-sm font-bold">
                                    {session.user?.name?.split(" ")[0] || "Usuario"}
                                </span>
                            </button>

                            {/* User dropdown menu (desktop) */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-zinc-200 shadow-xl rounded-xl z-50"
                                    >
                                        <div className="p-2">
                                            {(session.user?.role === "ADMIN" || (session.user as any)?.role === "SUPER_ADMIN") && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Panel Administrador
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false)
                                                    signOut({ callbackUrl: "/auth/login" })
                                                }}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="hidden lg:flex bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
                        >
                            Ingresar
                        </Link>
                    )}
                </div>

                {/* MENÚ MÓVIL */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden absolute top-full left-0 right-0 mt-4 bg-white border border-zinc-200 shadow-2xl rounded-2xl z-40 overflow-hidden"
                        >
                            <div className="flex flex-col p-6 space-y-4">
                                {navCategories.map((cat) => (
                                    <div key={cat.title} className="border-b border-zinc-100 pb-4 last:border-0">
                                        {cat.title === "Productos" ? (
                                            <>
                                                <button
                                                    onClick={handleAllProductsClick}
                                                    className="text-zinc-900 text-lg font-semibold block mb-2 hover:text-accent transition-colors w-full text-left"
                                                >
                                                    {cat.title}
                                                </button>

                                                {/* Subitems para Productos en Móvil */}
                                                {cat.items && cat.items.length > 0 && (
                                                    <div className="pl-4 space-y-1">
                                                        {/* Opción para ver todos */}
                                                        <button
                                                            onClick={handleAllProductsClick}
                                                            className="text-zinc-600 text-sm block py-1 hover:text-accent transition-colors w-full text-left font-medium mb-2 pb-2 border-b border-zinc-100"
                                                        >
                                                            Ver todos los productos
                                                        </button>

                                                        {/* Categorías específicas */}
                                                        {cat.items.map((item) => {
                                                            if (isProductCategory(item)) {
                                                                return (
                                                                    <button
                                                                        key={item.slug}
                                                                        onClick={() => handleProductCategoryClick(item.slug)}
                                                                        className="text-zinc-600 text-sm block py-1 hover:text-accent transition-colors w-full text-left"
                                                                    >
                                                                        {item.name}
                                                                    </button>
                                                                )
                                                            }
                                                            return null
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href={cat.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-zinc-900 text-lg font-semibold block mb-2 hover:text-accent transition-colors"
                                                >
                                                    {cat.title}
                                                </Link>

                                                {/* Subitems para otros menús en móvil */}
                                                {cat.items && cat.items.length > 0 && (
                                                    <div className="pl-4 space-y-1">
                                                        {cat.items.map((item) => {
                                                            if (isContactCategory(item)) {
                                                                return (
                                                                    <Link
                                                                        key={item.href}
                                                                        href={item.href}
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="text-zinc-600 text-sm block py-1 hover:text-accent transition-colors"
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                )
                                                            }
                                                            return null
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-zinc-200">
                                    {session ? (
                                        <>
                                            <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-50 rounded-lg">
                                                <User className="h-5 w-5 text-accent" />
                                                <div>
                                                    <p className="font-semibold text-zinc-900">
                                                        {session.user?.name || "Usuario"}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">
                                                        {session.user?.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {(session.user?.role === "ADMIN" || (session.user as any)?.role === "SUPER_ADMIN") && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 text-accent font-bold py-3 hover:text-accent/80 transition-colors"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Panel Administrador
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setIsOpen(false)
                                                    signOut({ callbackUrl: "/auth/login" })
                                                }}
                                                className="flex items-center gap-2 w-full text-red-500 font-semibold py-3 hover:text-red-600 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Cerrar sesión
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/auth/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block bg-primary text-white text-center py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                                        >
                                            Ingresar
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}
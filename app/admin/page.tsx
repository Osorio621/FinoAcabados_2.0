import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react" // Import all icons to be safe or import specific ones
import {
    Package,
    Users,
    TrendingUp,
    Boxes,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/product-utils"

export default async function AdminDashboard() {
    const session = await auth()

    // @ts-ignore
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return redirect("/")
    }

    // Fetch Real Data
    const productsCount = await db.product.count()

    const lowStockCount = await db.product.count({
        where: {
            stock: {
                lte: 5
            }
        }
    })

    const categoriesCount = await db.category.count()

    // Mocked Data (features not yet implemented)
    const usersCount = await db.user.count() // We actually have a user table
    const salesTotal = 0 // Needs Order model
    const salesChange = "+0%"

    const stats = [
        {
            label: "Total Productos",
            value: productsCount.toString(),
            icon: Package,
            change: "Actualizado",
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30",
        },
        {
            label: "Stock Bajo",
            value: lowStockCount.toString(),
            icon: Boxes,
            change: lowStockCount > 0 ? "Atención" : "Optimo",
            color: "text-orange-600",
            bg: "bg-orange-100 dark:bg-orange-900/30",
        },
        {
            label: "Categorías",
            value: categoriesCount.toString(),
            icon: LucideIcons.Tags, // Tags imported explicitly or via namespace
            change: "Activas",
            color: "text-emerald-600",
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
        },
        {
            label: "Usuarios Registrados",
            value: usersCount.toString(),
            icon: Users,
            change: "Total",
            color: "text-violet-600",
            bg: "bg-violet-100 dark:bg-violet-900/30",
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Dashboard</h1>
                    <p className="text-zinc-500 mt-1">Bienvenido al panel de administración de Fino Acabados.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className={stat.bg + " p-3 rounded-2xl"}>
                                <stat.icon className={stat.color + " h-6 w-6"} />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-zinc-500">{stat.label}</h3>
                            <p className="text-2xl font-bold text-primary dark:text-white mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-primary dark:text-white">Acciones Rápidas</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/admin/products/new"
                            className="flex flex-col gap-4 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-accent transition-all group"
                        >
                            <Package className="h-8 w-8 text-primary dark:text-white" />
                            <div>
                                <h4 className="font-bold text-primary dark:text-white">Nuevo Producto</h4>
                                <p className="text-xs text-zinc-500 mt-1">Añade nuevos artículos al catálogo.</p>
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/admin/inventory"
                            className="flex flex-col gap-4 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-accent transition-all group"
                        >
                            <Boxes className="h-8 w-8 text-primary dark:text-white" />
                            <div>
                                <h4 className="font-bold text-primary dark:text-white">Ajustar Stock</h4>
                                <p className="text-xs text-zinc-500 mt-1">Actualiza inventario rápidamente.</p>
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary dark:text-white">Ventas y Métricas</h3>
                        <p className="text-sm text-zinc-500 mt-2 max-w-xs">
                            Próximamente: Gráficos detallados de rendimiento y tendencias de ventas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

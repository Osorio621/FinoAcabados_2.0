import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Package,
    Tags,
    Settings,
    ChevronLeft,
    LogOut,
    Boxes,
    BadgePercent
} from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
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
    {
        label: "Configuración",
        icon: Settings,
        href: "/admin/settings",
    },
]

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        return redirect("/")
    }

    return (
        <div className="h-full relative flex bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="p-6 flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Boxes className="text-white h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-primary dark:text-white">Admin Panel</span>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className="group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-primary dark:group-hover:text-white transition-colors">
                                    {route.label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <Link
                        href="/"
                        className="flex items-center gap-3 p-3 text-zinc-500 hover:text-primary dark:hover:text-white transition-colors rounded-xl px-4"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Volver al Sitio</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="md:pl-72 flex-1 w-full min-h-screen">
                <div className="h-full p-8 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    )
}

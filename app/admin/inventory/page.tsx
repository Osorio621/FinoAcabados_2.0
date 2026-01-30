import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import {
    Boxes,
    Search,
    Plus,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Package,
    ArrowUpDown,
    BadgePercent
} from "lucide-react"
import { InventoryList } from "./_components/inventory-list"

export default async function InventoryPage() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        return redirect("/")
    }

    const products = await db.product.findMany({
        include: {
            category: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    })

    // Serialización simple para evitar problemas con Decimal de Prisma en Client Components
    const serializedProducts = products.map(p => ({
        ...p,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
    }))

    const lowStockCount = products.filter(p => p.stock <= 5).length
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0)

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Inventario</h1>
                    <p className="text-zinc-500 mt-1">Gestiona el stock y las promociones de tus productos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95">
                        <Plus className="h-4 w-4" />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl">
                        <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Productos</p>
                        <p className="text-2xl font-bold text-primary dark:text-white">{products.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-2xl">
                        <Boxes className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stock Total</p>
                        <p className="text-2xl font-bold text-primary dark:text-white">{totalStock}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-2xl">
                        <AlertTriangle className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stock Bajo</p>
                        <p className="text-2xl font-bold text-primary dark:text-white">{lowStockCount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden">
                <InventoryList initialProducts={serializedProducts} />
            </div>
        </div>
    )
}

"use client"

import { useState, useTransition } from "react"
import {
    Search,
    Package,
    Edit,
    Trash2,
    RefreshCw,
    Plus,
    Loader2,
    Archive
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toggleProductActive } from "@/actions/admin-actions"

interface ProductListProps {
    initialProducts: any[]
}

export function ProductList({ initialProducts }: ProductListProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [searchTerm, setSearchTerm] = useState("")
    const [products, setProducts] = useState(initialProducts)

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const onToggleStatus = (id: string, currentStatus: boolean) => {
        const action = currentStatus ? "archivar" : "activar"
        if (!confirm(`¿Estás seguro de ${action} este producto?`)) return

        startTransition(async () => {
            const res = await toggleProductActive(id, !currentStatus)
            if (!res.error) {
                setProducts(products.map(p =>
                    p.id === id ? { ...p, isActive: !currentStatus } : p
                ))
            }
        })
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 text-sm shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Producto</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Categoría</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Stock</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group ${!product.isActive ? 'opacity-60 bg-zinc-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-5 h-5 text-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm line-clamp-1">{product.name}</span>
                                            {product.isOffer && (
                                                <span className="text-[10px] text-emerald-500 font-bold uppercase">En Oferta</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.isActive ? (
                                        <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md">
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 text-zinc-500 rounded-md">
                                            Inactivo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
                                        {product.category?.name || "Sin Categoría"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-primary dark:text-white">${product.price}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-sm font-bold ${product.stock <= 5 ? "text-rose-500" : "text-zinc-600 dark:text-zinc-400"}`}>
                                        {product.stock} unid.
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2 text-zinc-400 hover:text-primary dark:hover:text-white transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => onToggleStatus(product.id, product.isActive)}
                                            disabled={isPending}
                                            className={`p-2 transition-colors rounded-lg disabled:opacity-50 ${product.isActive
                                                    ? "text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                                    : "text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                                }`}
                                            title={product.isActive ? "Archivar" : "Activar"}
                                        >
                                            {isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                product.isActive ? <Archive className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredProducts.length === 0 && (
                <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-sm text-zinc-500">No se encontraron productos.</p>
                </div>
            )}
        </div>
    )
}

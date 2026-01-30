"use client"

import { useState } from "react"
import {
    Search,
    Package,
    MoreVertical,
    Edit,
    Trash2,
    BadgePercent,
    AlertCircle,
    Loader2,
    Check
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { updateStock, updateProductOffer } from "@/actions/admin-actions"

interface InventoryListProps {
    initialProducts: any[]
}

export function InventoryList({ initialProducts }: InventoryListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [products, setProducts] = useState(initialProducts)

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleStockUpdate = async (id: string, newStock: number) => {
        setUpdatingId(id)
        const res = await updateStock(id, newStock)
        if (res.success) {
            setProducts(products.map(p =>
                p.id === id ? { ...p, stock: newStock, status: newStock > 0 ? "IN_STOCK" : "OUT_OF_STOCK" } : p
            ))
        }
        setUpdatingId(null)
    }

    const handleOfferToggle = async (id: string, currentIsOffer: boolean, price: number) => {
        setUpdatingId(id)
        const newIsOffer = !currentIsOffer
        const discountPrice = newIsOffer ? Math.round(price * 0.9) : undefined // 10% discount default
        const res = await updateProductOffer(id, newIsOffer, discountPrice)
        if (res.success) {
            setProducts(products.map(p =>
                p.id === id ? { ...p, isOffer: newIsOffer, discountPrice: discountPrice || null } : p
            ))
        }
        setUpdatingId(null)
    }

    return (
        <div className="flex flex-col">
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
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Producto</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Categoría</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Stock</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Promoción</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-5 h-5 text-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                        <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm line-clamp-1">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
                                        {product.category?.name || "Sin Categoría"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-primary dark:text-white">${product.price}</span>
                                        {product.isOffer && (
                                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Oferta: ${product.discountPrice}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <button
                                            disabled={updatingId === product.id}
                                            onClick={() => handleStockUpdate(product.id, Math.max(0, product.stock - 1))}
                                            className="w-7 h-7 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className={cn(
                                            "text-sm font-bold w-6 text-center",
                                            product.stock <= 5 ? "text-rose-500" : "text-zinc-700 dark:text-zinc-300"
                                        )}>
                                            {product.stock}
                                        </span>
                                        <button
                                            disabled={updatingId === product.id}
                                            onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                                            className="w-7 h-7 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        disabled={updatingId === product.id}
                                        onClick={() => handleOfferToggle(product.id, product.isOffer, product.price)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50",
                                            product.isOffer
                                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-transparent"
                                        )}
                                    >
                                        <BadgePercent className="h-3.5 w-3.5" />
                                        {product.isOffer ? "En Oferta" : "Sin Oferta"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {updatingId === product.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                                        ) : (
                                            <>
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
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
                    <div>
                        <h3 className="text-lg font-bold text-primary dark:text-white">No se encontraron productos</h3>
                        <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">Prueba con otro término de búsqueda o añade un nuevo producto.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

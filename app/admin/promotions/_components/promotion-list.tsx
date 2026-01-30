"use client"

import { useState, useTransition } from "react"
import {
    Search,
    Package,
    Edit,
    Trash2,
    Tag,
    X,
    Loader2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateProductOffer } from "@/actions/admin-actions"
import { formatPrice } from "@/lib/product-utils"

interface PromotionListProps {
    initialProducts: any[]
}

export function PromotionList({ initialProducts }: PromotionListProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [searchTerm, setSearchTerm] = useState("")
    const [products, setProducts] = useState(initialProducts)

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const onRemovePromotion = (id: string) => {
        if (!confirm("¿Estás seguro de quitar esta promoción? El producto seguirá existiendo pero no como oferta.")) return

        startTransition(async () => {
            const res = await updateProductOffer(id, false)
            if (!res.error) {
                setProducts(products.filter(p => p.id !== id))
                router.refresh()
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
                        placeholder="Buscar promoción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 font-medium">
                        {filteredProducts.length} ofert{filteredProducts.length !== 1 ? 'as' : 'a'} activa{filteredProducts.length !== 1 ? 's' : ''}
                    </span>
                    <Link
                        href="/admin/products"
                        className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 text-sm shadow-sm ml-4"
                    >
                        <Tag className="h-4 w-4" />
                        Agregar Nueva
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Producto</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Precio Original</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Oferta</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {filteredProducts.map((product) => {
                            const discountPercentage = product.discountPrice
                                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                                : 0

                            return (
                                <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
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
                                                <span className="text-[10px] text-zinc-500">{product.category?.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-zinc-400 line-through decoration-zinc-400/50">
                                            {formatPrice(product.price)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                {product.discountPrice ? formatPrice(product.discountPrice) : '-'}
                                            </span>
                                            {discountPercentage > 0 && (
                                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md w-fit mt-1">
                                                    -{discountPercentage}%
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 text-zinc-400 hover:text-primary dark:hover:text-white transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                                title="Editar Producto"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => onRemovePromotion(product.id)}
                                                disabled={isPending}
                                                className="p-2 text-zinc-400 hover:text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg disabled:opacity-50"
                                                title="Quitar Promoción"
                                            >
                                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {filteredProducts.length === 0 && (
                <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                        <Tag className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-sm text-zinc-500">No hay promociones activas.</p>
                </div>
            )}
        </div>
    )
}

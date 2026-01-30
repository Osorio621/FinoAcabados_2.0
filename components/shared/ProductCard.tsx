"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/product-utils"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ProductCardProps {
    id: string
    slug: string
    name: string
    price: number
    discountPrice?: number | null
    imageUrl?: string | null
    isOffer?: boolean
    category?: string
    stock: number
}

export const ProductCard = ({
    slug,
    name,
    price,
    discountPrice,
    imageUrl,
    isOffer,
    category,
    stock
}: ProductCardProps) => {
    const { data: session } = useSession()
    const router = useRouter()
    const hasDiscount = isOffer && discountPrice

    return (
        <Link href={`/productos/${slug}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                        src={imageUrl || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {hasDiscount && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-md">
                                Oferta
                            </span>
                        )}
                        {stock <= 0 && (
                            <span className="bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                                Agotado
                            </span>
                        )}
                    </div>

                    {/* Quick Actions Hover */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                if (!session) {
                                    router.push("/auth/login")
                                    return
                                }
                                // Future: Add to cart logic
                                console.log("Add to cart:", slug)
                            }}
                            className="h-10 w-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-accent hover:text-white transition-all transform hover:scale-110"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                router.push(`/productos/${slug}`)
                            }}
                            className="h-10 w-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-accent hover:text-white transition-all transform hover:scale-110"
                        >
                            <Eye className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{category || "General"}</p>
                            <h3 className="text-sm font-bold text-primary dark:text-white line-clamp-1 group-hover:text-accent transition-colors">{name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="text-[10px] font-bold text-zinc-500">4.9</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                        {hasDiscount ? (
                            <>
                                <span className="text-lg font-bold text-primary dark:text-white">{formatPrice(discountPrice)}</span>
                                <span className="text-xs text-zinc-400 line-through">{formatPrice(price)}</span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-primary dark:text-white">{formatPrice(price)}</span>
                        )}
                    </div>

                    <div className="w-full text-[10px] font-bold uppercase tracking-widest py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all text-center">
                        Ver Detalles
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

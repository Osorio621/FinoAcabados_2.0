"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Heart, Eye, Star, Zap, Check, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/product-utils"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ProductCardProps {
    id: string
    slug: string
    name: string
    price: number
    discountPrice?: number | null
    imageUrl?: string | null
    isOffer?: boolean
    category?: string
    subcategory?: string
    stock: number
}

import { useSidebar } from "@/lib/context/sidebar-context"
import { useCart } from "@/lib/context/cart-context"

export const ProductCard = ({
    id,
    slug,
    name,
    price,
    discountPrice,
    imageUrl,
    isOffer,
    category,
    subcategory,
    stock
}: ProductCardProps) => {
    const { data: session } = useSession()
    const router = useRouter()
    const { addItem } = useCart()
    const [isAdding, setIsAdding] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const hasDiscount = isOffer && discountPrice

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsAdding(true)
        await addItem(id, 1)
        setTimeout(() => setIsAdding(false), 1000)
    }

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/productos/${slug}`)
    }

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsWishlisted(!isWishlisted)
    }

    const discountPercentage = hasDiscount
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            className="group relative"
        >
            <Link href={`/productos/${slug}`} className="block">
                <div className="relative bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50 overflow-hidden hover:shadow-2xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-500 cursor-pointer">
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900">
                        <Image
                            src={imageUrl || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                            priority={false}
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {hasDiscount && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-red-500 rounded-full blur-md" />
                                    <span className="relative bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
                                        -{discountPercentage}%
                                    </span>
                                </motion.div>
                            )}
                            {isOffer && !hasDiscount && (
                                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-md">
                                    Destacado
                                </span>
                            )}
                        </div>

                        {/* Stock Badge */}
                        <div className="absolute top-4 right-4">
                            {stock <= 5 && stock > 0 && (
                                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                    {stock} unidades
                                </span>
                            )}
                            {stock <= 0 && (
                                <span className="bg-gradient-to-r from-zinc-700 to-zinc-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                    Agotado
                                </span>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-xl border border-zinc-200/50 dark:border-zinc-700/50"
                        >
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAddToCart}
                                disabled={stock <= 0 || isAdding}
                                className={cn(
                                    "h-9 w-9 rounded-full flex items-center justify-center text-primary dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-700 transition-all",
                                    stock <= 0
                                        ? "bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
                                        : "bg-white dark:bg-zinc-800 hover:bg-accent hover:text-white hover:border-accent hover:shadow-lg"
                                )}
                            >
                                {isAdding ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <ShoppingCart className="h-4 w-4" />
                                )}
                            </motion.button>

                            <button
                                onClick={handleQuickView}
                                className="h-9 w-9 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-primary dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg transition-all"
                            >
                                <Eye className="h-4 w-4" />
                            </button>

                            <button
                                onClick={handleWishlist}
                                className="h-9 w-9 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-primary dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg transition-all"
                            >
                                <Heart className={cn(
                                    "h-4 w-4",
                                    isWishlisted && "fill-red-500 text-red-500"
                                )} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div className="relative p-5 space-y-3">
                        {/* Category & Rating */}
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-1 rounded-md">
                                    {category || "General"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-accent text-accent" />
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">4.9</span>
                            </div>
                        </div>

                        {/* Product Name */}
                        <h3 className="text-base font-bold text-primary dark:text-white line-clamp-2 min-h-[2.5rem] group-hover:text-accent transition-colors leading-tight">
                            {name}
                        </h3>

                        {subcategory && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                {subcategory}
                            </p>
                        )}

                        {/* Price Section */}
                        <div className="flex items-baseline gap-2 pt-2">
                            {hasDiscount ? (
                                <>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-primary dark:text-white">
                                            {formatPrice(discountPrice)}
                                        </span>
                                        <span className="text-sm text-zinc-400 line-through">
                                            {formatPrice(price)}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-xl font-bold text-primary dark:text-white">
                                    {formatPrice(price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Indicator */}
                        {stock > 0 && (
                            <div className="pt-3">
                                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                    <span>Disponibilidad</span>
                                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{stock} unidades</span>
                                </div>
                                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.min((stock / 10) * 100, 100)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                    />
                                </div>
                            </div>
                        )}

                        {/* CTA Button */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative overflow-hidden rounded-xl mt-4"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 group-hover:border-transparent transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-primary dark:text-white group-hover:text-white transition-colors">
                                        Ver detalles
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-primary dark:text-white group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_60px_-20px] shadow-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
            </Link>

            {/* Success Feedback */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-4 right-4 z-50"
                    >
                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
                            <Check className="h-3 w-3" />
                            <span>¡Añadido!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
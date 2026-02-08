"use client"

import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/product-utils"
import {
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    ArrowRight,
    Package,
    AlertCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function CartClient({ initialCart }: { initialCart: any }) {
    const { cart, updateQuantity, removeItem, itemCount } = useCart()
    const router = useRouter()

    // Usar el carrito del contexto si está disponible, sino el inicial
    const currentCart = cart || initialCart

    if (!currentCart || currentCart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="h-10 w-10 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Tu carrito está vacío</h2>
                <p className="text-zinc-500 mb-8 max-w-sm">
                    Parece que aún no has agregado nada. ¡Explora nuestros acabados premium y encuentra lo que necesitas!
                </p>
                <Link
                    href="/productos"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                >
                    Explorar Productos
                </Link>
            </div>
        )
    }

    // Cálculos
    const subtotal = currentCart.items.reduce((acc: number, item: any) => {
        const price = item.product.isOffer && item.product.discountPrice
            ? Number(item.product.discountPrice)
            : Number(item.product.price)
        return acc + (price * item.quantity)
    }, 0)

    const tax = subtotal * 0.19 // 19% IVA
    const total = subtotal + tax

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Carrito de Compras</h1>
                <span className="text-zinc-500 font-medium">{itemCount} items</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Items */}
                <div className="lg:col-span-2 space-y-4">
                    {currentCart.items.map((item: any) => {
                        const price = item.product.isOffer && item.product.discountPrice
                            ? Number(item.product.discountPrice)
                            : Number(item.product.price)

                        return (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex gap-4 md:gap-6 items-center group"
                            >
                                <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                                    <Image
                                        src={item.product.imageUrl || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-primary dark:text-white truncate">
                                            {item.product.name}
                                        </h3>
                                        <span className="text-xs text-zinc-500">
                                            Stock: {item.product.stock} disponibles
                                        </span>
                                    </div>
                                    <div className="mt-2 text-accent font-bold">
                                        {formatPrice(price)}
                                    </div>
                                </div>

                                {/* Cantidad */}
                                <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="h-8 w-8 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock}
                                        className="h-8 w-8 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all disabled:opacity-30"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Resumen */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl sticky top-28">
                        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Resumen del Pedido</h2>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-zinc-500">
                                <span>Subtotal</span>
                                <span className="font-bold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500">
                                <span>IVA (19%)</span>
                                <span className="font-bold">{formatPrice(tax)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500">
                                <span>Envío</span>
                                <span className="text-emerald-500 font-bold tracking-tight">GRATIS</span>
                            </div>

                            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

                            <div className="flex justify-between text-lg font-bold text-primary dark:text-white">
                                <span>Total (COP)</span>
                                <span className="text-2xl font-black text-accent">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/checkout")}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold mt-8 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg active:scale-95 transition-all group"
                        >
                            Continuar al Checkout
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>

                        <div className="mt-6 flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <AlertCircle className="h-5 w-5 text-zinc-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-widest font-bold">
                                Los precios ya incluyen impuestos nacionales. El pago será procesado tras confirmar disponibilidad de stock total.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/product-utils"
import { createOrder } from "@/actions/order-actions"
import {
    Truck,
    CreditCard,
    ShieldCheck,
    ChevronLeft,
    Loader2,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export function CheckoutClient({ initialCart, user }: { initialCart: any, user: any }) {
    const router = useRouter()
    const { cart, refreshCart } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        customerName: user.name || "",
        address: "",
        city: "",
        phone: "",
        documentId: ""
    })

    const currentCart = cart || initialCart

    const subtotal = currentCart.items.reduce((acc: number, item: any) => {
        const price = item.product.isOffer && item.product.discountPrice
            ? Number(item.product.discountPrice)
            : Number(item.product.price)
        return acc + (price * item.quantity)
    }, 0)

    const tax = subtotal * 0.19
    const total = subtotal + tax

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validaciones básicas
        if (!formData.address || !formData.city || !formData.phone || !formData.documentId) {
            toast.error("Por favor completa todos los campos de envío")
            return
        }

        setIsSubmitting(true)

        try {
            const result = await createOrder(formData)
            if (result.success) {
                toast.success("¡Pedido confirmado con éxito!")
                await refreshCart()
                router.push(`/confirmacion/${result.orderId}`)
            } else {
                toast.error(result.error || "No se pudo crear el pedido")
            }
        } catch (error) {
            toast.error("Error al procesar el pedido. Intenta de nuevo.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <Link
                href="/carrito"
                className="flex items-center gap-2 text-zinc-500 hover:text-accent transition-all font-medium group"
            >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Volver al carrito
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información de Envío */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-accent/10 rounded-xl text-accent">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-primary dark:text-white">Información de Envío</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Cédula / NIT</label>
                                    <input
                                        type="text"
                                        name="documentId"
                                        value={formData.documentId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                                        placeholder="Número de identificación"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Dirección de Entrega</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                                        placeholder="Calle, Carrera, Barrio y Apto/Casa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Ciudad</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                                        placeholder="Ej: Medellín"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Teléfono de Contacto</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                                        placeholder="Ej: 3001234567"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-60">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-400">Métodos de Pago</h2>
                                <span className="bg-zinc-100 text-zinc-500 text-[10px] uppercase font-bold px-2 py-1 rounded ml-auto">Próximamente</span>
                            </div>
                            <p className="text-zinc-500 text-sm">
                                Por ahora, solo aceptamos pagos contra entrega o transferencia directa una vez confirmemos tu pedido telefónicamente.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Resumen Final */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl sticky top-28">
                        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Tu Pedido</h2>

                        <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 scrollbar-hide">
                            {currentCart.items.map((item: any) => {
                                const price = item.product.isOffer && item.product.discountPrice
                                    ? Number(item.product.discountPrice)
                                    : Number(item.product.price)
                                return (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.imageUrl || "/finoacabadologo.png"}
                                                alt={item.product.name}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-primary dark:text-white truncate">{item.product.name}</p>
                                            <p className="text-[10px] text-zinc-500">{item.quantity} x {formatPrice(price)}</p>
                                        </div>
                                        <span className="text-xs font-bold">{formatPrice(price * item.quantity)}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="space-y-3 text-sm border-t pt-4">
                            <div className="flex justify-between text-zinc-500">
                                <span>Subtotal</span>
                                <span className="font-bold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500">
                                <span>IVA (19%)</span>
                                <span className="font-bold">{formatPrice(tax)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-primary dark:text-white pt-2">
                                <span>Total a pagar</span>
                                <span className="text-xl font-black text-accent">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-accent text-white py-4 rounded-2xl font-black mt-8 flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Confirmar Pedido
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Compra Segura Protegida
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

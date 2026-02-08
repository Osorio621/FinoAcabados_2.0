import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getOrderDetails } from "@/actions/order-actions"
import { formatPrice, serializeOrder } from "@/lib/product-utils"
import {
    CheckCircle,
    Truck,
    Calendar,
    MapPin,
    ShoppingCart,
    ArrowLeft,
    Download
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function ConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
    const session = await auth()
    const { orderId } = await params

    if (!session) {
        return redirect("/auth/login")
    }

    const result = await getOrderDetails(orderId)

    if (!result.success || !result.data) {
        notFound()
    }

    const order = serializeOrder(result.data) as any

    if (!order) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header Success */}
                <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-10 text-center border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden mb-8">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                            <CheckCircle className="h-12 w-12" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-primary dark:text-white mb-2">¡Pedido Confirmado!</h1>
                    <p className="text-zinc-500 font-medium">Gracias por elegir Fino Acabados. Tu pedido está siendo procesado.</p>

                    <div className="mt-8 inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-6 py-2 rounded-full font-bold text-sm">
                        Orden ID: <span className="text-accent">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Detalles de Envío */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-accent" />
                            Detalles de Envío
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-5 w-5 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Dirección</p>
                                    <p className="font-medium">{order.address}</p>
                                    <p className="text-sm text-zinc-500">{order.city}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-5 w-5 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Fecha Estimada</p>
                                    <p className="font-medium">24 - 48 Horas Laborales</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Pago */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-accent" />
                            Resumen de Pago
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Subtotal</span>
                                <span className="font-bold">{formatPrice(Number(order.total) / 1.19)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">IVA (19%)</span>
                                <span className="font-bold">{formatPrice(Number(order.total) - (Number(order.total) / 1.19))}</span>
                            </div>
                            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />
                            <div className="flex justify-between text-xl font-black text-primary dark:text-white">
                                <span>Total Pagado</span>
                                <span className="text-accent">{formatPrice(Number(order.total))}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <h3 className="font-bold uppercase tracking-widest text-xs text-zinc-500">Productos en tu orden</h3>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="p-6 flex items-center gap-4">
                                <div className="h-16 w-16 bg-zinc-50 rounded-xl overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
                                    <Image
                                        src={item.product.imageUrl || "/finoacabadologo.png"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-primary dark:text-white">{item.product.name}</h4>
                                    <p className="text-xs text-zinc-500">{item.quantity} unidades × {formatPrice(Number(item.price))}</p>
                                </div>
                                <span className="font-bold">{formatPrice(Number(item.price) * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/productos"
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Seguir Comprando
                    </Link>
                    <button
                        className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-900 text-primary dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold hover:bg-zinc-50 transition-all shadow-sm active:scale-95"
                    >
                        <Download className="h-5 w-5" />
                        Descargar Recibo
                    </button>
                </div>
            </div>
        </div>
    )
}

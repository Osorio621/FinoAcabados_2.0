"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { clearCart } from "./cart-actions"
import { serializeOrder } from "@/lib/product-utils"

interface ShippingData {
    customerName: string
    address: string
    city: string
    phone: string
    documentId: string
}

/**
 * Crea un nuevo pedido basado en el carrito actual del usuario.
 */
export async function createOrder(shippingData: ShippingData) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Debes iniciar sesión" }

        // 1. Obtener el carrito con items y productos
        // @ts-ignore
        const cart = await db.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!cart || cart.items.length === 0) {
            return { success: false, error: "El carrito está vacío" }
        }

        // 2. Validar stock de todos los productos antes de procesar
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return { success: false, error: `Stock insuficiente para ${item.product.name}` }
            }
        }

        // 3. Calcular totales (IVA 19% Colombia)
        // @ts-ignore
        const subtotal = cart.items.reduce((acc: number, item: any) => {
            const price = item.product.isOffer && item.product.discountPrice
                ? Number(item.product.discountPrice)
                : Number(item.product.price)
            return acc + (price * item.quantity)
        }, 0)

        const tax = subtotal * 0.19
        const total = subtotal + tax
        const shippingPrice = 0 // Podría implementarse lógica de envío después

        // 4. Crear la orden y sus items en una transacción
        const order = await db.$transaction(async (tx) => {
            // Crear la orden
            // @ts-ignore
            const newOrder = await tx.order.create({
                data: {
                    // @ts-ignore
                    userId: session.user.id,
                    customerName: shippingData.customerName,
                    address: shippingData.address,
                    city: shippingData.city,
                    phone: shippingData.phone,
                    documentId: shippingData.documentId,
                    subtotal: subtotal,
                    tax: tax,
                    total: total,
                    shippingPrice: shippingPrice,
                    status: "PENDING",
                    items: {
                        create: cart.items.map((item: any) => {
                            const price = item.product.isOffer && item.product.discountPrice
                                ? Number(item.product.discountPrice)
                                : Number(item.product.price)
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                price: price
                            }
                        })
                    }
                }
            })

            // Reducir stock de cada producto
            // @ts-ignore
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            return newOrder
        })

        // 5. Vaciar el carrito
        await clearCart()

        revalidatePath("/admin/inventory") // Por el stock
        return { success: true, orderId: order.id }
    } catch (error) {
        console.error("[CREATE_ORDER]", error)
        return { success: false, error: "Error al procesar el pedido" }
    }
}

/**
 * Obtiene los detalles de una orden específica (para la página de confirmación).
 */
export async function getOrderDetails(orderId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "No autorizado" }

        // @ts-ignore
        const order = await db.order.findUnique({
            where: {
                id: orderId,
                // @ts-ignore
                userId: session.user.id // Seguridad
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!order) return { success: false, error: "Pedido no encontrado" }

        return { success: true, data: serializeOrder(order) }
    } catch (error) {
        console.error("[GET_ORDER_DETAILS]", error)
        return { success: false, error: "Error al obtener detalles" }
    }
}

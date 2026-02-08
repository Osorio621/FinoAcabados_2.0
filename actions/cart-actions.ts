"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { serializeCart } from "@/lib/product-utils"

/**
 * Obtiene el carrito del usuario actual.
 * Si no existe, lo crea.
 */
export async function getCart() {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Debes iniciar sesión" }

        // @ts-ignore
        let cart = await db.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        })

        // @ts-ignore
        if (!cart) {
            // @ts-ignore
            cart = await db.cart.create({
                // @ts-ignore
                data: { userId: session.user.id },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        }

        return { success: true, data: serializeCart(cart) }
    } catch (error) {
        console.error("[GET_CART]", error)
        return { success: false, error: "Error al obtener el carrito" }
    }
}

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 */
export async function addToCart(productId: string, quantity: number = 1) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Debes iniciar sesión" }

        // Validar producto y stock
        const product = await db.product.findUnique({
            where: { id: productId }
        })

        if (!product) return { success: false, error: "Producto no encontrado" }
        if (product.stock < quantity) return { success: false, error: "Stock insuficiente" }

        // Obtener o crear carrito
        // @ts-ignore
        let cart = await db.cart.findUnique({
            where: { userId: session.user.id }
        })

        if (!cart) {
            // @ts-ignore
            cart = await db.cart.create({
                // @ts-ignore
                data: { userId: session.user.id }
            })
        }

        // Verificar si el producto ya está en el carrito
        // @ts-ignore
        const existingItem = await db.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId
            }
        })

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity

            // Validar stock total acumulado
            if (product.stock < newQuantity) {
                return { success: false, error: `Solo quedan ${product.stock} unidades disponibles` }
            }

            // @ts-ignore
            await db.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity }
            })
        } else {
            // @ts-ignore
            await db.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: quantity
                }
            })
        }

        revalidatePath("/carrito")
        return { success: true, message: "Producto agregado al carrito" }
    } catch (error) {
        console.error("[ADD_TO_CART]", error)
        return { success: false, error: "Error al agregar al carrito" }
    }
}

/**
 * Actualiza la cantidad de un item en el carrito.
 */
export async function updateCartQuantity(itemId: string, quantity: number) {
    try {
        if (quantity < 1) return removeFromCart(itemId)

        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "No autorizado" }

        // @ts-ignore
        const cartItem = await db.cartItem.findUnique({
            where: { id: itemId },
            include: { product: true }
        })

        if (!cartItem) return { success: false, error: "Item no encontrado" }

        // El item debe pertenecer al carrito del usuario
        // @ts-ignore
        const cart = await db.cart.findUnique({
            where: { userId: session.user.id }
        })
        if (cartItem.cartId !== cart?.id) return { success: false, error: "No autorizado" }

        // Validar stock
        if (cartItem.product.stock < quantity) {
            return { success: false, error: "Stock insuficiente" }
        }

        // @ts-ignore
        await db.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        })

        revalidatePath("/carrito")
        return { success: true }
    } catch (error) {
        console.error("[UPDATE_CART_QUANTITY]", error)
        return { success: false, error: "Error al actualizar cantidad" }
    }
}

/**
 * Elimina un item del carrito.
 */
export async function removeFromCart(itemId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "No autorizado" }

        // @ts-ignore
        const cartItem = await db.cartItem.findUnique({
            where: { id: itemId }
        })

        if (!cartItem) return { success: false, error: "Item no encontrado" }

        // Validar pertenencia
        // @ts-ignore
        const cart = await db.cart.findUnique({
            where: { userId: session.user.id }
        })
        if (cartItem.cartId !== cart?.id) return { success: false, error: "No autorizado" }

        // @ts-ignore
        await db.cartItem.delete({
            where: { id: itemId }
        })

        revalidatePath("/carrito")
        return { success: true, message: "Producto eliminado" }
    } catch (error) {
        console.error("[REMOVE_FROM_CART]", error)
        return { success: false, error: "Error al eliminar del carrito" }
    }
}

/**
 * Vacía el carrito del usuario.
 */
export async function clearCart() {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false }

        // @ts-ignore
        const cart = await db.cart.findUnique({
            where: { userId: session.user.id }
        })

        if (cart) {
            // @ts-ignore
            await db.cartItem.deleteMany({
                where: { cartId: cart.id }
            })
        }

        revalidatePath("/carrito")
        return { success: true }
    } catch (error) {
        console.error("[CLEAR_CART]", error)
        return { success: false }
    }
}

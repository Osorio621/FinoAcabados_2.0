"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getCart, addToCart as addToCartAction, updateCartQuantity as updateAction, removeFromCart as removeAction } from "@/actions/cart-actions"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface CartContextType {
    cart: any
    itemCount: number
    isLoading: boolean
    refreshCart: () => Promise<void>
    addItem: (productId: string, quantity?: number) => Promise<boolean>
    updateQuantity: (itemId: string, quantity: number) => Promise<boolean>
    removeItem: (itemId: string) => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const [cart, setCart] = useState<any>(null)
    const [itemCount, setItemCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const refreshCart = useCallback(async () => {
        if (!session?.user) {
            setCart(null)
            setItemCount(0)
            return
        }

        try {
            const result = await getCart() as any
            if (result.success) {
                setCart(result.data)
                // Calcular total de items
                const count = result.data.items.reduce((acc: number, item: any) => acc + item.quantity, 0)
                setItemCount(count)
            }
        } catch (error) {
            console.error("Error refreshing cart:", error)
        }
    }, [session])

    useEffect(() => {
        if (session?.user) {
            refreshCart()
        } else {
            setCart(null)
            setItemCount(0)
        }
    }, [session, refreshCart])

    const addItem = async (productId: string, quantity: number = 1) => {
        if (!session) {
            toast.error("Debes iniciar sesión para agregar productos")
            return false
        }

        setIsLoading(true)
        try {
            const result = await addToCartAction(productId, quantity) as any
            if (result.success) {
                toast.success(result.message || "Agregado al carrito")
                await refreshCart()
                return true
            } else {
                toast.error(result.error || "No se pudo agregar")
                return false
            }
        } catch (error) {
            toast.error("Error de conexión")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            const result = await updateAction(itemId, quantity) as any
            if (result.success) {
                toast.success("Carrito actualizado")
                await refreshCart()
                return true
            } else {
                toast.error(result.error || "Error al actualizar")
                return false
            }
        } catch (error) {
            toast.error("Error de conexión")
            return false
        }
    }

    const removeItem = async (itemId: string) => {
        try {
            const result = await removeAction(itemId) as any
            if (result.success) {
                toast.success("Producto eliminado")
                await refreshCart()
                return true
            } else {
                toast.error(result.error || "Error al eliminar")
                return false
            }
        } catch (error) {
            toast.error("Error de conexión")
            return false
        }
    }

    return (
        <CartContext.Provider value={{
            cart,
            itemCount,
            isLoading,
            refreshCart,
            addItem,
            updateQuantity,
            removeItem
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

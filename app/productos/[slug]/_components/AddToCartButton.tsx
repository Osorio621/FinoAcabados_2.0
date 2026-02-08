"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/context/cart-context"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
    stock: number
    productId: string
    name: string
}

export const AddToCartButton = ({ stock, productId, name }: AddToCartButtonProps) => {
    const { data: session } = useSession()
    const router = useRouter()
    const { addItem, isLoading } = useCart()

    const handleAddToCart = async () => {
        if (!session) {
            router.push("/auth/login")
            return
        }

        await addItem(productId, 1)
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={stock <= 0 || isLoading}
            className="w-full bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
            <ShoppingCart className="h-6 w-6" />
            {isLoading ? 'Agregando...' : stock > 0 ? 'Agregar al Carrito' : 'Producto Agotado'}
        </button>
    )
}

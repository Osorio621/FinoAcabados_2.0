"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
    stock: number
    slug: string
    name: string
}

export const AddToCartButton = ({ stock, slug, name }: AddToCartButtonProps) => {
    const { data: session } = useSession()
    const router = useRouter()

    const handleAddToCart = () => {
        if (!session) {
            router.push("/auth/login")
            return
        }

        // Logic for authenticated users
        // Since cart context is unimplemented, we'll confirm action to user
        alert(`¡${name} agregado al carrito! (Simulación)`)
        console.log("Adding to cart:", slug)
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="w-full bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
            <ShoppingCart className="h-6 w-6" />
            {stock > 0 ? 'Agregar al Carrito' : 'Producto Agotado'}
        </button>
    )
}

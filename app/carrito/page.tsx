import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CartClient } from "./_components/cart-client"
import { getCart } from "@/actions/cart-actions"
import { serializeCart } from "@/lib/product-utils"

export default async function CarritoPage() {
    const session = await auth()

    if (!session) {
        return redirect("/auth/login?callbackUrl=/carrito")
    }

    const result = await getCart()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <CartClient initialCart={(result.success ? serializeCart(result.data) : null) as any} />
            </div>
        </div>
    )
}

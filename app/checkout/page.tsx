import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CheckoutClient } from "./_components/checkout-client"
import { getCart } from "@/actions/cart-actions"
import { serializeCart } from "@/lib/product-utils"

export default async function CheckoutPage() {
    const session = await auth()

    if (!session) {
        return redirect("/auth/login?callbackUrl=/checkout")
    }

    const result = await getCart()

    if (!result.success || !result.data || result.data.items.length === 0) {
        return redirect("/carrito")
    }

    const initialCart = serializeCart(result.data) as any

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <CheckoutClient initialCart={initialCart} user={session.user} />
            </div>
        </div>
    )
}

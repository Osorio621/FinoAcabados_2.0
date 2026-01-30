import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PromotionList } from "./_components/promotion-list"

export default async function PromotionsPage() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        return redirect("/")
    }

    const products = await db.product.findMany({
        where: {
            isOffer: true
        },
        include: {
            category: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    })

    // Serialización simple
    const serializedProducts = products.map(p => ({
        ...p,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Promociones Activas</h1>
                <p className="text-zinc-500 mt-1">Gestiona las ofertas y descuentos de tu catálogo.</p>
            </div>

            <PromotionList initialProducts={serializedProducts} />
        </div>
    )
}

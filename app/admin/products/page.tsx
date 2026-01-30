import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProductList } from "./_components/product-list"

export default async function AdminProductsPage() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        return redirect("/")
    }

    const products = await db.product.findMany({
        include: {
            category: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    })

    // Serialización simple para evitar problemas con Decimal de Prisma en Client Components
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
                <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Gestión de Productos</h1>
                <p className="text-zinc-500 mt-1">Crea, edita o elimina productos de tu catálogo.</p>
            </div>

            <ProductList initialProducts={serializedProducts} />
        </div>
    )
}

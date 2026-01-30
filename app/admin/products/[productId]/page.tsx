import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { ProductForm } from "../_components/product-form"

import { serializeProduct } from "@/lib/product-utils"

interface EditProductPageProps {
    params: Promise<{
        productId: string
    }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const session = await auth()
    const { productId } = await params

    if (session?.user?.role !== "ADMIN") {
        return redirect("/")
    }

    // Si es "new", no buscamos en DB (aunque usualmente esto se maneja en /new/page.tsx si existe)
    if (productId === 'new') {
        // Lógica para nuevo producto si aplica, o redirect
        // Asumiendo que existe una ruta dedicada o que este componente maneja create
        // Pero el error era id undefined.
    }

    const product = await db.product.findUnique({
        where: { id: productId }
    })

    if (!product) {
        return notFound()
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    const serializedProduct = serializeProduct(product)

    return (
        <div className="pt-6">
            <ProductForm
                initialData={serializedProduct}
                categories={categories}
            />
        </div>
    )
}

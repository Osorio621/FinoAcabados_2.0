import { getProducts, getCategories } from "@/actions/product-actions"
import { ProductsClient } from "./_components/ProductsClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Productos | Fino Acabados",
    description:
        "Explora nuestro catálogo completo de pinturas, herramientas, complementos y acabados de alta calidad para tus proyectos de construcción y renovación.",
}

export default async function ProductsPage() {
    const [productsResult, categoriesResult] = await Promise.all([
        getProducts(),
        getCategories(),
    ])

    if (!productsResult.success || !categoriesResult.success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-primary dark:text-white">
                        Error al cargar productos
                    </h1>
                    <p className="text-zinc-500">
                        {productsResult.error || categoriesResult.error}
                    </p>
                </div>
            </div>
        )
    }

    // ✅ Variables seguras para TypeScript
    const products = productsResult.data ?? []
    const categories = categoriesResult.data ?? []

    return (
        <ProductsClient
            initialProducts={products}
            categories={categories}
        />
    )
}

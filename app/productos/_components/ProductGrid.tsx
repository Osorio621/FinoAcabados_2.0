"use client"

import { motion } from "framer-motion"
import { ProductCard } from "@/components/shared/ProductCard"
import { Package } from "lucide-react"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    discountPrice: number | null
    imageUrl: string | null
    isOffer: boolean
    stock: number
    category: {
        id: string
        name: string
        slug: string
    }
}

interface ProductGridProps {
    products: Product[]
}

export const ProductGrid = ({ products }: ProductGridProps) => {
    if (products.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="w-20 h-20 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                        <Package className="h-10 w-10 text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-bold text-primary dark:text-white">
                        No se encontraron productos
                    </h3>
                    <p className="text-zinc-500 max-w-md">
                        Intenta ajustar los filtros o la búsqueda para encontrar lo que necesitas.
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <>
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <ProductCard
                        id={product.id}
                        slug={product.slug}
                        name={product.name}
                        price={product.price}
                        discountPrice={product.discountPrice}
                        imageUrl={product.imageUrl}
                        isOffer={product.isOffer}
                        category={product.category.name}
                        stock={product.stock}
                    />
                </motion.div>
            ))}
        </>
    )
}

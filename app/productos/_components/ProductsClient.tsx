"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductFilters } from "./ProductFilters"
import { ProductSearch } from "./ProductSearch"
import { ProductSort } from "./ProductSort"
import { ProductGrid } from "./ProductGrid"
import { filterProducts, sortProducts, paginateProducts, SortOption } from "@/lib/product-utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Category {
    id: string
    name: string
    slug: string
    _count: {
        products: number
    }
}

interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    discountPrice: number | null
    imageUrl: string | null
    isOffer: boolean
    stock: number
    categoryId: string
    category: {
        id: string
        name: string
        slug: string
    }
}

interface ProductsClientProps {
    initialProducts: Product[]
    categories: Category[]
}

const PRODUCTS_PER_PAGE = 12

// Mapeo de slugs de categorías desde el navbar
const categorySlugMap: Record<string, string> = {
    "pinturas": "pinturas",
    "herramientas": "herramientas",
    "complementos": "complementos",
    "acabados": "acabados"
}

export const ProductsClient = ({ initialProducts, categories }: ProductsClientProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("newest")
    const [showOffersOnly, setShowOffersOnly] = useState(false)
    const [showInStockOnly, setShowInStockOnly] = useState(false)

    // Price range
    const minProductPrice = Math.min(...initialProducts.map(p => Number(p.price)))
    const maxProductPrice = Math.max(...initialProducts.map(p => Number(p.price)))
    const [priceRange, setPriceRange] = useState<[number, number]>([minProductPrice, maxProductPrice])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)

    // Efecto para leer categoría de la URL
    useEffect(() => {
        const categoriaFromURL = searchParams.get("categoria")

        if (categoriaFromURL) {
            // Limpiar cualquier selección previa
            setSelectedCategories([])

            // Buscar la categoría que coincide con el slug
            const categoriaEncontrada = categories.find(cat =>
                cat.slug === categoriaFromURL ||
                categorySlugMap[categoriaFromURL] === cat.slug
            )

            if (categoriaEncontrada) {
                // Seleccionar la categoría encontrada
                setSelectedCategories([categoriaEncontrada.id])

                // Opcional: Resetear a página 1
                setCurrentPage(1)

                // Opcional: Limpiar búsqueda si hay una categoría seleccionada
                if (searchQuery) {
                    setSearchQuery("")
                }
            }
        }
    }, [searchParams, categories])

    // Función para manejar cambio de categorías y actualizar URL
    const handleCategoryChange = (categoryIds: string[]) => {
        setSelectedCategories(categoryIds)

        // Actualizar URL si hay cambios en las categorías
        if (categoryIds.length === 1) {
            // Si hay exactamente una categoría seleccionada, actualizar URL
            const selectedCategory = categories.find(cat => cat.id === categoryIds[0])
            if (selectedCategory) {
                router.push(`/productos?categoria=${selectedCategory.slug}`)
            }
        } else if (categoryIds.length === 0) {
            // Si no hay categorías seleccionadas, quitar parámetro de categoría
            router.push("/productos")
        } else {
            // Si hay múltiples categorías, mantener solo la primera en la URL
            const firstCategory = categories.find(cat => cat.id === categoryIds[0])
            if (firstCategory) {
                router.push(`/productos?categoria=${firstCategory.slug}`)
            }
        }

        // Resetear a página 1 cuando cambian las categorías
        setCurrentPage(1)
    }

    // Función para limpiar todos los filtros incluyendo URL
    const handleClearFilters = () => {
        setSelectedCategories([])
        setSearchQuery("")
        setShowOffersOnly(false)
        setShowInStockOnly(false)
        setPriceRange([minProductPrice, maxProductPrice])
        setCurrentPage(1)
        router.push("/productos") // Limpiar parámetros de la URL
    }

    // Apply filters and sorting
    const filteredAndSortedProducts = useMemo(() => {
        let products = filterProducts(initialProducts, {
            categoryIds: selectedCategories,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            inStockOnly: showInStockOnly,
            offersOnly: showOffersOnly,
            search: searchQuery
        })

        products = sortProducts(products, sortBy)

        return products
    }, [initialProducts, selectedCategories, priceRange, showInStockOnly, showOffersOnly, searchQuery, sortBy])

    // Paginate results
    const paginatedData = useMemo(() => {
        return paginateProducts(filteredAndSortedProducts, currentPage, PRODUCTS_PER_PAGE)
    }, [filteredAndSortedProducts, currentPage])

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [selectedCategories, priceRange, showInStockOnly, showOffersOnly, searchQuery, sortBy])

    // Obtener nombre de categoría seleccionada para mostrar en el título
    const selectedCategoryName = useMemo(() => {
        if (selectedCategories.length === 1) {
            const category = categories.find(cat => cat.id === selectedCategories[0])
            return category ? category.name : null
        }
        return null
    }, [selectedCategories, categories])

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white tracking-tight">
                                {selectedCategoryName
                                    ? `Productos: ${selectedCategoryName}`
                                    : "Nuestros Productos"
                                }
                            </h1>
                            <p className="text-zinc-500 mt-2">
                                {selectedCategories.length === 1
                                    ? `Explora nuestra selección de ${selectedCategoryName?.toLowerCase()} premium`
                                    : "Descubre nuestra selección completa de productos premium"
                                }
                            </p>
                        </div>
                        <ProductSort value={sortBy} onChange={setSortBy} />
                    </div>

                    {/* Search */}
                    <ProductSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                        resultCount={filteredAndSortedProducts.length}
                    />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <ProductFilters
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange} // Usar nueva función
                            minPrice={minProductPrice}
                            maxPrice={maxProductPrice}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                            showOffersOnly={showOffersOnly}
                            onShowOffersOnlyChange={setShowOffersOnly}
                            showInStockOnly={showInStockOnly}
                            onShowInStockOnlyChange={setShowInStockOnly}
                            onClearFilters={handleClearFilters} // Usar nueva función
                            totalProducts={filteredAndSortedProducts.length}
                        />
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            <ProductGrid products={paginatedData.items} />
                        </div>

                        {/* Mensaje si no hay productos */}
                        {filteredAndSortedProducts.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-zinc-400 mb-4">
                                    <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">
                                    No se encontraron productos
                                </h3>
                                <p className="text-zinc-500 mb-6">
                                    {selectedCategories.length > 0
                                        ? "No hay productos en esta categoría con los filtros aplicados"
                                        : "Intenta con otros filtros o términos de búsqueda"
                                    }
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="bg-accent text-white px-6 py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors"
                                >
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        )}

                        {/* Pagination - Solo mostrar si hay productos */}
                        {paginatedData.totalPages > 1 && filteredAndSortedProducts.length > 0 && (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={!paginatedData.hasPreviousPage}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-primary dark:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: paginatedData.totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-all ${page === currentPage
                                                ? "bg-accent text-white"
                                                : "bg-white dark:bg-zinc-900 text-primary dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(paginatedData.totalPages, p + 1))}
                                    disabled={!paginatedData.hasNextPage}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-primary dark:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
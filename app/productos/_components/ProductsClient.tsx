"use client"

import { useState, useMemo } from "react"
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

export const ProductsClient = ({ initialProducts, categories }: ProductsClientProps) => {
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

    const handleClearFilters = () => {
        setSelectedCategories([])
        setSearchQuery("")
        setShowOffersOnly(false)
        setShowInStockOnly(false)
        setPriceRange([minProductPrice, maxProductPrice])
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white tracking-tight">
                                Nuestros Productos
                            </h1>
                            <p className="text-zinc-500 mt-2">
                                Descubre nuestra selección completa de productos premium
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
                            onCategoryChange={setSelectedCategories}
                            minPrice={minProductPrice}
                            maxPrice={maxProductPrice}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                            showOffersOnly={showOffersOnly}
                            onShowOffersOnlyChange={setShowOffersOnly}
                            showInStockOnly={showInStockOnly}
                            onShowInStockOnlyChange={setShowInStockOnly}
                            onClearFilters={handleClearFilters}
                            totalProducts={filteredAndSortedProducts.length}
                        />
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            <ProductGrid products={paginatedData.items} />
                        </div>

                        {/* Pagination */}
                        {paginatedData.totalPages > 1 && (
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

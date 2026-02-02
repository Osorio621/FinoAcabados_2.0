"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, SlidersHorizontal } from "lucide-react"
import { formatPrice } from "@/lib/product-utils"

interface Category {
    id: string
    name: string
    slug: string
    _count: {
        products: number
    }
    children?: Category[]
}

interface ProductFiltersProps {
    categories: Category[]
    selectedCategories: string[]
    onCategoryChange: (categoryIds: string[]) => void
    minPrice: number
    maxPrice: number
    priceRange: [number, number]
    onPriceRangeChange: (range: [number, number]) => void
    showOffersOnly: boolean
    onShowOffersOnlyChange: (value: boolean) => void
    showInStockOnly: boolean
    onShowInStockOnlyChange: (value: boolean) => void
    onClearFilters: () => void
    totalProducts: number
}

export const ProductFilters = ({
    categories,
    selectedCategories,
    onCategoryChange,
    minPrice,
    maxPrice,
    priceRange,
    onPriceRangeChange,
    showOffersOnly,
    onShowOffersOnlyChange,
    showInStockOnly,
    onShowInStockOnlyChange,
    onClearFilters,
    totalProducts
}: ProductFiltersProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const hasActiveFilters = selectedCategories.length > 0 ||
        showOffersOnly ||
        showInStockOnly ||
        priceRange[0] !== minPrice ||
        priceRange[1] !== maxPrice

    const handleCategoryToggle = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            onCategoryChange(selectedCategories.filter(id => id !== categoryId))
        } else {
            onCategoryChange([...selectedCategories, categoryId])
        }
    }

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-bold text-primary dark:text-white">Filtros</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                    >
                        Limpiar todo
                    </button>
                )}
            </div>

            {/* Categorías */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                    Categorías
                </h4>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="space-y-2">
                            <label
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryToggle(category.id)}
                                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-accent focus:ring-accent focus:ring-offset-0"
                                />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-accent transition-colors flex-1 font-medium">
                                    {category.name}
                                </span>
                                {category._count.products > 0 && (
                                    <span className="text-xs text-zinc-400">
                                        ({category._count.products})
                                    </span>
                                )}
                            </label>

                            {/* Subcategorías */}
                            {category.children && category.children.length > 0 && (
                                <div className="ml-6 space-y-2 border-l-2 border-zinc-100 dark:border-zinc-800 pl-3">
                                    {category.children.map((child: Category) => (
                                        <label
                                            key={child.id}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(child.id)}
                                                onChange={() => handleCategoryToggle(child.id)}
                                                className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 text-accent focus:ring-accent focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-accent transition-colors flex-1">
                                                {child.name}
                                            </span>
                                            {child._count.products > 0 && (
                                                <span className="text-xs text-zinc-400">
                                                    ({child._count.products})
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Rango de Precio */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                    Precio
                </h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">
                            {formatPrice(priceRange[0])}
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400">
                            {formatPrice(priceRange[1])}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={priceRange[0]}
                            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                    </div>
                </div>
            </div>

            {/* Ofertas */}
            <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={showOffersOnly}
                        onChange={(e) => onShowOffersOnlyChange(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-accent focus:ring-accent focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-accent transition-colors">
                        Solo ofertas
                    </span>
                </label>
            </div>

            {/* Stock */}
            <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={showInStockOnly}
                        onChange={(e) => onShowInStockOnlyChange(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-accent focus:ring-accent focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-accent transition-colors">
                        Solo en stock
                    </span>
                </label>
            </div>

            {/* Resultados */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-bold text-accent">{totalProducts}</span> productos encontrados
                </p>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-accent text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold hover:bg-accent/90 transition-all active:scale-95"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    Filtros
                    {hasActiveFilters && (
                        <span className="bg-white text-accent rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            !
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Filter Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-zinc-900 z-50 overflow-y-auto p-6 shadow-2xl lg:hidden"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <FilterContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block sticky top-24 h-fit">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg">
                    <FilterContent />
                </div>
            </div>
        </>
    )
}

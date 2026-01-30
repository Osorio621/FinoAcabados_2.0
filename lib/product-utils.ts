import { Product, Category } from "@prisma/client"
import Decimal from "decimal.js"

/**
 * Genera un slug SEO-friendly desde un nombre de producto
 * Ejemplo: "Pintura Acrílica Premium" -> "pintura-acrilica-premium"
 */
export function generateProductSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD") // Normalizar caracteres Unicode
        .replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
        .trim()
        .replace(/\s+/g, "-") // Reemplazar espacios con guiones
        .replace(/-+/g, "-") // Remover guiones duplicados
}

/**
 * Serializa un producto de Prisma para uso en Client Components
 * Convierte Decimal a number y Date a string
 */
export function serializeProduct(product: any) {
    // Ensure we have a plain object first to handle all nested non-serializables
    const plain = JSON.parse(JSON.stringify(product))

    return {
        ...plain,
        // Ensure numeric fields are actually numbers, not strings from JSON serialization
        price: Number(plain.price),
        discountPrice: plain.discountPrice ? Number(plain.discountPrice) : null,
    }
}

/**
 * Serializa múltiples productos
 */
export function serializeProducts(products: any[]) {
    return products.map(serializeProduct)
}

export interface ProductFilters {
    categoryIds?: string[]
    minPrice?: number
    maxPrice?: number
    inStockOnly?: boolean
    offersOnly?: boolean
    search?: string
}

/**
 * Filtra productos basado en criterios
 */
export function filterProducts(products: any[], filters: ProductFilters) {
    let filtered = [...products]

    // Filtrar por categorías
    if (filters.categoryIds && filters.categoryIds.length > 0) {
        filtered = filtered.filter(p => filters.categoryIds!.includes(p.categoryId))
    }

    // Filtrar por rango de precio
    if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => Number(p.price) >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => Number(p.price) <= filters.maxPrice!)
    }

    // Filtrar solo en stock
    if (filters.inStockOnly) {
        filtered = filtered.filter(p => p.stock > 0)
    }

    // Filtrar solo ofertas
    if (filters.offersOnly) {
        filtered = filtered.filter(p => p.isOffer && p.discountPrice)
    }

    // Filtrar por búsqueda
    if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        )
    }

    return filtered
}

export type SortOption =
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc"
    | "newest"

/**
 * Ordena productos basado en criterio
 */
export function sortProducts(products: any[], sortBy: SortOption) {
    const sorted = [...products]

    switch (sortBy) {
        case "price-asc":
            return sorted.sort((a, b) => {
                const priceA = a.isOffer && a.discountPrice ? Number(a.discountPrice) : Number(a.price)
                const priceB = b.isOffer && b.discountPrice ? Number(b.discountPrice) : Number(b.price)
                return priceA - priceB
            })

        case "price-desc":
            return sorted.sort((a, b) => {
                const priceA = a.isOffer && a.discountPrice ? Number(a.discountPrice) : Number(a.price)
                const priceB = b.isOffer && b.discountPrice ? Number(b.discountPrice) : Number(b.price)
                return priceB - priceA
            })

        case "name-asc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name))

        case "name-desc":
            return sorted.sort((a, b) => b.name.localeCompare(a.name))

        case "newest":
            return sorted.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime()
                const dateB = new Date(b.createdAt).getTime()
                return dateB - dateA
            })

        default:
            return sorted
    }
}

/**
 * Calcula el precio efectivo de un producto (considerando descuento)
 */
export function getEffectivePrice(product: any): number {
    if (product.isOffer && product.discountPrice) {
        return Number(product.discountPrice)
    }
    return Number(product.price)
}

/**
 * Calcula el porcentaje de descuento
 */
export function getDiscountPercentage(price: number, discountPrice: number): number {
    return Math.round(((price - discountPrice) / price) * 100)
}

/**
 * Pagina un array de productos
 */
export function paginateProducts<T>(items: T[], page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return {
        items: items.slice(startIndex, endIndex),
        totalItems: items.length,
        totalPages: Math.ceil(items.length / pageSize),
        currentPage: page,
        pageSize,
        hasNextPage: endIndex < items.length,
        hasPreviousPage: page > 1
    }
}

/**
 * Formato de precio en Pesos Colombianos (COP)
 * Ejemplo: $ 1.250.000
 */
export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)
}

import { Product, Category } from "@prisma/client"
import Decimal from "decimal.js"

/**
 * Genera un slug SEO-friendly desde un nombre de producto
 */
export function generateProductSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

/**
 * Serializa un producto Individual
 */
export function serializeProduct(product: any) {
    if (!product) return null

    // Si ya es un objeto plano sin Decimals, devolverlo (prevención de doble serialización)
    if (typeof product.price === 'number') return product

    return {
        ...product,
        // Convertir Decimal a Number
        price: product.price ? Number(product.price.toString()) : 0,
        discountPrice: product.discountPrice ? Number(product.discountPrice.toString()) : null,
        // Convertir Dates a Strings ISO
        createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
        updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
    }
}

/**
 * Serializa múltiples productos
 */
export function serializeProducts(products: any[]) {
    if (!products) return []
    return products.map(serializeProduct)
}

/**
 * Serializa un carrito
 */
export function serializeCart(cart: any) {
    if (!cart) return null

    return {
        id: cart.id,
        userId: cart.userId,
        createdAt: cart.createdAt instanceof Date ? cart.createdAt.toISOString() : cart.createdAt,
        updatedAt: cart.updatedAt instanceof Date ? cart.updatedAt.toISOString() : cart.updatedAt,
        items: (cart.items || []).map((item: any) => ({
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
            updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
            product: serializeProduct(item.product)
        }))
    }
}

/**
 * Serializa una orden
 */
export function serializeOrder(order: any) {
    if (!order) return null

    return {
        id: order.id,
        userId: order.userId,
        customerName: order.customerName,
        address: order.address,
        city: order.city,
        phone: order.phone,
        documentId: order.documentId,
        status: order.status,
        total: order.total ? Number(order.total.toString()) : 0,
        tax: order.tax ? Number(order.tax.toString()) : 0,
        subtotal: order.subtotal ? Number(order.subtotal.toString()) : 0,
        shippingPrice: order.shippingPrice ? Number(order.shippingPrice.toString()) : 0,
        createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
        updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
        items: (order.items || []).map((item: any) => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price ? Number(item.price.toString()) : 0,
            product: serializeProduct(item.product)
        }))
    }
}

export interface ProductFilters {
    categoryIds?: string[]
    minPrice?: number
    maxPrice?: number
    inStockOnly?: boolean
    offersOnly?: boolean
    search?: string
}

export function filterProducts(products: any[], filters: ProductFilters) {
    let filtered = [...products]
    if (filters.categoryIds && filters.categoryIds.length > 0) {
        filtered = filtered.filter(p => filters.categoryIds!.includes(p.categoryId))
    }
    if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => Number(p.price) >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => Number(p.price) <= filters.maxPrice!)
    }
    if (filters.inStockOnly) {
        filtered = filtered.filter(p => p.stock > 0)
    }
    if (filters.offersOnly) {
        filtered = filtered.filter(p => p.isOffer && p.discountPrice)
    }
    if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        )
    }
    return filtered
}

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest"

export function sortProducts(products: any[], sortBy: SortOption) {
    const sorted = [...products]
    switch (sortBy) {
        case "price-asc":
            return sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))
        case "price-desc":
            return sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a))
        case "name-asc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name))
        case "name-desc":
            return sorted.sort((a, b) => b.name.localeCompare(a.name))
        case "newest":
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        default:
            return sorted
    }
}

export function getEffectivePrice(product: any): number {
    return (product.isOffer && product.discountPrice) ? Number(product.discountPrice) : Number(product.price)
}

export function getDiscountPercentage(price: number, discountPrice: number): number {
    return Math.round(((price - discountPrice) / price) * 100)
}

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

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)
}

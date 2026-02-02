"use server"

import { db } from "@/lib/db"
import { serializeProduct, serializeProducts } from "@/lib/product-utils"

/**
 * Obtiene todos los productos con sus categorías
 */
export async function getProducts() {
    try {
        const products = await db.product.findMany({
            where: {
                isActive: true
            },
            include: {
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return { success: true, data: serializeProducts(products) }
    } catch (error: any) {
        return { success: false, error: error.message || "Error al obtener productos" }
    }
}

/**
 * Obtiene un producto por su slug
 */
export async function getProductBySlug(slug: string) {
    try {
        const product = await db.product.findUnique({
            where: {
                slug,
                isActive: true
            },
            include: {
                category: true
            }
        })

        if (!product) {
            return { success: false, error: "Producto no encontrado" }
        }

        return { success: true, data: serializeProduct(product) }
    } catch (error: any) {
        return { success: false, error: error.message || "Error al obtener producto" }
    }
}

/**
 * Obtiene todas las categorías con conteo de productos
 */
export async function getCategories() {
    try {
        const categories = await db.category.findMany({
            where: {
                parentId: null
            },
            include: {
                _count: {
                    select: { products: { where: { isActive: true } } }
                },
                children: {
                    include: {
                        _count: {
                            select: { products: { where: { isActive: true } } }
                        }
                    },
                    orderBy: { name: 'asc' }
                }
            },
            orderBy: {
                name: "asc"
            }
        })

        return { success: true, data: categories }
    } catch (error: any) {
        return { success: false, error: error.message || "Error al obtener categorías" }
    }
}

/**
 * Obtiene productos por categoría
 */
export async function getProductsByCategory(categorySlug: string) {
    try {
        const products = await db.product.findMany({
            where: {
                category: {
                    slug: categorySlug
                },
                isActive: true
            },
            include: {
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return { success: true, data: serializeProducts(products) }
    } catch (error: any) {
        return { success: false, error: error.message || "Error al obtener productos" }
    }
}

/**
 * Obtiene solo productos en oferta
 */
export async function getOfferProducts() {
    try {
        const products = await db.product.findMany({
            where: {
                isActive: true,
                isOffer: true,
                discountPrice: {
                    not: null
                }
            },
            include: {
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return { success: true, data: serializeProducts(products) }
    } catch (error: any) {
        return { success: false, error: error.message || "Error al obtener ofertas" }
    }
}

/**
 * Obtiene productos relacionados (misma categoría, excluyendo el actual)
 */
export async function getRelatedProducts(productId: string, categoryId: string, limit: number = 4) {
    try {
        const products = await db.product.findMany({
            where: {
                isActive: true,
                categoryId,
                id: {
                    not: productId
                },
                stock: {
                    gt: 0
                }
            },
            include: {
                category: true
            },
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        })

        return { success: true, data: serializeProducts(products) }
    } catch (error: any) {
        return { success: false, error: error.message || "Error al obtener productos relacionados" }
    }
}

/**
 * Obtiene productos destacados (ofertas o más recientes)
 */
export async function getFeaturedProducts(limit: number = 8) {
    try {
        // Primero intentar obtener ofertas
        const offers = await db.product.findMany({
            where: {
                isOffer: true,
                discountPrice: {
                    not: null
                },
                stock: {
                    gt: 0
                }
            },
            include: {
                category: true
            },
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        })

        // Si no hay suficientes ofertas, completar con productos recientes
        if (offers.length < limit) {
            const remaining = limit - offers.length
            const recentProducts = await db.product.findMany({
                where: {
                    isActive: true,
                    id: {
                        notIn: offers.map(p => p.id)
                    },
                    stock: {
                        gt: 0
                    }
                },
                include: {
                    category: true
                },
                take: remaining,
                orderBy: {
                    createdAt: "desc"
                }
            })

            const combined = [...offers, ...recentProducts]
            return { success: true, data: serializeProducts(combined) }
        }

        return { success: true, data: serializeProducts(offers) }
    } catch (error: any) {
        return { success: false, error: error.message || "Error al obtener productos destacados" }
    }
}

import { db } from "@/lib/db"

export const getProducts = async () => {
    try {
        return await db.product.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" }
        })
    } catch {
        return null
    }
}

export const getProductById = async (id: string) => {
    try {
        return await db.product.findUnique({
            where: { id },
            include: { category: true }
        })
    } catch {
        return null
    }
}

export const getCategories = async () => {
    try {
        return await db.category.findMany({
            orderBy: { name: "asc" }
        })
    } catch {
        return null
    }
}

"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { serializeProduct } from "@/lib/product-utils"

// Utility to verify admin role
const checkAdmin = async () => {
    const session = await auth()
    // @ts-ignore
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("No autorizado")
    }
    return session
}

/* ==========================================
   PRODUCT ACTIONS
   ========================================== */

export async function createProduct(values: any) {
    try {
        await checkAdmin()

        const product = await db.product.create({
            data: {
                ...values,
                price: Number(values.price),
                discountPrice: values.discountPrice ? Number(values.discountPrice) : null,
                stock: Number(values.stock),
                status: Number(values.stock) > 0 ? "IN_STOCK" : "OUT_OF_STOCK"
            }
        })

        revalidatePath("/admin/products")
        revalidatePath("/admin/inventory")
        revalidatePath("/")
        return { success: "Producto creado", data: serializeProduct(product) }
    } catch (error: any) {
        return { error: error.message || "Error al crear el producto" }
    }
}

export async function updateProduct(id: string, values: any) {
    try {
        await checkAdmin()

        const product = await db.product.update({
            where: { id },
            data: {
                ...values,
                price: Number(values.price),
                discountPrice: values.discountPrice ? Number(values.discountPrice) : null,
                stock: Number(values.stock),
                status: Number(values.stock) > 0 ? "IN_STOCK" : "OUT_OF_STOCK"
            }
        })

        revalidatePath("/admin/products")
        revalidatePath("/admin/inventory")
        revalidatePath(`/admin/products/${id}`)
        revalidatePath("/")
        return { success: "Producto actualizado", data: serializeProduct(product) }
    } catch (error: any) {
        return { error: error.message || "Error al actualizar el producto" }
    }
}

export async function deleteProduct(id: string) {
    return toggleProductActive(id, false)
}

export async function toggleProductActive(id: string, isActive: boolean) {
    try {
        await checkAdmin()

        const product = await db.product.update({
            where: { id },
            data: { isActive }
        })

        revalidatePath("/admin/products")
        revalidatePath("/admin/inventory")
        revalidatePath("/")
        return { success: isActive ? "Producto activado" : "Producto archivado", data: serializeProduct(product) }
    } catch (error: any) {
        return { error: error.message || "Error al cambiar estado del producto" }
    }
}

export async function updateStock(id: string, newStock: number) {
    try {
        await checkAdmin()

        const product = await db.product.update({
            where: { id },
            data: {
                stock: newStock,
                status: newStock > 0 ? "IN_STOCK" : "OUT_OF_STOCK"
            }
        })

        revalidatePath("/admin/inventory")
        revalidatePath("/admin/products")
        return { success: "Stock actualizado", data: serializeProduct(product) }
    } catch (error: any) {
        return { error: error.message || "Error al actualizar el stock" }
    }
}

export async function updateProductOffer(id: string, isOffer: boolean, discountPrice?: number) {
    try {
        await checkAdmin()

        const product = await db.product.update({
            where: { id },
            data: {
                isOffer,
                discountPrice: isOffer ? discountPrice : null
            }
        })

        revalidatePath("/admin/inventory")
        revalidatePath("/admin/products")
        revalidatePath("/admin/promotions")
        return { success: "Promoción actualizada", data: serializeProduct(product) }
    } catch (error: any) {
        return { error: error.message || "Error al actualizar la promoción" }
    }
}

/* ==========================================
   CATEGORY ACTIONS
   ========================================== */

export async function createCategory(values: {
    name: string,
    slug: string,
    parentId?: string | null  // ← Cambiado a aceptar null
}) {
    try {
        await checkAdmin()

        const category = await db.category.create({
            data: {
                name: values.name,
                slug: values.slug,
                parentId: values.parentId || null
            },
            include: {
                parent: true  // ← Agregado para incluir la relación
            }
        })

        revalidatePath("/admin/categories")
        revalidatePath("/admin/products")
        return { success: "Categoría creada", data: category }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: "Ya existe una categoría con ese nombre o slug" }
        }
        return { error: error.message || "Error al crear la categoría" }
    }
}

export async function updateCategory(id: string, values: {
    name: string,
    slug: string,
    parentId?: string | null  // ← Cambiado a aceptar null
}) {
    try {
        await checkAdmin()

        // Evitar que una categoría sea su propio padre
        if (values.parentId === id) {
            return { error: "Una categoría no puede ser su propio padre" }
        }

        const category = await db.category.update({
            where: { id },
            data: {
                name: values.name,
                slug: values.slug,
                parentId: values.parentId || null
            },
            include: {
                parent: true  // ← Agregado para incluir la relación
            }
        })

        revalidatePath("/admin/categories")
        return { success: "Categoría actualizada", data: category }
    } catch (error: any) {
        return { error: error.message || "Error al actualizar la categoría" }
    }
}

export async function deleteCategory(id: string) {
    try {
        await checkAdmin()

        // Comprobar si tiene productos
        const productsCount = await db.product.count({
            where: { categoryId: id }
        })

        if (productsCount > 0) {
            return { error: "No se puede eliminar la categoría porque tiene productos asociados" }
        }

        // Comprobar si tiene subcategorías
        const childrenCount = await db.category.count({
            where: { parentId: id }
        })

        if (childrenCount > 0) {
            return { error: "No se puede eliminar la categoría porque tiene subcategorías asociadas" }
        }

        await db.category.delete({
            where: { id }
        })

        revalidatePath("/admin/categories")
        return { success: "Categoría eliminada" }
    } catch (error: any) {
        return { error: error.message || "Error al eliminar la categoría" }
    }
}
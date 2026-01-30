import { NextResponse } from "next/server"
import { db } from "@/lib/db"

type ProductSlug = {
    id: string
    name: string
    slug: string | null
    stock: number
}

export async function GET() {
    try {
        const products: ProductSlug[] = await db.product.findMany({
            select: { id: true, name: true, slug: true, stock: true }
        })

        const slugMap = new Map<string, ProductSlug>()

        const duplicates: {
            slug: string
            original: ProductSlug
            duplicate: ProductSlug
        }[] = []

        products.forEach(p => {
            if (!p.slug) return

            if (slugMap.has(p.slug)) {
                duplicates.push({
                    slug: p.slug,
                    original: slugMap.get(p.slug)!,
                    duplicate: p
                })
            } else {
                slugMap.set(p.slug, p)
            }
        })

        return NextResponse.json({
            totalProducts: products.length,
            duplicatesCount: duplicates.length,
            duplicates
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

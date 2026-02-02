import { getProductBySlug, getRelatedProducts } from "@/actions/product-actions"
import { notFound } from "next/navigation"
import { formatPrice } from "@/lib/product-utils"
import Image from "next/image"
import Link from "next/link"
import { ProductCard } from "@/components/shared/ProductCard"
import { AddToCartButton } from "./_components/AddToCartButton"
import { ChevronRight, Home, Package, Truck, Shield } from "lucide-react"
import type { Metadata } from "next"

/* ✅ CORRECCIÓN CLAVE:
   En Next App Router moderno, params ES UNA PROMISE */
interface ProductDetailPageProps {
    params: Promise<{
        slug: string
    }>
}

/* =========================
   METADATA
========================= */
export async function generateMetadata(
    { params }: ProductDetailPageProps
): Promise<Metadata> {
    const { slug } = await params

    const result = await getProductBySlug(slug)

    if (!result.success || !result.data) {
        return {
            title: "Producto no encontrado | Fino Acabados",
        }
    }

    const product = result.data

    return {
        title: `${product.name} | Fino Acabados`,
        description: product.description,
    }
}

/* =========================
   PAGE
========================= */
export default async function ProductDetailPage(
    { params }: ProductDetailPageProps
) {
    const { slug } = await params

    const result = await getProductBySlug(slug)

    if (!result.success || !result.data) {
        notFound()
    }

    const product = result.data

    /* =========================
       RELATED PRODUCTS
    ========================= */
    const relatedResult = await getRelatedProducts(
        product.id,
        product.categoryId,
        4
    )

    /* ✅ Convertimos Decimal → number (CRÍTICO) */
    const relatedProducts =
        relatedResult.success && relatedResult.data
            ? relatedResult.data.map(p => ({
                ...p,
                price: Number(p.price),
                discountPrice: p.discountPrice
                    ? Number(p.discountPrice)
                    : null,
            }))
            : []

    const hasDiscount = product.isOffer && product.discountPrice
    const effectivePrice = hasDiscount
        ? Number(product.discountPrice)
        : Number(product.price)

    const discountPercentage = hasDiscount
        ? Math.round(
            ((Number(product.price) - Number(product.discountPrice)) /
                Number(product.price)) *
            100
        )
        : 0

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* =========================
               BREADCRUMBS
            ========================= */}
            <div className="bg-zinc-50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Link href="/" className="hover:text-accent">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/productos" className="hover:text-accent">
                            Productos
                        </Link>
                        {product.category.parent && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <Link
                                    href={`/productos?categoria=${product.category.parent.slug}`}
                                    className="hover:text-accent"
                                >
                                    {product.category.parent.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="h-4 w-4" />
                        <Link
                            href={`/productos?categoria=${product.category.slug}`}
                            className="hover:text-accent"
                        >
                            {product.category.name}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium text-primary dark:text-white truncate">
                            {product.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* =========================
               PRODUCT DETAIL
            ========================= */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* IMAGE */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border">
                        <Image
                            src={
                                product.imageUrl ||
                                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f"
                            }
                            alt={product.name}
                            fill
                            priority
                            className="object-cover"
                        />
                        {hasDiscount && (
                            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                -{discountPercentage}% OFF
                            </span>
                        )}
                        {product.stock <= 0 && (
                            <span className="absolute top-4 right-4 bg-zinc-800 text-white px-3 py-1 rounded-full font-bold">
                                Agotado
                            </span>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex flex-col">
                                {product.category.parent && (
                                    <Link
                                        href={`/productos?categoria=${product.category.parent.slug}`}
                                        className="text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-accent transition-colors"
                                    >
                                        {product.category.parent.name}
                                    </Link>
                                )}
                                <Link
                                    href={`/productos?categoria=${product.category.slug}`}
                                    className="text-sm font-bold text-accent uppercase tracking-widest"
                                >
                                    {product.category.name}
                                </Link>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mt-2">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold">
                                {formatPrice(effectivePrice)}
                            </span>
                            {hasDiscount && (
                                <span className="text-2xl text-zinc-400 line-through">
                                    {formatPrice(Number(product.price))}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Package
                                className={`h-5 w-5 ${product.stock > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                    }`}
                            />
                            <span className="font-medium">
                                {product.stock > 0
                                    ? `${product.stock} unidades disponibles`
                                    : "Producto agotado"}
                            </span>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400">
                            {product.description}
                        </p>

                        <AddToCartButton
                            stock={product.stock}
                            slug={product.slug}
                            name={product.name}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
                            <div className="flex gap-3">
                                <Truck className="text-blue-500" />
                                <div>
                                    <h4 className="font-bold">Envío Rápido</h4>
                                    <p className="text-xs text-zinc-500">
                                        24–48 horas
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Shield className="text-green-500" />
                                <div>
                                    <h4 className="font-bold">
                                        Garantía de Calidad
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        Productos certificados
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================
                   RELATED PRODUCTS
                ========================= */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                            <h2 className="text-2xl font-bold text-primary dark:text-white uppercase tracking-widest">
                                Productos Relacionados
                            </h2>
                            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(rp => (
                                <ProductCard
                                    key={rp.id}
                                    id={rp.id}
                                    slug={rp.slug}
                                    name={rp.name}
                                    price={rp.price}
                                    discountPrice={rp.discountPrice}
                                    imageUrl={rp.imageUrl}
                                    isOffer={rp.isOffer}
                                    category={rp.category?.parent?.name || rp.category?.name}
                                    subcategory={rp.category?.parent ? rp.category?.name : undefined}
                                    stock={rp.stock}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

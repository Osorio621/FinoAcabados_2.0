import { Hero } from "@/components/shared/Hero";
import { CategoryHighlights } from "@/components/shared/CategoryHighlights";
import { Benefits } from "@/components/shared/Benefits";
import { ProductCard } from "@/components/shared/ProductCard";
import { getFeaturedProducts } from "@/actions/product-actions";
import Link from "next/link";

export const dynamic = "force-dynamic"

export default async function Home() {
  const result = await getFeaturedProducts(8)
  console.log("🏠 Homepage Fetch Result:", {
    success: result.success,
    count: result.success && result.data ? result.data.length : 0,
    error: !result.success ? result.error : null
  })

  const featuredProducts = (result.success && result.data) ? result.data : []

  return (
    <div className="relative flex flex-col w-full space-y-12 md:space-y-16">
      <Hero />
      <CategoryHighlights />
      <Benefits />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-20 px-4 sm:px-6 bg-zinc-50 dark:bg-black/50">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 md:gap-6">
              <div className="space-y-3 text-left">
                <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em]">Exclusividad</h2>
                <p className="text-3xl md:text-4xl font-bold text-primary dark:text-white tracking-tight">Selección Destacada</p>
              </div>
              <Link
                href="/productos"
                className="text-sm font-bold border-b-2 border-accent pb-1 hover:text-accent transition-colors"
              >
                Ver todos los productos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  isOffer={product.isOffer}
                  category={product.category.name}
                  stock={product.stock}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Section / Final CTA */}
      <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 dark:border-accent/20">
        <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-3 md:mb-4">
          ¿Necesitas asesoría personalizada?
        </h3>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6 md:mb-8">
          Nuestros expertos te ayudarán a elegir los productos perfectos para tu proyecto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link
            href="/productos"
            className="px-6 md:px-8 py-2.5 md:py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Ver Todo el Catálogo
          </Link>
          <Link
            href="/contacto"
            className="px-6 md:px-8 py-2.5 md:py-3 border-2 border-primary text-primary dark:text-white font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
          >
            Contactar Asesor
          </Link>
        </div>
      </div>
    </div>
  );
}
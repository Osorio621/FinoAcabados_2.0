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
    <div className="relative flex flex-col w-full">
      <Hero />
      <CategoryHighlights />
      <Benefits />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-24 px-6 bg-zinc-50 dark:bg-black/50">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="space-y-4 text-left">
                <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em]">Exclusividad</h2>
                <p className="text-4xl font-bold text-primary dark:text-white tracking-tight">Selección Destacada</p>
              </div>
              <Link
                href="/productos"
                className="text-sm font-bold border-b-2 border-accent pb-1 hover:text-accent transition-colors"
              >
                Ver todos los productos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="py-24 px-6 bg-white dark:bg-zinc-950 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <h2 className="text-4xl font-bold tracking-tight">¿Listo para elevar tu próximo proyecto?</h2>
          <p className="text-zinc-500">Nuestro equipo está listo para asesorarte en la elección de los mejores acabados y herramientas del mercado.</p>
          <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-accent transition-all shadow-xl active:scale-95">
            Contactar Asesor
          </button>
        </div>
      </section>
    </div>
  );
}

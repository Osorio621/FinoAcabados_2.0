import { db } from "../lib/db"
import { generateProductSlug } from "../lib/product-utils"

async function main() {
    console.log("🌱 Iniciando seed de productos...")

    // Crear categorías si no existen
    const categories = [
        { name: "Pinturas", slug: "pinturas" },
        { name: "Herramientas", slug: "herramientas" },
        { name: "Complementos", slug: "complementos" },
        { name: "Acabados", slug: "acabados" }
    ]

    console.log("📁 Creando categorías...")
    for (const cat of categories) {
        await db.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        })
    }

    const pinturas = await db.category.findUnique({ where: { slug: "pinturas" } })
    const herramientas = await db.category.findUnique({ where: { slug: "herramientas" } })
    const complementos = await db.category.findUnique({ where: { slug: "complementos" } })
    const acabados = await db.category.findUnique({ where: { slug: "acabados" } })

    if (!pinturas || !herramientas || !complementos || !acabados) {
        throw new Error("Error al crear categorías")
    }

    // Productos de ejemplo
    const products = [
        // Pinturas
        {
            name: "Pintura Acrílica Premium Mate",
            description: "Pintura acrílica de alta calidad con acabado mate perfecto para interiores. Excelente cubrimiento y durabilidad.",
            price: 45.90,
            discountPrice: 35.00,
            isOffer: true,
            stock: 20,
            categoryId: pinturas.id,
            imageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Pintura Látex Exterior Blanco",
            description: "Pintura látex especial para exteriores con protección UV y resistencia a la intemperie.",
            price: 52.00,
            stock: 15,
            categoryId: pinturas.id,
            imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Esmalte Sintético Brillante",
            description: "Esmalte sintético de alto brillo para madera y metal. Secado rápido y gran resistencia.",
            price: 38.50,
            discountPrice: 29.90,
            isOffer: true,
            stock: 25,
            categoryId: pinturas.id,
            imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Pintura Antihumedad Interior",
            description: "Pintura especial con tecnología antimoho para ambientes húmedos como baños y cocinas.",
            price: 48.00,
            stock: 12,
            categoryId: pinturas.id,
            imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=2070&auto=format&fit=crop"
        },

        // Herramientas
        {
            name: "Drill Inalámbrico High-Force 20V",
            description: "Taladro inalámbrico profesional de 20V con batería de litio, 2 velocidades y luz LED integrada.",
            price: 189.00,
            stock: 5,
            categoryId: herramientas.id,
            imageUrl: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Lijadora Orbital Profesional",
            description: "Lijadora orbital de alta potencia con sistema de recolección de polvo y control de velocidad variable.",
            price: 125.00,
            discountPrice: 99.00,
            isOffer: true,
            stock: 8,
            categoryId: herramientas.id,
            imageUrl: "https://images.unsplash.com/photo-1530124560676-4fbc91bad174?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Pistola de Pintura Eléctrica",
            description: "Pistola de pintura eléctrica con 3 patrones de rociado y control de flujo ajustable.",
            price: 156.00,
            stock: 6,
            categoryId: herramientas.id,
            imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Sierra Circular 7 1/4 Pulgadas",
            description: "Sierra circular profesional con guía láser y profundidad de corte ajustable hasta 65mm.",
            price: 210.00,
            stock: 0,
            categoryId: herramientas.id,
            imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=2070&auto=format&fit=crop"
        },

        // Complementos
        {
            name: "Set de Brochas Sintéticas Pro 5 Piezas",
            description: "Set profesional de 5 brochas de diferentes tamaños con cerdas sintéticas de alta calidad.",
            price: 12.50,
            stock: 50,
            categoryId: complementos.id,
            imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Rodillo Antigota Premium",
            description: "Rodillo de microfibra antigota de 23cm con mango ergonómico y extensión telescópica.",
            price: 18.00,
            discountPrice: 14.50,
            isOffer: true,
            stock: 35,
            categoryId: complementos.id,
            imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Cinta de Enmascarar Profesional",
            description: "Cinta de enmascarar de alta adherencia, fácil remoción sin residuos. Rollo de 50m.",
            price: 5.50,
            stock: 100,
            categoryId: complementos.id,
            imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Bandeja para Pintura con Rejilla",
            description: "Bandeja profesional de plástico resistente con rejilla escurridora incluida.",
            price: 8.00,
            stock: 45,
            categoryId: complementos.id,
            imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=2070&auto=format&fit=crop"
        },

        // Acabados
        {
            name: "Barniz de Alta Resistencia Transparente",
            description: "Barniz poliuretano transparente con protección UV para madera interior y exterior.",
            price: 28.00,
            stock: 0,
            categoryId: acabados.id,
            imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Sellador Acrílico Multiuso",
            description: "Sellador acrílico de alta penetración para todo tipo de superficies porosas.",
            price: 22.00,
            discountPrice: 17.50,
            isOffer: true,
            stock: 18,
            categoryId: acabados.id,
            imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Masilla para Madera Profesional",
            description: "Masilla de alta calidad para reparación de madera, fácil lijado y excelente adherencia.",
            price: 15.00,
            stock: 22,
            categoryId: acabados.id,
            imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Imprimante Anticorrosivo Gris",
            description: "Imprimante anticorrosivo de alta adherencia para superficies metálicas.",
            price: 32.00,
            stock: 14,
            categoryId: acabados.id,
            imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=2070&auto=format&fit=crop"
        }
    ]

    console.log("🎨 Creando productos...")
    let created = 0
    let updated = 0

    for (const productData of products) {
        const slug = generateProductSlug(productData.name)

        const existing = await db.product.findUnique({
            where: { slug }
        })

        if (existing) {
            await db.product.update({
                where: { slug },
                data: {
                    ...productData,
                    slug,
                    status: productData.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK"
                }
            })
            updated++
        } else {
            await db.product.create({
                data: {
                    ...productData,
                    slug,
                    status: productData.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK"
                }
            })
            created++
        }
    }

    console.log(`✅ Seed completado: ${created} productos creados, ${updated} actualizados`)
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })

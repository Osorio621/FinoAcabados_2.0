import { db } from "../lib/db"

async function main() {
    console.log("🌱 Iniciando seed de subcategorías de Pintura...")

    // Obtener categoría padre "Pinturas"
    const pinturas = await db.category.findUnique({
        where: { slug: "pinturas" }
    })

    if (!pinturas) {
        console.error("❌ La categoría 'Pinturas' no existe. Ejecuta primero seed-products.ts")
        process.exit(1)
    }

    const subcategories = [
        { name: "Tipo 1", slug: "pinturas-tipo-1" },
        { name: "Tipo 2", slug: "pinturas-tipo-2" },
        { name: "Tipo 3", slug: "pinturas-tipo-3" },
        { name: "En Aceite", slug: "pinturas-en-aceite" }
    ]

    console.log("📁 Creando subcategorías...")
    for (const sub of subcategories) {
        await db.category.upsert({
            where: { slug: sub.slug },
            update: {
                parentId: pinturas.id
            },
            create: {
                name: sub.name,
                slug: sub.slug,
                parentId: pinturas.id
            }
        })
        console.log(`✅ Subcategoría creada/actualizada: ${sub.name}`)
    }

    console.log("✨ Seed completado con éxito")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })

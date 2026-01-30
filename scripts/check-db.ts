import { db } from "../lib/db"

async function main() {
    try {
        console.log("🔎 Verificando base de datos...")
        const count = await db.product.count()
        console.log(`📊 Productos totales: ${count}`)

        const offers = await db.product.count({ where: { isOffer: true } })
        console.log(`🏷️ Ofertas: ${offers}`)

        const stock = await db.product.count({ where: { stock: { gt: 0 } } })
        console.log(`📦 En stock: ${stock}`)

        const one = await db.product.findFirst()
        console.log("📝 Primer producto encontrado:", one)

        if (count === 0) {
            console.error("❌ LA BASE DE DATOS ESTÁ VACÍA")
        } else {
            console.log("✅ Datos encontrados en DB")
        }
    } catch (error) {
        console.error("❌ Error conectando a DB:", error)
    } finally {
        await db.$disconnect()
    }
}

main()

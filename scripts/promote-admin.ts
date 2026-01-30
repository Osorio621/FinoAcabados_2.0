import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
    const email = 'juanjoseosorio90@gmail.com'
    const user = await db.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log('❌ Usuario no encontrado:', email)
        process.exit(1)
    }

    console.log('👤 Usuario encontrado:', user.email)
    console.log('📊 Rol actual:', user.role)

    if (user.role !== 'ADMIN') {
        console.log('🚀 Promocionando a ADMIN...')
        await db.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        })
        console.log('✅ Éxito! El usuario ahora es ADMINISTRADOR.')
    } else {
        console.log('✨ El usuario ya tiene el rol de ADMINISTRADOR.')
    }

    await db.$disconnect()
}

main().catch((err) => {
    console.error('💥 Error inesperado:', err)
    process.exit(1)
})

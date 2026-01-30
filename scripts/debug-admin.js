const { PrismaClient } = require("./prisma/generated-client")
const db = new PrismaClient()

async function checkAndPromote() {
    const email = 'juanjoseosorio90@gmail.com'
    const user = await db.user.findUnique({
        where: { email }
    })

    if (user) {
        console.log('USER_FOUND')
        console.log('EMAIL:', user.email)
        console.log('ROLE:', user.role)

        if (user.role !== 'ADMIN') {
            console.log('PROMOTING_USER...')
            await db.user.update({
                where: { email },
                data: { role: 'ADMIN' }
            })
            console.log('SUCCESS: User is now ADMIN')
        } else {
            console.log('USER_ALREADY_ADMIN')
        }
    } else {
        console.log('ERROR: User not found')
    }
    await db.$disconnect()
}

checkAndPromote()

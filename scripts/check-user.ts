import { db } from "../lib/db"

async function checkUser() {
    const email = 'juanjoseosorio90@gmail.com'
    const user = await db.user.findUnique({
        where: { email }
    })

    if (user) {
        console.log('✅ Usuario encontrado:')
        console.log('Email:', user.email)
        console.log('Role:', user.role)
        console.log('ID:', user.id)
        console.log('Password exists:', !!user.password)
    } else {
        console.log('❌ Usuario no encontrado.')
    }
    process.exit(0)
}

checkUser()

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers } from "@/actions/user-actions"
import { UserList } from "./_components/user-list"
import { Users } from "lucide-react"

export default async function UsersPage() {
    const session = await auth()

    // @ts-ignore
    if (session?.user?.role !== "SUPER_ADMIN") {
        return redirect("/admin")
    }

    const result = await getUsers()
    const users = result.success && result.data ? result.data : []

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Users className="h-6 w-6 text-accent" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Gestión de Usuarios</h1>
                    </div>
                    <p className="text-zinc-500">Administra los roles y accesos del equipo de Fino Acabados.</p>
                </div>
            </div>

            <UserList initialUsers={users} currentUser={session.user} />
        </div>
    )
}

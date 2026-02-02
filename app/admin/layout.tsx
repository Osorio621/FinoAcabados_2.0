import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "./_components/AdminShell"

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // @ts-ignore
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return redirect("/")
    }

    return <AdminShell>{children}</AdminShell>
}

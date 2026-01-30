import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CategoryManager } from "./_components/category-manager"

export default async function CategoriesPage() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        return redirect("/")
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Categorías</h1>
                <p className="text-zinc-500 mt-1">Organiza tus productos en categorías para que sea más fácil encontrarlos.</p>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    )
}

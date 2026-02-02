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
        },
        include: {
            parent: true,
            children: true // Agregamos esto para saber si tiene subcategorías
        }
    })

    // Separamos categorías principales y subcategorías
    const mainCategories = categories.filter(category => !category.parentId)
    const subCategories = categories.filter(category => category.parentId)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Categorías</h1>
                <p className="text-zinc-500 mt-1">Organiza tus productos en categorías y subcategorías.</p>
            </div>

            <CategoryManager 
                initialCategories={categories}
                mainCategories={mainCategories}
                subCategories={subCategories}
            />
        </div>
    )
}
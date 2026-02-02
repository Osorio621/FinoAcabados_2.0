import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProductForm } from "../_components/product-form"

export default async function NewProductPage() {
    const session = await auth()

    // @ts-ignore
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return redirect("/")
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    return (
        <div className="pt-6">
            <ProductForm categories={categories} />
        </div>
    )
}

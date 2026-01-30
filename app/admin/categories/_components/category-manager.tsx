"use client"

import { useState, useTransition } from "react"
import {
    Plus,
    Trash2,
    Loader2,
    Tags,
    AlertCircle,
    CheckCircle2,
    Search
} from "lucide-react"
import { createCategory, deleteCategory } from "@/actions/admin-actions"

interface CategoryListProps {
    initialCategories: any[]
}

export function CategoryManager({ initialCategories }: CategoryListProps) {
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState(initialCategories)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    // Form state
    const [name, setName] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
    }

    const onCreate = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!name) return

        startTransition(async () => {
            const slug = generateSlug(name)
            const res = await createCategory({ name, slug })

            if (res.error) {
                setError(res.error)
            } else {
                setSuccess("Categoría creada con éxito")
                setCategories([res.data, ...categories])
                setName("")
            }
        })
    }

    const onDelete = (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta categoría?")) return

        setError("")
        setSuccess("")

        startTransition(async () => {
            const res = await deleteCategory(id)
            if (res.error) {
                setError(res.error)
            } else {
                setSuccess("Categoría eliminada")
                setCategories(categories.filter(c => c.id !== id))
            }
        })
    }

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <Plus className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold text-primary dark:text-white">Nueva Categoría</h2>
                    </div>

                    <form onSubmit={onCreate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Nombre</label>
                            <input
                                disabled={isPending}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Pinturas, Brochas..."
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-destructive/15 p-3 rounded-xl flex items-center gap-2 text-xs text-destructive font-medium border border-destructive/10">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/15 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-500 font-medium border border-emerald-500/10">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                <p>{success}</p>
                            </div>
                        )}

                        <button
                            disabled={isPending || !name}
                            type="submit"
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-accent dark:hover:text-primary transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Crear Categoría"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Lista */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <div key={category.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                                            <Tags className="h-6 w-6 text-zinc-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{category.name}</h4>
                                            <p className="text-xs text-zinc-500 font-mono tracking-tighter">slug: {category.slug}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDelete(category.id)}
                                        disabled={isPending}
                                        className="p-3 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                                    <Tags className="h-8 w-8 text-zinc-300" />
                                </div>
                                <p className="text-zinc-500 text-sm">No se encontraron categorías.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

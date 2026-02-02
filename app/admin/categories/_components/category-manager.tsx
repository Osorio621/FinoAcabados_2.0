"use client"

import { useState, useTransition } from "react"
import {
    Plus,
    Trash2,
    Loader2,
    Tags,
    AlertCircle,
    CheckCircle2,
    Search,
    ChevronDown,
    ChevronRight,
    FolderTree,
    Pencil,
    X as CloseIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createCategory, deleteCategory, updateCategory } from "@/actions/admin-actions"

interface CategoryListProps {
    initialCategories: any[]
    mainCategories: any[]
    subCategories: any[]
}

export function CategoryManager({ initialCategories, mainCategories: initialMainCategories, subCategories: initialSubCategories }: CategoryListProps) {
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState(initialCategories)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    // Form state
    const [name, setName] = useState("")
    const [parentId, setParentId] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
    const [editingCategory, setEditingCategory] = useState<any | null>(null)

    // Re-calculate main and sub categories when local categories change
    const mainCategories = categories.filter(c => !c.parentId)
    const subCategories = categories.filter(c => c.parentId)

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!name) return

        startTransition(async () => {
            const slug = generateSlug(name)

            if (editingCategory) {
                // UPDATE
                const res = await updateCategory(editingCategory.id, {
                    name,
                    slug,
                    parentId: parentId || null
                })

                if (res.error) {
                    setError(res.error)
                } else {
                    setSuccess("Categoría actualizada con éxito")
                    setCategories(categories.map(c => c.id === editingCategory.id ? res.data : c))
                    cancelEdit()
                }
            } else {
                // CREATE
                const res = await createCategory({
                    name,
                    slug,
                    parentId: parentId || null
                })

                if (res.error) {
                    setError(res.error)
                } else {
                    setSuccess(parentId ? "Subcategoría creada con éxito" : "Categoría creada con éxito")
                    setCategories([res.data, ...categories])
                    setName("")
                    setParentId("")
                }
            }
        })
    }

    const onEdit = (category: any) => {
        setEditingCategory(category)
        setName(category.name)
        setParentId(category.parentId || "")
        setError("")
        setSuccess("")
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
        setEditingCategory(null)
        setName("")
        setParentId("")
        setError("")
    }

    const onDelete = (id: string) => {
        const categoryToDelete = categories.find(c => c.id === id)
        const hasChildren = categories.some(c => c.parentId === id)

        if (hasChildren) {
            setError("No puedes eliminar una categoría que tiene subcategorías. Elimina primero las subcategorías.")
            return
        }

        if (!confirm(`¿Estás seguro de eliminar "${categoryToDelete?.name}"?`)) return

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

    const getSubcategoriesForCategory = (categoryId: string) => {
        return subCategories.filter(sc => sc.parentId === categoryId)
    }

    const toggleExpand = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
    }

    const filteredMainCategories = mainCategories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSubcategoriesForCategory(c.id).some(sc =>
            sc.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            editingCategory ? "bg-amber-500/10" : "bg-emerald-500/10"
                        )}>
                            {editingCategory ? (
                                <Pencil className="h-5 w-5 text-amber-500" />
                            ) : (
                                <Plus className="h-5 w-5 text-emerald-500" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-primary dark:text-white">
                            {editingCategory ? "Editar Categoría" : parentId ? "Nueva Subcategoría" : "Nueva Categoría"}
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">
                                Nombre {parentId && "de Subcategoría"}
                            </label>
                            <input
                                disabled={isPending}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={parentId ? "Ej: Acrílicas, Óleos..." : "Ej: Pinturas, Brochas..."}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">
                                Categoría Padre (opcional)
                            </label>
                            <select
                                disabled={isPending}
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                            >
                                <option value="">-- Seleccionar categoría principal --</option>
                                {mainCategories.filter(c => c.id !== editingCategory?.id).map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-zinc-500">
                                {editingCategory
                                    ? "Cambia el padre si deseas mover esta categoría"
                                    : "Déjalo vacío para crear una categoría principal"}
                            </p>
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

                        <div className="flex gap-2">
                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 py-3 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                disabled={isPending || !name}
                                type="submit"
                                className={cn(
                                    "flex-1 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50",
                                    editingCategory ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-zinc-800 dark:hover:bg-accent dark:hover:text-primary"
                                )}
                            >
                                {isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : editingCategory ? (
                                    "Guardar Cambios"
                                ) : parentId ? (
                                    "Crear Subcategoría"
                                ) : (
                                    "Crear Categoría"
                                )}
                            </button>
                        </div>

                        {!editingCategory && parentId && (
                            <button
                                type="button"
                                onClick={() => setParentId("")}
                                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 py-2 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-sm"
                            >
                                Crear como categoría principal
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Lista de Categorías */}
            <div className="lg:col-span-2 space-y-6">
                {/* Panel de Categorías Principales */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <FolderTree className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-primary dark:text-white">Categorías Principales</h3>
                                    <p className="text-sm text-zinc-500">
                                        {mainCategories.length} categoría(s) principal(es)
                                    </p>
                                </div>
                            </div>
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar categorías..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {filteredMainCategories.length > 0 ? (
                            filteredMainCategories.map((category) => {
                                const subCats = getSubcategoriesForCategory(category.id)
                                const isExpanded = expandedCategory === category.id

                                return (
                                    <div key={category.id}>
                                        <div className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => toggleExpand(category.id)}
                                                    className="text-zinc-400 hover:text-primary transition-colors"
                                                    disabled={subCats.length === 0}
                                                >
                                                    {subCats.length > 0 ? (
                                                        isExpanded ? (
                                                            <ChevronDown className="h-5 w-5" />
                                                        ) : (
                                                            <ChevronRight className="h-5 w-5" />
                                                        )
                                                    ) : (
                                                        <div className="w-5"></div>
                                                    )}
                                                </button>
                                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                                                    <Tags className="h-6 w-6 text-blue-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200">
                                                            {category.name}
                                                        </h4>
                                                        {subCats.length > 0 && (
                                                            <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                                                                {subCats.length} subcategoría(s)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-zinc-500 font-mono tracking-tighter mt-1">
                                                        slug: {category.slug}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onEdit(category)}
                                                    className="p-3 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(category.id)}
                                                    disabled={isPending || subCats.length > 0}
                                                    className="p-3 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={subCats.length > 0 ? "Elimina primero las subcategorías" : "Eliminar categoría"}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subcategorías (expandible) */}
                                        {isExpanded && subCats.length > 0 && (
                                            <div className="bg-zinc-50/50 dark:bg-zinc-800/10 border-t border-zinc-100 dark:border-zinc-800/50">
                                                {subCats.map((subCategory) => (
                                                    <div key={subCategory.id} className="pl-20 pr-6 py-4 flex items-center justify-between hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                                                                <Tags className="h-5 w-5 text-purple-500" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-medium text-zinc-700 dark:text-zinc-300">
                                                                        {subCategory.name}
                                                                    </h4>
                                                                    <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">
                                                                        Subcategoría
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-zinc-500 font-mono tracking-tighter mt-1">
                                                                    slug: {subCategory.slug}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => onEdit(subCategory)}
                                                                className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                                                                title="Editar"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => onDelete(subCategory.id)}
                                                                disabled={isPending}
                                                                className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="p-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                                    <FolderTree className="h-8 w-8 text-zinc-300" />
                                </div>
                                <p className="text-zinc-500 text-sm">
                                    {searchTerm ? "No se encontraron categorías con ese término." : "No hay categorías principales aún."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel de Todas las Subcategorías (si hay) */}
                {subCategories.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                    <Tags className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-primary dark:text-white">Todas las Subcategorías</h3>
                                    <p className="text-sm text-zinc-500">
                                        {subCategories.length} subcategoría(s) en total
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {subCategories.map((subCategory) => (
                                <div key={subCategory.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                                            <Tags className="h-6 w-6 text-purple-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">
                                                {subCategory.name}
                                            </h4>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-xs text-zinc-500 font-mono tracking-tighter">
                                                    slug: {subCategory.slug}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">
                                                        Subcategoría
                                                    </span>
                                                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">
                                                        Pertenece a: {subCategory.parent?.name || categories.find(c => c.id === subCategory.parentId)?.name || "Desconocido"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(subCategory)}
                                            className="p-3 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                                            title="Editar"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(subCategory.id)}
                                            disabled={isPending}
                                            className="p-3 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Package,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    Upload
} from "lucide-react"
import Link from "next/link"
import { productSchema } from "@/schemas"
import { createProduct, updateProduct } from "@/actions/admin-actions"

interface ProductFormProps {
    initialData?: any
    categories: any[]
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isUploading, setIsUploading] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })
            const data = await res.json()

            if (data.success) {
                form.setValue("imageUrl", data.url)
                setSuccess("Imagen subida correctamente")
            } else {
                setError(data.error || "Error al subir imagen")
            }
        } catch (error) {
            setError("Error de red al subir imagen")
        } finally {
            setIsUploading(false)
        }
    }

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: initialData.price.toString(),
            stock: initialData.stock.toString(),
            discountPrice: initialData.discountPrice?.toString() || "",
            imageUrl: initialData.imageUrl || ""
        } : {
            name: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "",
            imageUrl: "",
            isOffer: false,
            discountPrice: ""
        }
    })

    const onSubmit = (values: z.infer<typeof productSchema>) => {
        setError("")
        setSuccess("")

        startTransition(async () => {
            const res = initialData
                ? await updateProduct(initialData.id, values)
                : await createProduct(values)

            if (res.error) {
                setError(res.error)
            } else {
                setSuccess(initialData ? "Producto actualizado" : "Producto creado")
                router.push("/admin/products")
                router.refresh()
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group"
                >
                    <ArrowLeft className="h-5 w-5 text-zinc-500 group-hover:text-primary dark:group-hover:text-white" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
                        {initialData ? "Editar Producto" : "Nuevo Producto"}
                    </h1>
                    <p className="text-zinc-500">
                        {initialData ? "Actualiza los detalles del producto existente." : "Crea un nuevo artículo para tu catálogo."}
                    </p>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Detalles Principales */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Nombre del Producto</label>
                            <input
                                {...form.register("name")}
                                disabled={isPending}
                                placeholder="Pintura Latex Premium..."
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                            />
                            {form.formState.errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 pl-1">{form.formState.errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Descripción</label>
                            <textarea
                                {...form.register("description")}
                                disabled={isPending}
                                rows={4}
                                placeholder="Escribe las características y beneficios del producto..."
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 resize-none"
                            />
                            {form.formState.errors.description && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 pl-1">{form.formState.errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Precio Original</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                    <input
                                        {...form.register("price")}
                                        disabled={isPending}
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                    />
                                </div>
                                {form.formState.errors.price && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 pl-1">{form.formState.errors.price.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Stock Inicial</label>
                                <input
                                    {...form.register("stock")}
                                    disabled={isPending}
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                />
                                {form.formState.errors.stock && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 pl-1">{form.formState.errors.stock.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <BadgePercent className="h-5 w-5 text-accent" />
                            <h3 className="font-bold text-primary dark:text-white">Ofertas y Promociones</h3>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <input
                                type="checkbox"
                                id="isOffer"
                                {...form.register("isOffer")}
                                disabled={isPending}
                                className="w-5 h-5 rounded-md border-zinc-300 text-accent focus:ring-accent transition-all cursor-pointer"
                            />
                            <label htmlFor="isOffer" className="text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                                Activar precio de oferta
                            </label>
                        </div>

                        {form.watch("isOffer") && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Precio de Descuento</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                    <input
                                        {...form.register("discountPrice")}
                                        disabled={isPending}
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar del Formulario */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Categoría</label>
                            <select
                                {...form.register("categoryId")}
                                disabled={isPending}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {form.formState.errors.categoryId && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 pl-1">{form.formState.errors.categoryId.message}</p>}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Imagen del Producto</label>
                                <div className="mt-2">
                                    <div className="flex items-center gap-4">
                                        <label
                                            htmlFor="image-upload"
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-bold cursor-pointer transition-all ${isUploading
                                                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                                : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 hover:border-primary hover:text-primary"
                                                }`}
                                        >
                                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            {isUploading ? "Subiendo..." : "Subir Imagen"}
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={isUploading || isPending}
                                            />
                                        </label>
                                        <span className="text-xs text-zinc-400">o pega una URL abajo</span>
                                    </div>
                                </div>
                            </div>

                            <input
                                {...form.register("imageUrl")}
                                disabled={isPending}
                                type="url"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                            />
                            {form.watch("imageUrl") && (
                                <div className="mt-4 aspect-square bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden relative group">
                                    <img
                                        src={form.watch("imageUrl")}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "")}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        {error && (
                            <div className="bg-destructive/15 p-4 rounded-2xl flex items-center gap-3 text-xs text-destructive font-bold border border-destructive/10">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/15 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-500 font-bold border border-emerald-500/10">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                <p>{success}</p>
                            </div>
                        )}

                        <button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-accent dark:hover:text-primary transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    <CheckCircle2 className="h-5 w-5" />
                                    {initialData ? "Guardar Cambios" : "Publicar Producto"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

function BadgePercent(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="8" r="3" />
            <path d="m19 5-9 9" />
            <path d="M14 14a3 3 0 1 0 3 3" />
            <rect width="18" height="18" x="3" y="3" rx="2" />
        </svg>
    )
}

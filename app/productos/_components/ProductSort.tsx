"use client"

import { SortOption } from "@/lib/product-utils"
import { ArrowUpDown } from "lucide-react"

interface ProductSortProps {
    value: SortOption
    onChange: (value: SortOption) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Más recientes" },
    { value: "price-asc", label: "Precio: Menor a Mayor" },
    { value: "price-desc", label: "Precio: Mayor a Menor" },
    { value: "name-asc", label: "Nombre: A-Z" },
    { value: "name-desc", label: "Nombre: Z-A" },
]

export const ProductSort = ({ value, onChange }: ProductSortProps) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Ordenar por:</span>
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-primary dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent cursor-pointer transition-all"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

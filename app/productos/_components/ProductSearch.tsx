"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface ProductSearchProps {
    value: string
    onChange: (value: string) => void
    resultCount: number
}

export const ProductSearch = ({ value, onChange, resultCount }: ProductSearchProps) => {
    const [localValue, setLocalValue] = useState(value)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue)
        }, 300)

        return () => clearTimeout(timer)
    }, [localValue, onChange])

    const handleClear = () => {
        setLocalValue("")
        onChange("")
    }

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-primary dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
                {localValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-zinc-400" />
                    </button>
                )}
            </div>
            {localValue && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {resultCount} {resultCount === 1 ? "resultado" : "resultados"} para "{localValue}"
                </p>
            )}
        </div>
    )
}

"use client"

import { motion } from "framer-motion"
import { PaintBucket, Drill, Layers, ArrowRight } from "lucide-react"
import Link from "next/link"

const businessAreas = [
    {
        title: "Pinturas Premium",
        description: "Acabados de lujo con tecnología de vanguardia para interiores y exteriores.",
        icon: PaintBucket,
        href: "/productos?categoria=pinturas",
        color: "bg-blue-500/10",
        iconColor: "text-blue-500",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Herramientas Pro",
        description: "Equipamiento de alta precisión para resultados impecables en cada proyecto.",
        icon: Drill,
        href: "/productos?categoria=herramientas",
        color: "bg-amber-500/10",
        iconColor: "text-amber-500",
        image: "https://images.unsplash.com/photo-1530124560676-4fbc91bad174?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Complementos",
        description: "Todo el soporte técnico y accesorios necesarios para un trabajo completo.",
        icon: Layers,
        href: "/productos?categoria=complementos",
        color: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
    }
]

export const CategoryHighlights = () => {
    return (
        <section className="py-24 px-6 bg-white dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em]">Nuestras Soluciones</h2>
                    <p className="text-4xl md:text-5xl font-bold text-primary dark:text-white tracking-tight">
                        Todo para tu Obra en un solo Lugar
                    </p>
                    <p className="text-zinc-500 max-w-2xl mx-auto">
                        Explora nuestra selección curada de productos técnicos y estéticos diseñados para elevar el estándar de tus construcciones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {businessAreas.map((area, index) => (
                        <motion.div
                            key={area.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="p-8 space-y-6 relative z-10">
                                <div className={`h-16 w-16 ${area.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <area.icon className={`h-8 w-8 ${area.iconColor}`} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-primary dark:text-white group-hover:text-accent transition-colors">{area.title}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">
                                        {area.description}
                                    </p>
                                </div>

                                <Link
                                    href={area.href}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-white group/btn"
                                >
                                    Ver Catálogo
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2 text-accent" />
                                </Link>
                            </div>

                            {/* Decorative Circle */}
                            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${area.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

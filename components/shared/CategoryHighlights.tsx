"use client"

import { motion } from "framer-motion"
import { PaintBucket, Drill, Layers, ArrowRight, Sparkles, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const businessAreas = [
    {
        title: "Pinturas Premium",
        description: "Acabados de lujo con tecnología de vanguardia para interiores y exteriores.",
        icon: PaintBucket,
        href: "/productos?categoria=pinturas",
        color: "bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-cyan-500/20",
        iconColor: "text-blue-500",
        accentColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
        stats: "50+ productos",
        features: ["Alta durabilidad", "Secado rápido", "Colores vibrantes", "Resistente a humedad"],
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Herramientas Pro",
        description: "Equipamiento de alta precisión para resultados impecables en cada proyecto.",
        icon: Drill,
        href: "/productos?categoria=herramientas",
        color: "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-orange-500/20",
        iconColor: "text-amber-500",
        accentColor: "bg-gradient-to-r from-amber-500 to-orange-500",
        stats: "30+ herramientas",
        features: ["Alta precisión", "Ergonómicas", "Garantía extendida", "Materiales premium"],
        image: "https://images.unsplash.com/photo-1530124560676-4fbc91bad174?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Complementos",
        description: "Todo el soporte técnico y accesorios necesarios para un trabajo completo.",
        icon: Layers,
        href: "/productos?categoria=complementos",
        color: "bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-teal-500/20",
        iconColor: "text-emerald-500",
        accentColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
        stats: "80+ accesorios",
        features: ["Alta calidad", "Compatibilidad total", "Fácil instalación", "Soporte técnico"],
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
    }
]

export const CategoryHighlights = () => {
    return (
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />

            <div className="relative mx-auto max-w-7xl space-y-20 z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                        <span className="text-sm font-bold text-accent uppercase tracking-widest">
                            Soluciones Integrales
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent italic">
                            Todo para tu Proyecto
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                        Descubre nuestra selección premium de productos diseñados para transformar cualquier espacio con calidad profesional y diseño excepcional.
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
                    {businessAreas.map((area, index) => (
                        <motion.div
                            key={area.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            {/* Main Card */}
                            <div className="relative h-full rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 ${area.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Header Section */}
                                <div className="relative p-8 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${area.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <area.icon className={`h-8 w-8 ${area.iconColor}`} />
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <Zap className="h-3 w-3 text-accent" />
                                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                {area.stats}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-primary dark:text-white group-hover:text-accent transition-colors">
                                            {area.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                                            {area.description}
                                        </p>
                                    </div>

                                    {/* Features List */}
                                    <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                                        <ul className="space-y-3">
                                            {area.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                                                        <CheckCircle className="h-3 w-3 text-accent" />
                                                    </div>
                                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="relative px-8 pb-8">
                                    <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
                                        <Link
                                            href={area.href}
                                            className="group/btn inline-flex items-center justify-between w-full px-6 py-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${area.color}`}>
                                                    <area.icon className={`h-5 w-5 ${area.iconColor}`} />
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                                        Explorar Productos
                                                    </span>
                                                    <span className="text-xs text-zinc-500 block">
                                                        Descubre nuestra colección
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-accent">
                                                    Ver más
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover/btn:translate-x-2" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className={`absolute -top-20 -right-20 w-40 h-40 ${area.color} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700`} />
                                <div className={`absolute -bottom-10 -left-10 w-24 h-24 ${area.color} rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 + 0.3 }}
                                className={`absolute -top-3 right-6 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${area.accentColor}`}
                            >
                                Popular
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center pt-12"
                >
                </motion.div>
            </div>
        </section>
    )
}
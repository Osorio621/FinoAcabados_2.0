"use client"

import { motion } from "framer-motion"
import { Factory, PaintBucket, ShieldCheck, TrendingUp } from "lucide-react"

export default function NosotrosPage() {
    return (
        <section className="py-24 px-6 bg-white dark:bg-zinc-950 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent/10 rounded-full blur-[120px] -translate-y-1/2" />

            <div className="mx-auto max-w-6xl relative z-10 space-y-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-6"
                >
                    <h2 className="text-sm font-bold text-accent uppercase tracking-[0.3em]">
                        Sobre Nosotros
                    </h2>
                    <p className="text-4xl md:text-5xl font-bold tracking-tight text-primary dark:text-white">
                        Pasión por los acabados, compromiso con la calidad
                    </p>
                    <p className="max-w-3xl mx-auto text-zinc-500 text-lg leading-relaxed">
                        En <span className="font-semibold text-primary dark:text-white">Fino Acabados</span> somos un
                        local especializado en pinturas, herramientas y complementos para todo tipo de proyectos.
                        Fabricamos nuestras propias pinturas profesionales, pensadas para ofrecer durabilidad,
                        excelente acabado y confianza real.
                    </p>
                </motion.div>

                {/* Values / Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[
                        {
                            icon: Factory,
                            title: "Fabricación Propia",
                            text: "Desarrollamos nuestras pinturas con procesos controlados, garantizando calidad constante en cada lote.",
                        },
                        {
                            icon: PaintBucket,
                            title: "Soluciones Profesionales",
                            text: "Productos pensados para obras, remodelaciones y trabajos exigentes, tanto para expertos como para el hogar.",
                        },
                        {
                            icon: ShieldCheck,
                            title: "Garantía de 3 Años",
                            text: "Respaldamos nuestras pinturas con una garantía real que refleja la confianza en nuestro producto.",
                        },
                        {
                            icon: TrendingUp,
                            title: "Visión de Futuro",
                            text: "Nacimos con la meta clara de crecer y posicionarnos como referentes en la industria de acabados.",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-4 text-center group"
                        >
                            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                                <item.icon className="h-7 w-7 text-accent group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-primary dark:text-white">
                                {item.title}
                            </h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Vision */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <p className="text-2xl font-bold tracking-tight text-primary dark:text-white">
                        Nuestra visión
                    </p>
                    <p className="text-zinc-500 text-lg leading-relaxed">
                        Queremos ser reconocidos como una marca líder en pinturas y soluciones para acabados,
                        destacándonos por la calidad de nuestros productos, la atención cercana y el respaldo
                        que brindamos a cada cliente. Crecemos junto a quienes confían en nosotros para transformar
                        sus espacios.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

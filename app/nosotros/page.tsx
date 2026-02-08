"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Factory, PaintBucket, ShieldCheck, TrendingUp, Sparkles, Target, Users, Award } from "lucide-react"
import { useRef } from "react"

export default function NosotrosPage() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-white via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" ref={containerRef}>
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
            </div>

            {/* Parallax Hero */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-[100px]" />
            </motion.div>

            <section className="relative z-10 py-32 px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Hero Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold text-accent uppercase tracking-widest">
                                Desde 2018
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                Fino Acabados
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                            Transformamos espacios con{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 font-bold text-primary dark:text-white">calidad premium</span>
                                <motion.span
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="absolute bottom-0 left-0 h-2 bg-accent/30 -rotate-1"
                                />
                            </span>{" "}
                            y{" "}
                            <span className="font-bold text-accent">pasión por los detalles</span>
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
                    >
                        {[
                            { value: "100%", label: "Satisfacción", icon: Award },
                            { value: "3+", label: "Años Garantía", icon: ShieldCheck },
                            { value: "500+", label: "Clientes", icon: Users },
                            { value: "50+", label: "Productos", icon: Target },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className="group relative p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 hover:border-accent/30 transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <stat.icon className="h-10 w-10 text-accent mb-4" />
                                <div className="text-3xl font-bold text-primary dark:text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-zinc-500">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Mission & Vision */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-lg"
                        >
                            <div className="absolute -top-4 left-8 px-4 py-2 bg-primary text-white text-sm font-bold rounded-full">
                                Nuestra Misión
                            </div>
                            <h3 className="text-2xl font-bold text-primary dark:text-white mb-6">
                                Fabricamos excelencia en cada gota
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                                En <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent italic">Fino Acabados</span> desarrollamos nuestras propias pinturas con procesos controlados que garantizan calidad constante. Cada producto está pensado para ofrecer durabilidad, excelente acabado y confianza real en cada proyecto.
                            </p>
                            <ul className="space-y-3">
                                {["Procesos de fabricación controlados", "Materias primas de primera calidad", "Pruebas de durabilidad exhaustivas", "Innovación constante en fórmulas"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="h-2 w-2 bg-accent rounded-full" />
                                        <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 dark:border-accent/30 shadow-lg"
                        >
                            <div className="absolute -top-4 left-8 px-4 py-2 bg-accent text-white text-sm font-bold rounded-full">
                                Nuestra Visión
                            </div>
                            <h3 className="text-2xl font-bold text-primary dark:text-white mb-6">
                                Líderes en transformación de espacios
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                                Aspiramos a ser la marca preferida en pinturas y soluciones para acabados, reconocida por nuestra calidad excepcional, atención personalizada y el respaldo real que ofrecemos a cada cliente.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Innovación", value: 95 },
                                    { label: "Calidad", value: 98 },
                                    { label: "Servicio", value: 92 },
                                    { label: "Confianza", value: 96 },
                                ].map((item) => (
                                    <div key={item.label} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                                            <span className="font-bold text-accent">{item.value}%</span>
                                        </div>
                                        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${item.value}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full bg-gradient-to-r from-primary to-accent"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Values */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
                            Lo que nos hace diferentes
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
                            Cuatro pilares fundamentales que definen nuestra esencia y compromiso
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Factory,
                                title: "Fabricación Propia",
                                description: "Control total del proceso para garantizar calidad en cada lote.",
                                features: ["Procesos controlados", "Calidad constante", "Innovación propia"]
                            },
                            {
                                icon: PaintBucket,
                                title: "Soluciones Profesionales",
                                description: "Productos diseñados para obras exigentes y proyectos domésticos.",
                                features: ["Para expertos y hogar", "Alto rendimiento", "Aplicación sencilla"]
                            },
                            {
                                icon: ShieldCheck,
                                title: "Garantía Real",
                                description: "3 años de respaldo que demuestran nuestra confianza en el producto.",
                                features: ["Garantía extendida", "Soporte técnico", "Reemplazo garantizado"]
                            },
                            {
                                icon: TrendingUp,
                                title: "Visión de Futuro",
                                description: "Crecimiento constante para ser referentes en la industria.",
                                features: ["Expansión continua", "Nuevos productos", "Mercados emergentes"]
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group relative p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-accent transition-all duration-300 hover:shadow-2xl"
                            >
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 text-accent" />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                                        <item.icon className="h-7 w-7 text-accent group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-primary dark:text-white mb-3">
                                    {item.title}
                                </h3>

                                <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-6">
                                    {item.description}
                                </p>

                                <ul className="space-y-2">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <div className="h-1.5 w-1.5 bg-accent rounded-full" />
                                            <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-24 text-center"
                    >
                        <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
                            <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                                ¿Listo para transformar tu próximo proyecto?
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-300 mb-8">
                                Descubre la diferencia de trabajar con productos fabricados con pasión y compromiso.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl">
                                    Ver Catálogo
                                </button>
                                <button className="px-8 py-3 border-2 border-primary text-primary dark:text-white font-semibold rounded-full hover:bg-primary hover:text-white transition-all">
                                    Contactar Asesor
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
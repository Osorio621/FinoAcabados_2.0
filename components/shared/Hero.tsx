"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, Drill, PaintBucket, MapPin, ShieldCheck, Truck, Zap, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"

export const Hero = () => {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent/30 dark:from-primary/90 dark:via-primary/80 dark:to-accent/40"
        >
            {/* Animated Background Elements */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-r from-accent/30 via-primary/20 to-transparent rounded-full blur-[120px]" />
                <div className="absolute bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-l from-accent/20 via-white/10 to-transparent rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-white/5 to-transparent rounded-full blur-[80px]" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </motion.div>

            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-3 rounded-full group"
                        >
                            <div className="relative">
                                <Sparkles className="h-5 w-5 text-accent" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-accent/20 rounded-full blur-sm"
                                />
                            </div>
                            <span className="text-sm font-bold text-white tracking-widest uppercase">
                                Líderes en Calidad desde 2023
                            </span>
                            <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
                        </motion.div>

                        {/* Headline */}
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9]">
                                <span className="block text-white">Transforma</span>
                                <span className="block bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
                                    Tus Espacios
                                </span>
                                <span className="block text-white">Con Excelencia</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-xl">
                                En <strong className="text-white">Fino Acabados</strong> proveemos
                                <span className="text-accent font-bold"> pinturas premium</span>,
                                <span className="text-accent font-bold"> herramientas profesionales</span> y
                                <span className="text-accent font-bold"> complementos de alta gama</span>
                                para resultados impecables en cada proyecto.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link
                                href="/productos"
                                className="group relative px-8 py-4 bg-accent text-primary rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-accent/30"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <span>Explorar Productos Premium</span>
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                                </div>
                                <motion.div
                                    className="absolute inset-0 rounded-xl border-2 border-accent"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </Link>

                            <Link
                                href="/contacto"
                                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <MapPin className="h-5 w-5" />
                                <span>Visítanos</span>
                                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10"
                        >

                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex flex-wrap items-center gap-6 pt-6"
                        >
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                ))}
                                <span className="text-sm text-white/70">4.9/5 (248 reseñas)</span>
                            </div>
                            <div className="h-4 w-px bg-white/20" />
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm text-white/70">Envío garantizado</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 40 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        {/* Main Image Container */}
                        <div className="relative">
                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-6 -left-6 z-20"
                            >
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-2xl w-40">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                            <PaintBucket className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/60">Desde</div>
                                            <div className="text-lg font-bold text-white">$45.990</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-white font-medium">Pinturas Premium</div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                className="absolute -bottom-6 -right-6 z-20"
                            >
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-2xl w-40">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                            <Drill className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/60">Desde</div>
                                            <div className="text-lg font-bold text-white">$89.990</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-white font-medium">Herramientas Pro</div>
                                </div>
                            </motion.div>

                            {/* Main Image */}
                            <div className="relative rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl">
                                <Image
                                    src="/local.jpg"
                                    alt="Fino Acabados - Tienda Premium"
                                    width={600}
                                    height={800}
                                    className="w-full h-[500px] object-cover"
                                    priority
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

                                {/* Store Info Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Fino Acabados</h3>
                                            <p className="text-white/80">Tienda Premium</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-white/60">Horario</div>
                                            <div className="text-sm font-bold text-white">8:00 - 18:00</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <MapPin className="h-4 w-4 text-accent" />
                                        <span className="text-sm text-white/80">Visítanos para asesoría personal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -z-10 -inset-8 bg-gradient-to-br from-white/10 to-accent/10 rounded-[2.5rem] blur-xl" />
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 -right-10 w-40 h-40 border border-white/10 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-10 -left-10 w-32 h-32 border border-accent/20 rounded-full"
                        />
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="h-8 w-px bg-gradient-to-b from-accent via-white/50 to-transparent" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
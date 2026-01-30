"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Drill, PaintBucket, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center bg-primary px-6 pt-28 overflow-hidden">
            {/* Fondo suave */}
            <div className="absolute inset-0">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* TEXTO */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full backdrop-blur">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold text-white tracking-widest uppercase">
                            Todo para pintar y construir
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                        Pinturas y herramientas{" "}
                        <span className="text-accent">
                            para trabajos bien hechos
                        </span>
                    </h1>

                    <p className="text-lg text-zinc-300 max-w-xl">
                        En <strong>Fino Acabados</strong> encuentras pinturas, herramientas y
                        complementos de calidad para profesionales y hogares.
                        Te asesoramos para que tu proyecto quede perfecto.
                    </p>

                    {/* BOTONES */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/categoria/pinturas"
                            className="group inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-accent/30"
                        >
                            Ver productos
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/contacto"
                            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                        >
                            <MapPin className="h-5 w-5" />
                            Visítanos
                        </Link>
                    </div>

                    {/* BENEFICIOS */}
                    <div className="flex gap-10 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <PaintBucket className="h-6 w-6 text-accent" />
                            <div>
                                <p className="text-xs text-zinc-400 uppercase font-bold">
                                    Pinturas
                                </p>
                                <p className="text-sm text-white">
                                    Amplia gama y colores
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Drill className="h-6 w-6 text-accent" />
                            <div>
                                <p className="text-xs text-zinc-400 uppercase font-bold">
                                    Herramientas
                                </p>
                                <p className="text-sm text-white">
                                    Calidad profesional
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* FOTO DEL LOCAL */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <Image
                            src="/local.jpg"
                            alt="Fino Acabados - Local"
                            width={600}
                            height={600}
                            className="object-cover"
                            priority
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h3 className="text-2xl font-bold">
                                Fino Acabados
                            </h3>
                            <p className="text-sm text-zinc-200">
                                Visítanos y recibe asesoría personalizada
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

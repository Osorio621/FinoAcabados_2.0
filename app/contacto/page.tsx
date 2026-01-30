"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Clock, Mail, Send, MessageCircle } from "lucide-react"
import { STORE_LOCATION } from "@/lib/location";


export default function ContactoPage() {

    // Componente de línea separadora elegante
    const Separator = () => (
        <div className="flex justify-center items-center my-20">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
        </div>
    )

    return (
        <section className="relative py-24 px-6 bg-white dark:bg-zinc-950 transition-colors duration-300">
            <div className="mx-auto max-w-6xl">

                {/* --- SECCIÓN 1: HERO --- */}
                {/* Esta sección introduce el propósito de la página con un título fuerte y una descripción clara. */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 mb-12"
                >
                    <span className="text-accent font-semibold tracking-widest uppercase text-xs">Atención Personalizada</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        Hablemos de tu <span className="text-primary italic">próximo proyecto</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        En **Fino Acabados** estamos listos para asesorarte con soluciones profesionales.
                        Ya sea una renovación pequeña o un gran proyecto, estamos aquí para ayudarte.
                    </p>
                </motion.div>

                <Separator />

                {/* --- SECCIÓN 2: UBICACIÓN Y VISITA --- */}
                {/* Aquí mostramos dónde estamos ubicados y cómo pueden visitarnos físicamente. */}
                <section className="space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Nuestra Tienda Física</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">Ven y conoce la calidad de nuestros materiales de cerca.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        {/* Tarjeta de Información */}
                        <div className="space-y-8">
                            <div className="grid gap-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-accent mt-1" />
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Dirección</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">Carrera 22 #22 - 04, Tuluá Colombia</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-accent mt-1" />
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Horario de Atención</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">Lunes a Sábado: 8:00 AM – 6:00 PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-accent mt-1" />
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Teléfono</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">+57 316 802 8475</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://wa.me/573168028475"
                                target="_blank"
                                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
                            >
                                <MessageCircle className="h-5 w-5 fill-current" />
                                Escríbenos por WhatsApp
                            </a>
                        </div>

                        {/* MAPA*/}
                        <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl h-[400px]">
                            <iframe
                                src={`https://www.google.com/maps?q=${STORE_LOCATION.lat},${STORE_LOCATION.lng}&z=${STORE_LOCATION.zoom}&output=embed`}
                                className="w-full h-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </motion.div>
                </section>

                <Separator />

                {/* --- SECCIÓN 3: FORMULARIO DE CONTACTO --- */}
                {/* Formulario optimizado para que el usuario pueda enviar consultas rápidas por correo. */}
                <section className="max-w-3xl mx-auto space-y-10">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Envíanos un correo</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">¿Tienes dudas técnicas? Nuestro equipo te responderá en breve.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-zinc-50 dark:bg-zinc-900/50 p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Nombre</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Mensaje</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-4 focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
                                    placeholder="¿Cómo podemos asesorarte?"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-md active:scale-[0.98]"
                            >
                                Enviar mensaje
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </motion.div>
                </section>

            </div>
        </section>
    )
}
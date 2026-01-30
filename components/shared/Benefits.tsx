"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react"

const benefits = [
    {
        title: "Productos de Confianza",
        description: "Trabajamos con marcas reconocidas y materiales durables para que tus acabados queden bien desde la primera.",
        icon: ShieldCheck,
    },
    {
        title: "Entrega Ágil",
        description: "Despachos rápidos y organizados para que tu obra o proyecto no se retrase.",
        icon: Truck,
    },
    {
        title: "Asesoría Personalizada",
        description: "Te ayudamos a elegir la pintura, herramienta o complemento ideal según tu necesidad.",
        icon: Headphones,
    },
    {
        title: "Respaldo Garantizado",
        description: "Nuestros productos cuentan con garantía y soporte directo para tu tranquilidad.",
        icon: Award,
    }
]

export const Benefits = () => {
    return (
        <section className="py-24 px-6 bg-primary text-white overflow-hidden relative">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />

            <div className="mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-4 group"
                        >
                            <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors duration-500">
                                <benefit.icon className="h-6 w-6 text-accent group-hover:text-primary transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold">{benefit.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

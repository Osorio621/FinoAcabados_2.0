"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Truck, Headphones, Award, Package, Clock, MapPin, BadgePercent, Zap, Sparkles, Gift } from "lucide-react"

const benefits = [
    {
        title: "Envío Gratis",
        description: "Entregas sin costo en compras mayores a $50,000 en toda la ciudad capital.",
        icon: Truck,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
        stat: "+500 envíos/mes",
        tag: "Destacado"
    },
    {
        title: "Garantía Extendida",
        description: "3 años de respaldo en todas nuestras pinturas premium y herramientas profesionales.",
        icon: ShieldCheck,
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
        stat: "100% protegido",
        tag: "Seguro"
    },
    {
        title: "Calidad Certificada",
        description: "Productos con certificación internacional y estándares de calidad premium.",
        icon: Award,
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-500/10",
        iconColor: "text-amber-500",
        stat: "ISO 9001",
        tag: "Premium"
    },
    {
        title: "Entrega Express",
        description: "Despacho en 2-4 horas para pedidos urgentes dentro del área metropolitana.",
        icon: Zap,
        color: "from-red-500 to-rose-500",
        bgColor: "bg-red-500/10",
        iconColor: "text-red-500",
        stat: "2-4 horas",
        tag: "Express"
    },
    {
        title: "Programación Flexible",
        description: "Elige la fecha y hora de entrega que mejor se adapte a tu agenda.",
        icon: Clock,
        color: "from-sky-500 to-blue-500",
        bgColor: "bg-sky-500/10",
        iconColor: "text-sky-500",
        stat: "24/7 disponible",
        tag: "Flexible"
    },
]

const shippingInfo = [
    {
        title: "Envío Estándar",
        price: "Gratis",
        time: "3-5 días",
        condition: "Compras mayores a $50,000",
        icon: Truck,
        color: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
        title: "Envío Express",
        price: "$9,990",
        time: "24-48 horas",
        condition: "Área metropolitana",
        icon: Zap,
        color: "bg-red-100 dark:bg-red-900/20"
    },
    {
        title: "Entrega Premium",
        price: "Gratis",
        time: "Mismo día",
        condition: "Compras mayores a $150,000",
        icon: Gift,
        color: "bg-emerald-100 dark:bg-emerald-900/20"
    }
]

export const Benefits = () => {
    return (
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/20 dark:from-primary/90 dark:via-primary/80 dark:to-accent/30" />

            {/* Animated Background Elements */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-1/4 left-10 w-96 h-96 bg-white/5 rounded-full blur-[100px]"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px]"
            />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />

            <div className="relative mx-auto max-w-7xl z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
                        <span className="text-sm font-bold text-white uppercase tracking-widest">
                            Beneficios Exclusivos
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-accent to-white">
                            Más que productos,
                        </span>
                        <br />
                        <span className="text-white">una experiencia premium</span>
                    </h2>

                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        En Fino Acabados no solo vendemos materiales, ofrecemos soluciones completas con beneficios diseñados para tu tranquilidad y éxito.
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative"
                        >
                            {/* Tag */}
                            <div className="absolute -top-3 left-4 z-20">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${benefit.color} shadow-lg`}>
                                    {benefit.tag}
                                </div>
                            </div>

                            {/* Card */}
                            <div className="h-full relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-500">
                                {/* Icon Container */}
                                <div className={`h-14 w-14 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <benefit.icon className={`h-7 w-7 ${benefit.iconColor}`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                    {benefit.description}
                                </p>

                                {/* Stat Badge */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-accent to-white animate-pulse" />
                                        <span className="text-xs font-bold text-white">
                                            {benefit.stat}
                                        </span>
                                    </div>
                                    <BadgePercent className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Hover Effects */}
                                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-r ${benefit.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Shipping Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Opciones de Envío y Entrega
                            </h3>
                            <p className="text-white/70 max-w-2xl mx-auto">
                                Elige la opción que mejor se adapte a tus necesidades y disfruta de nuestros beneficios de entrega.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {shippingInfo.map((option, index) => (
                                <motion.div
                                    key={option.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className={`relative rounded-2xl p-6 border border-white/10 ${option.color} backdrop-blur-sm hover:scale-105 transition-all duration-300`}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <option.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-white">{option.price}</div>
                                            <div className="text-sm text-white/70">{option.time}</div>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-white mb-2">
                                        {option.title}
                                    </h4>
                                    <p className="text-white/70 text-sm">
                                        {option.condition}
                                    </p>

                                    {option.price === "Gratis" && (
                                        <div className="absolute -top-3 right-4">
                                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-xs font-bold text-white shadow-lg">
                                                Recomendado
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-10 pt-8 border-t border-white/10 text-center"
                        >
                            <div className="inline-flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-accent" />
                                    <span>Envío seguro y protegido</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-accent" />
                                    <span>Seguimiento en tiempo real</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-accent" />
                                    <span>Garantía de satisfacción</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Headphones className="h-4 w-4 text-accent" />
                                    <span>Soporte durante la entrega</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                </motion.div>
            </div>
        </section>
    )
}
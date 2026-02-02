"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { useSidebar } from "@/lib/context/sidebar-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export const Footer = () => {
    const { isSidebarOpen } = useSidebar()
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/auth/admin")

    return (
        <footer className={cn(
            "bg-primary text-white pt-16 pb-8 px-6 transition-all duration-300",
            isAdmin && (isSidebarOpen ? "md:pl-72" : "md:pl-20")
        )}>
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-accent flex items-center justify-center rounded-lg">
                            <span className="text-primary text-lg font-bold italic">FA</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight uppercase">Fino Acabados</span>
                    </Link>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Especialistas en acabados de alta gama, herramientas profesionales y complementos para la construcción y remodelación.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                        <Facebook className="h-5 w-5 text-zinc-400 hover:text-accent cursor-pointer transition-colors" />
                        <Instagram className="h-5 w-5 text-zinc-400 hover:text-accent cursor-pointer transition-colors" />
                        <Twitter className="h-5 w-5 text-zinc-400 hover:text-accent cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-accent">Categorías</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Pinturas Interiores</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Herramientas Eléctricas</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Revestimientos</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Complementos de Obra</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-accent">Soporte</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Políticas de Envío</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Garantías</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
                    </ul>
                </div>

                {/* Contact info */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-accent">Contacto</h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                        <li className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-accent shrink-0" />
                            <span>CRA. 22 #22 - 04, Tuluá Colombia</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-accent shrink-0" />
                            <span>+57 316 802 8475</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-accent shrink-0" />
                            <span>ventas@finoacabados.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mx-auto max-w-7xl border-t border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                <p>© 2026 Fino Acabados. Todos los derechos reservados.</p>
                <div className="flex gap-6">
                    <Link href="#">Privacidad</Link>
                    <Link href="#">Términos de Servicio</Link>
                </div>
            </div>
        </footer>
    )
}

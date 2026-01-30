"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Lock, Mail, User, ArrowRight, Github, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { register } from "@/actions/register"

export default function RegisterPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        startTransition(() => {
            register(formData).then((data) => {
                setError(data?.error)
                setSuccess(data?.success)

                if (data?.success) {
                    setFormData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: ""
                    })
                }
            })
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
            >
                <div className="p-8 md:p-12 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Crea tu Cuenta</h2>
                        <p className="text-zinc-500 text-sm">Únete a Fino Acabados y accede a beneficios exclusivos.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Nombre Completo</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    disabled={isPending}
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Juan Pérez"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Correo Electrónico</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    disabled={isPending}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="tu@correo.com"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    disabled={isPending}
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-accent transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Confirmar Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                <input
                                    disabled={isPending}
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-accent transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-destructive/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-destructive">
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-emerald-500">
                                <p>{success}</p>
                            </div>
                        )}

                        <button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-accent dark:hover:text-primary transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Registrarse
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-500">
                        ¿Ya tienes cuenta? <Link href="/auth/login" className="font-bold text-accent hover:underline">Inicia Sesión</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

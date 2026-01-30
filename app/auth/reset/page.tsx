"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowRight, Loader2, ChevronLeft, ShieldCheck, KeyRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { reset } from "@/actions/reset"

export default function ResetPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [step, setStep] = useState<1 | 2>(1)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")

    const onSendEmail = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        startTransition(() => {
            reset({ email }).then((data) => {
                if (data?.error) {
                    setError(data.error)
                } else {
                    setSuccess("Código enviado a tu correo")
                    setStep(2)
                }
            })
        })
    }

    const onVerifyCode = (e: React.FormEvent) => {
        e.preventDefault()
        if (code.length !== 6) {
            setError("El código debe tener 6 dígitos")
            return
        }
        // Redirect to new-password with the code as token
        router.push(`/auth/new-password?token=${code}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
            >
                <div className="p-8 md:p-12 space-y-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <Link
                                        href="/auth/login"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-primary transition-colors group"
                                    >
                                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                        Volver al login
                                    </Link>
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Recuperar Contraseña</h2>
                                        <p className="text-zinc-500 text-sm">Ingresa tu correo para recibir un código de recuperación.</p>
                                    </div>
                                </div>

                                <form onSubmit={onSendEmail} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">Correo Electrónico</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                            <input
                                                disabled={isPending}
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="tu@correo.com"
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-destructive/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-destructive font-medium">
                                            <p>{error}</p>
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
                                                Enviar Código
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-primary transition-colors group"
                                    >
                                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                        Cambiar correo
                                    </button>
                                    <div className="text-center space-y-2">
                                        <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                                            <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Verifica tu correo</h2>
                                        <p className="text-zinc-500 text-sm">Hemos enviado un código de 6 dígitos a <span className="font-bold text-zinc-800 dark:text-zinc-200">{email}</span></p>
                                    </div>
                                </div>

                                <form onSubmit={onVerifyCode} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1 text-center block">Código de seguridad</label>
                                        <div className="relative group">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={code}
                                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                                placeholder="123456"
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-4 pl-10 pr-4 text-2xl text-center font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-destructive/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-destructive font-medium">
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="bg-emerald-500/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-emerald-500 font-medium">
                                            <p>{success}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-accent dark:hover:text-primary transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
                                    >
                                        Continuar
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>

                                    <p className="text-center text-xs text-zinc-400">
                                        ¿No recibiste el código?{" "}
                                        <button
                                            type="button"
                                            onClick={onSendEmail}
                                            disabled={isPending}
                                            className="text-accent font-bold hover:underline disabled:opacity-50"
                                        >
                                            Reenviar
                                        </button>
                                    </p>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

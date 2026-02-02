"use client"

import { useState, useTransition } from "react"
import { User, Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import { updateProfile } from "@/actions/profile-actions"

interface ProfileFormProps {
    user: {
        name?: string | null
        email?: string | null
        role?: string
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState(user.name || "")
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isEditing, setIsEditing] = useState(false)

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        startTransition(async () => {
            const res = await updateProfile({ name })
            if (res.error) {
                setError(res.error)
            } else {
                setSuccess(res.success)
                setIsEditing(false)
            }
        })
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                        <User className="h-6 w-6 text-primary dark:text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-primary dark:text-white">Perfil de Administrador</h2>
                        <p className="text-sm text-zinc-500">Información de tu cuenta actual</p>
                    </div>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-bold text-primary dark:text-white hover:underline"
                    >
                        Editar
                    </button>
                )}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Nombre</p>
                    {isEditing ? (
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isPending}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                    ) : (
                        <p className="text-primary dark:text-white font-medium">{name || "Sin Nombre"}</p>
                    )}
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 opacity-70">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Email (No editable)</p>
                    <p className="text-primary dark:text-white font-medium">{user.email}</p>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 opacity-70">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Rol</p>
                    <p className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded w-fit text-sm">
                        {user.role}
                    </p>
                </div>

                {error && (
                    <div className="bg-destructive/15 p-3 rounded-xl flex items-center gap-2 text-xs text-destructive font-medium">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/15 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-500 font-medium">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <p>{success}</p>
                    </div>
                )}

                {isEditing && (
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false)
                                setName(user.name || "")
                                setError("")
                            }}
                            disabled={isPending}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Guardar Cambios
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

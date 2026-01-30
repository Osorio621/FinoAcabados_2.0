import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Settings, User, Bell, Shield } from "lucide-react"

export default async function SettingsPage() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        return redirect("/")
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Configuración</h1>
                <p className="text-zinc-500 mt-1">Administra las preferencias generales del sitio y tu cuenta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Perfil */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                            <User className="h-6 w-6 text-primary dark:text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-primary dark:text-white">Perfil de Administrador</h2>
                            <p className="text-sm text-zinc-500">Información de tu cuenta actual</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Nombre</p>
                            <p className="text-primary dark:text-white font-medium">{session?.user?.name || "Sin Nombre"}</p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</p>
                            <p className="text-primary dark:text-white font-medium">{session?.user?.email}</p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Rol</p>
                            <p className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded w-fit text-sm">
                                {session?.user?.role}
                            </p>
                        </div>
                    </div>
                </div>

                {/* General Settings Placeholder */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm opacity-60">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Settings className="h-5 w-5 text-zinc-500" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-500">Configuración General</h3>
                        </div>
                        <p className="text-zinc-400 text-sm">Opciones de SEO, metadatos y preferencias globales del sitio.</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm opacity-60">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Bell className="h-5 w-5 text-zinc-500" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-500">Notificaciones</h3>
                        </div>
                        <p className="text-zinc-400 text-sm">Configuración de alertas de stock y nuevos pedidos.</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm opacity-60">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Shield className="h-5 w-5 text-zinc-500" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-500">Seguridad</h3>
                        </div>
                        <p className="text-zinc-400 text-sm">Gestión de contraseñas y accesos.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

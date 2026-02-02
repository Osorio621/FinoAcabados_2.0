import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Settings, Bell, Shield } from "lucide-react"
import { ProfileForm } from "./_components/profile-form"

export default async function SettingsPage() {
    const session = await auth()

    // @ts-ignore
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
        return redirect("/")
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Configuración</h1>
                <p className="text-zinc-500 mt-1">Administra las preferencias generales del sitio y tu cuenta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Perfil Editable */}
                <ProfileForm user={session.user} />

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

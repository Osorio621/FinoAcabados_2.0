"use client"

import { useState, useTransition } from "react"
import {
    Shield,
    User,
    Key,
    MoreVertical,
    Search,
    UserPlus,
    UserMinus,
    Trash2,
    Check,
    X,
    Loader2,
    ShieldCheck
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { updateUserRole, resetUserPassword, deleteUser } from "@/actions/user-actions"
import { Role } from "@prisma/client"

interface UserItem {
    id: string
    name: string | null
    email: string
    role: Role
    createdAt: Date
}

interface UserListProps {
    initialUsers: any[]
    currentUser: any
}

export const UserList = ({ initialUsers, currentUser }: UserListProps) => {
    const [users, setUsers] = useState<UserItem[]>(initialUsers)
    const [searchQuery, setSearchQuery] = useState("")
    const [isPending, startTransition] = useTransition()

    // UI States
    const [editingUserId, setEditingUserId] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [actionMessage, setActionMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleRoleChange = (userId: string, newRole: Role) => {
        // @ts-ignore
        if (userId === currentUser.id && currentUser.role === "SUPER_ADMIN" && newRole !== "SUPER_ADMIN") {
            setActionMessage({ type: "error", text: "No puedes quitarte los permisos de Super Admin a ti mismo" })
            return
        }

        startTransition(async () => {
            const result = await updateUserRole(userId, newRole)
            if (result.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
                setActionMessage({ type: "success", text: result.message || "Rol actualizado" })
            } else {
                setActionMessage({ type: "error", text: result.error || "Error al actualizar" })
            }
        })
    }

    const handlePasswordReset = (userId: string) => {
        if (!newPassword || newPassword.length < 6) {
            setActionMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" })
            return
        }

        startTransition(async () => {
            const result = await resetUserPassword(userId, newPassword)
            if (result.success) {
                setNewPassword("")
                setEditingUserId(null)
                setActionMessage({ type: "success", text: result.message || "Contraseña actualizada" })
            } else {
                setActionMessage({ type: "error", text: result.error || "Error al actualizar" })
            }
        })
    }

    const handleDelete = (userId: string) => {
        if (userId === currentUser.id) return

        if (!confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return

        startTransition(async () => {
            const result = await deleteUser(userId)
            if (result.success) {
                setUsers(prev => prev.filter(u => u.id !== userId))
                setActionMessage({ type: "success", text: result.message || "Usuario eliminado" })
            } else {
                setActionMessage({ type: "error", text: result.error || "Error al eliminar" })
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>

                <AnimatePresence>
                    {actionMessage && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2",
                                actionMessage.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                            )}
                        >
                            {actionMessage.type === "success" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            {actionMessage.text}
                            <button onClick={() => setActionMessage(null)} className="ml-2 hover:opacity-70">
                                <X className="h-3 w-3" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* User Grid/Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-black/20 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Rol</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Fecha Registro</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-md",
                                                // @ts-ignore
                                                user.role === "SUPER_ADMIN" ? "bg-zinc-900" : user.role === "ADMIN" ? "bg-accent" : "bg-zinc-400"
                                            )}>
                                                {user.name?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-primary dark:text-white">
                                                    {user.name || "Invitado"}
                                                    {user.id === currentUser.id && <span className="ml-2 text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">Tú</span>}
                                                </p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                                // @ts-ignore
                                                disabled={isPending || (user.id === currentUser.id && user.role === "SUPER_ADMIN")}
                                                className={cn(
                                                    "text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-accent cursor-pointer transition-all",
                                                    // @ts-ignore
                                                    user.role === "SUPER_ADMIN" ? "bg-zinc-900 text-white" :
                                                        user.role === "ADMIN" ? "bg-accent/10 text-accent" :
                                                            "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                                )}
                                            >
                                                <option value="CUSTOMER">CLIENTE</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="SUPER_ADMIN">SUPER ADMIN</option>
                                            </select>
                                            {isPending && editingUserId === null && <Loader2 className="h-3 w-3 animate-spin text-accent" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-zinc-500">
                                            {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(user.createdAt))}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-accent"
                                                title="Cambiar contraseña"
                                            >
                                                <Key className="h-4 w-4" />
                                            </button>
                                            {user.id !== currentUser.id && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-zinc-500 hover:text-red-500"
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Cambio de Contraseña (Inline) */}
            <AnimatePresence>
                {editingUserId && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-4"
                    >
                        <div className="flex-1">
                            <h4 className="text-sm font-bold mb-1">Nueva contraseña para {users.find(u => u.id === editingUserId)?.name}</h4>
                            <p className="text-xs text-zinc-500">Mínimo 6 caracteres.</p>
                        </div>
                        <input
                            type="password"
                            placeholder="Ingrese nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePasswordReset(editingUserId)}
                                disabled={isPending}
                                className="bg-accent text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-accent/90 transition-all disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar"}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingUserId(null)
                                    setNewPassword("")
                                }}
                                className="px-6 py-2 rounded-xl font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                Cancelar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

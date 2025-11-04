// src/components/admin/AdminUsersTab.tsx
import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import api from '../../services/api'

interface Usuario {
    id: number
    username: string
    nombreCompleto: string
    email: string
    rol: string
}

interface UsuariosPage {
    content: Usuario[]
    totalPages: number
    number: number
}

export default function AdminUsersTab() {
    const [page, setPage] = useState(0)
    const [data, setData] = useState<UsuariosPage | null>(null)
    const [loading, setLoading] = useState(false)

    const load = () => {
        setLoading(true)
        api
            .get('/api/usuarios', { params: { page, size: 20 } })
            .then((res) => setData(res.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, [page])

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Usuarios</h2>
                    <p className="text-sm text-slate-500">Listado de usuarios registrados en el sistema</p>
                </div>
            </div>

            {loading ? (
                <div className="p-6">Cargando usuarios...</div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Nombre completo</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Rol</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.content.map((u) => (
                                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-3 text-sm text-slate-700">{u.id}</td>
                                    <td className="px-6 py-3 text-sm text-slate-900">{u.username}</td>
                                    <td className="px-6 py-3 text-sm text-slate-700">{u.nombreCompleto}</td>
                                    <td className="px-6 py-3 text-sm text-slate-700">{u.email}</td>
                                    <td className="px-6 py-3 text-sm">
                        <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          {u.rol}
                        </span>
                                    </td>
                                </tr>
                            ))}
                            {data && data.content.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-slate-400">
                                        No hay usuarios
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {data && data.totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between bg-slate-50">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                disabled={data.number === 0}
                                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40"
                            >
                                Anterior
                            </button>
                            <p className="text-sm text-slate-500">
                                Página {data.number + 1} de {data.totalPages}
                            </p>
                            <button
                                onClick={() => setPage((p) => (p + 1 < data.totalPages ? p + 1 : p))}
                                disabled={data.number + 1 >= data.totalPages}
                                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

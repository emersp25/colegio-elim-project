// src/components/admin/AdminUsersTab.tsx
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

type Usuario = {
    id: number
    username: string
    nombreCompleto: string
    email: string
    rol: string // viene así del backend
}

export default function AdminUsersTab() {
    const [users, setUsers] = useState<Usuario[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // modal
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [currentId, setCurrentId] = useState<number | null>(null)

    // tu backend necesita nombre y apellido separados
    const [form, setForm] = useState({
        username: '',
        nombre: '',
        apellido: '',
        email: '',
        rolNombre: 'ALUMNO',
        password: 'Elim123!' // solo al crear
    })
    const [saving, setSaving] = useState(false)

    const loadUsers = () => {
        setLoading(true)
        setError('')
        api
            .get('/api/usuarios?size=100')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setUsers(res.data as Usuario[])
                } else if (Array.isArray(res.data.content)) {
                    setUsers(res.data.content as Usuario[])
                } else {
                    setUsers([])
                }
            })
            .catch(() => setError('No se pudieron cargar los usuarios'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const openCreate = () => {
        setIsEdit(false)
        setCurrentId(null)
        setForm({
            username: '',
            nombre: '',
            apellido: '',
            email: '',
            rolNombre: 'ALUMNO',
            password: 'Elim123!'
        })
        setShowModal(true)
    }

    const openEdit = (u: Usuario) => {
        // nombreCompleto viene junto, lo partimos un poco
        const partes = u.nombreCompleto ? u.nombreCompleto.split(' ') : ['']
        const nombre = partes.shift() || ''
        const apellido = partes.join(' ').trim()

        setIsEdit(true)
        setCurrentId(u.id)
        setForm({
            username: u.username, // lo mostramos pero no lo mandamos en PUT
            nombre,
            apellido,
            email: u.email,
            rolNombre: u.rol,
            password: '' // en edición no tocamos password
        })
        setShowModal(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (isEdit && currentId != null) {
                // EDITAR -> tu controller solo actualiza lo que mandes
                await api.put(`/api/usuarios/${currentId}`, {
                    email: form.email,
                    nombre: form.nombre,
                    apellido: form.apellido,
                    rolNombre: form.rolNombre,
                    // password: form.password ? form.password : undefined,
                    activo: true
                })
            } else {
                // CREAR -> tu controller requiere username, email, nombre, apellido, password, rolNombre
                await api.post('/api/usuarios', {
                    username: form.username,
                    email: form.email,
                    nombre: form.nombre,
                    apellido: form.apellido,
                    password: form.password,
                    rolNombre: form.rolNombre
                })
            }
            setShowModal(false)
            loadUsers()
        } catch (err) {
            alert('No se pudo guardar el usuario (revisa que username o email no estén repetidos)')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (u: Usuario) => {
        const ok = confirm(`¿Eliminar al usuario "${u.username}"?`)
        if (!ok) return
        try {
            await api.delete(`/api/usuarios/${u.id}`)
            loadUsers()
        } catch {
            alert('No se pudo eliminar el usuario')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Usuarios</h2>
                    <p className="text-sm text-slate-500">Administra cuentas de la plataforma</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo usuario
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <p className="text-slate-500 text-sm">Cargando...</p>
                ) : error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                ) : users.length === 0 ? (
                    <p className="text-slate-500 text-sm">No hay usuarios.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Usuario</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Nombre completo</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
                                <th className="px-4 py-3 font-semibold text-slate-600">Rol</th>
                                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-slate-700">{u.id}</td>
                                    <td className="px-4 py-3 text-slate-700">{u.username}</td>
                                    <td className="px-4 py-3 text-slate-700">{u.nombreCompleto}</td>
                                    <td className="px-4 py-3 text-slate-700">{u.email}</td>
                                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {u.rol}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => openEdit(u)}
                                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u)}
                                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {isEdit ? 'Editar usuario' : 'Nuevo usuario'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-slate-100">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                            {!isEdit && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                                    <input
                                        value={form.username}
                                        onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                    <input
                                        value={form.nombre}
                                        onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                                    <input
                                        value={form.apellido}
                                        onChange={(e) => setForm((p) => ({ ...p, apellido: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                                <select
                                    value={form.rolNombre}
                                    onChange={(e) => setForm((p) => ({ ...p, rolNombre: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="PROFESOR">PROFESOR</option>
                                    <option value="ALUMNO">ALUMNO</option>
                                </select>
                            </div>

                            {!isEdit && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Password inicial
                                    </label>
                                    <input
                                        type="text"
                                        value={form.password}
                                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">
                                        Se guardará cifrada en el backend.
                                    </p>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

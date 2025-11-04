// src/components/admin/AdminCoursesTab.tsx
import { useEffect, useState } from 'react'
import { BookOpen, Plus, Pencil } from 'lucide-react'
import api from '../../services/api'

interface CursoListDTO {
    id: number
    nombre: string
    descripcion: string
    anio: number
    gradoId: number | null
    gradoNombre: string | null
    profesorUsername: string | null
    activo: boolean
    inscritos: number
}

interface CursoPage {
    content: CursoListDTO[]
    totalPages: number
    number: number
}

interface Grado {
    id: number
    nombre: string
    nivel: string
    anio: number
}

interface Usuario {
    id: number
    username: string
    nombreCompleto: string
    email: string
    rol: string
}

export default function AdminCoursesTab() {
    const [page, setPage] = useState(0)
    const [cursoPage, setCursoPage] = useState<CursoPage | null>(null)
    const [grados, setGrados] = useState<Grado[]>([])
    const [profesores, setProfesores] = useState<Usuario[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<CursoListDTO | null>(null)
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        anio: new Date().getFullYear(),
        gradoId: '',
        profesorUsername: '',
        activo: true,
    })

    const loadCursos = () => {
        setLoading(true)
        api
            .get('/api/cursos', { params: { page, size: 10 } })
            .then((res) => setCursoPage(res.data))
            .finally(() => setLoading(false))
    }

    const loadGradosYProfes = async () => {
        const [gradosRes, usuariosRes] = await Promise.all([
            api.get('/api/grados'),
            api.get('/api/usuarios', { params: { size: 100 } }),
        ])
        setGrados(gradosRes.data)
        const profs = usuariosRes.data.content.filter((u: Usuario) => u.rol === 'PROFESOR')
        setProfesores(profs)
    }

    useEffect(() => {
        loadCursos()
    }, [page])

    useEffect(() => {
        loadGradosYProfes()
    }, [])

    const openNew = () => {
        setEditing(null)
        setForm({
            nombre: '',
            descripcion: '',
            anio: new Date().getFullYear(),
            gradoId: '',
            profesorUsername: '',
            activo: true,
        })
        setShowForm(true)
    }

    const openEdit = (c: CursoListDTO) => {
        setEditing(c)
        setForm({
            nombre: c.nombre ?? '',
            descripcion: c.descripcion ?? '',
            anio: c.anio ?? new Date().getFullYear(),
            gradoId: c.gradoId ? String(c.gradoId) : '',
            profesorUsername: c.profesorUsername ?? '',
            activo: c.activo,
        })
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload: any = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            anio: form.anio,
            gradoId: Number(form.gradoId),
            activo: form.activo,
        }
        if (form.profesorUsername) {
            payload.profesorUsername = form.profesorUsername
        }

        try {
            if (editing) {
                await api.put(`/api/cursos/${editing.id}`, payload)
            } else {
                await api.post('/api/cursos', payload)
            }
            setShowForm(false)
            loadCursos()
        } catch (err) {
            alert('Error al guardar curso')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Cursos</h2>
                        <p className="text-sm text-slate-500">Crea y administra los cursos del colegio</p>
                    </div>
                </div>
                <button
                    onClick={openNew}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-500"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo curso
                </button>
            </div>

            {loading ? (
                <div className="p-6">Cargando cursos...</div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Grado</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Profesor</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Inscritos</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Activo</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {cursoPage?.content.map((c) => (
                                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-3 text-sm text-slate-700">{c.id}</td>
                                    <td className="px-6 py-3 text-sm text-slate-900">{c.nombre}</td>
                                    <td className="px-6 py-3 text-sm text-slate-700">{c.gradoNombre ?? '—'}</td>
                                    <td className="px-6 py-3 text-sm text-slate-700">{c.profesorUsername ?? '—'}</td>
                                    <td className="px-6 py-3 text-sm text-slate-700">{c.inscritos}</td>
                                    <td className="px-6 py-3 text-sm">
                      <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              c.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}
                      >
                        {c.activo ? 'Sí' : 'No'}
                      </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => openEdit(c)}
                                            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm"
                                        >
                                            <Pencil className="w-4 h-4" /> Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cursoPage && cursoPage.content.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-6 text-center text-slate-400">
                                        No hay cursos
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {cursoPage && cursoPage.totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between bg-slate-50">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                disabled={cursoPage.number === 0}
                                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40"
                            >
                                Anterior
                            </button>
                            <p className="text-sm text-slate-500">
                                Página {cursoPage.number + 1} de {cursoPage.totalPages}
                            </p>
                            <button
                                onClick={() => setPage((p) => (p + 1 < cursoPage.totalPages ? p + 1 : p))}
                                disabled={cursoPage.number + 1 >= cursoPage.totalPages}
                                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editing ? 'Editar curso' : 'Nuevo curso'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input
                                    value={form.nombre}
                                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Año</label>
                                <input
                                    type="number"
                                    value={form.anio}
                                    onChange={(e) => setForm((f) => ({ ...f, anio: Number(e.target.value) }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Grado</label>
                                <select
                                    value={form.gradoId}
                                    onChange={(e) => setForm((f) => ({ ...f, gradoId: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">Selecciona un grado</option>
                                    {grados.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.nombre} ({g.anio})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Profesor (solo admin)</label>
                                <select
                                    value={form.profesorUsername}
                                    onChange={(e) => setForm((f) => ({ ...f, profesorUsername: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="">-- ninguno / lo asigna backend --</option>
                                    {profesores.map((p) => (
                                        <option key={p.id} value={p.username}>
                                            {p.nombreCompleto} ({p.username})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.activo}
                                    onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                                />
                                <span className="text-sm">Activo</span>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
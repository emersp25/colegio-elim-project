// src/components/admin/AdminEnrollmentsTab.tsx
import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import api from '../../services/api'

interface Usuario {
    id: number
    username: string
    nombreCompleto: string
    rol: string
}

interface CursoOption {
    id: number
    nombre: string
}

interface InscripcionDTO {
    id: number
    cursoId: number
    cursoNombre: string
    alumnoUsername: string
    alumnoNombreCompleto: string
    estado: string
    fechaInscripcion: string
}

interface InscripcionPage {
    content: InscripcionDTO[]
    totalPages: number
    number: number
}

export default function AdminEnrollmentsTab() {
    const [alumnos, setAlumnos] = useState<Usuario[]>([])
    const [cursos, setCursos] = useState<CursoOption[]>([])
    const [inscPage, setInscPage] = useState<InscripcionPage | null>(null)
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ alumnoUsername: '', cursoId: '' })

    const loadInscripciones = () => {
        setLoading(true)
        api
            .get('/api/inscripciones', { params: { page, size: 10 } })
            .then((res) => setInscPage(res.data))
            .finally(() => setLoading(false))
    }

    const loadAlumnosYCursos = async () => {
        const usuariosRes = await api.get('/api/usuarios', { params: { size: 200 } })
        const alumnosOnly = usuariosRes.data.content.filter((u: Usuario) => u.rol === 'ALUMNO')
        setAlumnos(alumnosOnly)

        const cursosRes = await api.get('/api/cursos', { params: { size: 200 } })
        const cursoOpts = cursosRes.data.content.map((c: any) => ({ id: c.id, nombre: c.nombre }))
        setCursos(cursoOpts)
    }

    useEffect(() => {
        loadInscripciones()
    }, [page])

    useEffect(() => {
        loadAlumnosYCursos()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.alumnoUsername || !form.cursoId) return
        try {
            await api.post('/api/inscripciones', {
                alumnoUsername: form.alumnoUsername,
                cursoId: Number(form.cursoId),
            })
            setForm({ alumnoUsername: '', cursoId: '' })
            loadInscripciones()
        } catch (e) {
            alert('No se pudo inscribir al alumno')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Inscripciones</h2>
                    <p className="text-sm text-slate-500">Inscribir estudiantes a cursos</p>
                </div>
            </div>

            {/* formulario */}
            <div className="px-6 py-4 border-b border-slate-100">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <select
                        className="border rounded-lg px-3 py-2 flex-1"
                        value={form.alumnoUsername}
                        onChange={(e) => setForm((f) => ({ ...f, alumnoUsername: e.target.value }))}
                    >
                        <option value="">Selecciona alumno</option>
                        {alumnos.map((a) => (
                            <option key={a.id} value={a.username}>
                                {a.nombreCompleto} ({a.username})
                            </option>
                        ))}
                    </select>
                    <select
                        className="border rounded-lg px-3 py-2 flex-1"
                        value={form.cursoId}
                        onChange={(e) => setForm((f) => ({ ...f, cursoId: e.target.value }))}
                    >
                        <option value="">Selecciona curso</option>
                        {cursos.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500" type="submit">
                        Inscribir
                    </button>
                </form>
            </div>

            {/* tabla */}
            {loading ? (
                <div className="p-6">Cargando inscripciones...</div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Alumno</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Curso</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            {inscPage?.content.map((i) => (
                                <tr key={i.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-3 text-sm text-slate-900">
                                        {i.alumnoNombreCompleto || i.alumnoUsername}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-700">{i.cursoNombre}</td>
                                    <td className="px-6 py-3 text-sm">
                      <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              i.estado === 'ACTIVA'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                          }`}
                      >
                        {i.estado}
                      </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-500">
                                        {i.fechaInscripcion ? new Date(i.fechaInscripcion).toLocaleString() : '—'}
                                    </td>
                                </tr>
                            ))}
                            {inscPage && inscPage.content.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-6 text-center text-slate-400">
                                        No hay inscripciones
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    {inscPage && inscPage.totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between bg-slate-50">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                disabled={inscPage.number === 0}
                                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40"
                            >
                                Anterior
                            </button>
                            <p className="text-sm text-slate-500">
                                Página {inscPage.number + 1} de {inscPage.totalPages}
                            </p>
                            <button
                                onClick={() => setPage((p) => (p + 1 < inscPage.totalPages ? p + 1 : p))}
                                disabled={inscPage.number + 1 >= inscPage.totalPages}
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

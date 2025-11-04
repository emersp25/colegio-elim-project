// src/pages/DashboardAlumno.tsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import { BookOpen, GraduationCap, ClipboardList, CheckCircle2, Clock, Send, X, FileText, Award } from 'lucide-react'

type CursoDTO = {
    id: number
    nombre: string
    descripcion?: string
    gradoId?: number
    gradoNombre?: string
    profesorUsername?: string
    activo?: boolean
    inscritos?: number
}

type Tarea = {
    id: number
    titulo: string
    descripcion?: string
    puntosTotales: number
    fechaEntrega?: string
    curso?: {
        id: number
        nombre: string
    }
}

type Entrega = {
    id: number
    tarea: Tarea
    contenido: string
    fechaEntrega: string
    calificacion?: number
    observaciones?: string
}

type NotaDTO = {
    id: number
    cursoId: number
    cursoNombre: string
    alumnoUsername: string
    alumnoNombreCompleto: string
    nota: number
    tipo?: string
    comentario?: string
    fechaRegistro: string
}

export default function DashboardAlumno() {
    const [cursos, setCursos] = useState<CursoDTO[]>([])
    const [tareas, setTareas] = useState<Tarea[]>([])
    const [entregas, setEntregas] = useState<Entrega[]>([])
    const [notas, setNotas] = useState<NotaDTO[]>([])
    const [grado, setGrado] = useState<string>('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // modal de entrega
    const [showEntregaModal, setShowEntregaModal] = useState(false)
    const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)
    const [contenidoEntrega, setContenidoEntrega] = useState('')
    const [sending, setSending] = useState(false)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                // 1) cursos del alumno
                const cursosRes = await api.get('/api/cursos?size=100')
                const cursosData: CursoDTO[] = Array.isArray(cursosRes.data)
                    ? cursosRes.data
                    : cursosRes.data.content ?? []
                setCursos(cursosData)

                // grado (tomamos el del primer curso si hay)
                if (cursosData.length > 0) {
                    const gname = cursosData[0].gradoNombre || 'Sin grado asignado'
                    setGrado(gname)
                } else {
                    setGrado('Sin grado asignado')
                }

                // 2) tareas de cada curso (para alumnos el controller pide cursoId)
                const tareasPorCurso = await Promise.all(
                    cursosData.map((c) => api.get(`/api/tareas?cursoId=${c.id}`))
                )

                const todasTareas: Tarea[] = tareasPorCurso
                    .map((r, idx) => {
                        const cursoOrigen = cursosData[idx]
                        const lista = r.data as Tarea[]
                        // si el backend no manda el curso, lo metemos aquí
                        return lista.map((t) => {
                            if (!t.curso) {
                                return {
                                    ...t,
                                    curso: {
                                        id: cursoOrigen.id,
                                        nombre: cursoOrigen.nombre
                                    }
                                }
                            }
                            return t
                        })
                    })
                    .flat()

                setTareas(todasTareas)

                // 3) entregas del alumno
                const entregasRes = await api.get('/api/entregas')
                const entregasData: Entrega[] = entregasRes.data
                setEntregas(entregasData)

                // 4) notas del alumno (tolerante a Page o a array)
                const notasRes = await api.get('/api/notas?size=100')
                const notasData: NotaDTO[] = Array.isArray(notasRes.data)
                    ? notasRes.data
                    : notasRes.data.content ?? []
                setNotas(notasData)
            } catch (e) {
                setError('No se pudo cargar la información del alumno')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    const tareasPendientes = tareas.filter((t) => {
        const yaEntregada = entregas.some((e) => e.tarea?.id === t.id)
        return !yaEntregada
    })

    const tareasEntregadas = tareas.filter((t) =>
        entregas.some((e) => e.tarea?.id === t.id)
    )

    const abrirModalEntrega = (t: Tarea) => {
        setTareaSeleccionada(t)
        setContenidoEntrega('')
        setShowEntregaModal(true)
    }

    const enviarEntrega = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tareaSeleccionada) return
        setSending(true)
        try {
            await api.post('/api/entregas', {
                tareaId: tareaSeleccionada.id,
                contenido: contenidoEntrega
            })
            // recargar entregas y cerrar
            const entregasRes = await api.get('/api/entregas')
            setEntregas(entregasRes.data)
            setShowEntregaModal(false)
        } catch (err) {
            alert('No se pudo enviar la entrega (quizá ya entregaste esta tarea)')
        } finally {
            setSending(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Panel del Alumno</h1>
                    <p className="text-slate-600">Aquí puedes ver tus cursos, tareas y calificaciones.</p>
                </div>

                {/* resumen */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* grado */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Mi grado</p>
                            <p className="text-sm font-semibold text-slate-900">{grado}</p>
                        </div>
                    </div>
                    {/* cursos inscritos */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Cursos inscritos</p>
                            <p className="text-2xl font-bold text-slate-900">{cursos.length}</p>
                        </div>
                    </div>
                    {/* tareas pendientes */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Tareas pendientes</p>
                            <p className="text-2xl font-bold text-slate-900">{tareasPendientes.length}</p>
                        </div>
                    </div>
                    {/* calificaciones registradas */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Award className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Calificaciones</p>
                            <p className="text-2xl font-bold text-slate-900">{notas.length}</p>
                        </div>
                    </div>
                </div>

                {/* cursos */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-slate-500" />
                            Mis cursos
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cursos.length === 0 ? (
                            <p className="text-sm text-slate-500">No estás inscrito en ningún curso.</p>
                        ) : (
                            cursos.map((c) => (
                                <div key={c.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
                                    <p className="text-xs text-slate-500 mb-1">{c.gradoNombre ?? 'Sin grado'}</p>
                                    <h3 className="text-sm font-semibold text-slate-900">{c.nombre}</h3>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Profesor: {c.profesorUsername ?? '—'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* tareas pendientes y entregadas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* pendientes */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                Tareas pendientes
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {tareasPendientes.length === 0 ? (
                                <p className="text-sm text-slate-500">No tienes tareas pendientes 👏</p>
                            ) : (
                                tareasPendientes.map((t) => (
                                    <div
                                        key={t.id}
                                        className="border border-slate-100 rounded-lg p-4 flex justify-between gap-4"
                                    >
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">
                                                Curso: {t.curso?.nombre ?? '—'}
                                            </p>
                                            <h3 className="text-sm font-semibold text-slate-900">{t.titulo}</h3>
                                            {t.descripcion && (
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.descripcion}</p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-2">
                                                Puntos: {t.puntosTotales}
                                                {t.fechaEntrega && (
                                                    <> · Entregar antes de {new Date(t.fechaEntrega).toLocaleString()}</>
                                                )}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => abrirModalEntrega(t)}
                                            className="self-center inline-flex items-center gap-1 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg hover:bg-slate-800"
                                        >
                                            <Send className="w-4 h-4" />
                                            Entregar
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* entregadas */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Tareas entregadas
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {tareasEntregadas.length === 0 ? (
                                <p className="text-sm text-slate-500">Aún no has entregado tareas.</p>
                            ) : (
                                tareasEntregadas.map((t) => {
                                    const entrega = entregas.find((e) => e.tarea?.id === t.id)
                                    return (
                                        <div key={t.id} className="border border-slate-100 rounded-lg p-4">
                                            <p className="text-xs text-slate-400 mb-1">
                                                Curso: {t.curso?.nombre ?? '—'}
                                            </p>
                                            <h3 className="text-sm font-semibold text-slate-900">{t.titulo}</h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Entregado el{' '}
                                                {entrega ? new Date(entrega.fechaEntrega).toLocaleString() : '—'}
                                            </p>
                                            {entrega?.calificacion != null && (
                                                <p className="text-xs mt-2">
                                                    Calificación:{' '}
                                                    <span className="inline-flex px-2 py-1 text-xs rounded bg-emerald-50 text-emerald-700">
                            {entrega.calificacion}
                          </span>
                                                </p>
                                            )}
                                            {entrega?.observaciones && (
                                                <p className="text-xs text-slate-500 mt-1">{entrega.observaciones}</p>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* calificaciones */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <h2 className="text-lg font-semibold text-slate-900">Mis calificaciones</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Curso
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Nota
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Tipo
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Comentario
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Fecha
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {notas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-slate-400 text-sm">
                                        No tienes calificaciones aún.
                                    </td>
                                </tr>
                            ) : (
                                notas.map((n) => (
                                    <tr key={n.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 text-slate-800">{n.cursoNombre}</td>
                                        <td className="px-6 py-3">
                        <span className="inline-flex px-3 py-1 rounded-full bg-slate-900 text-white text-xs">
                          {n.nota}
                        </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-600">{n.tipo ?? '—'}</td>
                                        <td className="px-6 py-3 text-slate-600">{n.comentario ?? '—'}</td>
                                        <td className="px-6 py-3 text-slate-400 text-xs">
                                            {n.fechaRegistro ? new Date(n.fechaRegistro).toLocaleString() : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* modal entrega */}
            {showEntregaModal && tareaSeleccionada && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-slate-900">Entregar tarea</h3>
                            <button onClick={() => setShowEntregaModal(false)} className="p-1 rounded hover:bg-slate-100">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={enviarEntrega} className="px-6 py-5 space-y-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">
                                    Curso: {tareaSeleccionada.curso?.nombre ?? '—'}
                                </p>
                                <p className="text-sm font-semibold text-slate-900">{tareaSeleccionada.titulo}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Contenido / enlace / respuesta
                                </label>
                                <textarea
                                    value={contenidoEntrega}
                                    onChange={(e) => setContenidoEntrega(e.target.value)}
                                    required
                                    rows={5}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                                    placeholder="Pega aquí tu enlace o escribe tu respuesta..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEntregaModal(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-50 inline-flex items-center gap-2"
                                >
                                    {sending && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

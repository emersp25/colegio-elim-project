import { useEffect, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import api from '../../services/api'
import { CursoItem, TareaItem } from '../../pages/DashboardProfesor'

type Props = {
    cursos: CursoItem[]
}

export default function ProfTareas({ cursos }: Props) {
    const [tareas, setTareas] = useState<TareaItem[]>([])
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [newTarea, setNewTarea] = useState({
        cursoId: '',
        titulo: '',
        descripcion: '',
        puntosTotales: 100,
        fechaEntrega: ''
    })

    const loadTareas = () => {
        setLoading(true)
        api
            .get('/api/tareas')
            .then((res) => setTareas(res.data))
            .catch(() => setTareas([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadTareas()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setMsg('')
        if (!newTarea.cursoId || !newTarea.titulo) {
            setMsg('Curso y título son obligatorios')
            return
        }
        try {
            await api.post('/api/tareas', {
                cursoId: Number(newTarea.cursoId),
                titulo: newTarea.titulo,
                descripcion: newTarea.descripcion,
                puntosTotales: Number(newTarea.puntosTotales),
                fechaEntrega: newTarea.fechaEntrega || null
            })
            setMsg('Tarea creada ✅')
            setNewTarea({ cursoId: '', titulo: '', descripcion: '', puntosTotales: 100, fechaEntrega: '' })
            loadTareas()
        } catch {
            setMsg('No se pudo crear la tarea')
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-slate-700" />
                    <h2 className="text-lg font-semibold text-slate-900">Tareas de mis cursos</h2>
                </div>
                <div className="p-6">
                    {loading ? (
                        <p className="text-slate-500 text-sm">Cargando...</p>
                    ) : tareas.length === 0 ? (
                        <p className="text-slate-500 text-sm">No tienes tareas todavía.</p>
                    ) : (
                        <ul className="space-y-4">
                            {tareas.map((t) => (
                                <li key={t.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        {t.titulo}
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      {t.curso ? t.curso.nombre : 'Sin curso'}
                    </span>
                                    </h3>
                                    {t.descripcion && <p className="text-sm text-slate-600 mt-1">{t.descripcion}</p>}
                                    <p className="text-xs text-slate-400 mt-2">
                                        Puntos: {t.puntosTotales}{' '}
                                        {t.fechaEntrega && <>· Entrega: {new Date(t.fechaEntrega).toLocaleString()}</>}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-slate-700" />
                    <h2 className="text-lg font-semibold text-slate-900">Crear tarea</h2>
                </div>
                <div className="p-6">
                    <form className="space-y-4" onSubmit={handleCreate}>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Curso</label>
                            <select
                                value={newTarea.cursoId}
                                onChange={(e) => setNewTarea((p) => ({ ...p, cursoId: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Seleccione un curso</option>
                                {cursos.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Título</label>
                            <input
                                value={newTarea.titulo}
                                onChange={(e) => setNewTarea((p) => ({ ...p, titulo: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Descripción</label>
                            <textarea
                                value={newTarea.descripcion}
                                onChange={(e) => setNewTarea((p) => ({ ...p, descripcion: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Puntos totales</label>
                                <input
                                    type="number"
                                    value={newTarea.puntosTotales}
                                    onChange={(e) => setNewTarea((p) => ({ ...p, puntosTotales: Number(e.target.value) }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Fecha entrega</label>
                                <input
                                    type="datetime-local"
                                    value={newTarea.fechaEntrega}
                                    onChange={(e) => setNewTarea((p) => ({ ...p, fechaEntrega: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        {msg && <p className="text-xs text-slate-500">{msg}</p>}
                        <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition">
                            Crear tarea
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

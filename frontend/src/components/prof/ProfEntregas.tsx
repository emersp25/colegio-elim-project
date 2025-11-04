import { useEffect, useState } from 'react'
import { Users, CheckCircle2 } from 'lucide-react'
import api from '../../services/api'
import { EntregaItem } from '../../pages/DashboardProfesor'

export default function ProfEntregas() {
    const [entregas, setEntregas] = useState<EntregaItem[]>([])
    const [loading, setLoading] = useState(false)
    const [calificando, setCalificando] = useState<{ [id: number]: { calificacion: string; observaciones: string } }>({})

    const loadEntregas = () => {
        setLoading(true)
        api
            .get('/api/entregas')
            .then((res) => setEntregas(res.data))
            .catch(() => setEntregas([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadEntregas()
    }, [])

    const handleChange = (id: number, field: 'calificacion' | 'observaciones', value: string) => {
        setCalificando((prev) => ({
            ...prev,
            [id]: {
                calificacion: field === 'calificacion' ? value : prev[id]?.calificacion || '',
                observaciones: field === 'observaciones' ? value : prev[id]?.observaciones || ''
            }
        }))
    }

    const handleSave = async (id: number) => {
        const data = calificando[id]
        if (!data || !data.calificacion) return
        await api.put(`/api/entregas/${id}/calificar`, {
            calificacion: Number(data.calificacion),
            observaciones: data.observaciones,
            registrarNota: true
        })
        loadEntregas()
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">Entregas de mis tareas</h2>
            </div>
            <div className="p-6">
                {loading ? (
                    <p className="text-slate-500 text-sm">Cargando...</p>
                ) : entregas.length === 0 ? (
                    <p className="text-slate-500 text-sm">Aún no tienes entregas.</p>
                ) : (
                    <div className="space-y-4">
                        {entregas.map((e) => (
                            <div key={e.id} className="border border-slate-100 rounded-lg p-4">
                                <div className="flex justify-between gap-2 mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {e.tarea.titulo}{' '}
                                            <span className="text-xs text-slate-500">({e.tarea.curso.nombre})</span>
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Alumno: {e.alumno.username} · {(e.alumno.nombre || '') + ' ' + (e.alumno.apellido || '')}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400">{new Date(e.fechaEntrega).toLocaleString()}</p>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">
                                    Contenido: <span className="text-slate-800">{e.contenido}</span>
                                </p>
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                                    <input
                                        type="number"
                                        placeholder="Calificación"
                                        value={calificando[e.id]?.calificacion ?? (e.calificacion ?? '').toString()}
                                        onChange={(ev) => handleChange(e.id, 'calificacion', ev.target.value)}
                                        className="border border-slate-200 rounded-lg px-3 py-1 text-sm w-32"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Observaciones"
                                        value={calificando[e.id]?.observaciones ?? (e.observaciones ?? '')}
                                        onChange={(ev) => handleChange(e.id, 'observaciones', ev.target.value)}
                                        className="border border-slate-200 rounded-lg px-3 py-1 text-sm flex-1"
                                    />
                                    <button
                                        onClick={() => handleSave(e.id)}
                                        className="bg-slate-900 text-white text-xs px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-1"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

import { useEffect, useState } from 'react'
import api from '../services/api'
import { LayoutPanelLeft, Users, GraduationCap, Award } from 'lucide-react'

interface TopCurso {
    cursoId: number
    nombre: string
    inscritos: number
}

interface ProfesorDashboard {
    misCursos: number
    alumnosEnMisCursos: number
    promedioMisNotas: number
    topMisCursos: TopCurso[]
}

export default function DashboardProfesor() {
    const [data, setData] = useState<ProfesorDashboard | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get('/api/dashboard/profesor')
            .then(res => setData(res.data))
            .catch(() => setError('No se pudo cargar el dashboard de Profesor'))
    }, [])

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Panel del Profesor</h1>
                    <p className="text-slate-600">Resumen de tus cursos y alumnos</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Mis cursos */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <LayoutPanelLeft className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-slate-500">Mis cursos</p>
                        <p className="text-3xl font-bold text-slate-900">{data.misCursos}</p>
                    </div>

                    {/* Alumnos en mis cursos */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="bg-emerald-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-sm text-slate-500">Alumnos en mis cursos</p>
                        <p className="text-3xl font-bold text-slate-900">{data.alumnosEnMisCursos}</p>
                    </div>

                    {/* Promedio mis notas */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="bg-amber-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <GraduationCap className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-sm text-slate-500">Promedio de mis notas</p>
                        <p className="text-3xl font-bold text-slate-900">{data.promedioMisNotas}%</p>
                    </div>
                </div>

                {/* Top cursos */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500/10 p-2 rounded-lg">
                                <Award className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Mis cursos más activos</h2>
                                <p className="text-sm text-slate-500">Según cantidad de alumnos inscritos</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Inscritos</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {data.topMisCursos.map((c, idx) => (
                                <tr key={c.cursoId} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-sm text-slate-900">#{c.cursoId}</td>
                                    <td className="px-6 py-3 text-sm text-slate-900 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold">
                        {idx + 1}
                      </span>
                                        {c.nombre}
                                    </td>
                                    <td className="px-6 py-3 text-sm">
                      <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        {c.inscritos} alumno(s)
                      </span>
                                    </td>
                                </tr>
                            ))}
                            {data.topMisCursos.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-6 text-center text-slate-400 text-sm">
                                        No hay cursos con inscripciones todavía
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}

import { useEffect, useState } from 'react'
import api from '../services/api'
import { BookOpen, GraduationCap, ClipboardList } from 'lucide-react'

interface AlumnoDashboard {
    cursosInscritos: number
    promedioMisNotas: number
    notasPendientes: number
}

export default function DashboardAlumno() {
    const [data, setData] = useState<AlumnoDashboard | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get('/api/dashboard/alumno')
            .then(res => setData(res.data))
            .catch(() => setError('No se pudo cargar el dashboard de Alumno'))
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
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Mi Panel</h1>
                    <p className="text-slate-600">Resumen de tus cursos y notas</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="bg-violet-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <BookOpen className="w-5 h-5 text-violet-600" />
                        </div>
                        <p className="text-sm text-slate-500">Cursos inscritos</p>
                        <p className="text-3xl font-bold text-slate-900">{data.cursosInscritos}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="bg-emerald-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <GraduationCap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-sm text-slate-500">Promedio de mis notas</p>
                        <p className="text-3xl font-bold text-slate-900">{data.promedioMisNotas}%</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="bg-amber-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                            <ClipboardList className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-sm text-slate-500">Notas pendientes</p>
                        <p className="text-3xl font-bold text-slate-900">{data.notasPendientes}</p>
                    </div>
                </div>

                {/* Tabla simple (como placeholder, porque el backend no manda cursos del alumno) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-900">Mis cursos</h2>
                        <p className="text-sm text-slate-500">Tu avance depende de las notas registradas</p>
                    </div>
                    <div className="p-6 text-center text-slate-400 text-sm">
                        (El backend no está enviando el detalle de cursos para alumno todavía)
                    </div>
                </div>
            </div>
        </div>
    )
}

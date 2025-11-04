import { useEffect, useState } from 'react'
import { ListChecks, Users, BookOpen, ClipboardList, Inbox, GraduationCap } from 'lucide-react'
import api from '../services/api'
import AdminUsersTab from '../components/admin/AdminUsersTab'
import AdminCoursesTab from '../components/admin/AdminCoursesTab'
import AdminEnrollmentsTab from '../components/admin/AdminEnrollmentsTab'
import AdminContactTab from '../components/admin/AdminContactTab'
import AdminGradesTab from '../components/admin/AdminGradesTab'

interface TopCurso {
    cursoId: number
    nombre: string
    inscritos: number
}

interface AdminDashboardDTO {
    totalUsuarios: number
    totalCursos: number
    totalInscripciones: number
    promedioNotasGlobal: number
    topCursos: TopCurso[]
}

type Tab =
    | 'resumen'
    | 'usuarios'
    | 'cursos'
    | 'inscripciones'
    | 'contacto'
    | 'grados'

export default function DashboardAdmin() {
    const [data, setData] = useState<AdminDashboardDTO | null>(null)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState<Tab>('resumen')

    useEffect(() => {
        api
            .get('/api/dashboard/admin')
            .then((res) => setData(res.data))
            .catch(() => setError('No se pudo cargar el dashboard de Admin'))
    }, [])

    const tabs = [
        { id: 'resumen' as const, label: 'Resumen', icon: ListChecks },
        { id: 'usuarios' as const, label: 'Usuarios', icon: Users },
        { id: 'cursos' as const, label: 'Cursos', icon: BookOpen },
        { id: 'grados' as const, label: 'Grados', icon: GraduationCap },
        { id: 'inscripciones' as const, label: 'Inscripciones', icon: ClipboardList },
        { id: 'contacto' as const, label: 'Contacto', icon: Inbox },
    ]

    if (error && !data) {
        return <div className="p-6 text-red-500">{error}</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Panel Administrativo</h1>
                    <p className="text-slate-600">Gestiona cursos, grados, inscripciones y mensajes</p>
                </div>

                <div className="mb-6 flex gap-3 border-b border-slate-200 overflow-x-auto">
                    {tabs.map((t) => {
                        const Icon = t.icon
                        return (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`px-4 py-2 rounded-t-lg flex items-center gap-2 ${
                                    activeTab === t.id
                                        ? 'bg-white text-slate-900 border-x border-t border-slate-200'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        )
                    })}
                </div>

                {/* Resumen */}
                {activeTab === 'resumen' && data && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total usuarios" value={data.totalUsuarios} color="text-blue-600" />
                            <StatCard title="Total cursos" value={data.totalCursos} color="text-purple-600" />
                            <StatCard title="Inscripciones" value={data.totalInscripciones} color="text-emerald-600" />
                            <StatCard title="Promedio global" value={data.promedioNotasGlobal + '%'} color="text-amber-600" />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-semibold text-slate-900">Cursos más populares</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Curso</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Inscritos</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                    {data.topCursos.map((c) => (
                                        <tr key={c.cursoId}>
                                            <td className="px-6 py-3 text-sm text-slate-700">#{c.cursoId}</td>
                                            <td className="px-6 py-3 text-sm text-slate-900">{c.nombre}</td>
                                            <td className="px-6 py-3 text-sm">
                          <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                            {c.inscritos}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.topCursos.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-6 text-center text-slate-400">
                                                No hay cursos
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'usuarios' && <AdminUsersTab />}
                {activeTab === 'cursos' && <AdminCoursesTab />}
                {activeTab === 'grados' && <AdminGradesTab />}
                {activeTab === 'inscripciones' && <AdminEnrollmentsTab />}
                {activeTab === 'contacto' && <AdminContactTab />}
            </div>
        </div>
    )
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    )
}

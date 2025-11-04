import { Award, GraduationCap, LayoutPanelLeft, Users } from 'lucide-react'
import { ProfesorDashboard } from '../../pages/DashboardProfesor'

type Props = {
    dash: ProfesorDashboard | null
    error: string
}

export default function ProfResumen({ dash, error }: Props) {
    if (error) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center p-4">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (!dash) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                        <LayoutPanelLeft className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-500">Mis cursos</p>
                    <p className="text-3xl font-bold text-slate-900">{dash.misCursos}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <div className="bg-emerald-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-sm text-slate-500">Alumnos en mis cursos</p>
                    <p className="text-3xl font-bold text-slate-900">{dash.alumnosEnMisCursos}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <div className="bg-amber-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                        <GraduationCap className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-sm text-slate-500">Promedio de mis notas</p>
                    <p className="text-3xl font-bold text-slate-900">{dash.promedioMisNotas}%</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                        <Award className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Mis cursos más activos</h2>
                        <p className="text-sm text-slate-500">Según cantidad de alumnos inscritos</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-slate-50">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Inscritos
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {dash.topMisCursos.map((c, idx) => (
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
                        {dash.topMisCursos.length === 0 && (
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
        </>
    )
}

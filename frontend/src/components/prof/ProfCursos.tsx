import { BookOpen } from 'lucide-react'
import { CursoItem } from '../../pages/DashboardProfesor'

type Props = {
    cursos: CursoItem[]
    onReload?: () => void
}

export default function ProfCursos({ cursos }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">Mis cursos</h2>
            </div>
            <div className="p-6">
                {cursos.length === 0 ? (
                    <p className="text-slate-500">No tienes cursos asignados todavía.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cursos.map((c) => (
                            <div key={c.id} className="border border-slate-100 rounded-lg p-4 hover:shadow-sm">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                                    {c.nombre}
                                    {!c.activo && (
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Inactivo</span>
                                    )}
                                </h3>
                                <p className="text-xs text-slate-500 mb-2">
                                    {c.gradoNombre ? c.gradoNombre : 'Sin grado'} · Año {c.anio}
                                </p>
                                <p className="text-sm text-slate-600 mb-3">{c.descripcion || 'Sin descripción'}</p>
                                <p className="text-xs text-slate-500">Inscritos: {c.inscritos}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

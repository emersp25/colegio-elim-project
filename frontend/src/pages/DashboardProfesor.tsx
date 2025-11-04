import { useEffect, useState } from 'react'
import api from '../services/api'
import { LayoutPanelLeft, BookOpen, ClipboardList, Users } from 'lucide-react'
import ProfResumen from '../components/prof/ProfResumen'
import ProfCursos from '../components/prof/ProfCursos'
import ProfTareas from '../components/prof/ProfTareas'
import ProfEntregas from '../components/prof/ProfEntregas'

interface TopCurso {
    cursoId: number
    nombre: string
    inscritos: number
}

export interface ProfesorDashboard {
    misCursos: number
    alumnosEnMisCursos: number
    promedioMisNotas: number
    topMisCursos: TopCurso[]
}

export interface CursoItem {
    id: number
    nombre: string
    descripcion: string | null
    anio: number
    gradoId: number | null
    gradoNombre: string | null
    profesorUsername: string | null
    activo: boolean
    inscritos: number
}

export interface TareaItem {
    id: number
    curso?: { id: number; nombre: string }
    titulo: string
    descripcion?: string
    puntosTotales: number
    fechaEntrega?: string
}

export interface EntregaItem {
    id: number
    tarea: {
        id: number
        titulo: string
        curso: { id: number; nombre: string }
    }
    alumno: {
        id: number
        username: string
        nombre?: string
        apellido?: string
    }
    contenido: string
    fechaEntrega: string
    calificacion?: number
    observaciones?: string
}

export default function DashboardProfesor() {
    const [activeTab, setActiveTab] = useState<'resumen' | 'cursos' | 'tareas' | 'entregas'>('resumen')
    const [dash, setDash] = useState<ProfesorDashboard | null>(null)
    const [dashError, setDashError] = useState('')

    // listas que comparten los tabs
    const [cursos, setCursos] = useState<CursoItem[]>([])

    useEffect(() => {
        api
            .get('/api/dashboard/profesor')
            .then((res) => setDash(res.data))
            .catch(() => setDashError('No se pudo cargar el dashboard de Profesor'))
    }, [])

    const loadCursos = () => {
        api
            .get('/api/cursos?size=50')
            .then((res) => {
                if (Array.isArray(res.data)) setCursos(res.data)
                else if (Array.isArray(res.data.content)) setCursos(res.data.content)
            })
            .catch(() => setCursos([]))
    }

    // cuando entro a tabs que necesitan cursos, los traigo
    useEffect(() => {
        if ((activeTab === 'cursos' || activeTab === 'tareas') && cursos.length === 0) {
            loadCursos()
        }
    }, [activeTab])

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header + tabs */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Panel del Profesor</h1>
                        <p className="text-slate-600">Gestiona tus cursos, tareas y entregas</p>
                    </div>
                    <div className="flex gap-2 bg-white rounded-lg p-1 border border-slate-200">
                        <button
                            onClick={() => setActiveTab('resumen')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
                                activeTab === 'resumen' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <LayoutPanelLeft className="w-4 h-4" /> Resumen
                        </button>
                        <button
                            onClick={() => setActiveTab('cursos')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
                                activeTab === 'cursos' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <BookOpen className="w-4 h-4" /> Mis cursos
                        </button>
                        <button
                            onClick={() => setActiveTab('tareas')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
                                activeTab === 'tareas' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <ClipboardList className="w-4 h-4" /> Tareas
                        </button>
                        <button
                            onClick={() => setActiveTab('entregas')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
                                activeTab === 'entregas' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <Users className="w-4 h-4" /> Entregas
                        </button>
                    </div>
                </div>

                {activeTab === 'resumen' && <ProfResumen dash={dash} error={dashError} />}
                {activeTab === 'cursos' && <ProfCursos cursos={cursos} onReload={loadCursos} />}
                {activeTab === 'tareas' && <ProfTareas cursos={cursos} />}
                {activeTab === 'entregas' && <ProfEntregas />}
            </div>
        </div>
    )
}
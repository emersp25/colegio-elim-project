// src/components/admin/AdminGradesTab.tsx
import { useEffect, useState } from 'react'
import { GraduationCap, Plus, Pencil } from 'lucide-react'
import api from '../../services/api'

interface Grado {
    id: number
    nombre: string
    nivel: string
    anio: number
}

export default function AdminGradesTab() {
    const [grados, setGrados] = useState<Grado[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Grado | null>(null)
    const [form, setForm] = useState({ nombre: '', nivel: '', anio: new Date().getFullYear() })

    const load = () => {
        api.get('/api/grados').then((res) => setGrados(res.data))
    }

    useEffect(() => {
        load()
    }, [])

    const openNew = () => {
        setEditing(null)
        setForm({ nombre: '', nivel: '', anio: new Date().getFullYear() })
        setShowForm(true)
    }

    const openEdit = (g: Grado) => {
        setEditing(g)
        setForm({ nombre: g.nombre, nivel: g.nivel, anio: g.anio })
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editing) {
                await api.put(`/api/grados/${editing.id}`, form)
            } else {
                await api.post('/api/grados', form)
            }
            setShowForm(false)
            load()
        } catch (e) {
            alert('No se pudo guardar el grado')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-50 p-2 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Grados</h2>
                        <p className="text-sm text-slate-500">Crea y administra los grados</p>
                    </div>
                </div>
                <button
                    onClick={openNew}
                    className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-500"
                >
                    <Plus className="w-4 h-4" /> Nuevo grado
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Nivel</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Año</th>
                        <th className="px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {grados.map((g) => (
                        <tr key={g.id} className="border-t border-slate-100 hover:bg-slate-50">
                            <td className="px-6 py-3 text-sm text-slate-700">{g.id}</td>
                            <td className="px-6 py-3 text-sm text-slate-900">{g.nombre}</td>
                            <td className="px-6 py-3 text-sm text-slate-700">{g.nivel}</td>
                            <td className="px-6 py-3 text-sm text-slate-700">{g.anio}</td>
                            <td className="px-6 py-3 text-right">
                                <button
                                    onClick={() => openEdit(g)}
                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm"
                                >
                                    <Pencil className="w-4 h-4" /> Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {grados.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-6 text-center text-slate-400">
                                No hay grados
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editing ? 'Editar grado' : 'Nuevo grado'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input
                                    value={form.nombre}
                                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nivel</label>
                                <input
                                    value={form.nivel}
                                    onChange={(e) => setForm((f) => ({ ...f, nivel: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Año</label>
                                <input
                                    type="number"
                                    value={form.anio}
                                    onChange={(e) => setForm((f) => ({ ...f, anio: Number(e.target.value) }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

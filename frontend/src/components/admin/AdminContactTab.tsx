// src/components/admin/AdminContactTab.tsx
import { useEffect, useState } from 'react'
import { Inbox, CheckCircle2, Clock } from 'lucide-react'
import api from '../../services/api'

interface Contacto {
    id: number
    nombre: string
    email: string
    telefono: string
    mensaje: string
    fecha: string
    atendido: boolean
}

export default function AdminContactTab() {
    const [contactos, setContactos] = useState<Contacto[]>([])
    const [loading, setLoading] = useState(false)

    const load = () => {
        setLoading(true)
        api
            .get('/api/contacto')
            .then((res) => setContactos(res.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, [])

    const marcarAtendido = async (id: number) => {
        try {
            await api.put(`/api/contacto/${id}/atender`)
            load()
        } catch (e) {
            alert('No se pudo marcar como atendido')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                    <Inbox className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Mensajes de contacto</h2>
                    <p className="text-sm text-slate-500">Mensajes enviados desde el formulario público</p>
                </div>
            </div>

            {loading ? (
                <div className="p-6">Cargando mensajes...</div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {contactos.map((c) => (
                        <div key={c.id} className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{c.nombre}</h3>
                                    <p className="text-sm text-slate-500">
                                        {c.email} {c.telefono ? `• ${c.telefono}` : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {c.fecha ? new Date(c.fecha).toLocaleString() : ''}
                  </span>
                                    {c.atendido ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      Atendido
                    </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                      <Clock className="w-4 h-4" />
                      Pendiente
                    </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-slate-700">{c.mensaje}</p>
                            {!c.atendido && (
                                <button
                                    onClick={() => marcarAtendido(c.id)}
                                    className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Marcar atendido
                                </button>
                            )}
                        </div>
                    ))}
                    {contactos.length === 0 && (
                        <div className="px-6 py-6 text-center text-slate-400">No hay mensajes</div>
                    )}
                </div>
            )}
        </div>
    )
}

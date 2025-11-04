// src/components/ContactForm.tsx
import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'

export default function ContactForm() {
    const [contactForm, setContactForm] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
        type: null,
        message: ''
    })
    const [phoneError, setPhoneError] = useState('')

    // Solo números, máx 8 y mensaje
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorOriginal = e.target.value
        const soloNumeros = valorOriginal.replace(/\D/g, '').slice(0, 8)

        setContactForm((prev) => ({ ...prev, telefono: soloNumeros }))

        // validaciones instantáneas
        if (!soloNumeros) {
            setPhoneError('El teléfono es obligatorio')
        } else if (valorOriginal !== soloNumeros) {
            setPhoneError('Solo se permiten números (máx. 8)')
        } else if (soloNumeros.length < 8) {
            setPhoneError('El teléfono debe tener 8 dígitos')
        } else {
            setPhoneError('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormStatus({ type: null, message: '' })

        // nombre
        if (!contactForm.nombre.trim()) {
            setFormStatus({ type: 'error', message: 'El nombre es requerido' })
            setIsSubmitting(false)
            return
        }
        // email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
            setFormStatus({ type: 'error', message: 'Email inválido' })
            setIsSubmitting(false)
            return
        }
        // teléfono obligatorio
        if (!contactForm.telefono) {
            setPhoneError('El teléfono es obligatorio')
            setFormStatus({ type: 'error', message: 'Revisa el teléfono' })
            setIsSubmitting(false)
            return
        }
        // teléfono de 8 dígitos exactos
        if (contactForm.telefono.length !== 8) {
            setPhoneError('El teléfono debe tener exactamente 8 dígitos')
            setFormStatus({ type: 'error', message: 'Revisa el teléfono' })
            setIsSubmitting(false)
            return
        }
        // mensaje
        if (!contactForm.mensaje.trim()) {
            setFormStatus({ type: 'error', message: 'El mensaje es requerido' })
            setIsSubmitting(false)
            return
        }

        try {
            await api.post('/api/contacto', contactForm)
            setFormStatus({
                type: 'success',
                message: '¡Mensaje enviado con éxito! Nos contactaremos pronto.'
            })
            setContactForm({ nombre: '', email: '', telefono: '', mensaje: '' })
            setPhoneError('')
        } catch (err) {
            setFormStatus({
                type: 'error',
                message: 'Error al enviar el mensaje. Intenta nuevamente.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-t-4 border-blue-600">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-2">
                        Nombre Completo *
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        value={contactForm.nombre}
                        onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                        placeholder="Tu nombre completo"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-lg"
                        placeholder="tu@email.com"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-2">
                        Teléfono *
                    </label>
                    <input
                        id="telefono"
                        type="tel"
                        value={contactForm.telefono}
                        onChange={handlePhoneChange}
                        className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 outline-none transition-all text-lg ${
                            phoneError
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-200'
                        }`}
                        placeholder="00000000"
                        disabled={isSubmitting}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                    {phoneError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {phoneError}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="mensaje" className="block text-sm font-bold text-gray-700 mb-2">
                        Mensaje *
                    </label>
                    <textarea
                        id="mensaje"
                        rows={5}
                        value={contactForm.mensaje}
                        onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-lg"
                        placeholder="¿En qué podemos ayudarte?"
                        disabled={isSubmitting}
                    />
                </div>

                {formStatus.message && (
                    <div
                        className={`flex items-center gap-3 p-5 rounded-xl ${
                            formStatus.type === 'success'
                                ? 'bg-green-50 border-2 border-green-200'
                                : 'bg-red-50 border-2 border-red-200'
                        }`}
                    >
                        {formStatus.type === 'success' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                        <p
                            className={`text-base font-medium ${
                                formStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}
                        >
                            {formStatus.message}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg transform hover:scale-105"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Enviando...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-6 h-6" />
                            <span>Enviar Mensaje</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

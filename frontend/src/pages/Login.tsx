import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, User, Lock, AlertCircle, GraduationCap } from 'lucide-react'
import api from '../services/api'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMsg('')
        setError(false)

        try {
            const { data } = await api.post('/api/auth/login', { username, password })
            console.log('LOGIN RESPONSE:', data)

            // guardamos token
            localStorage.setItem('token', data.token)

            // detectar rol en distintos formatos
            const roleFromBackend =
                data.role ||
                data.rol ||
                (Array.isArray(data.roles) ? data.roles[0] : null) ||
                (Array.isArray(data.authorities) ? data.authorities[0] : null)

            // guardar user en localStorage
            localStorage.setItem(
                'user',
                JSON.stringify({
                    username: data.username ?? username,
                    nombreCompleto: data.nombreCompleto ?? username,
                    role: roleFromBackend,
                })
            )

            setMsg(`¡Bienvenido, ${data.nombreCompleto ?? username}!`)

            // pequeño delay para mostrar mensaje de éxito
            setTimeout(() => {
                // redirigir
                if (roleFromBackend === 'ADMIN') navigate('/dashboard/admin')
                else if (roleFromBackend === 'PROFESOR') navigate('/dashboard/profesor')
                else if (roleFromBackend === 'ALUMNO') navigate('/dashboard/alumno')
                else navigate('/')
            }, 1000)
        } catch (err) {
            console.error(err)
            setError(true)
            setMsg('Credenciales inválidas. Por favor, verifica tus datos.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Colegio Elim
                    </h1>
                    <p className="text-gray-600">
                        Ingresa a tu cuenta para continuar
                    </p>
                </div>

                {/* Card del formulario */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo de usuario */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Campo de contraseña */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Mensajes de error o éxito */}
                        {msg && (
                            <div
                                className={`flex items-center gap-2 p-4 rounded-lg ${
                                    error
                                        ? 'bg-red-50 border border-red-200'
                                        : 'bg-green-50 border border-green-200'
                                }`}
                            >
                                {error && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                                <p className={`text-sm ${error ? 'text-red-800' : 'text-green-800'}`}>
                                    {msg}
                                </p>
                            </div>
                        )}

                        {/* Botón de envío */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Iniciando sesión...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Iniciar Sesión</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer del formulario */}
                    <div className="mt-6 text-center">
                        <a
                            href="#"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                        </a>
                    </div>
                </div>

                {/* Footer general */}
                <p className="text-center text-sm text-gray-600 mt-8">
                    © 2024 Colegio Elim. Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}
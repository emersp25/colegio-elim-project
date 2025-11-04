import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoElim from '../assets/Logo_Elim.png'

type UserLS = {
    role: 'ADMIN' | 'PROFESOR' | 'ALUMNO' | string
    nombreCompleto?: string
}

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserLS | null>(null)
    const location = useLocation()
    const navigate = useNavigate()

    const isDashboard = location.pathname.startsWith('/dashboard')

    // leer usuario cada vez que cambie la ruta
    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) setCurrentUser(JSON.parse(userStr))
        else setCurrentUser(null)
    }, [location])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const goToSection = (id: string) => {
        if (location.pathname === '/') {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
            setIsMenuOpen(false)
        } else {
            navigate('/', { state: { scrollTo: id } })
            setIsMenuOpen(false)
        }
    }

    // link al dashboard según rol
    const dashboardPath =
        currentUser?.role === 'ADMIN'
            ? '/dashboard/admin'
            : currentUser?.role === 'PROFESOR'
                ? '/dashboard/profesor'
                : currentUser?.role === 'ALUMNO'
                    ? '/dashboard/alumno'
                    : null

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 border-b-4 border-blue-600">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => {
                            if (isDashboard) navigate('/')
                            else goToSection('inicio')
                        }}
                    >
                        <img
                            src={logoElim}
                            alt="Logo Colegio Elim"
                            className="h-14 w-14 object-contain hover:scale-110 transition-transform duration-300"
                        />
                        <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                Colegio Elim
              </span>
                            <p className="text-xs text-gray-600 font-medium">Estudios Avanzados</p>
                        </div>
                    </div>

                    {/* DESKTOP */}
                    {!isDashboard ? (
                        // ====== BARRA PÚBLICA ======
                        <div className="hidden md:flex items-center gap-6">
                            <button onClick={() => goToSection('inicio')} className="nav-link">
                                Inicio
                            </button>
                            <button onClick={() => goToSection('servicios')} className="nav-link">
                                Servicios
                            </button>
                            <button onClick={() => goToSection('mision')} className="nav-link">
                                Misión
                            </button>
                            <button onClick={() => goToSection('vision')} className="nav-link">
                                Visión
                            </button>
                            <button onClick={() => goToSection('contacto')} className="nav-link">
                                Contacto
                            </button>

                            {currentUser ? (
                                <>
                                    {dashboardPath && (
                                        <button
                                            onClick={() => navigate(dashboardPath)}
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
                                        >
                                            Mi panel
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-700 transition"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    ) : (
                        // ====== BARRA EN DASHBOARD ======
                        <div className="hidden md:flex items-center gap-4">
                            <button onClick={() => navigate('/')} className="nav-link">
                                Inicio
                            </button>
                            {dashboardPath && (
                                <button
                                    onClick={() => navigate(dashboardPath)}
                                    className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
                                >
                                    Mi panel
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-700 transition"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}

                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setIsMenuOpen((p) => !p)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-7 h-7 text-blue-600" /> : <Menu className="w-7 h-7 text-blue-600" />}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        {!isDashboard ? (
                            <div className="flex flex-col gap-4">
                                <button onClick={() => goToSection('inicio')} className="mobile-link">
                                    Inicio
                                </button>
                                <button onClick={() => goToSection('servicios')} className="mobile-link">
                                    Servicios
                                </button>
                                <button onClick={() => goToSection('mision')} className="mobile-link">
                                    Misión
                                </button>
                                <button onClick={() => goToSection('vision')} className="mobile-link">
                                    Visión
                                </button>
                                <button onClick={() => goToSection('contacto')} className="mobile-link">
                                    Contacto
                                </button>

                                {currentUser ? (
                                    <>
                                        {dashboardPath && (
                                            <button
                                                onClick={() => {
                                                    navigate(dashboardPath)
                                                    setIsMenuOpen(false)
                                                }}
                                                className="mobile-link"
                                            >
                                                Mi panel
                                            </button>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            navigate('/login')
                                            setIsMenuOpen(false)
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2.5 rounded-full font-bold"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        navigate('/')
                                        setIsMenuOpen(false)
                                    }}
                                    className="mobile-link"
                                >
                                    Inicio
                                </button>
                                {dashboardPath && (
                                    <button
                                        onClick={() => {
                                            navigate(dashboardPath)
                                            setIsMenuOpen(false)
                                        }}
                                        className="mobile-link"
                                    >
                                        Mi panel
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    )
}
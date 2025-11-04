// src/components/Footer.tsx
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logoElim from '../assets/Logo_Elim.png'

export default function Footer() {
    const navigate = useNavigate()

    const scrollTo = (id: string) => {
        // lo mismo que en navbar: si no estás en / te manda
        navigate('/', { state: { scrollTo: id } })
    }

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-16 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img src={logoElim} alt="Logo Colegio Elim" className="h-14 w-14 object-contain" />
                            <div>
                                <span className="text-2xl font-bold text-white">Colegio Elim</span>
                                <p className="text-sm text-blue-200">Estudios Avanzados</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Formando líderes con excelencia académica y valores cristianos desde 1998.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-6 text-yellow-300">Enlaces Rápidos</h3>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => scrollTo('inicio')} className="text-black hover:text-gray-700 transition-colors hover:translate-x-2 inline-block">
                                    → Inicio
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo('servicios')} className="text-black hover:text-gray-700 transition-colors hover:translate-x-2 inline-block">
                                    → Servicios
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo('mision')} className="text-black hover:text-gray-700 transition-colors hover:translate-x-2 inline-block">
                                    → Misión y Visión
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/login')} className="text-black hover:text-gray-700 transition-colors hover:translate-x-2 inline-block">
                                    → Plataforma Académica
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-6 text-green-300">Contacto</h3>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                                <span>San Lucas Sacatepéquez</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                                <span>Tel: +502 5350-9570</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                                <span>informacionelim@gmail.com</span>
                            </li>
                        </ul>
                        <div className="flex gap-4 mt-6">
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg transition-all transform hover:scale-110"
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg transition-all transform hover:scale-110"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-base">© 2024 Colegio Elim. Todos los derechos reservados.</p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">
                            Política de Privacidad
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Términos y Condiciones
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

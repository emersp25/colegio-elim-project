// src/pages/Landing.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ContactForm from '../components/ContactForm'
import PhotoCarousel from '../components/PhotoCarousel'
import logoElim from '../assets/Logo_Elim.png'
import prePrimaria from '../assets/pre_primaria.jpg'
import PrimariaNiños from '../assets/primaria.jpg'
import Basicos from '../assets/basicos.jpg'
import Diversificado from '../assets/diver.jpg'
import instalaciones from '../assets/instalaciones.jpg'
import { Target, Eye, CheckCircle, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'

export default function Landing() {
    const location = useLocation()

    // si navbar mandó { state: { scrollTo: 'servicios' } }
    useEffect(() => {
        if (location.state && (location.state as any).scrollTo) {
            const id = (location.state as any).scrollTo as string
            const el = document.getElementById(id)
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' })
                }, 200) // pequeño delay por la navbar fija
            }
        }
    }, [location])

    const servicios = [
        {
            title: 'Pre Primaria',
            description: 'Educación inicial para niños de 4 a 6 años con metodología lúdica y desarrollo integral.',
            color: 'from-yellow-400 to-amber-500',
            image: prePrimaria,
        },
        {
            title: 'Primaria',
            description: 'Formación académica sólida de 1ro a 6to grado con enfoque en valores y excelencia.',
            color: 'from-blue-500 to-blue-600',
            image: PrimariaNiños,
        },
        {
            title: 'Básicos',
            description: 'Ciclo básico con énfasis en ciencias, matemáticas y desarrollo de habilidades críticas.',
            color: 'from-green-500 to-emerald-600',
            image: Basicos,
        },
        {
            title: 'Diversificado',
            description: 'Preparación universitaria con carreras técnicas y bachillerato en ciencias y letras.',
            color: 'from-red-500 to-red-600',
            image: Diversificado,
        },
    ]

    // Carrusel
    const carouselImages = [
        {
            src: prePrimaria,
            alt: 'Pre primaria',
            caption: 'Aprendiendo con amor y juegos',
        },
        {
            src: PrimariaNiños,
            alt: 'Primaria',
            caption: 'Formación integral y valores cristianos',
        },
        {
            src: Basicos,
            alt: 'Básicos',
            caption: 'Desarrollo académico y tecnológico',
        },
        {
            src: Diversificado,
            alt: 'Diversificado',
            caption: 'Listos para la universidad',
        },
        {
            src: instalaciones,
            alt: 'instalaciones',
            caption: 'Instalaciones modernas y seguras',
        },
    ]

    return (
        <main className="pt-20 bg-white">
            {/* hero */}
            <section
                id="inicio"
                className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 py-24 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <div className="mb-6 inline-block">
                            <img src={logoElim} alt="Logo Colegio Elim" className="h-32 w-32 mx-auto drop-shadow-2xl" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
                            Liceo Cristiano de
                            <br />
                            <span className="text-yellow-300">Estudios Avanzados</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-50 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Formando líderes del mañana con excelencia académica, valores cristianos y compromiso social
                        </p>
                    </div>

                    {/* 👇 carrusel agregado debajo del texto del hero */}
                    <div className="mt-10">
                        <PhotoCarousel images={carouselImages} autoPlay interval={5000} />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* servicios */}
            <section id="servicios" className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                Nuestros Niveles Educativos
              </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Ofrecemos educación de calidad en todos los niveles académicos con metodología cristiana
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {servicios.map((s, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border-2 border-gray-100"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={s.image}
                                        alt={s.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${s.color} opacity-60`} />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">{s.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 leading-relaxed">{s.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* misión */}
            <section id="mision" className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 px-5 py-2.5 rounded-full mb-6">
                                <Target className="w-6 h-6 text-blue-600" />
                                <span className="text-blue-700 font-bold text-lg">Nuestra Misión</span>
                            </div>
                            <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Formando el Futuro
                </span>
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                Proporcionar una educación integral de excelencia que desarrolle las capacidades intelectuales, espirituales,
                                físicas y sociales de nuestros estudiantes.
                            </p>
                        </div>
                        <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-blue-100">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-blue-600 mb-2">25+</div>
                                    <div className="text-gray-600 font-semibold">Años de Experiencia</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-green-600 mb-2">400+</div>
                                    <div className="text-gray-600 font-semibold">Estudiantes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-yellow-500 mb-2">30+</div>
                                    <div className="text-gray-600 font-semibold">Profesores</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-red-500 mb-2">98%</div>
                                    <div className="text-gray-600 font-semibold">Satisfacción</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* visión */}
            <section id="vision" className="py-20 bg-gradient-to-br from-white via-yellow-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="bg-white rounded-3xl p-10 border-4 border-yellow-200 shadow-2xl">
                                <h3 className="text-3xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                    Nuestros Valores
                  </span>
                                </h3>
                                <ul className="space-y-5">
                                    {['Excelencia', 'Integridad', 'Respeto', 'Compromiso'].map((v) => (
                                        <li key={v} className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <strong className="text-gray-900 text-lg">{v}:</strong>
                                                <span className="text-gray-600"> Vivimos este valor cada día.</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 bg-red-100 px-5 py-2.5 rounded-full mb-6">
                                <Eye className="w-6 h-6 text-red-600" />
                                <span className="text-red-700 font-bold text-lg">Nuestra Visión</span>
                            </div>
                            <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  Liderando la Educación
                </span>
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Ser reconocidos como la institución educativa líder en Guatemala, destacada por su excelencia académica y
                                formación en valores cristianos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* contacto */}
            <section id="contacto" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                Contáctanos
              </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl p-8 flex gap-5 items-start">
                                <div className="bg-blue-100 p-4 rounded-xl">
                                    <MapPin className="w-7 h-7 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl mb-2">Dirección</h3>
                                    <p className="text-gray-600 text-lg">San Lucas Sacatepéquez</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-xl p-8 flex gap-5 items-start">
                                <div className="bg-green-100 p-4 rounded-xl">
                                    <Phone className="w-7 h-7 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl mb-2">Teléfono</h3>
                                    <p className="text-gray-600 text-lg">+502 5350-9570</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-xl p-8 flex gap-5 items-start">
                                <div className="bg-yellow-100 p-4 rounded-xl">
                                    <Mail className="w-7 h-7 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl mb-2">Email</h3>
                                    <p className="text-gray-600 text-lg">informacionelim@gmail.com</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 via-green-600 to-blue-600 rounded-2xl shadow-xl p-8">
                                <h3 className="font-bold text-white text-xl mb-6">Síguenos</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://www.facebook.com/"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all transform hover:scale-110"
                                    >
                                        <Facebook className="w-7 h-7" />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all transform hover:scale-110"
                                    >
                                        <Instagram className="w-7 h-7" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* formulario */}
                        <ContactForm />
                    </div>
                </div>
            </section>
        </main>
    )
}

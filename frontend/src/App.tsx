import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardProfesor from './pages/DashboardProfesor'
import DashboardAlumno from './pages/DashboardAlumno'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

function AppRoutes() {
    const location = useLocation()
    const isDashboard = location.pathname.startsWith('/dashboard')

    return (
        <>
            <NavBar />

            <div className="pt-20 min-h-screen bg-white">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/dashboard/admin"
                        element={
                            <PrivateRoute allowedRoles={['ADMIN']}>
                                <DashboardAdmin />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dashboard/profesor"
                        element={
                            <PrivateRoute allowedRoles={['PROFESOR']}>
                                <DashboardProfesor />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dashboard/alumno"
                        element={
                            <PrivateRoute allowedRoles={['ALUMNO']}>
                                <DashboardAlumno />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>

            {!isDashboard && <Footer />}
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
}

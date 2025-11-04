import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'

export default function App() {
    return (
        <BrowserRouter>
            <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/">Inicio</Link>
                    <Link to="/login">Login</Link>
                </nav>
            </header>
            <main style={{ padding: '1rem' }}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

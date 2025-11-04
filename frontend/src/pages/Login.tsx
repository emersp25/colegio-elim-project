import { useState } from 'react'
import api from '../services/api'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/auth/login', { username, password })
            localStorage.setItem('token', data.token)
            setMsg(`Bienvenido, ${data.nombreCompleto} (${data.rol})`)
        } catch {
            setMsg('Credenciales inválidas')
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 320 }}>
            <h2>Login</h2>
            <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Ingresar</button>
            {msg && <small>{msg}</small>}
        </form>
    )
}

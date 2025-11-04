import { useState } from 'react'
import api from '../services/api'

export default function Landing() {
    const [resp, setResp] = useState<string>('')

    const probarBackend = async () => {
        try {
            const { data } = await api.get('/ping')
            setResp(JSON.stringify(data))
        } catch (e) {
            setResp('Error contactando backend')
        }
    }

    return (
        <section>
            <h1>Colegio Elim</h1>
            <p>Plataforma académica — Landing pública.</p>

            <button onClick={probarBackend} style={{marginTop: '1rem'}}>
                Probar backend
            </button>

            {resp && (
                <pre style={{background:'#f7f7f7', padding:'0.75rem', marginTop:'0.5rem'}}>
          {resp}
        </pre>
            )}
        </section>
    )
}

import axios from 'axios'

/*const api = axios.create({
    baseURL: 'http://localhost:8080',
})*/

const api = axios.create({
    baseURL: 'http://93.127.139.74:8080/ELIM',
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// si el token no sirve, lo sacamos
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export default api

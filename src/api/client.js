import axios from 'axios'

// En producción (Android/Capacitor), el proxy de Vite no existe.
// Usamos las URLs reales directamente.
const isProd = import.meta.env.PROD

const USERS_URL         = isProd ? 'https://usuarios.vozciudadana.duckdns.org'      : ''
const REPORTS_URL       = isProd ? 'https://reportes.vozciudadana.duckdns.org'       : ''
const NOTIFICATIONS_URL = isProd ? 'https://notificaciones.vozciudadana.duckdns.org' : ''

function makeClient(baseURL) {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
  })
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )
  return instance
}

export const usersClient         = makeClient(USERS_URL)
export const reportsClient       = makeClient(REPORTS_URL)
export const notificationsClient = makeClient(NOTIFICATIONS_URL)
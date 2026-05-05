import axios from 'axios'

/**
 * Voz Ciudadana — tres microservicios FastAPI:
 *   usersClient        → Puerto 65000  (Usuarios  - MySQL)
 *   reportsClient      → Puerto 65001  (Reportes  - MongoDB)
 *   notificationsClient → Puerto 8002   (Notificaciones - MongoDB)
 */

const USERS_URL        = ''   // el proxy de Vite redirige /users → puerto 65000
const REPORTS_URL      = ''   // el proxy de Vite redirige /reports → puerto 65001
const NOTIFICATIONS_URL = ''  // el proxy de Vite redirige /notifications → puerto 8002

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

export const usersClient        = makeClient(USERS_URL)
export const reportsClient      = makeClient(REPORTS_URL)
export const notificationsClient = makeClient(NOTIFICATIONS_URL)
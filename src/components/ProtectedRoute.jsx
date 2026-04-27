import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

/**
 * ProtectedRoute - Componente que protege rutas requiriendo autenticación
 * Redirige a /login si no hay token válido
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser()
  
  if (!isAuthenticated()) {
    // Redirigir a login si no está autenticado
    return <Navigate to="/login" replace />
  }
  
  return children
}
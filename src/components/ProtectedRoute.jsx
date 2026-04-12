import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function ProtectedRoute({ children }) {
  const { usuario } = useUser()
  if (!usuario) return <Navigate to="/login" replace />
  return children
}
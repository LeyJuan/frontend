import { useConteoNoLeidas } from '../hooks/useNotificaciones'
import './NotificationBadge.css'

/**
 * Componente para mostrar un badge con el conteo de notificaciones no leídas
 */
export default function NotificationBadge({ className = '' }) {
  const conteo = useConteoNoLeidas()

  if (conteo === 0) return null

  return (
    <div className={`notification-badge ${className}`}>
      {conteo > 99 ? '99+' : conteo}
    </div>
  )
}

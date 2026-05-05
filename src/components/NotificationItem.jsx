import { useNotificaciones } from '../hooks/useNotificaciones'
import './NotificationItem.css'

/**
 * Componente para mostrar una notificación individual
 */
export default function NotificationItem({ notificacion, onMarkAsRead, onDelete }) {
  const { marcarLeida, eliminar } = useNotificaciones()

  const handleMarkAsRead = async () => {
    try {
      await marcarLeida(notificacion.id_notificacion)
      onMarkAsRead?.(notificacion.id_notificacion)
    } catch (error) {
      console.error('Error al marcar como leída:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await eliminar(notificacion.id_notificacion)
      onDelete?.(notificacion.id_notificacion)
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    const date = new Date(fecha)
    const ahora = new Date()
    const diferencia = ahora - date

    const minutos = Math.floor(diferencia / 60000)
    const horas = Math.floor(diferencia / 3600000)
    const dias = Math.floor(diferencia / 86400000)

    if (minutos < 1) return 'Hace un momento'
    if (minutos < 60) return `Hace ${minutos} min`
    if (horas < 24) return `Hace ${horas}h`
    if (dias < 7) return `Hace ${dias}d`

    return date.toLocaleDateString('es-ES')
  }

  const getIconoTipo = (tipo) => {
    const iconos = {
      'reportes.crear': '📝',
      'reportes.actualizar': '✏️',
      'reportes.comentario': '💬',
      'notificacion.create': '🔔',
      'notificacion.report_status_change': '📊',
    }
    return iconos[tipo] || '📢'
  }

  return (
    <div className={`notification-item ${notificacion.leida ? 'read' : 'unread'}`}>
      <div className="notification-header">
        <span className="notification-icon">{getIconoTipo(notificacion.tipo_notificacion)}</span>
        <span className="notification-title">{notificacion.titulo}</span>
        <span className="notification-time">{formatearFecha(notificacion.fecha_creacion)}</span>
      </div>

      <p className="notification-message">{notificacion.mensaje}</p>

      {notificacion.estado_reporte && (
        <div className="notification-status">
          <small>Estado: <strong>{notificacion.estado_reporte}</strong></small>
        </div>
      )}

      <div className="notification-actions">
        {!notificacion.leida && (
          <button 
            className="btn-mark-read"
            onClick={handleMarkAsRead}
            title="Marcar como leída"
          >
            ✓ Marcar como leída
          </button>
        )}
        <button 
          className="btn-delete"
          onClick={handleDelete}
          title="Eliminar"
        >
          ✕ Eliminar
        </button>
      </div>
    </div>
  )
}

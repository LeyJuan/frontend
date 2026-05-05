import { useNotifications } from '../context/NotificationsContext'

/**
 * Hook personalizado para usar notificaciones en componentes
 * Proporciona acceso completo al contexto de notificaciones
 */
export function useNotificaciones() {
  return useNotifications()
}

/**
 * Hook para obtener solo las notificaciones no leídas
 */
export function useNotificacionesNoLeidas() {
  const { noLeidas, conteoNoLeidas } = useNotifications()
  return { noLeidas, conteo: conteoNoLeidas }
}

/**
 * Hook para obtener el conteo de notificaciones no leídas
 */
export function useConteoNoLeidas() {
  const { conteoNoLeidas } = useNotifications()
  return conteoNoLeidas
}

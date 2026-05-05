import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useUser } from './UserContext'
import * as notificacionesAPI from '../api/notificaciones'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { usuario } = useUser()
  const [notificaciones, setNotificaciones] = useState([])
  const [noLeidas, setNoLeidas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pollInterval, setPollInterval] = useState(null)

  /**
   * Cargar todas las notificaciones del usuario
   */
  const cargarNotificaciones = useCallback(async () => {
    if (!usuario?.user_id) return

    try {
      setLoading(true)
      setError(null)
      const data = await notificacionesAPI.getNotificaciones(usuario.user_id)
      setNotificaciones(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar notificaciones:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [usuario?.user_id])

  /**
   * Cargar notificaciones no leídas
   */
  const cargarNoLeidas = useCallback(async () => {
    if (!usuario?.user_id) return

    try {
      const data = await notificacionesAPI.getNotificacionesNoLeidas(usuario.user_id)
      setNoLeidas(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar notificaciones no leídas:', err)
    }
  }, [usuario?.user_id])

  /**
   * Recargar ambas listas de notificaciones
   */
  const recargar = useCallback(async () => {
    await Promise.all([cargarNotificaciones(), cargarNoLeidas()])
  }, [cargarNotificaciones, cargarNoLeidas])

  /**
   * Marcar una notificación como leída
   */
  const marcarLeida = useCallback(
    async (notificationId) => {
      try {
        await notificacionesAPI.marcarComoLeida(notificationId)
        // Actualizar lista local
        setNotificaciones((prev) =>
          prev.map((n) =>
            n.id_notificacion === notificationId ? { ...n, leida: true } : n
          )
        )
        setNoLeidas((prev) =>
          prev.filter((n) => n.id_notificacion !== notificationId)
        )
      } catch (err) {
        console.error('Error al marcar como leída:', err)
        throw err
      }
    },
    []
  )

  /**
   * Marcar todas las notificaciones como leídas
   */
  const marcarTodasLeidas = useCallback(async () => {
    if (!usuario?.user_id) return

    try {
      await notificacionesAPI.marcarTodasComoLeidas(usuario.user_id)
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
      setNoLeidas([])
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err)
      throw err
    }
  }, [usuario?.user_id])

  /**
   * Eliminar una notificación
   */
  const eliminar = useCallback(
    async (notificationId) => {
      try {
        await notificacionesAPI.eliminarNotificacion(notificationId)
        setNotificaciones((prev) =>
          prev.filter((n) => n.id_notificacion !== notificationId)
        )
        setNoLeidas((prev) =>
          prev.filter((n) => n.id_notificacion !== notificationId)
        )
      } catch (err) {
        console.error('Error al eliminar notificación:', err)
        throw err
      }
    },
    []
  )

  /**
   * Eliminar todas las notificaciones
   */
  const eliminarTodas = useCallback(async () => {
    if (!usuario?.user_id) return

    try {
      await notificacionesAPI.eliminarTodasNotificaciones(usuario.user_id)
      setNotificaciones([])
      setNoLeidas([])
    } catch (err) {
      console.error('Error al eliminar todas:', err)
      throw err
    }
  }, [usuario?.user_id])

  /**
   * Iniciar polling automático para nuevas notificaciones
   */
  const iniciarPolling = useCallback((intervalo = 30000) => {
    if (pollInterval) clearInterval(pollInterval)

    const nuevoIntervalo = setInterval(() => {
      recargar()
    }, intervalo)

    setPollInterval(nuevoIntervalo)
  }, [pollInterval, recargar])

  /**
   * Detener polling automático
   */
  const detenerPolling = useCallback(() => {
    if (pollInterval) {
      clearInterval(pollInterval)
      setPollInterval(null)
    }
  }, [pollInterval])

  // Cargar notificaciones al autenticar
  useEffect(() => {
    if (usuario?.isAuthenticated) {
      recargar()
      // Iniciar polling cada 30 segundos
      iniciarPolling(30000)
    }

    return () => {
      detenerPolling()
    }
  }, [usuario?.isAuthenticated, usuario?.user_id])

  const value = {
    notificaciones,
    noLeidas,
    loading,
    error,
    cargarNotificaciones,
    cargarNoLeidas,
    recargar,
    marcarLeida,
    marcarTodasLeidas,
    eliminar,
    eliminarTodas,
    iniciarPolling,
    detenerPolling,
    conteoNoLeidas: noLeidas.length,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

/**
 * Hook para usar el contexto de notificaciones
 */
export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider')
  }
  return context
}

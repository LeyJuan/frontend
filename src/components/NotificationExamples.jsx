/**
 * Ejemplos avanzados de uso de notificaciones
 * Este archivo contiene patrones comunes para trabajar con notificaciones
 */

import { useEffect, useState } from 'react'
import { useNotificaciones } from '../hooks/useNotificaciones'

/**
 * Ejemplo 1: Componente que se actualiza cuando hay nuevas notificaciones
 */
export function NotificationAlert() {
  const { noLeidas, conteoNoLeidas } = useNotificaciones()
  const [mostrarAlerta, setMostrarAlerta] = useState(false)

  useEffect(() => {
    // Mostrar alerta si hay notificaciones nuevas
    if (conteoNoLeidas > 0) {
      setMostrarAlerta(true)
      // Cerrar alerta después de 5 segundos
      const timer = setTimeout(() => setMostrarAlerta(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [conteoNoLeidas])

  if (!mostrarAlerta) return null

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
      <p className="font-semibold">🔔 {conteoNoLeidas} notificación{conteoNoLeidas !== 1 ? 'es' : ''} nueva{conteoNoLeidas !== 1 ? 's' : ''}</p>
      <p className="text-sm text-blue-100">{noLeidas[0]?.titulo}</p>
    </div>
  )
}

/**
 * Ejemplo 2: Panel flotante de notificaciones recientes
 */
export function NotificationPanel({ limit = 3 }) {
  const { noLeidas, marcarLeida } = useNotificaciones()
  const recientes = noLeidas.slice(0, limit)

  if (recientes.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden z-40">
      <div className="bg-red-600 text-white px-4 py-3 font-bold">
        Notificaciones Recientes ({recientes.length})
      </div>
      <div className="overflow-y-auto max-h-80">
        {recientes.map((notif) => (
          <div
            key={notif.id_notificacion}
            className="border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => marcarLeida(notif.id_notificacion)}
          >
            <p className="font-semibold text-sm text-gray-900">{notif.titulo}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.mensaje}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Ejemplo 3: Statisticas de notificaciones
 */
export function NotificationStats() {
  const { notificaciones, noLeidas } = useNotificaciones()
  const leidas = notificaciones.length - noLeidas.length
  const porcentajeLeidas = notificaciones.length > 0 
    ? Math.round((leidas / notificaciones.length) * 100) 
    : 0

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
      <div className="text-center">
        <p className="text-2xl font-bold text-red-600">{notificaciones.length}</p>
        <p className="text-xs text-gray-600">Total</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-orange-600">{noLeidas.length}</p>
        <p className="text-xs text-gray-600">Sin leer</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{porcentajeLeidas}%</p>
        <p className="text-xs text-gray-600">Leídas</p>
      </div>
    </div>
  )
}

/**
 * Ejemplo 4: Filtro personalizado de notificaciones por tipo
 */
export function NotificationFilter() {
  const { notificaciones } = useNotificaciones()
  const [filtroTipo, setFiltroTipo] = useState(null)

  const tipos = [...new Set(notificaciones.map(n => n.tipo_notificacion))]
  const filtradas = filtroTipo 
    ? notificaciones.filter(n => n.tipo_notificacion === filtroTipo)
    : notificaciones

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFiltroTipo(null)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all ${
            filtroTipo === null
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({notificaciones.length})
        </button>
        {tipos.map(tipo => {
          const count = notificaciones.filter(n => n.tipo_notificacion === tipo).length
          return (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                filtroTipo === tipo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tipo} ({count})
            </button>
          )
        })}
      </div>

      <div className="space-y-2">
        {filtradas.map(notif => (
          <div key={notif.id_notificacion} className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="font-semibold">{notif.titulo}</p>
            <p className="text-sm text-gray-600">{notif.mensaje}</p>
            <span className="inline-block mt-2 text-xs bg-gray-300 text-gray-800 px-2 py-1 rounded">
              {notif.tipo_notificacion}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Ejemplo 5: Notificación modal/toast
 */
export function useNotificationToast() {
  const { noLeidas } = useNotificaciones()
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    // Crear un toast para cada notificación nueva
    if (noLeidas.length > 0) {
      const ultimaNotif = noLeidas[0]
      const toast = {
        id: ultimaNotif.id_notificacion,
        titulo: ultimaNotif.titulo,
        mensaje: ultimaNotif.mensaje,
      }

      setToasts(prev => [toast, ...prev])

      // Remover después de 4 segundos
      const timer = setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [noLeidas.length])

  return toasts
}

/**
 * Ejemplo 6: Componente de búsqueda en notificaciones
 */
export function SearchNotifications() {
  const { notificaciones } = useNotificaciones()
  const [busqueda, setBusqueda] = useState('')

  const resultados = notificaciones.filter(n =>
    n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    n.mensaje.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar notificaciones..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <div className="mt-4 space-y-2">
        {resultados.length === 0 && busqueda && (
          <p className="text-center text-gray-500">No se encontraron resultados</p>
        )}
        {resultados.map(notif => (
          <div key={notif.id_notificacion} className="p-3 bg-white border border-gray-200 rounded">
            <p className="font-semibold">{notif.titulo}</p>
            <p className="text-sm text-gray-600">{notif.mensaje}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Ejemplo 7: Timeline de notificaciones
 */
export function NotificationTimeline() {
  const { notificaciones } = useNotificaciones()

  // Agrupar por fecha
  const agrupadas = notificaciones.reduce((acc, notif) => {
    const fecha = new Date(notif.fecha_creacion).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    if (!acc[fecha]) acc[fecha] = []
    acc[fecha].push(notif)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(agrupadas).map(([fecha, notifs]) => (
        <div key={fecha}>
          <h3 className="font-bold text-sm text-gray-600 mb-3">{fecha}</h3>
          <div className="space-y-2 border-l-2 border-red-300 pl-4">
            {notifs.map(notif => (
              <div key={notif.id_notificacion} className="pb-4">
                <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[19px] mt-1.5" />
                <p className="font-semibold text-sm">{notif.titulo}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notif.fecha_creacion).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

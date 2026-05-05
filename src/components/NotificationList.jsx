import { useState } from 'react'
import NotificationItem from './NotificationItem'
import { useNotificaciones } from '../hooks/useNotificaciones'
import './NotificationList.css'

/**
 * Componente para mostrar la lista de notificaciones
 */
export default function NotificationList({ filtrarNoLeidas = false, debug = false }) {
  const { notificaciones, noLeidas, loading, error, marcarTodasLeidas, eliminarTodas, recargar } = useNotificaciones()
  const [filtro, setFiltro] = useState(filtrarNoLeidas ? 'noLeidas' : 'todas')

  const mostrar = filtro === 'noLeidas' ? noLeidas : notificaciones

  const handleRecargar = async () => {
    try {
      await recargar()
    } catch (err) {
      console.error('Error al recargar:', err)
    }
  }

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasLeidas()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleEliminarTodas = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
      try {
        await eliminarTodas()
      } catch (err) {
        console.error('Error:', err)
      }
    }
  }

  // Debug info
  if (debug) {
    return (
      <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg space-y-3">
        <h3 className="font-bold text-blue-900">🔍 Debug - Notificaciones</h3>
        
        <div className="bg-white p-3 rounded border border-blue-200 text-sm space-y-1">
          <p><strong>Loading:</strong> {loading ? '⏳ Sí' : '✓ No'}</p>
          <p><strong>Error:</strong> {error ? `❌ ${error}` : '✓ No'}</p>
          <p><strong>Total:</strong> {notificaciones.length} notificaciones</p>
          <p><strong>No leídas:</strong> {noLeidas.length}</p>
        </div>

        {notificaciones.length > 0 && (
          <details className="bg-white p-3 rounded border border-blue-200 text-sm">
            <summary className="cursor-pointer font-semibold text-blue-900">Ver primera notificación (JSON)</summary>
            <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-xs max-h-40">
              {JSON.stringify(notificaciones[0], null, 2)}
            </pre>
          </details>
        )}

        <button 
          onClick={handleRecargar}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded font-semibold"
        >
          🔄 Recargar ahora
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="notification-list-error">
        <p>Error al cargar notificaciones: {error}</p>
        <button onClick={handleRecargar}>Reintentar</button>
      </div>
    )
  }

  return (
    <div className="notification-list">
      <div className="notification-list-header">
        <h2 className="notification-list-title">Notificaciones</h2>
        <button className="btn-refresh" onClick={handleRecargar} title="Recargar">
          🔄
        </button>
      </div>

      {!filtrarNoLeidas && (
        <div className="notification-filters">
          <button 
            className={`filter-btn ${filtro === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas ({notificaciones.length})
          </button>
          <button 
            className={`filter-btn ${filtro === 'noLeidas' ? 'active' : ''}`}
            onClick={() => setFiltro('noLeidas')}
          >
            No leídas ({noLeidas.length})
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm mt-2">Cargando notificaciones...</p>
          </div>
        </div>
      )}

      {!loading && mostrar.length === 0 ? (
        <div className="notification-empty">
          <span className="empty-icon">📭</span>
          <p>
            {filtro === 'noLeidas' 
              ? 'No hay notificaciones por leer' 
              : 'No hay notificaciones'}
          </p>
        </div>
      ) : (
        <>
          <div className="notification-actions-top">
            {noLeidas.length > 0 && (
              <button className="action-btn" onClick={handleMarcarTodasLeidas}>
                ✓ Marcar todas como leídas
              </button>
            )}
            {notificaciones.length > 0 && (
              <button className="action-btn danger" onClick={handleEliminarTodas}>
                🗑️ Eliminar todas
              </button>
            )}
          </div>

          <div className="notification-items">
            {loading && <div className="loading">Cargando...</div>}
            {mostrar.map((notif) => (
              <NotificationItem
                key={notif.id_notificacion}
                notificacion={notif}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

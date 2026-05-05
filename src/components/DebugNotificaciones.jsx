import { useState } from 'react'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { useUser } from '../context/UserContext'

/**
 * Panel de Debug para Notificaciones
 * Muestra información sobre el estado del contexto de notificaciones
 */
export function DebugNotificaciones() {
  const { usuario } = useUser()
  const [mostrar, setMostrar] = useState(true)
  
  const notif = useNotificaciones()

  // Si no está autenticado, no mostrar
  if (!usuario?.isAuthenticated || !mostrar) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg border-2 border-blue-300 p-4 max-w-sm z-50 max-h-96 overflow-y-auto text-sm font-sans">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">
            🔔 Debug Notificaciones
          </h3>
          <button 
            onClick={() => setMostrar(false)}
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>

        <hr className="border-gray-200" />

        {/* Usuario */}
        <div>
          <p className="font-semibold text-gray-700">Usuario:</p>
          <p className="text-gray-600 text-xs ml-2">ID: {usuario?.user_id || 'N/A'}</p>
          <p className="text-gray-600 text-xs ml-2">Email: {usuario?.email || 'N/A'}</p>
        </div>

        {/* Estado de Carga */}
        <div>
          <p className="font-semibold text-gray-700">Estado:</p>
          <div className="ml-2 space-y-1 text-xs">
            <p className={notif.loading ? 'text-blue-600' : 'text-green-600'}>
              {notif.loading ? '🔄 Cargando...' : '✓ No cargando'}
            </p>
            <p className={notif.error ? 'text-red-600' : 'text-green-600'}>
              {notif.error ? `❌ Error: ${notif.error}` : '✓ Sin errores'}
            </p>
          </div>
        </div>

        {/* Conteos */}
        <div>
          <p className="font-semibold text-gray-700">Notificaciones:</p>
          <div className="ml-2 space-y-1 text-xs text-gray-600">
            <p>📊 Total: <strong className="text-lg">{notif.notificaciones.length}</strong></p>
            <p>📭 No leídas: <strong className="text-lg">{notif.noLeidas.length}</strong></p>
            <p>✓ Leídas: <strong>{notif.notificaciones.length - notif.noLeidas.length}</strong></p>
          </div>
        </div>

        {/* Primera Notificación */}
        {notif.notificaciones.length > 0 && (
          <details className="text-xs cursor-pointer">
            <summary className="font-semibold text-gray-700 py-1">
              📄 Primera Notificación (JSON)
            </summary>
            <div className="ml-2 bg-gray-50 p-2 rounded border border-gray-200 max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-words text-gray-600 text-xs">
                {JSON.stringify(notif.notificaciones[0], null, 2)}
              </pre>
            </div>
          </details>
        )}

        {/* Acciones */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">Acciones:</p>
          <div className="space-y-1">
            <button 
              onClick={() => notif.recargar()}
              className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 font-semibold"
            >
              🔄 Recargar
            </button>
            {notif.noLeidas.length > 0 && (
              <button 
                onClick={() => notif.marcarTodasLeidas()}
                className="w-full bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 font-semibold"
              >
                ✓ Marcar leídas ({notif.noLeidas.length})
              </button>
            )}
            {notif.notificaciones.length > 0 && (
              <button 
                onClick={() => {
                  if (window.confirm('¿Eliminar todas las notificaciones?')) {
                    notif.eliminarTodas()
                  }
                }}
                className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 font-semibold"
              >
                🗑️ Eliminar todas
              </button>
            )}
          </div>
        </div>

        {/* URLs de Debug */}
        <div className="pt-2 border-t border-gray-200">
          <p className="font-semibold text-gray-700 text-xs mb-1">🔗 Links:</p>
          <div className="space-y-1 text-xs">
            <a href="/alertas?debug=1" className="text-blue-600 hover:underline block">
              📋 Ver notificaciones (Debug)
            </a>
            <a href="/alertas" className="text-blue-600 hover:underline block">
              📋 Ver notificaciones (Normal)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

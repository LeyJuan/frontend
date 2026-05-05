/**
 * TEST DE NOTIFICACIONES
 * 
 * Este archivo contiene tests manuales y verificaciones para asegurar
 * que la integración de notificaciones está funcionando correctamente.
 * 
 * Cópialo a un componente temporal para verificar cada parte.
 */

import { useEffect } from 'react'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { useUser } from '../context/UserContext'

/**
 * TEST 1: Verificar que el contexto está accesible
 */
export function TestContextoAccesible() {
  try {
    const notif = useNotificaciones()
    const user = useUser()

    if (!notif) throw new Error('Contexto de notificaciones no disponible')
    if (!user) throw new Error('Contexto de usuario no disponible')

    return (
      <div className="p-4 bg-green-100 border border-green-500 rounded">
        <p className="text-green-800">✓ TEST 1: Contextos accesibles</p>
        <p className="text-sm text-green-700">Notificaciones: {Object.keys(notif).length} métodos</p>
        <p className="text-sm text-green-700">Usuario: {user.usuario?.email || 'No autenticado'}</p>
      </div>
    )
  } catch (err) {
    return (
      <div className="p-4 bg-red-100 border border-red-500 rounded">
        <p className="text-red-800">✗ TEST 1 FALLÓ: {err.message}</p>
      </div>
    )
  }
}

/**
 * TEST 2: Verificar que las notificaciones cargan
 */
export function TestCargaDatos() {
  const { notificaciones, noLeidas, loading, error } = useNotificaciones()

  return (
    <div className="p-4 bg-blue-100 border border-blue-500 rounded">
      <p className="text-blue-800">ℹ TEST 2: Carga de datos</p>
      <p className="text-sm text-blue-700">Total: {notificaciones.length}</p>
      <p className="text-sm text-blue-700">No leídas: {noLeidas.length}</p>
      <p className="text-sm text-blue-700">Cargando: {loading ? 'Sí' : 'No'}</p>
      {error && <p className="text-sm text-red-700">Error: {error}</p>}
      {notificaciones.length === 0 && !loading && (
        <p className="text-sm text-yellow-700">⚠ No hay notificaciones (normal si es la primera vez)</p>
      )}
    </div>
  )
}

/**
 * TEST 3: Verificar acciones (marcar/eliminar)
 */
export function TestAcciones() {
  const { noLeidas, marcarLeida, marcarTodasLeidas, eliminar } = useNotificaciones()
  const [testLog, setTestLog] = React.useState([])

  const log = (msg) => setTestLog(p => [...p, msg])

  const handleMarcarPrimera = async () => {
    if (noLeidas.length === 0) {
      log('⚠ No hay notificaciones para marcar')
      return
    }
    try {
      await marcarLeida(noLeidas[0].id_notificacion)
      log('✓ Marcar como leída: OK')
    } catch (err) {
      log(`✗ Error marcar: ${err.message}`)
    }
  }

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasLeidas()
      log('✓ Marcar todas: OK')
    } catch (err) {
      log(`✗ Error marcar todas: ${err.message}`)
    }
  }

  const handleEliminarPrimera = async () => {
    if (noLeidas.length === 0) {
      log('⚠ No hay notificaciones para eliminar')
      return
    }
    try {
      await eliminar(noLeidas[0].id_notificacion)
      log('✓ Eliminar: OK')
    } catch (err) {
      log(`✗ Error eliminar: ${err.message}`)
    }
  }

  return (
    <div className="p-4 bg-purple-100 border border-purple-500 rounded">
      <p className="text-purple-800 font-bold">TEST 3: Acciones</p>
      <div className="flex gap-2 mt-2 flex-wrap">
        <button 
          onClick={handleMarcarPrimera}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Marcar 1ª
        </button>
        <button 
          onClick={handleMarcarTodas}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Marcar Todas
        </button>
        <button 
          onClick={handleEliminarPrimera}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Eliminar 1ª
        </button>
      </div>
      <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
        {testLog.map((log, i) => (
          <p key={i} className="text-sm text-purple-700">{log}</p>
        ))}
      </div>
    </div>
  )
}

/**
 * TEST 4: Verificar polling
 */
export function TestPolling() {
  const { iniciarPolling, detenerPolling } = useNotificaciones()
  const [testLog, setTestLog] = React.useState([])
  const [pollingActivo, setPollingActivo] = React.useState(true)

  useEffect(() => {
    setTestLog(p => [...p, '✓ Polling debería estar activo automáticamente'])
  }, [])

  const handleIniciar = () => {
    try {
      iniciarPolling(15000) // 15 segundos para testing
      setTestLog(p => [...p, '✓ Polling iniciado (cada 15s)'])
      setPollingActivo(true)
    } catch (err) {
      setTestLog(p => [...p, `✗ Error: ${err.message}`])
    }
  }

  const handleDetener = () => {
    try {
      detenerPolling()
      setTestLog(p => [...p, '⊗ Polling detenido'])
      setPollingActivo(false)
    } catch (err) {
      setTestLog(p => [...p, `✗ Error: ${err.message}`])
    }
  }

  return (
    <div className="p-4 bg-orange-100 border border-orange-500 rounded">
      <p className="text-orange-800 font-bold">TEST 4: Polling Automático</p>
      <p className="text-sm text-orange-700 mt-1">
        Estado: {pollingActivo ? '🟢 Activo' : '🔴 Inactivo'}
      </p>
      <div className="flex gap-2 mt-2">
        <button 
          onClick={handleIniciar}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Iniciar
        </button>
        <button 
          onClick={handleDetener}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Detener
        </button>
      </div>
      <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
        {testLog.map((log, i) => (
          <p key={i} className="text-sm text-orange-700">{log}</p>
        ))}
      </div>
    </div>
  )
}

/**
 * TEST 5: Verificar estructura de datos
 */
export function TestEstructuraDatos() {
  const { notificaciones } = useNotificaciones()

  if (notificaciones.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-500 rounded">
        <p className="text-yellow-800">⚠ TEST 5: No hay notificaciones para validar estructura</p>
      </div>
    )
  }

  const primeraNotif = notificaciones[0]
  const camposRequeridos = [
    'id_notificacion',
    'id_usuario',
    'tipo_notificacion',
    'titulo',
    'mensaje',
    'leida',
    'fecha_creacion'
  ]

  const camposFaltantes = camposRequeridos.filter(campo => !(campo in primeraNotif))

  return (
    <div className="p-4 bg-green-100 border border-green-500 rounded">
      <p className="text-green-800 font-bold">TEST 5: Estructura de datos</p>
      <p className="text-sm text-green-700 mt-1">Campos validados: {camposRequeridos.length}</p>
      {camposFaltantes.length === 0 ? (
        <p className="text-sm text-green-700">✓ Todos los campos presentes</p>
      ) : (
        <p className="text-sm text-red-700">✗ Faltan: {camposFaltantes.join(', ')}</p>
      )}
      <details className="text-sm mt-2">
        <summary className="cursor-pointer text-green-700 font-semibold">Ver primero objeto</summary>
        <pre className="mt-1 bg-green-50 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(primeraNotif, null, 2)}
        </pre>
      </details>
    </div>
  )
}

/**
 * TEST COMPLETO - Incluye todos los tests
 */
export function TestsNotificacionesCompleto() {
  const { usuario } = useUser()
  const [testActual, setTestActual] = React.useState('diagnostico')

  if (!usuario?.isAuthenticated) {
    return (
      <div className="p-4 bg-red-100 border border-red-500 rounded">
        <p className="text-red-800">✗ Debes estar autenticado para ejecutar tests</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={() => setTestActual('diagnostico')}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            testActual === 'diagnostico'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Diagnóstico
        </button>
        <button 
          onClick={() => setTestActual('datos')}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            testActual === 'datos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Datos
        </button>
        <button 
          onClick={() => setTestActual('acciones')}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            testActual === 'acciones'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Acciones
        </button>
        <button 
          onClick={() => setTestActual('polling')}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            testActual === 'polling'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Polling
        </button>
        <button 
          onClick={() => setTestActual('estructura')}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            testActual === 'estructura'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Estructura
        </button>
      </div>

      {testActual === 'diagnostico' && (
        <>
          <TestContextoAccesible />
          <TestCargaDatos />
        </>
      )}
      {testActual === 'datos' && <TestCargaDatos />}
      {testActual === 'acciones' && <TestAcciones />}
      {testActual === 'polling' && <TestPolling />}
      {testActual === 'estructura' && <TestEstructuraDatos />}
    </div>
  )
}

export default TestsNotificacionesCompleto

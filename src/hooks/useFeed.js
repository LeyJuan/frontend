import { useState, useEffect, useCallback } from 'react'
import { getReportes } from '../api/reportes'
import { getUsuario   } from '../api/usuarios'
import {
  MOCK_REPORTES,
  MOCK_USUARIOS,
  TIPO_REPORTE,
  resolveEstado,
} from '../mock/data'

/**
 * ─── INTERRUPTOR PRINCIPAL ───────────────────────────────────────
 * true  → usa datos mock (desarrollo sin backend)
 * false → usa la API real (backend corriendo)
 * ─────────────────────────────────────────────────────────────────
 */
const USE_MOCK = false

async function enrichReporte(reporte) {
  const tipo   = TIPO_REPORTE[reporte.tipo_reporte] ?? TIPO_REPORTE[7]
  const estado = resolveEstado(reporte)

  let autor = { nombre: 'Ciudadano', apellido: '' }
  try {
    if (USE_MOCK) {
      autor = MOCK_USUARIOS[reporte.id_usuario] ?? autor
    } else {
      autor = await getUsuario(reporte.id_usuario)
    }
  } catch { /* si falla el usuario, mostramos nombre genérico */ }

  return { ...reporte, _tipo: tipo, _estado: estado, _autor: autor }
}

export function useFeed(filtros = {}) {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error,    setError]    = useState(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const raw = USE_MOCK
        ? MOCK_REPORTES
        : await getReportes()

      const enriquecidos = await Promise.all(raw.map(enrichReporte))
      setReportes(enriquecidos)
    } catch (e) {
      setError(e?.response?.data?.detail ?? 'Error al cargar reportes')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const { categoriaId = 'todos', tabEstado = 'todos' } = filtros

  const filtrados = reportes.filter((r) => {
    if (categoriaId === 'importante') return r.visibilidad < 30
    if (categoriaId === 'reciente') {
      const hace24h = Date.now() - 24 * 60 * 60 * 1000
      return new Date(r.fecha_creacion).getTime() > hace24h
    }
    if (categoriaId !== 'todos') {
      if (r._tipo?.categoria !== categoriaId) return false
    }
    if (tabEstado !== 'todos' && r._estado !== tabEstado) return false
    return true
  })

  return { reportes: filtrados, cargando, error, recargar: cargar }
}
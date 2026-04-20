import { reportsClient } from './client'

/**
 * API de Reportes — http://rodo.tplinkdns.com:65001
 *
 * Modelo Reporte (MongoDB) — campos que debe devolver el backend:
 * {
 *   id_reporte:       string   (UUID)
 *   id_usuario:       int
 *   tipo_reporte:     int      (1=Bache,2=Basura,3=Alumbrado,4=Agua,5=Tráfico,6=Servicio,7=Otro)
 *   descripcion:      string
 *   ubicacion:        string   (opcional)
 *   visibilidad:      float    (0-100)
 *   estado:           string   ('no_atendido' | 'en_proceso' | 'atendido')  ← PENDIENTE de agregar
 *   instituciones_ids: int[]   (IDs de instituciones etiquetadas)            ← PENDIENTE de agregar
 *   fecha_creacion:   datetime
 * }
 */

/** GET /reports/ — Listar todos los reportes */
export const getReportes = () =>
  reportsClient.get('/reports/').then((r) => r.data)

/** GET /reports/{report_id} — Obtener reporte por ID */
export const getReporte = (reportId) =>
  reportsClient.get(`/reports/${reportId}`).then((r) => r.data)

/** GET /reports/user/{user_id} — Reportes de un usuario */
export const getReportesPorUsuario = (userId) =>
  reportsClient.get(`/reports/user/${userId}`).then((r) => r.data)

/** POST /reports/ — Crear nuevo reporte */
export const crearReporte = (datos) => {
  const formData = new FormData()
  formData.append('id_usuario', datos.id_usuario)
  formData.append('tipo_reporte', datos.tipo_reporte)
  formData.append('descripcion', datos.descripcion)
  if (datos.ubicacion) formData.append('ubicacion', datos.ubicacion)
  if (datos.lat != null) formData.append('lat', datos.lat)
  if (datos.lng != null) formData.append('lng', datos.lng)
  if (datos.file) formData.append('file', datos.file)  // ← debe ser 'file'

  return reportsClient.post('/reports/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

/** PUT /reports/{report_id}/visibility — Actualizar visibilidad */
export const actualizarVisibilidad = (reportId, visibilidad) =>
  reportsClient.put(`/reports/${reportId}/visibility`, { visibilidad }).then((r) => r.data)

/** DELETE /reports/{report_id} — Eliminar reporte */
export const eliminarReporte = (reportId) =>
  reportsClient.delete(`/reports/${reportId}`).then((r) => r.data)

/** GET /reports/shadowbanned/list — Listar reportes shadowbaneados */
export const getReportesShadowban = () =>
  reportsClient.get('/reports/shadowbanned/list').then((r) => r.data)
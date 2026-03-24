/**
 * Mock data que espeja EXACTAMENTE los modelos del backend real.
 * Campos: los del README de tu compañero.
 *
 * Para conectar la API real:
 *   1. En useFeed.js cambia `USE_MOCK = true` a `false`
 *   2. Asegúrate de que el backend esté corriendo en los puertos 8000 y 8001
 */

/* ─── Mapeo tipo_reporte (int → info visual) ───────────────────────
 * Confirma con tu compañero si este mapeo es correcto.
 * Cuando lo confirmen, este objeto es la fuente de verdad.
 */
export const TIPO_REPORTE = {
  1: { label: 'Bache',           emoji: '🕳️', categoria: 'bache'     },
  2: { label: 'Basura',          emoji: '🗑️', categoria: 'basura'    },
  3: { label: 'Alumbrado',       emoji: '💡', categoria: 'alumbrado' },
  4: { label: 'Agua',            emoji: '🚰', categoria: 'agua'      },
  5: { label: 'Tráfico',         emoji: '🚦', categoria: 'trafico'   },
  6: { label: 'Servicio Público',emoji: '🏛️', categoria: 'servicio'  },
  7: { label: 'Otro',            emoji: '📋', categoria: 'otro'      },
}

/* ─── Mapeo estado ──────────────────────────────────────────────────
 * El backend va a agregar el campo "estado" al modelo de Reporte.
 * Valores esperados: 'no_atendido' | 'en_proceso' | 'atendido'
 *
 * Mientras tanto se usa "visibilidad" como fallback.
 * Cuando tu compañero agregue el campo, el hook useFeed.js
 * lo usará directamente con: reporte.estado ?? visibilidadToEstado(reporte.visibilidad)
 */
export function visibilidadToEstado(visibilidad = 50) {
  if (visibilidad >= 70) return 'atendido'
  if (visibilidad >= 30) return 'en_proceso'
  return 'no_atendido'
}

/** Resuelve el estado final de un reporte:
 *  - usa reporte.estado si el backend ya lo envía
 *  - hace fallback a visibilidad si aún no existe
 */
export function resolveEstado(reporte) {
  if (reporte.estado) return reporte.estado
  return visibilidadToEstado(reporte.visibilidad)
}

/* ─── Config visual por estado ─────────────────────────────────────
 * Colores según especificación:
 *   Verde   → Atendido
 *   Naranja → En proceso
 *   Rojo    → No atendido
 */
export const ESTADO_CONFIG = {
  atendido:    { label: 'Atendido',    bg: 'bg-green-100',  text: 'text-green-700',  bar: 'bg-green-500',  dot: '#22c55e' },
  en_proceso:  { label: 'En proceso',  bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500', dot: '#f97316' },
  no_atendido: { label: 'No atendido', bg: 'bg-red-100',    text: 'text-red-700',    bar: 'bg-red-500',    dot: '#ef4444' },
}

/* ─── Categorías del carrusel ───────────────────────────────────── */
export const CATEGORIAS = [
  { id: 'todos',    label: 'Todos',           emoji: '🏙️', tipo: null },
  { id: 'basura',   label: 'Basura',           emoji: '🗑️', tipo: 2   },
  { id: 'bache',    label: 'Baches',           emoji: '🕳️', tipo: 1   },
  { id: 'servicio', label: 'Servicio Público', emoji: '🏛️', tipo: 6   },
  { id: 'trafico',  label: 'Tráfico',          emoji: '🚦', tipo: 5   },
  { id: 'importante', label: 'Importantes',    emoji: '⚠️', tipo: null },
  { id: 'reciente', label: 'Recientes',        emoji: '🕐', tipo: null },
]

/* ─── Mock de reportes (estructura = modelo MongoDB real) ────────── */
export const MOCK_REPORTES = [
  {
    id_reporte:      'rep-001',
    id_usuario:      1,
    tipo_reporte:    1,
    descripcion:     'Bache de más de 40cm en el Blvd. Belisario Domínguez, ya causó accidente.',
    ubicacion:       'Blvd. Belisario Domínguez, Col. El Mirador',
    visibilidad:     20,
    estado:          'no_atendido',
    instituciones_ids: [2],
    fecha_creacion:  '2024-03-22T09:00:00Z',
    _autor: { nombre: 'María García', apellido: 'López' },
  },
  {
    id_reporte:      'rep-002',
    id_usuario:      2,
    tipo_reporte:    3,
    descripcion:     '3 lámparas apagadas en Calle 5a Poniente, llevan dos semanas sin funcionar.',
    ubicacion:       'Calle 5a Poniente, Centro Histórico',
    visibilidad:     50,
    estado:          'en_proceso',
    instituciones_ids: [3],
    fecha_creacion:  '2024-03-22T08:00:00Z',
    _autor: { nombre: 'José', apellido: 'Ramírez' },
  },
  {
    id_reporte:      'rep-003',
    id_usuario:      3,
    tipo_reporte:    6,
    descripcion:     'Juegos infantiles del Parque Central reparados. ¡El sistema funciona! 🙌',
    ubicacion:       'Parque Central, Tuxtla Gutiérrez',
    visibilidad:     90,
    estado:          'atendido',
    instituciones_ids: [6],
    fecha_creacion:  '2024-03-22T06:00:00Z',
    _autor: { nombre: 'Carmen', apellido: 'López' },
  },
  {
    id_reporte:      'rep-004',
    id_usuario:      4,
    tipo_reporte:    4,
    descripcion:     'Fuga de agua potable lleva 3 días sin atención. Reporté a SMAPA sin respuesta.',
    ubicacion:       'Calle Privada Crisantemos, Col. Terán',
    visibilidad:     10,
    estado:          'no_atendido',
    instituciones_ids: [1],
    fecha_creacion:  '2024-03-22T04:00:00Z',
    _autor: { nombre: 'Roberto', apellido: 'Pérez' },
  },
  {
    id_reporte:      'rep-005',
    id_usuario:      1,
    tipo_reporte:    2,
    descripcion:     'Basura acumulada en la esquina desde hace una semana. Mal olor en la zona.',
    ubicacion:       'Av. Central esq. Calle 3 Sur, Col. Morelos',
    visibilidad:     35,
    estado:          'en_proceso',
    instituciones_ids: [4],
    fecha_creacion:  '2024-03-21T14:00:00Z',
    _autor: { nombre: 'María García', apellido: 'López' },
  },
  {
    id_reporte:      'rep-006',
    id_usuario:      5,
    tipo_reporte:    5,
    descripcion:     'Semáforo descompuesto en crucero principal, causa caos vial en horas pico.',
    ubicacion:       'Av. 5a Norte esq. Calle 2 Oriente, Centro',
    visibilidad:     55,
    estado:          'en_proceso',
    instituciones_ids: [5],
    fecha_creacion:  '2024-03-21T10:00:00Z',
    _autor: { nombre: 'Ana', apellido: 'Flores' },
  },
]

/* ─── Instituciones municipales (mock) ──────────────────────────────
 * Cuando el backend esté listo, estos datos vendrán de un endpoint.
 * Cada institución tiene un color para su etiqueta visual.
 */
export const INSTITUCIONES = [
  { id: 1, nombre: 'SAPAM',           area: 'Agua y Saneamiento',     color: 'bg-blue-100 text-blue-700',   dot: '#3b82f6' },
  { id: 2, nombre: 'Obras Públicas',  area: 'Infraestructura Vial',   color: 'bg-orange-100 text-orange-700', dot: '#f97316' },
  { id: 3, nombre: 'Alumbrado',       area: 'Servicios Eléctricos',   color: 'bg-yellow-100 text-yellow-700', dot: '#eab308' },
  { id: 4, nombre: 'Limpia Pública',  area: 'Recolección de Basura',  color: 'bg-green-100 text-green-700',  dot: '#22c55e' },
  { id: 5, nombre: 'Tránsito',        area: 'Vialidad y Semáforos',   color: 'bg-red-100 text-red-700',     dot: '#ef4444' },
  { id: 6, nombre: 'Parques',         area: 'Áreas Verdes',           color: 'bg-emerald-100 text-emerald-700', dot: '#10b981' },
  { id: 7, nombre: 'Protección Civil',area: 'Emergencias y Riesgos',  color: 'bg-purple-100 text-purple-700', dot: '#a855f7' },
]
export const MOCK_USUARIOS = {
  1: { user_id: 1, nombre: 'María García',  apellido: 'López',    calificacion: 85, numero_reportes: 12, url_foto_perfil: null },
  2: { user_id: 2, nombre: 'José',          apellido: 'Ramírez',  calificacion: 70, numero_reportes: 5,  url_foto_perfil: null },
  3: { user_id: 3, nombre: 'Carmen',        apellido: 'López',    calificacion: 92, numero_reportes: 18, url_foto_perfil: null },
  4: { user_id: 4, nombre: 'Roberto',       apellido: 'Pérez',    calificacion: 60, numero_reportes: 3,  url_foto_perfil: null },
  5: { user_id: 5, nombre: 'Ana',           apellido: 'Flores',   calificacion: 78, numero_reportes: 7,  url_foto_perfil: null },
}
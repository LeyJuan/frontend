import CarCrashIcon from '@mui/icons-material/CarCrash';

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
  1: { label: 'Bache',            icon: 'Construction',       categoria: 'bache'     },
  2: { label: 'Basura',           icon: 'DeleteSweep',        categoria: 'basura'    },
  3: { label: 'Alumbrado',        icon: 'Lightbulb',          categoria: 'alumbrado' },
  4: { label: 'Agua',             icon: 'Opacity',            categoria: 'agua'      },
  5: { label: 'Tráfico',          icon: 'TrafficRounded',     categoria: 'trafico'   },
  6: { label: 'Servicio Público', icon: 'ApartmentRounded',   categoria: 'servicio'  },
  7: { label: 'Otro',             icon: 'MoreHoriz',          categoria: 'otro'      },
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
 *  - usa reporte.estado si el backend ya lo envía (normaliza formato)
 *  - hace fallback a visibilidad si aún no existe
 */
export function resolveEstado(reporte) {
  if (reporte.estado) {
    // Normaliza el valor del backend (convierte espacios a guiones bajos)
    const estadoNormalizado = reporte.estado.toLowerCase().replace(/\s+/g, '_')
    return estadoNormalizado
  }
  return visibilidadToEstado(reporte.visibilidad)
}

/* ─── Config visual por estado ─────────────────────────────────────
 * Colores según especificación:
 *   Verde   → Atendido
 *   Naranja → En proceso
 *   Rojo    → No atendido
 */
export const ESTADO_CONFIG = {
  resuelto:    { label: 'Atendido',    bg: 'bg-green-500',  text: 'text-[#ffffff]',  bar: 'bg-green-500',  dot: '#22c55e' },
  en_proceso:  { label: 'En proceso',  bg: 'bg-[#F87216]', text: 'text-[#ffffff]', bar: 'bg-[#F87216]', dot: '#F87216' },
  no_resuelto: { label: 'No atendido', bg: 'bg-red-500',    text: 'text-[#ffffff]',    bar: 'bg-red-500',    dot: '#ef4444' },
}

/* ─── Categorías del carrusel ───────────────────────────────────── */
export const CATEGORIAS = [
  { id: 'todos',        label: 'Todos',         icon: 'Apartment',      tipo: null },
  { id: 'bache',        label: 'Baches',        icon: 'Construction',   tipo: 1   },
  { id: 'basura',       label: 'Basura',        icon: 'DeleteSweep',    tipo: 2   },
  { id: 'alumbrado',    label: 'Alumbrado',     icon: 'Lightbulb',      tipo: 3   },
  { id: 'agua',         label: 'Agua',          icon: 'Opacity',        tipo: 4   },
  { id: 'trafico',      label: 'Tráfico',       icon: 'TrafficRounded', tipo: 5   },
  { id: 'servicio',     label: 'Servicio',      icon: 'ApartmentRounded',tipo: 6  },
  { id: 'otro',         label: 'Otro',          icon: 'MoreHoriz',      tipo: 7   },
  { id: 'importante',   label: 'Importantes',   icon: 'WarningRounded',  tipo: null},
  { id: 'reciente',     label: 'Recientes',     icon: 'AccessTime',     tipo: null},
]

/* ─── Mock de reportes (estructura = modelo MongoDB real) ────────── */
export const MOCK_REPORTES = [
  {
    id_reporte:      '4927ca6e-1562-41e7-a247-2c25defb45ac',
    id_usuario:      3,
    tipo_reporte:    1,
    descripcion:     'probando',
    ubicacion:       'string',
    lat:             null,
    lng:             null,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-03-23T22:12:26.729000Z',
  },
  {
    id_reporte:      'c2f4eb85-c7ac-4a5c-a78e-527a9468f646',
    id_usuario:      3,
    tipo_reporte:    2,
    descripcion:     'mi hermana (o su novio) no han sacado la basuraaaa',
    ubicacion:       'mi casa',
    lat:             null,
    lng:             null,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-03-23T22:56:30.265000Z',
  },
  {
    id_reporte:      '32afa0e0-fd8c-451a-aa11-4e9f52596017',
    id_usuario:      3,
    tipo_reporte:    3,
    descripcion:     'No hay luuz la dio miooo',
    ubicacion:       'aqui',
    lat:             null,
    lng:             null,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-03-24T15:25:20.576000Z',
  },
  {
    id_reporte:      '5d85abeb-826f-47b7-8ffc-82bfb0925241',
    id_usuario:      543,
    tipo_reporte:    2,
    descripcion:     'Se me olvidó sacar la basura. Tengo hambre',
    ubicacion:       'en frente de la plaza crystal',
    lat:             null,
    lng:             null,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-03-24T15:47:24.002000Z',
  },
  {
    id_reporte:      '21263bc1-7892-4aa6-a273-6b232858e44d',
    id_usuario:      535,
    tipo_reporte:    5,
    descripcion:     'chocaron ijoles',
    ubicacion:       'aquí',
    lat:             null,
    lng:             null,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-03-24T15:57:22.766000Z',
  },
  {
    id_reporte:      '0048c02b-265c-4000-9c39-25650c785b73',
    id_usuario:      2,
    tipo_reporte:    2,
    descripcion:     'Test con imagen',
    ubicacion:       null,
    lat:             40.7128,
    lng:             -74.006,
    image_url:       '/images/0048c02b-265c-4000-9c39-25650c785b73.webp',
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-07T00:08:51.112000Z',
  },
  {
    id_reporte:      '37cfe838-37c5-4683-90e1-97b3dc2edf6c',
    id_usuario:      535,
    tipo_reporte:    1,
    descripcion:     'llamen a dios',
    ubicacion:       null,
    lat:             16.751751481160678,
    lng:             -93.11564919106375,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-13T16:01:16.389000Z',
  },
  {
    id_reporte:      '80425cdd-6c22-463d-a6ea-80daedbec3ee',
    id_usuario:      535,
    tipo_reporte:    2,
    descripcion:     'Wtf is this?',
    ubicacion:       'Boulevard Las Palmas, Tuxtla Gutiérrez',
    lat:             16.749852865073244,
    lng:             -93.08989900636314,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-13T22:51:52.818000Z',
  },
  {
    id_reporte:      '68440176-085f-4e06-bd42-06dca87e75de',
    id_usuario:      535,
    tipo_reporte:    3,
    descripcion:     'ayuda',
    ubicacion:       'Jardín central, Tuxtla Gutiérrez',
    lat:             16.753929449573366,
    lng:             -93.11607815969296,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-13T22:52:42.264000Z',
  },
  {
    id_reporte:      'acb17fbe-83f5-49d3-9234-23b14306d3c3',
    id_usuario:      535,
    tipo_reporte:    5,
    descripcion:     'KASANE TETO?',
    ubicacion:       'Calle Secundino Orantes A., Tuxtla Gutiérrez',
    lat:             16.75138294132836,
    lng:             -93.09852192536057,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-13T22:57:55.034000Z',
  },
  {
    id_reporte:      '6fffcd51-369d-425c-8717-0c2324472e33',
    id_usuario:      535,
    tipo_reporte:    2,
    descripcion:     'sansss',
    ubicacion:       '15 Calle Oriente Sur, Tuxtla Gutiérrez',
    lat:             16.74894402410877,
    lng:             -93.10344187561239,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-13T23:01:19.569000Z',
  },
  {
    id_reporte:      '16121349-5172-495f-97a4-170c6e92c0fd',
    id_usuario:      535,
    tipo_reporte:    2,
    descripcion:     'Teto again',
    ubicacion:       'Avenida Álvaro Obregón, Tuxtla Gutiérrez',
    lat:             16.742566777164182,
    lng:             -93.09908029781005,
    image_url:       null,
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-13T23:23:00.905000Z',
  },
  {
    id_reporte:      '85aeeae9-6df1-4a0c-a9fb-df9529901a28',
    id_usuario:      535,
    tipo_reporte:    5,
    descripcion:     'Teto 3',
    ubicacion:       'Avenida Central Oriente, 1003, Tuxtla Gutiérrez',
    lat:             16.752346335111426,
    lng:             -93.10828106553411,
    image_url:       '/images/85aeeae9-6df1-4a0c-a9fb-df9529901a28.webp',
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-13T23:34:02.995000Z',
  },
  {
    id_reporte:      'bab5bd07-567c-4121-9a05-6a65fdb68ee7',
    id_usuario:      535,
    tipo_reporte:    5,
    descripcion:     'weyes chocaron',
    ubicacion:       'Calzada Antonio de Juambelz, Torreón',
    lat:             25.538051036010945,
    lng:             -103.4182434569837,
    image_url:       '/images/bab5bd07-567c-4121-9a05-6a65fdb68ee7.webp',
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-14T16:30:45.778000Z',
  },
  {
    id_reporte:      '59b782f8-db38-4353-8316-50bffacb0fc9',
    id_usuario:      535,
    tipo_reporte:    4,
    descripcion:     'agua',
    ubicacion:       '12a. Oriente Sur, Tuxtla Gutiérrez',
    lat:             16.746899156936166,
    lng:             -93.15737344067097,
    image_url:       '/images/59b782f8-db38-4353-8316-50bffacb0fc9.webp',
    visibilidad:     50,
    estado:          'en_proceso',
    fecha_creacion:  '2026-04-14T16:39:43.885000Z',
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
  535: { user_id: 535, nombre: 'Ciudadano', apellido: 'Anónimo',  calificacion: 65, numero_reportes: 11, url_foto_perfil: null },
  543: { user_id: 543, nombre: 'Usuario',   apellido: 'Reportero', calificacion: 72, numero_reportes: 4,  url_foto_perfil: null },
}
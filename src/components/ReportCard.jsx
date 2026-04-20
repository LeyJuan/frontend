import { MessageCircle, Share2, MapPin, ThumbsUp } from 'lucide-react'
import { ESTADO_CONFIG, INSTITUCIONES } from '../mock/data'

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hr`
  return `hace ${Math.floor(diff / 86400)} días`
}

function Initials({ nombre = '', apellido = '' }) {
  const a = (nombre[0] ?? '').toUpperCase()
  const b = (apellido[0] ?? '').toUpperCase()
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
      {a}{b}
    </div>
  )
}

function InstitucionTag({ institucion }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-gray-50 border-gray-200">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: institucion.dot }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-gray-800 leading-none">
          {institucion.nombre}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
          {institucion.area}
        </p>
      </div>
    </div>
  )
}

export default function ReportCard({ reporte }) {
  const estado = ESTADO_CONFIG[reporte._estado] ?? ESTADO_CONFIG.no_atendido
  const tipo   = reporte._tipo  ?? { emoji: '📋', label: 'Reporte' }
  const autor  = reporte._autor ?? {}

  const instituciones = (reporte.instituciones_ids ?? [])
    .map(id => INSTITUCIONES.find(i => i.id === id))
    .filter(Boolean)

  return (
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

      {/* ── Autor + badge de estado ── */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <Initials nombre={autor.nombre} apellido={autor.apellido} />
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold text-gray-900 truncate">
            {autor.nombre} {autor.apellido}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {timeAgo(reporte.fecha_creacion)}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${estado.bg} ${estado.text}`}>
          {estado.label}
        </span>
      </div>

      {/* ── Imagen / placeholder ── */}
<div className="w-full h-40 bg-gray-50 flex items-center justify-center text-5xl relative overflow-hidden">
  {reporte.image_url ? (
    <img
      src={`http://rodo.tplinkdns.com:65001${reporte.image_url}`}
      alt={tipo.label}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none'
        e.target.nextSibling.style.display = 'flex'
      }}
    />
  ) : null}
  <span
    style={{ display: reporte.image_url ? 'none' : 'flex' }}
    className="items-center justify-center w-full h-full"
  >
    {tipo.emoji}
  </span>
  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
  <span className="absolute top-2.5 left-3 text-[11px] font-semibold bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-white/50">
    {tipo.emoji} {tipo.label}
  </span>
</div>

      {/* ── Dirección ── */}
      <div className="flex items-start gap-2 px-4 pt-3 pb-1">
        <MapPin size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-gray-600 font-medium leading-snug">
          {reporte.ubicacion ?? 'Ubicación no especificada'}
        </p>
      </div>

      {/* ── Descripción ── */}
      <div className="px-4 pt-2 pb-3">
        <p className="text-[13px] text-gray-700 leading-relaxed line-clamp-3">
          {reporte.descripcion}
        </p>
      </div>

      {/* ── Instituciones responsables ── */}
      {instituciones.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Institución responsable
          </p>
          <div className="flex flex-col gap-2">
            {instituciones.map((inst) => (
              <InstitucionTag
                key={inst.id}
                institucion={inst}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Acciones ── */}
      <div className="border-t border-gray-100 px-3 py-2.5 flex items-center gap-1">
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
          <ThumbsUp size={15} />
          Apoyar
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-gray-400 hover:bg-gray-50 transition-all active:scale-90">
          <MessageCircle size={15} />
          Comentar
        </button>
        <div className="flex-1" />
        <button className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all active:scale-90">
          <Share2 size={13} />
        </button>
      </div>

    </article>
  )
}

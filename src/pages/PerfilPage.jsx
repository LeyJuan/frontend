import { useState, useEffect } from 'react'
import { Settings, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getReportesPorUsuario } from '../api/reportes'
import { TIPO_REPORTE, ESTADO_CONFIG, resolveEstado } from '../mock/data'
import { useUser } from '../context/UserContext'

export default function PerfilPage() {
  const { usuario, cerrarSesion } = useUser()
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!usuario) return
    getReportesPorUsuario(usuario.user_id)
      .then(setReportes)
      .catch(() => setReportes([]))
      .finally(() => setCargando(false))
  }, [usuario])

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
    </div>
  )

  const iniciales = `${usuario?.nombre?.[0] ?? ''}${usuario?.apellido?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">

      <header className="bg-red-600 px-4 pt-4 pb-4 sticky top-0 z-40 flex items-center justify-between">
        <h1 className="text-[18px] font-black text-white">Mi perfil</h1>
        <button className="w-9 h-9 rounded-xl bg-red-700/60 flex items-center justify-center text-white">
          <Settings size={17} strokeWidth={2} />
        </button>
      </header>

      {/* Tarjeta de perfil */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
            {iniciales}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-black text-gray-900">
              {usuario?.nombre} {usuario?.apellido}
            </h2>
            <p className="text-[12.5px] text-gray-500 mt-0.5">
              {usuario?.email}
            </p>
            <p className="text-[12.5px] text-gray-500 mt-0.5">
              Calificación: <span className="font-bold text-red-600">{usuario?.calificacion ?? 0}/100</span>
            </p>
            {usuario?.biografia && (
              <p className="text-[12px] text-gray-400 mt-1 line-clamp-2">{usuario.biografia}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-3 gap-3">
          {[
            { n: usuario?.numero_reportes ?? 0, l: 'Reportes',    c: 'text-red-600'    },
            { n: reportes.filter(r => resolveEstado(r) === 'atendido').length, l: 'Atendidos', c: 'text-green-600' },
            { n: Math.round(usuario?.calificacion ?? 0), l: 'Calificación', c: 'text-orange-500' },
          ].map(({ n, l, c }) => (
            <div key={l} className="text-center bg-gray-50 rounded-xl py-3">
              <p className={`text-[22px] font-black tracking-tight leading-none ${c}`}>{n}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mis reportes */}
      <div className="px-4 pt-5 pb-3">
        <h3 className="text-[18px] font-black text-gray-900">Mis reportes</h3>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {reportes.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Aún no has creado reportes</p>
        )}
        {reportes.map((r) => {
          const tipo  = TIPO_REPORTE[r.tipo_reporte] ?? TIPO_REPORTE[7]
          const estado = ESTADO_CONFIG[resolveEstado(r)]
          return (
            <div key={r.id_reporte} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                {tipo.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 leading-tight truncate">{r.descripcion}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">{r.ubicacion}</p>
                <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${estado.bar}`} style={{ width: `${r.visibilidad}%` }} />
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${estado.bg} ${estado.text}`}>
                {estado.label}
              </span>
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
            </div>
          )
        })}
      </div>

      {/* Opciones */}
      <div className="mx-4 mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {[
          { label: 'Editar perfil',          emoji: '✏️' },
          { label: 'Notificaciones',          emoji: '🔔' },
          { label: 'Acerca de Voz Ciudadana', emoji: 'ℹ️' },
        ].map(({ label, emoji }, i, arr) => (
          <button key={label}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <span className="text-lg w-7 text-center">{emoji}</span>
            <span className="text-[13.5px] font-medium flex-1 text-gray-700">{label}</span>
            <ChevronRight size={14} className="text-gray-300" />
          </button>
        ))}
        <button
          onClick={handleCerrarSesion}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-t border-gray-100 hover:bg-gray-50">
          <span className="text-lg w-7 text-center">🚪</span>
          <span className="text-[13.5px] font-medium flex-1 text-red-500">Cerrar sesión</span>
        </button>
      </div>

    </div>
  )
}
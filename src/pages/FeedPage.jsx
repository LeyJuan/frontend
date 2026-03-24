import { useState } from 'react'
import { Search, Bell, User, RefreshCw } from 'lucide-react'
import CategoryCarousel from '../components/CategoryCarousel'
import ReportCard       from '../components/ReportCard'
import { useFeed }      from '../hooks/useFeed'
import { useNavigate }  from 'react-router-dom'

const TABS = [
  { id: 'todos',       label: 'Todos'       },
  { id: 'no_atendido', label: 'No atendido' },
  { id: 'en_proceso',  label: 'En proceso'  },
  { id: 'atendido',    label: 'Atendido'    },
]

const TAB_ACTIVE = {
  todos:       'bg-white text-red-600 border-white',
  no_atendido: 'bg-red-700 text-white border-red-700',
  en_proceso:  'bg-orange-500 text-white border-orange-500',
  atendido:    'bg-green-500 text-white border-green-500',
}

export default function FeedPage() {
  const [catActiva, setCatActiva] = useState('todos')
  const [tabActivo, setTabActivo] = useState('todos')
  const navigate = useNavigate()

  const { reportes, cargando, error, recargar } = useFeed({
    categoriaId: catActiva,
    tabEstado:   tabActivo,
  })

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">

      {/* ── Header rojo ── */}
      <header className="bg-red-600 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          {/* Logo */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[2.5px] text-red-200">
              Tu ciudad, tu voz
            </p>
            <h1 className="text-[24px] font-black text-white leading-none tracking-tight mt-0.5">
              Voz Ciudadana
            </h1>
          </div>

          {/* Iconos: Perfil, Buscar, Notificaciones */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate('/perfil')}
              className="w-9 h-9 rounded-xl bg-red-700/60 flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <User size={17} strokeWidth={2} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-red-700/60 flex items-center justify-center text-white active:scale-90 transition-all">
              <Search size={17} strokeWidth={2} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-red-700/60 flex items-center justify-center text-white relative active:scale-90 transition-all">
              <Bell size={17} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full border-2 border-red-600" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Carrusel de categorías ── */}
      <CategoryCarousel activa={catActiva} onChange={setCatActiva} />

      {/* ── Tabs de estado (debajo del carrusel) ── */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActivo(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold border transition-all active:scale-95 ${
              tabActivo === tab.id
                ? TAB_ACTIVE[tab.id]
                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Sección título ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <h2 className="text-[20px] font-black text-gray-900 tracking-tight">
          Reportes{catActiva !== 'todos'
            ? ` · ${catActiva.charAt(0).toUpperCase() + catActiva.slice(1)}`
            : ''}
        </h2>
        <button
          onClick={recargar}
          className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 active:scale-90 transition-all"
        >
          <RefreshCw size={14} className={cargando ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── Feed ── */}
      <div className="flex flex-col gap-4 px-4 bg-white">

        {cargando && (
          <div className="flex flex-col items-center py-12 text-gray-400 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
            <p className="text-sm font-medium">Cargando reportes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 font-semibold text-sm">{error}</p>
            <button onClick={recargar} className="mt-2 text-xs text-red-500 font-bold underline">
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && reportes.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <p className="text-4xl mb-3">🏙️</p>
            <p className="font-semibold text-gray-500">Sin reportes en esta categoría</p>
            <p className="text-sm mt-1">Sé el primero en reportar un problema</p>
          </div>
        )}

        {!cargando && reportes.map((reporte) => (
          <ReportCard key={reporte.id_reporte} reporte={reporte} />
        ))}

      </div>
    </div>
  )
}

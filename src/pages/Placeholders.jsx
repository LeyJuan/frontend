import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { getReportes } from '../api/reportes'
import { TIPO_REPORTE, resolveEstado, ESTADO_CONFIG } from '../mock/data'
import NotificationList from '../components/NotificationList'
import 'leaflet/dist/leaflet.css'

import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'

// Fix para los íconos de Leaflet con Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CENTRO_TUXTLA = [16.7516, -93.1152]

// Crea un ícono de color según el estado del reporte
function crearIcono(estado) {
  const colores = {
    resuelto:    '#22c55e',
    en_proceso:  '#f97316',
    no_resuelto: '#ef4444',
  }
  const color = colores[estado] ?? '#ef4444'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path fill="${color}" stroke="white" stroke-width="2"
      d="M14 2C7.4 2 2 7.4 2 14c0 9 12 22 12 22S26 23 26 14C26 7.4 20.6 2 14 2z"/>
    <circle fill="white" cx="14" cy="14" r="5"/>
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  })
}


function ControlUbicacion() {
  const map = useMap()

  const centrar = async () => {
  try {
    let latitude, longitude

    if (Capacitor.isNativePlatform()) {
      const permiso = await Geolocation.requestPermissions()
      if (permiso.location !== 'granted') {
        alert('Permiso denegado. Habilita la ubicación en la configuración.')
        return
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true })
      latitude = pos.coords.latitude
      longitude = pos.coords.longitude
    } else {
      if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización')
        return
      }
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      )
      latitude = pos.coords.latitude
      longitude = pos.coords.longitude
    }

    map.flyTo([latitude, longitude], 16)
  } catch (error) {
    const mensajes = {
      1: 'Permiso denegado. Habilita la ubicación en tu navegador.',
      2: 'No se pudo obtener tu ubicación.',
      3: 'La solicitud tardó demasiado.',
    }
    alert(mensajes[error.code] || `Error: ${error.message}`)
  }
}

  return (
    <button
      onClick={centrar}
      className="absolute bottom-24 right-4 z-[1000] w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-xl border border-gray-200 active:scale-90 transition-all"
      title="Mi ubicación"
    >
      📍
    </button>
  )
}

export function MapaPage() {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getReportes()
      .then(setReportes)
      .catch(() => setReportes([]))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <header className="bg-red-600 px-4 pt-4 pb-4 sticky top-0 z-40">
        <h1 className="text-[18px] font-black text-white">Mapa de reportes</h1>
        <p className="text-red-200 text-xs mt-0.5">
          {cargando ? 'Cargando...' : `${reportes.length} reportes en el mapa`}
        </p>
      </header>

      {/* Leyenda */}
      <div className="flex gap-3 px-4 py-2 bg-white border-b border-gray-100 text-[11px] font-semibold">
        {Object.entries(ESTADO_CONFIG).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-full ${val.bar}`} />
            <span className="text-gray-500">{val.label}</span>
          </div>
        ))}
      </div>

      <div className="relative z-0" style={{ height: 'calc(100vh - 190px)', width: '100%' }}>
        <MapContainer
          center={CENTRO_TUXTLA}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {reportes.map((r) => {
            // Solo muestra reportes que tengan coordenadas
            const lat = r.latitud ?? r.lat
            const lng = r.longitud ?? r.lng ?? r.lon
            if (!lat || !lng) return null
            const tipo  = TIPO_REPORTE[r.tipo_reporte] ?? TIPO_REPORTE[7]
            const estado = resolveEstado(r)
            const cfg   = ESTADO_CONFIG[estado]
            return (
              <Marker
                key={r.id_reporte}
                position={[lat, lng]}
                icon={crearIcono(estado)}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 4px' }}>
                      {tipo.emoji} {tipo.label}
                    </p>
                    <p style={{ fontSize: 12, color: '#555', margin: '0 0 6px', lineHeight: 1.4 }}>
                      {r.descripcion}
                    </p>
                    {r.ubicacion && (
                      <p style={{ fontSize: 11, color: '#888', margin: 0 }}>📍 {r.ubicacion}</p>
                    )}
                    <span style={{
                      display: 'inline-block', marginTop: 6,
                      fontSize: 10, fontWeight: 700, padding: '2px 8px',
                      borderRadius: 99, background: cfg.dot + '22', color: cfg.dot
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          <ControlUbicacion />
        </MapContainer>
      </div>
    </div>
  )
}

export function ExplorarPage() { 
  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <header className="bg-red-600 px-4 pt-4 pb-4">
        <h1 className="text-[18px] font-black text-white">Explorar</h1>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-3">
        <p className="text-5xl">🔍</p>
        <p className="text-lg font-bold text-gray-600">Próximamente</p>
      </div>
    </div>
  ) }
export function AlertasPage()  { 
  // Para debug, agrega ?debug=1 a la URL para ver información detallada
  const params = new URLSearchParams(window.location.search)
  const debugMode = params.get('debug') === '1'
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <header className="bg-red-600 px-4 pt-4 pb-4">
        <h1 className="text-[18px] font-black text-white">Notificaciones</h1>
        {debugMode && <p className="text-red-200 text-xs mt-1">🔍 Modo Debug Activado</p>}
      </header>
      <div className="px-4 py-4">
        <NotificationList debug={debugMode} />
      </div>
    </div>
  )
}
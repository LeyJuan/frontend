import { useState, useEffect } from 'react'
import { useMapEvents, useMap } from 'react-leaflet'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { getIcon } from '../utils/iconMap'

import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'

const Icon = getIcon('LocationPin')

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Crea un ícono de color aleatorio para el picker
function crearIconoAleatorio() {
  const color = '#3f2a41';
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

async function geocodificarInverso(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
      { headers: { 'Accept-Language': 'es' } }
    )
    const data = await res.json()
    const d = data.address
    const partes = [
      d.road,
      d.house_number,
      d.suburb || d.neighbourhood || d.quarter,
      d.city || d.town || d.village,
    ].filter(Boolean)
    return partes.join(', ') || data.display_name
  } catch {
    return null
  }
}

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  })
  return null
}

function MapCenter({ posicion }) {
  const map = useMap()
  
  useEffect(() => {
    if (posicion) {
      map.setView([posicion.lat, posicion.lng], 16)
    }
  }, [posicion, map])
  
  return null
}

export default function MapaPicker({ value, onChange, onDireccion }) {
  const centro = [16.7516, -93.1152]
  const posicion = value ? [value.lat, value.lng] : null
  const [localizando, setLocalizando] = useState(false)

  const handleClick = async (coords) => {
    onChange(coords)
    const dir = await geocodificarInverso(coords.lat, coords.lng)
    if (dir && onDireccion) onDireccion(dir)
  }


const handleGeolocalización = async () => {
  setLocalizando(true)

  try {
    let latitude, longitude

    if (Capacitor.isNativePlatform()) {
      const permiso = await Geolocation.requestPermissions()
      if (permiso.location !== 'granted') {
        alert('Permiso denegado. Por favor, habilita la ubicación en la configuración.')
        setLocalizando(false)
        return
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 })
      latitude = pos.coords.latitude
      longitude = pos.coords.longitude
    } else {
      if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización')
        setLocalizando(false)
        return
      }
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
        })
      )
      latitude = pos.coords.latitude
      longitude = pos.coords.longitude
    }

      await handleClick({ lat: latitude, lng: longitude })
    } catch (error) {
      const mensajes = {
        1: 'Permiso denegado. Por favor, habilita la ubicación en tu navegador.',
        2: 'No se pudo obtener tu ubicación. Intenta de nuevo.',
        3: 'La solicitud de ubicación tardó demasiado.',
      }
      alert(mensajes[error.code] || 'Error al obtener tu ubicación')
    } finally {
      setLocalizando(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Ubicación en el mapa
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleGeolocalización}
            disabled={localizando}
            className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Navigation size={13} strokeWidth={2.5} />
            {localizando ? 'Localizando...' : 'Mi ubicación'}
          </button>
          {posicion && (
            <button onClick={() => { onChange(null); onDireccion?.('') }}
              className="text-xs text-red-500 font-semibold">
              Limpiar
            </button>
          )}
        </div>
      </div>
      

      <div style={{ zIndex:0, height: 380, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <MapContainer center={centro} zoom={14}
          style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapCenter posicion={value} />
          <ClickHandler onSelect={handleClick} />
          {posicion && <Marker position={posicion} icon={crearIconoAleatorio()} />}
        </MapContainer>
      </div>

      {posicion ? (
        <Icon
        sx={{
          fonSize:12, color:'#dc2626'
        }}
        />
      ) : (
        <p className="text-xs text-gray-400">Toca el mapa para marcar la ubicación, o usa el botón de geolocalización</p>
      )
      }
    </div>
  )
}
import { useMapEvents } from 'react-leaflet'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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

export default function MapaPicker({ value, onChange, onDireccion }) {
  const centro = [16.7516, -93.1152]
  const posicion = value ? [value.lat, value.lng] : null

  const handleClick = async (coords) => {
    onChange(coords)
    const dir = await geocodificarInverso(coords.lat, coords.lng)
    if (dir && onDireccion) onDireccion(dir)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Ubicación en el mapa
        </label>
        {posicion && (
          <button onClick={() => { onChange(null); onDireccion?.('') }}
            className="text-xs text-red-500 font-semibold">
            Limpiar
          </button>
        )}
      </div>

      <div style={{ height: 220, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <MapContainer center={posicion ?? centro} zoom={14}
          style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onSelect={handleClick} />
          {posicion && <Marker position={posicion} />}
        </MapContainer>
      </div>

      {posicion ? (
        <p className="text-xs text-gray-400">
          📍 {posicion[0].toFixed(5)}, {posicion[1].toFixed(5)}
        </p>
      ) : (
        <p className="text-xs text-gray-400">Toca el mapa para marcar la ubicación</p>
      )}
    </div>
  )
}
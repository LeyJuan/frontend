import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearReporte } from '../api/reportes'
import { useUser } from '../context/UserContext'
import MapaPicker from '../components/MapaPicker'

const TIPOS = [
  { value: 1, label: '🕳️ Bache' },
  { value: 2, label: '🗑️ Basura' },
  { value: 3, label: '💡 Alumbrado' },
  { value: 4, label: '🚰 Agua' },
  { value: 5, label: '🚦 Tráfico' },
  { value: 6, label: '🏛️ Servicio Público' },
  { value: 7, label: '📋 Otro' },
]

export default function NuevoReportePage() {
  const { usuario } = useUser()
  const [form, setForm] = useState({ tipo_reporte: '', descripcion: '', ubicacion: '' })
  const [coordenadas, setCoordenadas] = useState(null)
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputFotoRef = useRef(null)
  const navigate = useNavigate()

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value })),
  })

  const handleFoto = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  setFoto(file)              // ← esto debe ser el File object, no la URL
  setFotoPreview(URL.createObjectURL(file))
}

  const handleSubmit = async () => {
    if (!form.tipo_reporte || !form.descripcion.trim()) {
      setStatus({ type: 'error', message: 'El tipo y la descripción son obligatorios.' })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      await crearReporte({
  id_usuario: usuario.user_id,
  tipo_reporte: Number(form.tipo_reporte),
  descripcion: form.descripcion.trim(),
  ubicacion: form.ubicacion.trim() || null,
  lat: coordenadas?.lat ?? null,
  lng: coordenadas?.lng ?? null,
  file: foto || null,   // ← 'foto' debe ser el File object del input
})
      setStatus({ type: 'success', message: 'Reporte publicado correctamente.' })
      setForm({ tipo_reporte: '', descripcion: '', ubicacion: '' })
      setCoordenadas(null)
      setFoto(null)
      setFotoPreview(null)
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = typeof detail === 'string' ? detail : detail?.[0]?.msg ?? 'Error al crear reporte.'
      setStatus({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <header className="bg-red-600 px-4 pt-4 pb-4 sticky top-0 z-40 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white font-bold text-lg">←</button>
        <h1 className="text-[18px] font-black text-white">Nuevo reporte</h1>
      </header>

      <div className="px-4 pt-6 flex flex-col gap-4">

        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de reporte *</label>
          <select {...field('tipo_reporte')}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-white">
            <option value="">Selecciona un tipo...</option>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción *</label>
          <textarea rows={3} placeholder="Describe el problema..." {...field('descripcion')}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none" />
        </div>

        {/* Foto */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Foto</label>
          <input ref={inputFotoRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" />

          {fotoPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={fotoPreview} alt="preview" className="w-full h-48 object-cover" />
              <button
                onClick={() => { setFoto(null); setFotoPreview(null) }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full text-xs font-bold flex items-center justify-center"
              >✕</button>
            </div>
          ) : (
            <button onClick={() => inputFotoRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 active:bg-gray-50 transition-all">
              <span className="text-3xl">📷</span>
              <span className="text-xs font-semibold">Toca para agregar una foto</span>
            </button>
          )}
        </div>

        {/* Mapa picker — rellena dirección automáticamente */}
        <MapaPicker
          value={coordenadas}
          onChange={setCoordenadas}
          onDireccion={(dir) => setForm(prev => ({ ...prev, ubicacion: dir }))}
        />

        {/* Dirección texto — se rellena automáticamente pero se puede editar */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección</label>
          <input type="text" placeholder="Se rellena al tocar el mapa, o escribe manualmente"
            {...field('ubicacion')}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
        </div>

        {status && (
          <div className={`rounded-xl p-4 text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
            {status.type === 'success' && (
              <button onClick={() => navigate('/')} className="block mt-2 font-black underline">
                Ver feed →
              </button>
            )}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-red-600 text-white font-black py-4 rounded-2xl text-[15px] active:scale-95 transition-all disabled:opacity-50">
          {loading ? 'Publicando...' : 'Publicar reporte'}
        </button>
      </div>
    </div>
  )
}
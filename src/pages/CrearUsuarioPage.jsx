import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearUsuario } from '../api/usuarios'

const initialForm = {
  nombre: '', apellido: '', email: '',
  fecha_nacimiento: '', url_foto_perfil: '', biografia: '',
}

export default function CrearUsuarioPage() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value })),
  })

  const handleSubmit = async () => {
    setLoading(true)
    setStatus(null)
    try {
      await crearUsuario({
        ...form,
        fecha_nacimiento: new Date(form.fecha_nacimiento + 'T00:00:00').toISOString(),
        url_foto_perfil: form.url_foto_perfil || null,
        biografia: form.biografia || null,
      })
      setStatus({ type: 'success', message: 'Usuario creado correctamente.' })
      setForm(initialForm)
    } catch (err) {
      console.log('Error detalle:', err.response?.data)  // agregar esta línea
      const msg = err.response?.data?.detail?.[0]?.msg ?? 'Error al crear usuario.'
      setStatus({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <header className="bg-red-600 px-4 pt-4 pb-4 sticky top-0 z-40 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white font-bold text-lg">←</button>
        <h1 className="text-[18px] font-black text-white">Nuevo usuario</h1>
      </header>

      <div className="px-4 pt-6 flex flex-col gap-4">
        {[
          { label: 'Nombre *',     key: 'nombre',    type: 'text'     },
          { label: 'Apellido *',   key: 'apellido',  type: 'text'     },
          { label: 'Email *',      key: 'email',     type: 'email'    },
          { label: 'Nacimiento *', key: 'fecha_nacimiento', type: 'date' },
          { label: 'Foto (URL)',   key: 'url_foto_perfil',  type: 'url' },
        ].map(({ label, key, type }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
            <input type={type} {...field(key)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Biografía</label>
          <textarea rows={3} {...field('biografia')}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none" />
        </div>

        {status && (
          <div className={`rounded-xl p-4 text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-red-600 text-white font-black py-4 rounded-2xl text-[15px] active:scale-95 transition-all disabled:opacity-50">
          {loading ? 'Creando...' : 'Crear usuario'}
        </button>
      </div>
    </div>
  )
}
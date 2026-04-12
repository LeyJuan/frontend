import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarioPorEmail } from '../api/usuarios'
import { crearUsuario } from '../api/usuarios'
import { useUser } from '../context/UserContext'

export default function LoginPage() {
  const [tab, setTab] = useState('entrar')        // 'entrar' | 'registrar'
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '',
    fecha_nacimiento: '', biografia: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { iniciarSesion } = useUser()
  const navigate = useNavigate()

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value })),
  })

  const handleEntrar = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const user = await getUsuarioPorEmail(email.trim())
      iniciarSesion(user)
      navigate('/')
    } catch {
      setError('No se encontró ningún usuario con ese email.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegistrar = async () => {
    if (!form.nombre || !form.apellido || !form.email || !form.fecha_nacimiento) {
      setError('Completa todos los campos obligatorios.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await crearUsuario({
        ...form,
        fecha_nacimiento: new Date(form.fecha_nacimiento + 'T00:00:00').toISOString(),
        biografia: form.biografia || null,
        url_foto_perfil: null,
      })
      // Después de crear, busca el usuario para obtener su ID
      //const user = await getUsuarioPorEmail(form.email)
      //iniciarSesion(user)
      //navigate('/')
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : detail?.[0]?.msg ?? 'Error al registrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-red-600 px-6 pt-14 pb-8">
        <p className="text-[10px] font-black uppercase tracking-[2.5px] text-red-200">Tu ciudad, tu voz</p>
        <h1 className="text-[32px] font-black text-white leading-none mt-1">Voz Ciudadana</h1>
        <p className="text-red-200 text-sm mt-2">Reporta problemas en tu comunidad</p>
      </div>

      <div className="px-6 pt-6 flex flex-col gap-4 flex-1">
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[['entrar', 'Ya tengo cuenta'], ['registrar', 'Crear cuenta']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => { setTab(id); setError(null) }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                tab === id ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'entrar' ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500">Ingresa tu email para continuar</p>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEntrar()}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
            />
            <button onClick={handleEntrar} disabled={loading}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl text-[15px] active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'Buscando...' : 'Entrar'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[
              { label: 'Nombre *',     key: 'nombre',           type: 'text'  },
              { label: 'Apellido *',   key: 'apellido',         type: 'text'  },
              { label: 'Email *',      key: 'email',            type: 'email' },
              { label: 'Nacimiento *', key: 'fecha_nacimiento', type: 'date'  },
              { label: 'Biografía',    key: 'biografia',        type: 'text'  },
            ].map(({ label, key, type }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                <input type={type} {...field(key)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" />
              </div>
            ))}
            <button onClick={handleRegistrar} disabled={loading}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl text-[15px] active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'Creando cuenta...' : 'Crear cuenta y entrar'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm font-medium">{error}</div>
        )}
      </div>
    </div>
  )
}
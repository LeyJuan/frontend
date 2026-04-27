import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

const initialForm = {
  nombre: '', apellido: '', email: '',
  fecha_nacimiento: '', contraseña: '', url_foto_perfil: '', biografia: '',
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
    // Validación
    if (!form.nombre.trim() || !form.apellido.trim() || !form.email.trim() || !form.fecha_nacimiento) {
      setStatus({ type: 'error', message: 'Completa todos los campos obligatorios.' })
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setStatus({ type: 'error', message: 'Email inválido.' })
      return
    }

    setLoading(true)
    setStatus(null)
    
    try {
      const userData = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        fecha_nacimiento: new Date(form.fecha_nacimiento + 'T00:00:00').toISOString(),
        url_foto_perfil: form.url_foto_perfil.trim() || null,
        biografia: form.biografia.trim() || null,
      }
      
      // Agregar contraseña solo si se proporciona
      if (form.contraseña.trim()) {
        userData.contraseña = form.contraseña
      }

      await register(userData)
      setStatus({ type: 'success', message: 'Usuario creado correctamente.' })
      setForm(initialForm)
      
      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data
      
      if (status === 409) {
        setStatus({ type: 'error', message: 'Este email ya está registrado.' })
      } else if (status === 400) {
        const detail = data?.detail
        if (Array.isArray(detail)) {
          const message = detail.map(d => d.msg).join(', ')
          setStatus({ type: 'error', message })
        } else {
          setStatus({ type: 'error', message: detail || 'Hay campos inválidos.' })
        }
      } else {
        setStatus({ type: 'error', message: data?.detail || 'Error al crear usuario.' })
      }
      console.error('Error al crear usuario:', err)
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
          { label: 'Contraseña',   key: 'contraseña', type: 'password' },
          { label: 'Foto (URL)',   key: 'url_foto_perfil',  type: 'url' },
        ].map(({ label, key, type }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
            <input 
              type={type}
              placeholder={key === 'contraseña' ? '(Opcional - se usa passwd123 si no especificas)' : ''}
              {...field(key)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Biografía</label>
          <textarea rows={3} {...field('biografia')}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
          💡 <strong>Nota:</strong> Si no especificas contraseña, se usará automáticamente <code className="bg-blue-100 px-1 rounded">passwd123</code>
        </div>

        {status && (
          <div className={`rounded-xl p-4 text-sm font-medium border ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {status.type === 'success' ? '✓' : '⚠️'} {status.message}
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
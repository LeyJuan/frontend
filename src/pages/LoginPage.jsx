import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/auth'
import { useUser } from '../context/UserContext'

export default function LoginPage() {
  const [tab, setTab] = useState('entrar')        // 'entrar' | 'registrar'
  const [loginForm, setLoginForm] = useState({ email: '', contraseña: '' })
  const [registerForm, setRegisterForm] = useState({
    nombre: '', apellido: '', email: '',
    fecha_nacimiento: '', contraseña: '', biografia: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { iniciarSesion } = useUser()
  const navigate = useNavigate()

  const handleEntrar = async () => {
    const { email, contraseña } = loginForm
    if (!email.trim() || !contraseña.trim()) {
      setError('Email y contraseña son requeridos.')
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await login(email.trim(), contraseña)
      iniciarSesion(response)
      navigate('/')
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data
      
      if (status === 401) {
        setError('Email o contraseña incorrectos.')
      } else if (status === 400) {
        setError('Por favor verifica que el email y contraseña sean válidos.')
      } else {
        setError(data?.detail || 'Error al iniciar sesión. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegistrar = async () => {
    const { nombre, apellido, email, fecha_nacimiento, contraseña, biografia } = registerForm
    
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !fecha_nacimiento) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email inválido.')
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const userData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        fecha_nacimiento: new Date(fecha_nacimiento + 'T00:00:00').toISOString(),
        biografia: biografia.trim() || null,
        url_foto_perfil: null,
      }
      
      // Agregar contraseña solo si se proporciona
      if (contraseña.trim()) {
        userData.contraseña = contraseña
      }
      
      await register(userData)
      
      setSuccess('Cuenta creada exitosamente. Ahora inicia sesión con tus credenciales.')
      setRegisterForm({
        nombre: '', apellido: '', email: '',
        fecha_nacimiento: '', contraseña: '', biografia: '',
      })
      
      // Cambiar a tab de login después de 2 segundos
      setTimeout(() => {
        setTab('entrar')
        setLoginForm({ email: email.trim(), contraseña: '' })
        setSuccess(null)
      }, 2000)
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data
      
      if (status === 409) {
        setError('Este email ya está registrado. Intenta iniciar sesión o usa otro email.')
      } else if (status === 400) {
        const detail = data?.detail
        if (Array.isArray(detail)) {
          setError(detail.map(d => d.msg).join(', '))
        } else {
          setError(detail || 'Hay campos inválidos.')
        }
      } else {
        setError(data?.detail || 'Error al crear la cuenta. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLoginChange = (key, value) => {
    setLoginForm(prev => ({ ...prev, [key]: value }))
  }

  const handleRegisterChange = (key, value) => {
    setRegisterForm(prev => ({ ...prev, [key]: value }))
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
              onClick={() => { setTab(id); setError(null); setSuccess(null) }}
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
            <p className="text-sm text-gray-500">Ingresa tu email y contraseña</p>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email *</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={loginForm.email}
                onChange={(e) => handleLoginChange('email', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleEntrar()}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contraseña *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginForm.contraseña}
                onChange={(e) => handleLoginChange('contraseña', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleEntrar()}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
              />
            </div>

            <button onClick={handleEntrar} disabled={loading}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl text-[15px] active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[
              { label: 'Nombre *',     key: 'nombre',           type: 'text'  },
              { label: 'Apellido *',   key: 'apellido',         type: 'text'  },
              { label: 'Email *',      key: 'email',            type: 'email' },
              { label: 'Nacimiento *', key: 'fecha_nacimiento', type: 'date'  },
              { label: 'Contraseña',   key: 'contraseña',       type: 'password' },
              { label: 'Biografía',    key: 'biografia',        type: 'text'  },
            ].map(({ label, key, type }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                <input 
                  type={type}
                  placeholder={key === 'contraseña' ? '(Opcional - se usa passwd123 si no especificas)' : ''}
                  value={registerForm[key]}
                  onChange={(e) => handleRegisterChange(key, e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              💡 <strong>Nota:</strong> Si no especificas contraseña, se usará automáticamente <code className="bg-blue-100 px-1 rounded">passwd123</code>
            </div>

            <button onClick={handleRegistrar} disabled={loading}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl text-[15px] active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm font-medium border border-red-200">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 rounded-xl p-4 text-sm font-medium border border-green-200">
            ✓ {success}
          </div>
        )}
      </div>
    </div>
  )
}
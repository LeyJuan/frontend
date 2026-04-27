import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { logout } from '../api/auth'

/**
 * Componente Navbar/Header
 * Muestra información del usuario y opción de logout
 */
export default function Navbar() {
  const { usuario, isAuthenticated } = useUser()
  const navigate = useNavigate()

  if (!isAuthenticated()) {
    return null
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout()
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <button 
          onClick={() => navigate('/')}
          className="flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <p className="text-[10px] font-black uppercase tracking-[2.5px] text-red-600">
            Tu ciudad, tu voz
          </p>
          <h1 className="text-lg font-black text-gray-900">Voz Ciudadana</h1>
        </button>

        {/* User Info & Logout */}
        {/* {usuario && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {usuario.email}
              </p>
              <p className="text-xs text-gray-500">
                ID: {usuario.user_id}
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        )*/} 
      </div>
    </nav>
  )
}

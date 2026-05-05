import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    // Verificar si hay token activo en localStorage
    const token = localStorage.getItem('access_token')
    const user_id = localStorage.getItem('user_id')
    const user_email = localStorage.getItem('user_email')
    const is_admin_str = localStorage.getItem('is_admin')
    
    // Normalizar is_admin: puede estar como 'true', 'false', '1', '0', etc.
    const is_admin = is_admin_str === 'true' || is_admin_str === '1'
    
    if (token && user_id && user_email) {
      console.debug('[Init] Usuario recuperado de localStorage:', {
        user_id,
        email: user_email,
        is_admin,
        is_admin_str,
      })
      return {
        user_id,
        email: user_email,
        is_admin,
        isAuthenticated: true,
      }
    }
    return null
  })

  const [loading, setLoading] = useState(false)

  /**
   * Inicia sesión con datos del usuario y token JWT
   * @param {Object} data - { access_token, token_type, user_id, email, is_admin }
   */
  const iniciarSesion = (data) => {
    const { access_token, token_type, user_id, email, is_admin } = data
    
    // Normalizar is_admin: puede venir como boolean, string o número
    const normalizedIsAdmin = 
      is_admin === true || 
      is_admin === 'true' || 
      is_admin === 1 || 
      is_admin === '1'
    
    console.debug('[Login] is_admin valores:', {
      original: is_admin,
      tipo: typeof is_admin,
      normalizado: normalizedIsAdmin,
    })
    
    // Guardar en localStorage
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('token_type', token_type || 'bearer')
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('user_email', email)
    localStorage.setItem('is_admin', normalizedIsAdmin ? 'true' : 'false')
    
    // Actualizar estado
    setUsuario({
      user_id,
      email,
      is_admin: normalizedIsAdmin,
      isAuthenticated: true,
    })
  }

  /**
   * Cierra sesión del usuario
   */
  const cerrarSesion = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('token_type')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    localStorage.removeItem('is_admin')
    localStorage.removeItem('usuario_sesion')
    setUsuario(null)
  }

  /**
   * Obtiene el token actual
   */
  const getToken = () => {
    return localStorage.getItem('access_token')
  }

  /**
   * Valida si el usuario está autenticado
   */
  const isAuthenticated = () => {
    return !!getToken() && !!usuario
  }

  /**
   * Valida si el usuario es administrador
   */
  const isAdmin = () => {
    const result = isAuthenticated() && usuario?.is_admin === true
    console.debug('[isAdmin] Verificando permisos:', {
      isAuthenticated: isAuthenticated(),
      usuario_is_admin: usuario?.is_admin,
      tipo: typeof usuario?.is_admin,
      resultado: result,
    })
    return result
  }

  const value = {
    usuario,
    loading,
    setLoading,
    iniciarSesion,
    cerrarSesion,
    getToken,
    isAuthenticated,
    isAdmin,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser debe ser usado dentro de UserProvider')
  }
  return context
}
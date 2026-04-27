import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    // Verificar si hay token activo en localStorage
    const token = localStorage.getItem('access_token')
    const user_id = localStorage.getItem('user_id')
    const user_email = localStorage.getItem('user_email')
    
    if (token && user_id && user_email) {
      return {
        user_id,
        email: user_email,
        isAuthenticated: true,
      }
    }
    return null
  })

  const [loading, setLoading] = useState(false)

  /**
   * Inicia sesión con datos del usuario y token JWT
   * @param {Object} data - { access_token, token_type, user_id, email }
   */
  const iniciarSesion = (data) => {
    const { access_token, token_type, user_id, email } = data
    
    // Guardar en localStorage
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('token_type', token_type || 'bearer')
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('user_email', email)
    
    // Actualizar estado
    setUsuario({
      user_id,
      email,
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

  const value = {
    usuario,
    loading,
    setLoading,
    iniciarSesion,
    cerrarSesion,
    getToken,
    isAuthenticated,
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
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario_sesion')
    return guardado ? JSON.parse(guardado) : null
  })

  const iniciarSesion = (user) => {
    localStorage.setItem('usuario_sesion', JSON.stringify(user))
    setUsuario(user)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('usuario_sesion')
    setUsuario(null)
  }

  return (
    <UserContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
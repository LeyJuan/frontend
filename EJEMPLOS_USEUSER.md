# Ejemplos de Uso - Hook useUser()

Este archivo contiene ejemplos prácticos de cómo usar el hook `useUser()` en diferentes componentes.

## Ejemplo 1: Mostrar Información del Usuario

```jsx
import { useUser } from '../context/UserContext'

export default function PerfilCard() {
  const { usuario, isAuthenticated } = useUser()
  
  if (!isAuthenticated()) {
    return <p>Debes iniciar sesión</p>
  }
  
  return (
    <div className="card">
      <h2>Mi Perfil</h2>
      <p>Email: {usuario.email}</p>
      <p>ID: {usuario.user_id}</p>
    </div>
  )
}
```

## Ejemplo 2: Componente que Requiere Autenticación

```jsx
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const { usuario, isAuthenticated } = useUser()
  const navigate = useNavigate()
  
  // Si no está autenticado, redirigir
  if (!isAuthenticated()) {
    navigate('/login')
    return null
  }
  
  return (
    <div>
      <h1>Panel Administrador</h1>
      <p>Bienvenido, {usuario.email}</p>
    </div>
  )
}
```

## Ejemplo 3: Condicionales en UI Basados en Autenticación

```jsx
import { useUser } from '../context/UserContext'

export default function Header() {
  const { usuario, isAuthenticated } = useUser()
  
  return (
    <header>
      <h1>VoxPopuli</h1>
      
      {isAuthenticated() ? (
        <div>
          <span>Hola, {usuario.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </header>
  )
}
```

## Ejemplo 4: Hacer Request Solo si Está Autenticado

```jsx
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { usersClient } from '../api/client'

export default function UserReports() {
  const { usuario, isAuthenticated, getToken } = useUser()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!isAuthenticated()) return
    
    const fetchReports = async () => {
      setLoading(true)
      try {
        // El token se agrega automáticamente por el interceptor
        const response = await usersClient.get(`/reports/user/${usuario.user_id}`)
        setReports(response.data)
      } catch (error) {
        console.error('Error cargando reportes:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchReports()
  }, [usuario.user_id, isAuthenticated])
  
  if (!isAuthenticated()) {
    return <p>Debes iniciar sesión para ver tus reportes</p>
  }
  
  return (
    <div>
      <h2>Mis Reportes</h2>
      {loading && <p>Cargando...</p>}
      {reports.map(report => (
        <div key={report.id_reporte}>
          <h3>{report.descripcion}</h3>
          <p>Ubicación: {report.ubicacion}</p>
        </div>
      ))}
    </div>
  )
}
```

## Ejemplo 5: Usar Token Directamente (Si lo Necesitas)

```jsx
import { useUser } from '../context/UserContext'

export default function DebugInfo() {
  const { usuario, getToken } = useUser()
  
  const handleShowToken = () => {
    const token = getToken()
    console.log('Token actual:', token)
    console.log('Formato header:', `Authorization: Bearer ${token}`)
  }
  
  return (
    <button onClick={handleShowToken}>
      Ver Token (revisar consola)
    </button>
  )
}
```

## Ejemplo 6: Logout Programático

```jsx
import { useUser } from '../context/UserContext'
import { logout } from '../api/auth'

export default function ConfirmLogout() {
  const { usuario } = useUser()
  
  const handleLogout = () => {
    // logout() ya limpia token y redirige a /login
    logout()
  }
  
  return (
    <dialog>
      <p>¿Cerrar sesión {usuario.email}?</p>
      <button onClick={handleLogout}>Sí, cerrar sesión</button>
      <button onClick={() => dialog.close()}>Cancelar</button>
    </dialog>
  )
}
```

## Ejemplo 7: Form con Validación de Usuario

```jsx
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

export default function NuevoReporte() {
  const { usuario, isAuthenticated } = useUser()
  const navigate = useNavigate()
  const [form, setForm] = useState({ descripcion: '', ubicacion: '' })
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
    }
  }, [isAuthenticated])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // El usuario ya está validado por ProtectedRoute
    // Simplemente usa usuario.user_id para el request
    await fetch('/reports/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        id_usuario: usuario.user_id,
      }),
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />
      <input
        type="text"
        placeholder="Ubicación"
        value={form.ubicacion}
        onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
      />
      <button type="submit">Crear Reporte</button>
    </form>
  )
}
```

## Ejemplo 8: Validar Antes de Renderizar

```jsx
import { useUser } from '../context/UserContext'

export default function ProfilSecureData() {
  const { usuario, isAuthenticated, getToken } = useUser()
  
  // Doble validación
  if (!isAuthenticated()) return <p>No autenticado</p>
  if (!usuario) return <p>Cargando...</p>
  if (!getToken()) return <p>Token inválido</p>
  
  return (
    <div>
      <h2>Datos Seguros de {usuario.email}</h2>
      {/* Contenido seguro aquí */}
    </div>
  )
}
```

## Ejemplo 9: Loading State Durante Autenticación

```jsx
import { useUser } from '../context/UserContext'

export default function AutoAuthLoader() {
  const { usuario, loading } = useUser()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin">⏳ Cargando...</div>
      </div>
    )
  }
  
  if (!usuario) {
    return <p>No autenticado</p>
  }
  
  return <p>Autenticado como {usuario.email}</p>
}
```

## Ejemplo 10: Sincronizar Estado con Cambios en localStorage

```jsx
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'

export default function AutoLogoutOnChange() {
  const { usuario, cerrarSesion } = useUser()
  const [lastToken, setLastToken] = useState(null)
  
  // Detectar si el token cambió (logout en otra pestaña)
  useEffect(() => {
    const currentToken = localStorage.getItem('access_token')
    
    if (lastToken && !currentToken) {
      // Token fue eliminado en otra pestaña
      cerrarSesion()
      window.location.href = '/login'
    }
    
    setLastToken(currentToken)
  }, [])
  
  return <p>Token monitor activo</p>
}
```

---

## Métodos Disponibles en useUser()

```typescript
interface UseUser {
  usuario: {
    user_id: string
    email: string
    isAuthenticated: boolean
  } | null
  
  loading: boolean
  
  iniciarSesion(data: {
    access_token: string
    token_type: string
    user_id: string
    email: string
  }): void
  
  cerrarSesion(): void
  
  getToken(): string | null
  
  isAuthenticated(): boolean
}
```

## Tips Importantes

1. **Siempre valida** con `isAuthenticated()` antes de renderizar datos seguros
2. **Usa ProtectedRoute** para rutas que requieren autenticación
3. **El token se agrega automáticamente** a todos los requests via interceptor
4. **401 se maneja automáticamente** - limpia token y redirige
5. **No almacenes información sensible** en localStorage que no sea el token JWT

---

**Última actualización**: 2026-04-26

# Migración a Autenticación JWT - Guía de Integración

## Cambios Realizados

### 1. ✅ Servicio de Autenticación (`src/api/auth.js`)
Se creó un nuevo servicio con los siguientes métodos:

```javascript
// Login con email y contraseña
await login(email, contraseña)
// Retorna: { access_token, token_type, user_id, email }

// Registro de nuevo usuario (contraseña opcional)
await register(userData)
// userData puede no incluir 'contraseña' - se usa 'passwd123' por defecto

// Logout
await logout()
// Limpia token y redirige a login

// Validar si está autenticado
isAuthenticated()
// Retorna: boolean

// Obtener token actual
getToken()
// Retorna: string | null

// Obtener información del usuario
getUserInfo()
// Retorna: { user_id, email, token_type } | null
```

### 2. ✅ UserContext Mejorado (`src/context/UserContext.jsx`)
- Ahora almacena token JWT en localStorage
- Mantiene user_id y email del usuario logueado
- Método `isAuthenticated()` valida si hay token
- Método `getToken()` para obtener el token actual
- Sincroniza con localStorage automáticamente

### 3. ✅ LoginPage Actualizada (`src/pages/LoginPage.jsx`)
- **Tab "Entrar"**: Ahora requiere email Y contraseña
- **Tab "Registrar"**: Contraseña es OPCIONAL
  - Muestra mensaje informativo sobre contraseña por defecto
  - Valida email único
  - Maneja errores 401, 409, 400
- Mejor manejo de errores con mensajes claros
- Estados de éxito y error mejorados

### 4. ✅ Navbar Nuevo (`src/components/Navbar.jsx`)
Componente que debe agregarse al layout principal:
- Muestra email del usuario logueado
- Botón "Cerrar sesión" que limpia el token
- Solo se muestra si usuario está autenticado
- Links para navegar a home

### 5. ✅ ProtectedRoute Mejorada (`src/components/ProtectedRoute.jsx`)
- Ahora valida token JWT
- Redirige a /login si no hay autenticación
- Funciona como guard para rutas protegidas

### 6. ✅ CrearUsuarioPage Actualizada (`src/pages/CrearUsuarioPage.jsx`)
- Usa nuevo servicio de autenticación
- Soporta contraseña opcional
- Mejor validación de campos
- Manejo de errores 409 (email duplicado)

### 7. ✅ Client API (`src/api/client.js`)
**Ya configurado correctamente:**
- Interceptor de requests agrega `Authorization: Bearer <token>` automáticamente
- Interceptor de responses maneja 401 limpiando token y redirigiendo a login
- Los tokens expiran en 24 horas en el backend

## PRÓXIMOS PASOS - INTEGRAR EN TU APP

### Paso 1: Agregar Navbar al Layout Principal

En tu componente principal (probablemente `src/App.jsx`), importa y usa el Navbar:

```jsx
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />  {/* Agregar aquí */}
      {/* resto de tu app */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          } 
        />
        {/* más rutas */}
      </Routes>
    </div>
  )
}
```

### Paso 2: Proteger Rutas

Usa `ProtectedRoute` para rutas que requieren autenticación:

```jsx
<Route 
  path="/perfil" 
  element={
    <ProtectedRoute>
      <PerfilPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/nuevo-reporte" 
  element={
    <ProtectedRoute>
      <NuevoReportePage />
    </ProtectedRoute>
  } 
/>
```

### Paso 3: Usar el Hook useUser en Componentes

En cualquier componente, puedes acceder a la info del usuario:

```jsx
import { useUser } from '../context/UserContext'

export default function MiComponente() {
  const { usuario, isAuthenticated, getToken, cerrarSesion } = useUser()
  
  if (!isAuthenticated()) {
    return <p>Debes iniciar sesión</p>
  }
  
  return (
    <div>
      <p>Hola {usuario.email}</p>
      <p>Tu ID: {usuario.user_id}</p>
    </div>
  )
}
```

### Paso 4: Flujo de Login

El flujo automático es:

1. Usuario llena email + contraseña en LoginPage
2. Fronted hace POST a `/users/login` (automático)
3. Backend retorna `{ access_token, token_type, user_id, email }`
4. Frontend guarda token en localStorage
5. Todos los requests posteriores incluyen `Authorization: Bearer <token>`
6. Si recibe 401: limpia token y redirige a login (automático)

### Paso 5: Actualizar Otras Páginas si es Necesario

Si tienes otras páginas que usan datos del usuario, actualiza para usar `useUser()`:

```jsx
// Antes:
const user = JSON.parse(localStorage.getItem('usuario_sesion'))

// Ahora:
const { usuario } = useUser()
```

## Manejo de Errores - Resumen

| Error | Acción |
|-------|--------|
| 401 Unauthorized | Token inválido/expirado → Limpia token y redirige a login (automático) |
| 409 Conflict | Email ya registrado → Mostrar mensaje "Email ya registrado" |
| 400 Bad Request | Campos inválidos → Mostrar mensajes específicos de validación |
| 500 Server Error | Error del servidor → Mostrar "Intenta de nuevo más tarde" |

**El interceptor del client maneja automáticamente 401**, así que solo debes manejar otros errores en los catch de tus componentes.

## Testing de la Autenticación

### Crear usuario de prueba:
1. Ir a LoginPage → tab "Registrar"
2. Llenar: nombre, apellido, email
3. Dejar contraseña vacía (usa "passwd123" automáticamente)
4. Enviar

### Login:
1. Ir a LoginPage → tab "Entrar"
2. Email: mismo que en registro
3. Contraseña: `passwd123` (o la que especificaste)
4. Debería redirigir a home y mostrar navbar con tu email

### Logout:
1. En navbar, click "Cerrar sesión"
2. Debería limpiar token y redirigir a login

## Token en localStorage

El token se guarda bajo la clave `access_token`:

```javascript
// Acceder manualmente si lo necesitas:
const token = localStorage.getItem('access_token')
console.log(`Bearer ${token}`)
```

## Notas Importantes

⚠️ **Seguridad**: localStorage es accesible desde JavaScript, así que tokens pueden ser robados por XSS. Para mayor seguridad considera:
- Usar httpOnly cookies (requiere cambio en backend)
- Implementar CSRF protection
- Implementar token refresh (si backend lo soporta)

✅ **El interceptor automático** maneja:
- Agregar token a todos los requests
- Limpiar token cuando recibe 401
- Redirigir a login cuando es necesario

✅ **Contraseña por defecto**: Si no especificas contraseña en registro, backend usa "passwd123" automáticamente.

✅ **Token expira en 24 horas**: Después de ese tiempo, debe iniciar sesión nuevamente.

## Archivos Modificados

- ✅ `src/api/auth.js` - CREADO (nuevo servicio)
- ✅ `src/api/client.js` - YA CONFIGURADO (sin cambios necesarios)
- ✅ `src/context/UserContext.jsx` - ACTUALIZADO
- ✅ `src/pages/LoginPage.jsx` - ACTUALIZADO
- ✅ `src/pages/CrearUsuarioPage.jsx` - ACTUALIZADO
- ✅ `src/components/ProtectedRoute.jsx` - ACTUALIZADO
- ✅ `src/components/Navbar.jsx` - CREADO (nuevo componente)

## Próximos Pasos Opcionales

- [ ] Implementar refresh tokens (si backend los soporta)
- [ ] Agregar "Recordar contraseña" en LoginPage
- [ ] Validador de fortaleza de contraseña
- [ ] Toasts para notificaciones
- [ ] Avatar/foto del usuario en Navbar
- [ ] Perfil del usuario editable

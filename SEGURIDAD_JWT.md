# Seguridad JWT - Guía de Mejores Prácticas

## 🔐 Estado Actual de Seguridad

### ✅ Lo que Ya está Bien

1. **Interceptor automático** - El token se agrega automáticamente a todos los requests
2. **Manejo de 401** - El cliente limpia token y redirige cuando expira
3. **Token expira en 24 horas** - Reduce ventana de exposición si es robado
4. **HTTPS recomendado** - En producción, siempre usar HTTPS
5. **Token en localStorage** - Accesible por JavaScript (lado del usuario)

### ⚠️ Riesgos Actuales

1. **localStorage es accesible por XSS** - Un atacante con XSS puede robar el token
2. **No hay refresh tokens** - Si el token se roba, hay que esperar 24 horas para que expire
3. **No hay CSRF protection** - Aunque axios lo maneja parcialmente
4. **Token no está encriptado** - Es un JWT decodificable (pero no tamperable sin secret)

## 🛡️ Mejoras Recomendadas (En Orden de Prioridad)

### Nivel 1: CRÍTICO (Implementar Ahora)

#### 1.1 Usar httpOnly Cookies en lugar de localStorage

```javascript
// CAMBIAR de localStorage a httpOnly cookies

// En src/api/auth.js, cambiar:
// localStorage.setItem('access_token', access_token)
// POR: No hacer nada, el servidor establece la cookie automáticamente

// En src/api/client.js, cambiar:
// const token = localStorage.getItem('access_token')
// POR: Axios enviará la cookie automáticamente si está configurado
```

**Ventajas:**
- Cookie no es accesible por JavaScript
- Protegida contra XSS
- El navegador la envía automáticamente

**Desventajas:**
- Requiere cambios en backend
- Necesita CORS/credenciales configuradas
- Necesita SameSite policy

#### 1.2 Implementar CSRF Protection

Si usas cookies httpOnly, CSRF es un riesgo. Solución:

```javascript
// En axios config, agregar CSRF token
const instance = axios.create({
  withCredentials: true, // Enviar cookies
  headers: {
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
  }
})
```

#### 1.3 Content Security Policy (CSP)

Agregar al `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' http://localhost:* https://*;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
">
```

**Protege contra:**
- XSS (inyección de scripts)
- Clickjacking
- Man-in-the-middle

### Nivel 2: IMPORTANTE (Implementar en Sprint 2)

#### 2.1 Implementar Refresh Tokens

Estructura mejorada:

```javascript
// auth.js
export const login = async (email, contraseña) => {
  const response = await usersClient.post('/users/login', {
    email, contraseña
  })
  
  const { access_token, refresh_token, user_id, email: userEmail } = response.data
  
  // Access token: corta duración (1 hora)
  localStorage.setItem('access_token', access_token)
  
  // Refresh token: larga duración (7 días)
  // MEJOR: httpOnly cookie (más seguro)
  localStorage.setItem('refresh_token', refresh_token)
  
  return { access_token, refresh_token, user_id, email: userEmail }
}

// Renovar token automáticamente
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    const response = await axios.post('/users/refresh', {
      refresh_token: refreshToken
    })
    
    localStorage.setItem('access_token', response.data.access_token)
    return response.data.access_token
  } catch (error) {
    logout()
    throw error
  }
}
```

#### 2.2 Detectar Tokens Expirados y Renovar

```javascript
// En client.js, interceptor mejorado
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Intentar renovar token
        const newToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        // Si refresh falla, logout
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(err)
  }
)
```

#### 2.3 Validar Token en Frontend

```javascript
// auth.js
export const isTokenValid = () => {
  const token = getToken()
  if (!token) return false
  
  try {
    // Decodificar JWT (sin verificar firma)
    const [, payload] = token.split('.')
    const decoded = JSON.parse(atob(payload))
    
    // Verificar expiración
    const exp = decoded.exp * 1000 // Convertir a milisegundos
    const now = Date.now()
    
    return now < exp
  } catch {
    return false
  }
}

// Usar en UserContext
const isAuthenticated = () => {
  const token = getToken()
  return !!token && isTokenValid()
}
```

### Nivel 3: BUENO TENER (Futuro)

#### 3.1 Auditoria de Logins

```javascript
// Guardar info de login para revisar actividad sospechosa
const loginAttempt = {
  timestamp: new Date().toISOString(),
  email,
  ip: 'obtener del servidor',
  userAgent: navigator.userAgent,
  success: true/false
}
```

#### 3.2 Two-Factor Authentication (2FA)

```javascript
// login.js
const [twoFactorRequired, setTwoFactorRequired] = useState(false)
const [twoFactorCode, setTwoFactorCode] = useState('')

const handleLogin = async () => {
  const response = await login(email, contraseña)
  
  if (response.requires_2fa) {
    setTwoFactorRequired(true)
  } else {
    // Login exitoso
    iniciarSesion(response)
  }
}

const handleVerify2FA = async () => {
  const response = await verify2FA(twoFactorCode, email)
  iniciarSesion(response)
}
```

#### 3.3 Rate Limiting

```javascript
// Prevenir fuerza bruta
const loginAttempts = new Map()

const isRateLimited = (email) => {
  const attempts = loginAttempts.get(email) || []
  const recentAttempts = attempts.filter(
    time => Date.now() - time < 15 * 60 * 1000 // 15 minutos
  )
  
  if (recentAttempts.length >= 5) {
    return true
  }
  
  loginAttempts.set(email, [...recentAttempts, Date.now()])
  return false
}
```

## 📋 Checklist de Seguridad

### Antes de Producción

- [ ] HTTPS habilitado en servidor
- [ ] Headers de seguridad configurados
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Strict-Transport-Security
- [ ] CORS configurado correctamente
- [ ] Rate limiting en login
- [ ] Logs de autenticación
- [ ] Testing de seguridad XSS
- [ ] CSP headers configurados

### Mejoras Futuras

- [ ] Refresh tokens
- [ ] httpOnly cookies
- [ ] CSRF protection
- [ ] 2FA
- [ ] Biometric authentication
- [ ] OAuth2/OIDC
- [ ] Hardware security keys
- [ ] Rate limiting
- [ ] IP whitelisting
- [ ] Geo-blocking si es necesario

## 🔍 Testing de Seguridad

### Prueba XSS

Inyectar en inputs:
```javascript
<img src=x onerror="alert('XSS')">
<script>alert('XSS')</script>
```

Si aparece alert, hay vulnerabilidad XSS. El token podría ser robado.

### Prueba de Token Robo

1. Abrir DevTools → Application → localStorage
2. Copiar valor de `access_token`
3. En otra pestaña/navegador, agregar el token
4. Intentar acceder a rutas protegidas
5. Si funciona, hay vulnerabilidad

**Mitiga con:** httpOnly cookies (no accesible por JavaScript)

### Prueba de 401 Handling

1. Login normalmente
2. En DevTools, limpiar localStorage
3. Intentar acceder a ruta protegida
4. Debería redirigir a login

## 🌐 Configuración por Ambiente

### Desarrollo (localhost)

```javascript
// src/api/client.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const SECURE = false // HTTPS no requerido localmente
```

### Staging

```javascript
const API_URL = 'https://staging-api.example.com'
const SECURE = true
// Habilitar CSP, CORS restringido, HSTS
```

### Producción

```javascript
const API_URL = 'https://api.example.com'
const SECURE = true
// Máxima seguridad:
// - HTTPS obligatorio
// - CSP strict
// - CORS restringido
// - httpOnly cookies
// - Refresh tokens
// - Rate limiting
// - Monitoring
```

## 📚 Referencias y Recursos

- [OWASP JWT Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Auth0 Security Best Practices](https://auth0.com/blog/)
- [JWT.io](https://jwt.io) - Debugger y información

## ⚡ Quick Start para Mejorar Seguridad

**Ahora (30 minutos):**
1. Agregar CSP headers
2. Configurar CORS correctamente
3. Validar todos los inputs

**Esta semana:**
1. Implementar refresh tokens
2. Agregar validación de token en frontend

**Próximo sprint:**
1. Cambiar a httpOnly cookies
2. Implementar 2FA
3. Agregar auditoria de logs

---

**Última actualización**: 2026-04-26
**Estado**: 🟡 Seguridad Básica Implementada - Mejoras Pendientes

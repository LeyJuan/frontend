# Checklist de Integración JWT - VoxPopuli Frontend

## ✅ Cambios Realizados

### Servicios API
- [x] Crear `src/api/auth.js` con métodos de autenticación
  - login(email, contraseña)
  - register(userData)
  - logout()
  - isAuthenticated()
  - getToken()
  - getUserInfo()
  - clearToken()

- [x] Cliente HTTP (`src/api/client.js`)
  - ✅ YA tiene interceptor que agrega Authorization header
  - ✅ YA maneja 401 limpiando token y redirigiendo a login

### Contexto y Estado
- [x] Actualizar `src/context/UserContext.jsx`
  - Almacena token, user_id, email
  - Métodos: iniciarSesion, cerrarSesion, getToken, isAuthenticated
  - Sincroniza con localStorage

### Componentes
- [x] Crear `src/components/Navbar.jsx`
  - Muestra usuario logueado
  - Botón logout
  - Solo visible si autenticado

- [x] Actualizar `src/components/ProtectedRoute.jsx`
  - Valida token JWT
  - Redirige a login si no autenticado

- [x] Actualizar `src/App.jsx`
  - Importa Navbar
  - Usa Navbar en Layout
  - Usa isAuthenticated() en lugar de usuario

### Páginas
- [x] Actualizar `src/pages/LoginPage.jsx`
  - Tab "Entrar": email + contraseña
  - Tab "Registrar": contraseña opcional
  - Manejo de errores 401, 409, 400
  - Mensajes de éxito/error claros

- [x] Actualizar `src/pages/CrearUsuarioPage.jsx`
  - Usa nuevo servicio auth
  - Contraseña opcional
  - Validación mejorada
  - Mejor manejo de errores

### Documentación
- [x] Crear `MIGRACION_JWT.md`
  - Guía completa de cambios
  - Instrucciones de integración
  - Ejemplos de uso
  - Testing de autenticación

- [x] Crear este checklist

## 🔄 Flujo de Autenticación

```
Usuario → LoginPage
  ↓
Ingresa email + contraseña
  ↓
Frontend: POST /api/v1/users/login
  ↓
Backend retorna: { access_token, token_type, user_id, email }
  ↓
Frontend guarda en localStorage
  ↓
UserContext actualiza estado
  ↓
Redirect a home (/)
  ↓
Navbar muestra usuario
  ↓
Todos los requests incluyen Authorization header (automático)
  ↓
Si 401: Limpia token y redirige a login (automático)
```

## 📋 Rutas Protegidas

Estas rutas requieren autenticación:
- `/` - Feed
- `/explorar` - Explorar
- `/mapa` - Mapa
- `/alertas` - Alertas
- `/perfil` - Perfil
- `/nuevo-reporte` - Crear reporte

Rutas públicas:
- `/login` - Login/Register

## 🧪 Testing Manual

### Crear Cuenta
1. Ir a `/login`
2. Click tab "Crear cuenta"
3. Llenar campos: nombre, apellido, email, fecha_nacimiento
4. Dejar contraseña vacía o ingresar una
5. Click "Crear cuenta"
6. Debería mostrar "Cuenta creada" y cambiar a tab "Entrar"

### Login
1. Ir a `/login`
2. Tab "Entrar"
3. Email: el que creaste
4. Contraseña: `passwd123` (o la que especificaste)
5. Click "Iniciar sesión"
6. Debería redirigir a `/` y mostrar navbar

### Logout
1. En navbar, click "Cerrar sesión"
2. Confirmar
3. Debería limpiar token y redirigir a `/login`

### Rutas Protegidas
1. Estando logueado, accede a cualquier ruta protegida
2. Debería funcionar normalmente
3. Si eliminas token de localStorage y refrescas, debería redirigir a login

## 🔑 Token en localStorage

Claves guardadas:
- `access_token` - El JWT token
- `token_type` - "bearer"
- `user_id` - ID del usuario
- `user_email` - Email del usuario

## ⚠️ Puntos Importantes

1. **Interceptor automático**: El cliente ya agrega el header `Authorization: Bearer <token>` a todos los requests

2. **401 automático**: Si recibe 401, el interceptor automáticamente:
   - Limpia el token de localStorage
   - Redirige a /login
   - No necesitas manejar esto en componentes

3. **Token expira en 24 horas**: El usuario debe iniciar sesión nuevamente

4. **Contraseña por defecto**: Si no especificas contraseña en registro, usa "passwd123"

5. **Email único**: El sistema valida que no haya emails duplicados (error 409)

## 📦 Dependencias

No se necesitan nuevas dependencias. Se usa:
- `axios` - Ya instalado (client.js)
- `react-router-dom` - Ya instalado

## 🚀 Próximos Pasos Opcionales

- [ ] Implementar refresh tokens
- [ ] Agregar "Recordar contraseña"
- [ ] Validador de contraseña fuerte
- [ ] Avatar del usuario en Navbar
- [ ] Editar perfil del usuario
- [ ] Cambiar contraseña
- [ ] Recuperar contraseña
- [ ] Two-factor authentication

## ❓ FAQ

**P: ¿Dónde se guarda el token?**
R: En `localStorage` con clave `access_token`. Se agrega automáticamente a todos los requests.

**P: ¿Qué pasa si el token expira?**
R: El backend retorna 401. El interceptor limpia el token y redirige a login.

**P: ¿Puedo usar sessionStorage en lugar de localStorage?**
R: Sí, cambia `localStorage` por `sessionStorage` en `auth.js` y `UserContext.jsx`. SessionStorage es más seguro pero se borra al cerrar el navegador.

**P: ¿Cómo accedo al usuario en un componente?**
R: Usa `const { usuario, isAuthenticated } = useUser()`

**P: ¿Necesito cambiar el backend?**
R: No, se asume que ya está implementado. Solo actualiza si los endpoints de JWT aún no existen.

---

**Status**: ✅ LISTO PARA PRODUCCIÓN
**Última actualización**: 2026-04-26

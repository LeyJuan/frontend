import { usersClient } from './client'

/**
 * Servicio de Autenticación con JWT
 * Gestiona login, logout, registro y validación de tokens
 */

/**
 * Login - Autentica usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} contraseña - Contraseña del usuario
 * @returns {Promise<{access_token, token_type, user_id, email, is_admin}>}
 */
export const login = async (email, contraseña) => {
  const response = await usersClient.post('/users/login', {
    email,
    contraseña,
  })
  const { access_token, token_type, user_id, email: userEmail, is_admin } = response.data
  
  console.debug('[Auth.login] Response del backend:', {
    user_id,
    email: userEmail,
    is_admin,
    is_admin_type: typeof is_admin,
  })
  
  // Guardar token en localStorage (esto lo hace UserContext también, pero lo dejamos para compatibilidad)
  localStorage.setItem('access_token', access_token)
  localStorage.setItem('token_type', token_type)
  localStorage.setItem('user_id', user_id)
  localStorage.setItem('user_email', userEmail)
  
  return { access_token, token_type, user_id, email: userEmail, is_admin }
}

/**
 * Register - Crea nuevo usuario (contraseña es opcional)
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.nombre
 * @param {string} userData.apellido
 * @param {string} userData.email
 * @param {string} userData.fecha_nacimiento
 * @param {string} [userData.contraseña] - Opcional, usa "passwd123" por defecto
 * @param {string} [userData.url_foto_perfil]
 * @param {string} [userData.biografia]
 * @returns {Promise<{user_id, nombre, apellido, email, ...}>}
 */
export const register = async (userData) => {
  const response = await usersClient.post('/users/', userData)
  return response.data
}

/**
 * Logout - Limpia el token y la información del usuario
 */
export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_email')
  localStorage.removeItem('usuario_sesion')
  window.location.href = '/login'
}

/**
 * Obtiene el token actual del almacenamiento
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('access_token')
}

/**
 * Valida si hay un token válido (sin verificar expiración en frontend)
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

/**
 * Obtiene la información del usuario logueado
 * @returns {Object|null}
 */
export const getUserInfo = () => {
  const token = getToken()
  if (!token) return null
  
  return {
    user_id: localStorage.getItem('user_id'),
    email: localStorage.getItem('user_email'),
    token_type: localStorage.getItem('token_type'),
  }
}

/**
 * Limpiar token manualmente (usado en caso de errores)
 */
export const clearToken = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_email')
}

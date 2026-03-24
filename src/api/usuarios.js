import { usersClient } from './client'

/**
 * API de Usuarios — Puerto 8000
 *
 * Modelo real (MySQL):
 * {
 *   user_id:          int  (PK)
 *   nombre:           string
 *   apellido:         string
 *   email:            string (único)
 *   fecha_nacimiento: datetime
 *   fecha_creacion:   datetime
 *   calificacion:     float (0-100)
 *   numero_reportes:  int
 *   url_foto_perfil:  string (opcional)
 *   biografia:        string (opcional)
 * }
 */

/** Crear usuario */
export const crearUsuario = (datos) =>
  usersClient.post('/users/', datos).then((r) => r.data)

/** Obtener usuario por ID */
export const getUsuario = (userId) =>
  usersClient.get(`/users/${userId}`).then((r) => r.data)

/** Obtener usuario por email */
export const getUsuarioPorEmail = (email) =>
  usersClient.get(`/users/email/${email}`).then((r) => r.data)

/** Listar todos los usuarios */
export const getUsuarios = () =>
  usersClient.get('/users/').then((r) => r.data)

/** Actualizar usuario */
export const actualizarUsuario = (userId, datos) =>
  usersClient.put(`/users/${userId}`, datos).then((r) => r.data)

/** Eliminar usuario */
export const eliminarUsuario = (userId) =>
  usersClient.delete(`/users/${userId}`).then((r) => r.data)

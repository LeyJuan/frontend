import { notificationsClient } from './client'

/**
 * Obtener todas las notificaciones del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de notificaciones
 */
export const getNotificaciones = async (userId) => {
  try {
    const response = await notificationsClient.get(`/notifications/user/${userId}`)
    return response.data.notifications || []
  } catch (error) {
    console.error('Error al obtener notificaciones:', error)
    throw error
  }
}

/**
 * Obtener notificaciones no leídas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de notificaciones no leídas
 */
export const getNotificacionesNoLeidas = async (userId) => {
  try {
    const response = await notificationsClient.get(`/notifications/user/${userId}/unread`)
    return response.data.notifications || []
  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error)
    throw error
  }
}

/**
 * Obtener una notificación específica
 * @param {string} notificationId - ID de la notificación
 * @returns {Promise<Object>} Datos de la notificación
 */
export const getNotificacion = async (notificationId) => {
  try {
    const response = await notificationsClient.get(`/notifications/${notificationId}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener notificación:', error)
    throw error
  }
}

/**
 * Marcar una notificación como leída
 * @param {string} notificationId - ID de la notificación
 * @returns {Promise<Object>} Notificación marcada como leída
 */
export const marcarComoLeida = async (notificationId) => {
  try {
    const response = await notificationsClient.put(`/notifications/${notificationId}/read`)
    return response.data
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error)
    throw error
  }
}

/**
 * Marcar todas las notificaciones del usuario como leídas
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Respuesta de la operación
 */
export const marcarTodasComoLeidas = async (userId) => {
  try {
    const response = await notificationsClient.put(`/notifications/user/${userId}/read-all`)
    return response.data
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error)
    throw error
  }
}

/**
 * Eliminar una notificación
 * @param {string} notificationId - ID de la notificación
 * @returns {Promise<Object>} Respuesta de la operación
 */
export const eliminarNotificacion = async (notificationId) => {
  try {
    const response = await notificationsClient.delete(`/notifications/${notificationId}`)
    return response.data
  } catch (error) {
    console.error('Error al eliminar notificación:', error)
    throw error
  }
}

/**
 * Eliminar todas las notificaciones del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Respuesta de la operación
 */
export const eliminarTodasNotificaciones = async (userId) => {
  try {
    const response = await notificationsClient.delete(`/notifications/user/${userId}/delete-all`)
    return response.data
  } catch (error) {
    console.error('Error al eliminar todas las notificaciones:', error)
    throw error
  }
}

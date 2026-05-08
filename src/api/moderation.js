import axios from 'axios'

/**
 * Moderation API Client
 * Base URL: http://localhost:8003 (or proxied through Vite)
 * Requires JWT token with admin user (is_admin=true)
 */

const isProd = import.meta.env.PROD
const MODERATION_URL = isProd ? 'https://admin.vozciudadana.duckdns.org' : ''

function makeModerationClient(baseURL) {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
  })

  // Attach JWT token to all requests
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Handle errors
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        // Invalid/expired token
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )

  return instance
}

export const moderationClient = makeModerationClient(MODERATION_URL)

/**
 * Delete a report
 * @param {Object} data - { report_id, reason, description }
 * @returns {Promise} { status, message, action_id }
 */
export const deleteReport = async (data) => {
  const response = await moderationClient.post('/moderation/reports/delete', data)
  return response.data
}

/**
 * Close a user account
 * @param {Object} data - { user_id, reason, description, is_permanent }
 * @returns {Promise} { status, message, action_id }
 */
export const closeAccount = async (data) => {
  const response = await moderationClient.post('/moderation/accounts/close', data)
  return response.data
}

/**
 * Ban a user
 * @param {Object} data - { user_id, reason, duration_days?, description }
 * @returns {Promise} { status, message, action_id }
 */
export const banUser = async (data) => {
  const response = await moderationClient.post('/moderation/users/ban', data)
  return response.data
}

/**
 * Warn a user
 * @param {Object} data - { user_id, reason, description }
 * @returns {Promise} { status, message, action_id }
 */
export const warnUser = async (data) => {
  const response = await moderationClient.post('/moderation/users/warn', data)
  return response.data
}

/**
 * Review reported content
 * @param {Object} data - { report_id, action, reason?, notes? }
 * action can be: 'approve', 'reject', 'needs_more_info'
 * @returns {Promise} { status, message, action_id }
 */
export const reviewContent = async (data) => {
  const response = await moderationClient.post('/moderation/content/review', data)
  return response.data
}

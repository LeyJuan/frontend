import axios from 'axios'

/**
 * Analytics API Client
 * Base URL: http://localhost:8004 (or proxied through Vite)
 * No authentication required
 */

const isProd = import.meta.env.PROD
const ANALYTICS_URL = isProd ? 'https://metricas.vozciudadana.duckdns.org' : ''


const analyticsClient = axios.create({
  baseURL: ANALYTICS_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

/**
 * Record a metrics event
 * @param {Object} data - { event_type, entity_id, entity_type, user_id?, metadata? }
 * @returns {Promise} { metric_id, event_type, entity_id, entity_type, timestamp, user_id }
 */
export const recordMetric = async (data) => {
  const response = await analyticsClient.post('/metrics/record', data)
  return response.data
}

/**
 * Get metrics report for last N days
 * @param {Number} days - Number of days to report (default: 7)
 * @returns {Promise} { start_date, end_date, total_events, events_by_type }
 */
export const getMetricsReport = async (days = 7) => {
  const response = await analyticsClient.get(`/metrics/report?days=${days}`)
  return response.data
}

/**
 * Get daily statistics for a specific date
 * @param {String} date - ISO 8601 date string (e.g., '2026-05-04T00:00:00')
 * @returns {Promise} Array of { date, event_type, count }
 */
export const getDailyStats = async (date) => {
  const response = await analyticsClient.get(`/metrics/daily-stats?date=${date}`)
  return response.data
}

/**
 * Get metrics summary for a date range
 * @param {String} startDate - ISO 8601 start date
 * @param {String} endDate - ISO 8601 end date
 * @returns {Promise} { summary: {...}, date_range: {...} }
 */
export const getMetricsSummary = async (startDate, endDate) => {
  const response = await analyticsClient.get(
    `/metrics/summary?start_date=${startDate}&end_date=${endDate}`
  )
  return response.data
}

/**
 * Check analytics API health
 * @returns {Promise} { status: "healthy" }
 */
export const checkAnalyticsHealth = async () => {
  const response = await analyticsClient.get('/metrics/health')
  return response.data
}

import { useEffect, useState } from 'react'
import {
  getMetricsReport,
  getDailyStats,
  getMetricsSummary,
  checkAnalyticsHealth,
} from '../api/analytics'
import './AnalyticsDashboard.css'

export function AnalyticsDashboard() {
  const [metricsData, setMetricsData] = useState(null)
  const [dailyStats, setDailyStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [days, setDays] = useState(7)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Load metrics report
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      try {
        const data = await getMetricsReport(days)
        setMetricsData(data)
        setError(null)
      } catch (err) {
        setError('Error loading metrics: ' + (err.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [days])

  // Load daily stats
  useEffect(() => {
    if (!startDate || !endDate) return

    const fetchStats = async () => {
      try {
        const data = await getMetricsSummary(startDate, endDate)
        setDailyStats(data)
      } catch (err) {
        console.error('Error loading daily stats:', err)
      }
    }

    fetchStats()
  }, [startDate, endDate])

  const handleDateRangeChange = (e) => {
    const range = e.target.value
    const now = new Date()
    const startDateObj = new Date()

    switch (range) {
      case '7':
        startDateObj.setDate(now.getDate() - 7)
        break
      case '30':
        startDateObj.setDate(now.getDate() - 30)
        break
      case '90':
        startDateObj.setDate(now.getDate() - 90)
        break
      default:
        return
    }

    setStartDate(startDateObj.toISOString().split('T')[0])
    setEndDate(now.toISOString().split('T')[0])
  }

  if (loading) {
    return <div className="analytics-dashboard loading">Cargando métricas...</div>
  }

  if (error) {
    return <div className="analytics-dashboard error">{error}</div>
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Panel de Analítica</h2>
        <button onClick={() => window.location.reload()} className="refresh-btn">
          🔄 Actualizar
        </button>
      </div>

      <div className="controls">
        <label>
          Últimos días:
          <select onChange={(e) => setDays(parseInt(e.target.value))} value={days}>
            <option value={7}>7 días</option>
            <option value={14}>14 días</option>
            <option value={30}>30 días</option>
          </select>
        </label>

        <label>
          Rango personalizado:
          <select onChange={handleDateRangeChange}>
            <option value="">Seleccionar rango</option>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
        </label>
      </div>

      {metricsData && (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total de Eventos</h3>
            <div className="metric-value">{metricsData.total_events || 0}</div>
            <p className="metric-period">
              Del {metricsData.start_date} al {metricsData.end_date}
            </p>
          </div>

          {metricsData.events_by_type && (
            <div className="metric-card">
              <h3>Distribución de Eventos</h3>
              <div className="event-types">
                {Object.entries(metricsData.events_by_type).map(([type, count]) => (
                  <div key={type} className="event-type-item">
                    <span className="type-label">{type}</span>
                    <span className="type-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {dailyStats && dailyStats.summary && (
        <div className="analytics-details">
          <h3>Resumen del Período</h3>
          <pre className="json-display">{JSON.stringify(dailyStats.summary, null, 2)}</pre>
        </div>
      )}

      <div className="analytics-footer">
        <p>Las métricas se actualizan automáticamente cada 5 minutos</p>
      </div>
    </div>
  )
}

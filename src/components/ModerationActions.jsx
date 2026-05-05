import { useState } from 'react'
import { deleteReport, warnUser, banUser, closeAccount, reviewContent } from '../api/moderation'
import './ModerationActions.css'

export function DeleteReportForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({ report_id: '', reason: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.reason.length < 5) {
      setError('Razón debe tener al menos 5 caracteres')
      return
    }

    setLoading(true)
    try {
      await deleteReport(formData)
      setFormData({ report_id: '', reason: '', description: '' })
      onSuccess?.('Reporte eliminado exitosamente')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al eliminar reporte'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="moderation-form" onSubmit={handleSubmit}>
      <h3>Eliminar Reporte</h3>
      
      <div className="form-group">
        <label htmlFor="report_id">ID del Reporte</label>
        <input
          type="text"
          id="report_id"
          name="report_id"
          value={formData.report_id}
          onChange={handleChange}
          placeholder="UUID del reporte"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Razón (mínimo 5 caracteres)</label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Ej: Contenido violento"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detalles adicionales"
          rows="4"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Eliminando...' : 'Eliminar Reporte'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function WarnUserForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({ user_id: '', reason: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await warnUser(formData)
      setFormData({ user_id: '', reason: '', description: '' })
      onSuccess?.('Usuario advertido exitosamente')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al advertir usuario'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="moderation-form" onSubmit={handleSubmit}>
      <h3>Advertir Usuario</h3>
      
      <div className="form-group">
        <label htmlFor="user_id">ID del Usuario</label>
        <input
          type="number"
          id="user_id"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          placeholder="ID del usuario"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Razón</label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Ej: Lenguaje inapropiado"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detalles de la advertencia"
          rows="4"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Advirtiendo...' : 'Advertir Usuario'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function BanUserForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    user_id: '',
    reason: '',
    duration_days: '',
    description: '',
  })
  const [isPermanent, setIsPermanent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        user_id: formData.user_id,
        reason: formData.reason,
        description: formData.description,
      }
      if (!isPermanent && formData.duration_days) {
        data.duration_days = parseInt(formData.duration_days)
      }
      await banUser(data)
      setFormData({ user_id: '', reason: '', duration_days: '', description: '' })
      onSuccess?.('Usuario baneado exitosamente')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al banear usuario'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="moderation-form" onSubmit={handleSubmit}>
      <h3>Banear Usuario</h3>
      
      <div className="form-group">
        <label htmlFor="user_id">ID del Usuario</label>
        <input
          type="number"
          id="user_id"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          placeholder="ID del usuario"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Razón</label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Ej: Spam sistemático"
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isPermanent}
            onChange={(e) => setIsPermanent(e.target.checked)}
          />
          Ban permanente
        </label>
      </div>

      {!isPermanent && (
        <div className="form-group">
          <label htmlFor="duration_days">Días de ban</label>
          <input
            type="number"
            id="duration_days"
            name="duration_days"
            value={formData.duration_days}
            onChange={handleChange}
            placeholder="Ej: 7, 30"
            min="1"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detalles del ban"
          rows="4"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Baneando...' : 'Banear Usuario'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function CloseAccountForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    user_id: '',
    reason: '',
    description: '',
  })
  const [isPermanent, setIsPermanent] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await closeAccount({
        ...formData,
        user_id: formData.user_id,
        is_permanent: isPermanent,
      })
      setFormData({ user_id: '', reason: '', description: '' })
      onSuccess?.('Cuenta cerrada exitosamente')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al cerrar cuenta'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="moderation-form" onSubmit={handleSubmit}>
      <h3>Cerrar Cuenta de Usuario</h3>
      
      <div className="form-group">
        <label htmlFor="user_id">ID del Usuario</label>
        <input
          type="number"
          id="user_id"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          placeholder="ID del usuario"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Razón</label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Ej: Violación grave de términos"
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isPermanent}
            onChange={(e) => setIsPermanent(e.target.checked)}
          />
          Cierre permanente
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detalles del cierre de cuenta"
          rows="4"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary btn-danger">
          {loading ? 'Cerrando...' : 'Cerrar Cuenta'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function ReviewContentForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    report_id: '',
    action: 'approve',
    reason: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await reviewContent(formData)
      setFormData({ report_id: '', action: 'approve', reason: '', notes: '' })
      onSuccess?.('Contenido revisado exitosamente')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al revisar contenido'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="moderation-form" onSubmit={handleSubmit}>
      <h3>Revisar Contenido Reportado</h3>
      
      <div className="form-group">
        <label htmlFor="report_id">ID del Reporte</label>
        <input
          type="text"
          id="report_id"
          name="report_id"
          value={formData.report_id}
          onChange={handleChange}
          placeholder="UUID del reporte"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="action">Acción</label>
        <select
          id="action"
          name="action"
          value={formData.action}
          onChange={handleChange}
          required
        >
          <option value="approve">Aprobar (eliminar contenido)</option>
          <option value="reject">Rechazar (mantener contenido)</option>
          <option value="needs_more_info">Necesita más información</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="reason">Razón</label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Razón de la decisión"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notas</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notas adicionales"
          rows="4"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Revisar Contenido'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}

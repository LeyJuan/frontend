import { useState } from 'react'
import { useUser } from '../context/UserContext'
import {
  DeleteReportForm,
  WarnUserForm,
  BanUserForm,
  CloseAccountForm,
  ReviewContentForm,
} from '../components/ModerationActions'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'
import './AdminPage.css'

export default function AdminPage() {
  const { isAdmin } = useUser()
  const [activeTab, setActiveTab] = useState('moderation')
  const [successMessage, setSuccessMessage] = useState(null)
  const [activeForm, setActiveForm] = useState(null)

  // Check admin access
  if (!isAdmin()) {
    return (
      <div className="admin-page">
        <div className="permission-denied">
          <h2>❌ Acceso Denegado</h2>
          <p>Solo los administradores pueden acceder a este panel.</p>
          <p>Tu cuenta no tiene permisos de administrador.</p>
        </div>
      </div>
    )
  }

  const handleFormSuccess = (message) => {
    setSuccessMessage(message)
    setActiveForm(null)
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  const handleFormCancel = () => {
    setActiveForm(null)
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>🛡️ Panel de Administración</h1>
        <p>Moderación y Analítica de VoxPopuli</p>
      </header>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'moderation' ? 'active' : ''}`}
          onClick={() => setActiveTab('moderation')}
        >
          📋 Moderación
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analítica
        </button>
      </div>

      {successMessage && (
        <div className="success-banner">
          ✅ {successMessage}
        </div>
      )}

      <div className="admin-content">
        {/* MODERATION TAB */}
        {activeTab === 'moderation' && (
          <div className="moderation-section">
            <div className="section-header">
              <h2>Herramientas de Moderación</h2>
              <p>Manage reports, users, and content violations</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div
                className="action-card"
                onClick={() => setActiveForm('delete-report')}
                role="button"
                tabIndex={0}
              >
                <div className="action-icon">🗑️</div>
                <h3>Eliminar Reporte</h3>
                <p>Remover un reporte de la plataforma</p>
              </div>

              <div
                className="action-card"
                onClick={() => setActiveForm('review-content')}
                role="button"
                tabIndex={0}
              >
                <div className="action-icon">👁️</div>
                <h3>Revisar Contenido</h3>
                <p>Revisar y decidir sobre reportes</p>
              </div>

              <div
                className="action-card"
                onClick={() => setActiveForm('warn-user')}
                role="button"
                tabIndex={0}
              >
                <div className="action-icon">⚠️</div>
                <h3>Advertir Usuario</h3>
                <p>Enviar advertencia a usuario</p>
              </div>

              <div
                className="action-card"
                onClick={() => setActiveForm('ban-user')}
                role="button"
                tabIndex={0}
              >
                <div className="action-icon">🚫</div>
                <h3>Banear Usuario</h3>
                <p>Ban temporal o permanente</p>
              </div>

              <div
                className="action-card"
                onClick={() => setActiveForm('close-account')}
                role="button"
                tabIndex={0}
              >
                <div className="action-icon">🔒</div>
                <h3>Cerrar Cuenta</h3>
                <p>Cerrar cuenta de usuario</p>
              </div>
            </div>

            {/* Forms */}
            {activeForm === 'delete-report' && (
              <DeleteReportForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}

            {activeForm === 'review-content' && (
              <ReviewContentForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}

            {activeForm === 'warn-user' && (
              <WarnUserForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}

            {activeForm === 'ban-user' && (
              <BanUserForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}

            {activeForm === 'close-account' && (
              <CloseAccountForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <AnalyticsDashboard />
          </div>
        )}
      </div>

      <footer className="admin-footer">
        <p>
          ⚠️ <strong>Nota:</strong> Todas las acciones de moderación se registran y pueden ser auditadas.
        </p>
      </footer>
    </div>
  )
}

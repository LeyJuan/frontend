import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar           from './components/Navbar'
import BottomNav        from './components/BottomNav'
import ProtectedRoute   from './components/ProtectedRoute'
import { DebugNotificaciones } from './components/DebugNotificaciones'
import FeedPage         from './pages/FeedPage'
import PerfilPage       from './pages/PerfilPage'
import NuevoReportePage from './pages/NuevoReportePage'
import AdminPage        from './pages/AdminPage'
import LoginPage        from './pages/LoginPage'
import { ExplorarPage, MapaPage, AlertasPage } from './pages/Placeholders'
import { useUser } from './context/UserContext'

function Layout({ children }) {
  const { isAuthenticated } = useUser()
  return (
    <>

      {children}
      {isAuthenticated() && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/"              element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/explorar"      element={<ProtectedRoute><ExplorarPage /></ProtectedRoute>} />
          <Route path="/mapa"          element={<ProtectedRoute><MapaPage /></ProtectedRoute>} />
          <Route path="/alertas"       element={<ProtectedRoute><AlertasPage /></ProtectedRoute>} />
          <Route path="/perfil"        element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
          <Route path="/nuevo-reporte" element={<ProtectedRoute><NuevoReportePage /></ProtectedRoute>} />
          <Route path="/admin"         element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav        from './components/BottomNav'
import ProtectedRoute   from './components/ProtectedRoute'
import FeedPage         from './pages/FeedPage'
import PerfilPage       from './pages/PerfilPage'
import NuevoReportePage from './pages/NuevoReportePage'
import LoginPage        from './pages/LoginPage'
import { ExplorarPage, MapaPage, AlertasPage } from './pages/Placeholders'
import { useUser } from './context/UserContext'

function Layout({ children }) {
  const { usuario } = useUser()
  return (
    <>
      {children}
      {usuario && <BottomNav />}
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
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
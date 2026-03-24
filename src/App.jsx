import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav  from './components/BottomNav'
import FeedPage   from './pages/FeedPage'
import PerfilPage from './pages/PerfilPage'
import { ExplorarPage, MapaPage, AlertasPage, NuevoReportePage } from './pages/Placeholders'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<FeedPage />}         />
        <Route path="/explorar"      element={<ExplorarPage />}     />
        <Route path="/mapa"          element={<MapaPage />}         />
        <Route path="/alertas"       element={<AlertasPage />}      />
        <Route path="/perfil"        element={<PerfilPage />}       />
        <Route path="/nuevo-reporte" element={<NuevoReportePage />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}

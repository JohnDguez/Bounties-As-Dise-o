import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RutaProtegida from './components/RutaProtegida'
import { AuthProvider } from './lib/AuthContext'
import LoginAdmin from './paginas/LoginAdmin'
import PanelAdmin from './paginas/PanelAdmin'
import VistaColaborador from './paginas/VistaColaborador'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<VistaColaborador />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route
            path="/admin"
            element={
              <RutaProtegida>
                <PanelAdmin />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function RutaProtegida({ children }) {
  const { sesion, rol, cargando } = useAuth()

  // Mientras se confirma la sesión no se decide nada todavía — evita un
  // parpadeo hacia el login para alguien que sí tiene sesión válida.
  if (cargando) return null

  if (!sesion || rol !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

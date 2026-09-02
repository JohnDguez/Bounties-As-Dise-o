import Pagina from '../components/Pagina'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import styles from './PanelAdmin.module.css'

export default function PanelAdmin() {
  const { sesion } = useAuth()

  return (
    <Pagina>
      <h1>Panel de administrador</h1>
      <p>Sesión iniciada como {sesion?.user?.email}</p>
      <button className={styles.boton} onClick={() => supabase.auth.signOut()}>
        Cerrar sesión
      </button>
    </Pagina>
  )
}

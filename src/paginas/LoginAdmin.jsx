import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagina from '../components/Pagina'
import { supabase } from '../lib/supabase'
import styles from './LoginAdmin.module.css'

export default function LoginAdmin() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function enviar(e) {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const { data, error: errorLogin } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    })

    if (errorLogin) {
      setError('Correo o contraseña incorrectos.')
      setCargando(false)
      return
    }

    // Login correcto no es suficiente: sin esta verificación, cualquier
    // cuenta de Auth que exista (incluso una vieja de prueba) entraría al
    // panel. Solo rol = admin pasa.
    const { data: perfil, error: errorPerfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', data.user.id)
      .single()

    if (errorPerfil || perfil.rol !== 'admin') {
      await supabase.auth.signOut()
      setError('Esta cuenta no tiene permisos de administrador.')
      setCargando(false)
      return
    }

    setCargando(false)
    navigate('/admin')
  }

  return (
    <Pagina>
      <h1>Acceso de administrador</h1>
      <form className={styles.formulario} onSubmit={enviar}>
        <input
          className={styles.campo}
          type="email"
          autoComplete="username"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          className={styles.campo}
          type="password"
          autoComplete="current-password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button className={styles.boton} type="submit" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Pagina>
  )
}

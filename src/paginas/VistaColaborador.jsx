import { useState } from 'react'
import { Link } from 'react-router-dom'
import Pagina from '../components/Pagina'
import { usePinColaborador } from '../lib/usePinColaborador'
import styles from './VistaColaborador.module.css'

function PantallaPin({ onIntentar, error, cargando }) {
  const [valor, setValor] = useState('')

  function enviar(e) {
    e.preventDefault()
    onIntentar(valor)
  }

  return (
    <Pagina>
      <h1>Bounties As Diseño</h1>
      <form className={styles.formulario} onSubmit={enviar}>
        <input
          className={styles.campoPin}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          autoFocus
          value={valor}
          onChange={(e) => setValor(e.target.value.replace(/\D/g, ''))}
          placeholder="PIN de 6 dígitos"
        />
        <button className={styles.boton} type="submit" disabled={cargando || valor.length !== 6}>
          {cargando ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </Pagina>
  )
}

export default function VistaColaborador() {
  const { datos, error, cargando, intentarPin } = usePinColaborador()

  if (!datos) {
    return <PantallaPin onIntentar={intentarPin} error={error} cargando={cargando} />
  }

  // Placeholder de la Fase 3: solo confirma que resumen_colaborador() ya
  // llega hasta acá con datos reales. La escalera, la bandera y el reloj
  // de arena de "mes no iniciado" se construyen en la Fase 4.
  return (
    <Pagina>
      <h1>Bounties As Diseño</h1>
      <p>Estado del mes: {datos.estado_mes}</p>
      {datos.avance_pct !== null && <p>Avance: {datos.avance_pct}%</p>}
      {datos.dias_restantes !== null && <p>Días restantes: {datos.dias_restantes}</p>}
      <Link className={styles.linkAdmin} to="/admin/login">
        Acceder como administrador
      </Link>
    </Pagina>
  )
}

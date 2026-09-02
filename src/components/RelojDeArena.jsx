import { Link } from 'react-router-dom'
import styles from './RelojDeArena.module.css'

export default function RelojDeArena() {
  return (
    <main className={styles.contenedor}>
      <svg viewBox="0 0 100 140" className={styles.reloj} role="img" aria-label="Mes sin iniciar">
        <path d="M20,10 H80 L55,70 L80,130 H20 L45,70 Z" className={styles.marco} fill="none" />
        <circle cx="50" cy="28" r="4" className={styles.granoArriba} />
        <circle cx="50" cy="112" r="4" className={styles.granoAbajo} />
        <rect x="48" y="60" width="4" height="20" className={styles.hilo} />
      </svg>
      <h1 className={styles.marca}>Bounties As Diseño</h1>
      <p className={styles.titulo}>Todavía no arranca el mes</p>
      <p className={styles.subtitulo}>
        En cuanto el administrador lo abra, aquí va a aparecer el avance del equipo.
      </p>
      <Link className={styles.linkAdmin} to="/admin">
        Acceder como administrador
      </Link>
    </main>
  )
}

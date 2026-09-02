import styles from './Pagina.module.css'

export default function Pagina({ children }) {
  return <main className={styles.contenedor}>{children}</main>
}

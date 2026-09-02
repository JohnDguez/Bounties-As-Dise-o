import styles from './Modal.module.css'

export default function Modal({ titulo, subtitulo, onClose, children, pie }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.tarjeta} onClick={(e) => e.stopPropagation()}>
        <div className={styles.encabezado}>
          <div>
            <div className={styles.titulo}>{titulo}</div>
            {subtitulo && <div className={styles.subtitulo}>{subtitulo}</div>}
          </div>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className={styles.cuerpo}>{children}</div>
        {pie && <div className={styles.pie}>{pie}</div>}
      </div>
    </div>
  )
}

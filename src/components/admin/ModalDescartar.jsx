import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from './Modal'
import modal from './Modal.module.css'
import styles from './ModalDescartar.module.css'

export default function ModalDescartar({ pendiente, onClose, onExito }) {
  const [motivo, setMotivo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  async function confirmar() {
    setEnviando(true)
    setError(null)

    const { error: errorRpc } = await supabase.rpc('descartar_pendiente', {
      p_pendiente_id: pendiente.id,
      p_motivo: motivo,
    })

    setEnviando(false)

    if (errorRpc) {
      setError(errorRpc.message)
      return
    }

    onExito()
  }

  return (
    <Modal
      titulo="Descartar pendiente"
      subtitulo={`${pendiente.cliente} · ${pendiente.descripcion}`}
      onClose={onClose}
      pie={
        <>
          <button className={modal.botonSecundario} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={modal.botonPrincipal}
            onClick={confirmar}
            disabled={enviando || motivo.trim().length === 0}
          >
            Descartar
          </button>
        </>
      }
    >
      <span className={styles.aviso}>
        Descartar saca este trabajo de la bandeja para siempre, sin que entre a la meta. Pide un motivo por
        escrito y queda en el registro.
      </span>
      <label className={styles.campo}>
        <span className={styles.etiqueta}>MOTIVO DEL DESCARTE</span>
        <textarea
          className={styles.textarea}
          placeholder="El cliente canceló el proyecto por completo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </label>
      {error && <div className={modal.errorAviso}>{error}</div>}
    </Modal>
  )
}

import { useState } from 'react'
import { pesos } from '../../lib/formato'
import { supabase } from '../../lib/supabase'
import Modal from './Modal'
import modal from './Modal.module.css'
import styles from './ModalRegistrarPago.module.css'

export default function ModalRegistrarPago({ pendiente, meta, avanceActual, ivaPct, onClose, onExito }) {
  const [esAbono, setEsAbono] = useState(false)
  const [monto, setMonto] = useState(String(pendiente.saldo.toFixed(2)))
  const [incluyeIva, setIncluyeIva] = useState(true)
  const [mermaMonto, setMermaMonto] = useState('')
  const [mermaDescripcion, setMermaDescripcion] = useState('')
  const [depositado, setDepositado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  function alternarAbono() {
    const nuevo = !esAbono
    setEsAbono(nuevo)
    setMonto(nuevo ? '' : String(pendiente.saldo.toFixed(2)))
  }

  const montoNum = Number(monto) || 0
  const montoNeto = incluyeIva ? montoNum / (1 + ivaPct / 100) : montoNum
  const mermaNum = !esAbono ? Number(mermaMonto) || 0 : 0
  const avanceSube = meta > 0 ? (montoNeto / meta) * 100 : 0
  const avanceBaja = meta > 0 ? (mermaNum / meta) * 100 : 0
  const avanceFinalAprox = Number(avanceActual) + avanceSube - avanceBaja
  const saldoNuevo = Math.max(0, pendiente.saldo - montoNum)

  async function confirmar() {
    setEnviando(true)
    setError(null)

    const { error: errorRpc } = await supabase.rpc('registrar_pago', {
      p_pendiente_id: pendiente.id,
      p_monto: montoNum,
      p_incluye_iva: incluyeIva,
      p_es_liquidacion: !esAbono,
      p_merma_monto: mermaNum > 0 ? mermaNum : null,
      p_merma_descripcion: mermaNum > 0 ? mermaDescripcion : null,
    })

    setEnviando(false)

    if (errorRpc) {
      setError(errorRpc.message)
      return
    }

    onExito()
  }

  const puedeConfirmar = depositado && montoNum > 0 && !enviando

  return (
    <Modal
      titulo="Registrar pago"
      subtitulo={`${pendiente.cliente} · ${pendiente.descripcion}`}
      onClose={onClose}
      pie={
        <>
          <button className={modal.botonSecundario} onClick={onClose}>
            Cancelar
          </button>
          <button className={modal.botonPrincipal} onClick={confirmar} disabled={!puedeConfirmar}>
            {esAbono ? 'Registrar abono' : 'Liquidar trabajo'}
          </button>
        </>
      }
    >
      <div className={styles.datosTrabajo}>
        <Dato label="MONTO TOTAL" valor={pesos(pendiente.monto_total)} />
        <Dato label="ABONADO" valor={pesos(pendiente.abonado)} verde />
        <Dato label="SALDO ACTUAL" valor={pesos(pendiente.saldo)} />
      </div>

      <div className={styles.toggleFila}>
        <div className={styles.toggleTextos}>
          <span className={styles.toggleTitulo}>¿El cliente abonó una parte?</span>
          <span className={styles.toggleSub}>
            {esAbono
              ? 'Abono parcial: el trabajo sigue en la bandeja con su nuevo saldo.'
              : 'Apagado: es liquidación total del trabajo.'}
          </span>
        </div>
        <div
          className={`${styles.switch} ${esAbono ? styles.switchOn : ''}`}
          onClick={alternarAbono}
          role="switch"
          aria-checked={esAbono}
          tabIndex={0}
        >
          <div className={`${styles.switchBola} ${esAbono ? styles.switchBolaOn : ''}`} />
        </div>
      </div>

      <div className={styles.filaMonto}>
        <label className={styles.campoMonto}>
          <span className={styles.etiquetaCampo}>
            {esAbono ? 'MONTO DEL ABONO' : 'MONTO FINAL (editable)'}
          </span>
          <input
            className={styles.inputMonto}
            type="text"
            inputMode="decimal"
            value={monto}
            onChange={(e) => setMonto(e.target.value.replace(/[^0-9.]/g, ''))}
          />
        </label>
        <label className={styles.checkIva}>
          <input type="checkbox" checked={incluyeIva} onChange={(e) => setIncluyeIva(e.target.checked)} />
          <span className={styles.checkIvaTexto}>El monto incluye IVA</span>
        </label>
      </div>
      <span className={styles.ivaLinea}>
        {incluyeIva
          ? `Subtotal sin IVA: ${pesos(montoNeto)}`
          : 'Sin IVA: el monto entra completo a la meta.'}
      </span>

      {!esAbono && (
        <div className={styles.mermaBloque}>
          <div className={styles.mermaEncabezado}>
            <span className={styles.mermaTitulo}>¿Hubo merma en este trabajo?</span>
            <span className={styles.mermaSub}>Opcional. Solo al liquidar.</span>
          </div>
          <div className={styles.mermaCampos}>
            <label className={styles.campo}>
              <span className={styles.etiquetaCampo}>DESCRIPCIÓN DE LA MERMA</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Vuelta extra por falta de material"
                value={mermaDescripcion}
                onChange={(e) => setMermaDescripcion(e.target.value)}
              />
            </label>
            <label className={styles.campo}>
              <span className={styles.etiquetaCampo}>MONTO</span>
              <input
                className={`${styles.input} ${styles.inputDer}`}
                type="text"
                inputMode="decimal"
                placeholder="$0.00"
                value={mermaMonto}
                onChange={(e) => setMermaMonto(e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </label>
          </div>
        </div>
      )}

      <label className={styles.depositoFila}>
        <input
          type="checkbox"
          className={styles.depositoCheck}
          checked={depositado}
          onChange={(e) => setDepositado(e.target.checked)}
        />
        <div className={styles.depositoTextos}>
          <span className={styles.depositoTitulo}>El pago ya está depositado en la cuenta</span>
          <span className={styles.depositoSub}>Obligatorio. Nada entra a la meta sobre promesas de pago.</span>
        </div>
      </label>

      <div className={styles.resumen}>
        <span className={styles.resumenTitulo}>RESUMEN ANTES DE CONFIRMAR</span>
        <FilaResumen k="Entra a la meta (sin IVA)" v={'+' + pesos(montoNeto)} />
        <FilaResumen k="Sube el avance" v={'+' + avanceSube.toFixed(1) + ' pts'} />
        {mermaNum > 0 && <FilaResumen k="Baja por merma" v={'−' + avanceBaja.toFixed(1) + ' pts'} negativo />}
        {esAbono && <FilaResumen k="Queda de saldo, sigue en la bandeja" v={pesos(saldoNuevo)} />}
        <div className={styles.resumenFinal}>
          <span className={styles.resumenFinalTexto}>Avance del mes después de la operación (aprox.)</span>
          <span className={styles.resumenFinalValor}>{avanceFinalAprox.toFixed(1)}%</span>
        </div>
      </div>

      {error && <div className={modal.errorAviso}>{error}</div>}
    </Modal>
  )
}

function Dato({ label, valor, verde }) {
  return (
    <div className={styles.dato}>
      <span className={styles.datoLabel}>{label}</span>
      <span className={`${styles.datoValor} ${verde ? styles.datoValorVerde : ''}`}>{valor}</span>
    </div>
  )
}

function FilaResumen({ k, v, negativo }) {
  return (
    <div className={styles.resumenFila}>
      <span className={styles.resumenK}>{k}</span>
      <span className={styles.resumenV} style={{ color: negativo ? '#e9b06a' : '#8fd47a' }}>
        {v}
      </span>
    </div>
  )
}

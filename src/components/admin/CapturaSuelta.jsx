import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import styles from './CapturaSuelta.module.css'

const HOY = new Date().toISOString().slice(0, 10)

const TABS = [
  { id: 'pendiente', label: 'Pendiente nuevo' },
  { id: 'merma', label: 'Merma suelta' },
  { id: 'ajuste', label: 'Ajuste' },
]

export default function CapturaSuelta({ mesId, onExito }) {
  const { sesion } = useAuth()
  const [tab, setTab] = useState('pendiente')
  const [cliente, setCliente] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(HOY)
  const [incluyeIva, setIncluyeIva] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  function limpiar() {
    setCliente('')
    setDescripcion('')
    setMonto('')
    setFecha(HOY)
    setIncluyeIva(false)
  }

  async function guardar() {
    setEnviando(true)
    setMensaje(null)

    try {
      if (tab === 'pendiente') {
        const { error } = await supabase.from('pendientes').insert({
          cliente,
          descripcion,
          monto_total: Number(monto),
          fecha_entrega: fecha,
          estado: 'espera',
        })
        if (error) throw error
      } else {
        if (!mesId) throw new Error('No hay un mes abierto para registrar esto.')
        const { error } = await supabase.from('movimientos').insert({
          mes_id: mesId,
          tipo: tab, // 'merma' | 'ajuste'
          cliente,
          descripcion,
          monto_bruto: Number(monto),
          incluye_iva: incluyeIva,
          fecha,
          registrado_por: sesion?.user?.id,
        })
        if (error) throw error
      }

      setMensaje({ tipo: 'ok', texto: 'Guardado.' })
      limpiar()
      onExito()
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  const puedeGuardar = cliente.trim() && descripcion.trim() && Number(monto) > 0 && fecha && !enviando

  return (
    <div className={styles.tarjeta}>
      <div className={styles.encabezado}>
        <div>
          <div className={styles.titulo}>Captura suelta</div>
          <div className={styles.subtitulo}>Para lo que no viene de la bandeja</div>
        </div>
        <div className={styles.pestanas}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.pestana} ${tab === t.id ? styles.pestanaActiva : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.campos}>
        <label className={styles.campo}>
          <span className={styles.etiqueta}>CLIENTE</span>
          <input
            className={styles.input}
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Grupo Fetasa"
          />
        </label>
        <label className={styles.campo}>
          <span className={styles.etiqueta}>DESCRIPCIÓN</span>
          <input
            className={styles.input}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Lona 3x2 sucursal norte"
          />
        </label>
        <label className={styles.campo}>
          <span className={styles.etiqueta}>MONTO</span>
          <input
            className={`${styles.input} ${styles.inputDer}`}
            inputMode="decimal"
            value={monto}
            onChange={(e) => setMonto(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="$0.00"
          />
        </label>
        <label className={styles.campo}>
          <span className={styles.etiqueta}>{tab === 'pendiente' ? 'FECHA DE ENTREGA' : 'FECHA'}</span>
          <input className={styles.input} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
      </div>

      <div className={styles.piePagina}>
        {tab !== 'pendiente' ? (
          <label className={styles.checkIva}>
            <input type="checkbox" checked={incluyeIva} onChange={(e) => setIncluyeIva(e.target.checked)} />
            <span className={styles.checkIvaTexto}>El monto incluye IVA</span>
          </label>
        ) : (
          <span />
        )}
        <button className={styles.boton} onClick={guardar} disabled={!puedeGuardar}>
          Guardar
        </button>
      </div>

      {mensaje && (
        <span className={`${styles.aviso} ${mensaje.tipo === 'ok' ? styles.avisoOk : styles.avisoError}`}>
          {mensaje.texto}
        </span>
      )}
    </div>
  )
}

import { useState } from 'react'
import { pesos } from '../../lib/formato'
import ModalDescartar from './ModalDescartar'
import ModalRegistrarPago from './ModalRegistrarPago'
import styles from './Tablas.module.css'

function badgeDias(dias) {
  if (dias >= 30) return { bg: '#f6eee2', fg: '#8a5a2b' }
  if (dias >= 15) return { bg: '#f7f5f1', fg: '#5c5952' }
  return { bg: 'transparent', fg: '#1c1b18' }
}

export default function BandejaPendientes({ pendientes, meta, avanceActual, ivaPct, onExito }) {
  const [paraPago, setParaPago] = useState(null)
  const [paraDescarte, setParaDescarte] = useState(null)
  const totalSaldo = pendientes.reduce((acc, p) => acc + p.saldo, 0)

  function alTerminar() {
    setParaPago(null)
    setParaDescarte(null)
    onExito()
  }

  return (
    <div className={styles.tarjetaEnfasis}>
      <div className={styles.encabezado}>
        <div className={styles.encabezadoTextos}>
          <span className={styles.titulo}>Bandeja de pendientes</span>
          <span className={styles.subtitulo}>Entregados, esperando pago. No pertenecen a ningún mes.</span>
        </div>
        <div className={styles.encabezadoTextos}>
          <span className={styles.conteoBadge}>{pendientes.length} trabajos en espera</span>
          <span className={styles.montoBadge}>{pesos(totalSaldo)}</span>
        </div>
      </div>

      {pendientes.length === 0 ? (
        <div className={styles.vacio}>
          <div className={styles.vacioIcono} />
          <span className={styles.vacioTitulo}>Nada en espera</span>
          <span className={styles.vacioTexto}>
            Todos los trabajos entregados están liquidados. Los nuevos aparecerán aquí al registrarlos como
            pendientes.
          </span>
        </div>
      ) : (
        <table className={styles.tabla}>
          <thead>
            <tr className={styles.filaEncabezado}>
              <th className={styles.th}>CLIENTE / TRABAJO</th>
              <th className={`${styles.th} ${styles.thDer}`}>TOTAL</th>
              <th className={`${styles.th} ${styles.thDer}`}>ABONADO</th>
              <th className={`${styles.th} ${styles.thDer}`}>SALDO</th>
              <th className={`${styles.th} ${styles.thAvance}`}>AVANCE DE PAGO</th>
              <th className={styles.th}>ENTREGA</th>
              <th className={`${styles.th} ${styles.thDer}`}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.map((p) => {
              const pw = p.monto_total > 0 ? Math.round((p.abonado / p.monto_total) * 100) : 0
              const dias = p.dias_esperando
              const badge = badgeDias(dias)
              return (
                <tr key={p.id} className={styles.fila}>
                  <td className={styles.td}>
                    <div className={styles.clienteNombre}>{p.cliente}</div>
                    <div className={styles.clienteDesc}>{p.descripcion}</div>
                  </td>
                  <td className={`${styles.td} ${styles.tdDer}`}>{pesos(p.monto_total)}</td>
                  <td className={`${styles.td} ${styles.tdDer}`}>{pesos(p.abonado)}</td>
                  <td className={`${styles.td} ${styles.tdDer} ${styles.tdFuerte}`}>{pesos(p.saldo)}</td>
                  <td className={styles.td}>
                    <div className={styles.barraProgreso}>
                      <div className={styles.barraProgresoLlena} style={{ width: `${pw}%` }} />
                    </div>
                    <div className={styles.progresoTexto}>{pw}% pagado</div>
                  </td>
                  <td className={styles.td}>
                    {p.fecha_entrega}
                    <br />
                    <span className={styles.diasBadge} style={{ background: badge.bg, color: badge.fg }}>
                      {dias} días
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.tdDer} ${styles.tdAcciones}`}>
                    <button className={styles.botonFilaPrincipal} onClick={() => setParaPago(p)}>
                      Registrar pago
                    </button>{' '}
                    <button className={styles.botonFilaSecundario} onClick={() => setParaDescarte(p)}>
                      Descartar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <div className={styles.piePagina}>Descartar pide un motivo por escrito y deja registro.</div>

      {paraPago && (
        <ModalRegistrarPago
          pendiente={paraPago}
          meta={meta}
          avanceActual={avanceActual}
          ivaPct={ivaPct}
          onClose={() => setParaPago(null)}
          onExito={alTerminar}
        />
      )}

      {paraDescarte && (
        <ModalDescartar pendiente={paraDescarte} onClose={() => setParaDescarte(null)} onExito={alTerminar} />
      )}
    </div>
  )
}

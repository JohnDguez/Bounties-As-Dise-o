import { pesos } from '../../lib/formato'
import styles from './Tablas.module.css'

const ESTILO_TIPO = {
  cobro: { bg: '#eef3ec', fg: '#3f6633', glyph: '●' },
  abono: { bg: '#eef1f6', fg: '#3d5580', glyph: '◐' },
  merma: { bg: '#f7efe4', fg: '#8a5a2b', glyph: '▲' },
  ajuste: { bg: '#f3f1ee', fg: '#5c5952', glyph: '◇' },
}

export default function MovimientosMes({ movimientos }) {
  return (
    <div className={styles.tarjeta}>
      <div className={styles.encabezado}>
        <span className={styles.titulo}>Movimientos del mes</span>
        <span className={styles.subtitulo}>Todo lo que ya entró al medidor</span>
      </div>

      {movimientos.length === 0 ? (
        <div className={styles.vacio}>
          <span className={styles.vacioTitulo}>El mes está recién abierto</span>
          <span className={styles.vacioTexto}>
            Aún no entra ningún movimiento al medidor. La captura llega en la siguiente fase.
          </span>
        </div>
      ) : (
        <table className={styles.tabla}>
          <thead>
            <tr className={styles.filaEncabezado}>
              <th className={styles.th}>TIPO</th>
              <th className={styles.th}>FECHA</th>
              <th className={styles.th}>CLIENTE</th>
              <th className={styles.th}>DESCRIPCIÓN</th>
              <th className={`${styles.th} ${styles.thDer}`}>BRUTO</th>
              <th className={`${styles.th} ${styles.thDer}`}>SIN IVA</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => {
              const e = ESTILO_TIPO[m.tipo]
              const negativo = m.tipo === 'merma' || m.tipo === 'ajuste'
              return (
                <tr key={m.id} className={styles.fila}>
                  <td className={styles.td}>
                    <span className={styles.tipoBadge} style={{ background: e.bg, color: e.fg }}>
                      <span>{e.glyph}</span>
                      {m.tipo.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.td}>{m.fecha}</td>
                  <td className={`${styles.td} ${styles.tdClienteFuerte}`}>
                    {m.cliente}
                  </td>
                  <td className={styles.td}>{m.descripcion}</td>
                  <td className={`${styles.td} ${styles.tdDer}`} style={{ color: negativo ? '#8a5a2b' : '#1c1b18' }}>
                    {negativo ? '−' : ''}
                    {pesos(m.monto_bruto)}
                  </td>
                  <td
                    className={`${styles.td} ${styles.tdDer} ${styles.tdFuerte}`}
                    style={{ color: negativo ? '#8a5a2b' : '#1c1b18' }}
                  >
                    {negativo ? '−' : ''}
                    {pesos(m.monto_neto)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

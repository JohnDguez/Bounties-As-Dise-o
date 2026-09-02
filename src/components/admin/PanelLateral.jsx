import { clamp, pesos } from '../../lib/formato'
import styles from './PanelLateral.module.css'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function mesLabel(anio, mes) {
  if (!anio || !mes) return '—'
  const nombre = MESES[mes - 1]
  return nombre.charAt(0).toUpperCase() + nombre.slice(1) + ' ' + anio
}

export function ReglasDelMes({ mes }) {
  return (
    <div className={styles.tarjeta}>
      <div className={styles.encabezadoReglas}>
        <div className={styles.encabezadoReglasTexto}>
          <span className={styles.titulo}>Reglas del mes</span>
          <span className={styles.estadoChip}>
            {mes.reglas_bloqueadas ? '⬤ BLOQUEADAS' : '○ EDITABLES'}
          </span>
        </div>
      </div>

      <FilaRegla label="Monto de la meta del mes" sub="Se fija al abrir el mes" valor={pesos(mes.meta)} />
      <FilaRegla label="Porcentaje destinado al bono" sub="Sobre el cobrado sin IVA" valor={`${mes.pct_bono}%`} />
      <FilaRegla
        label="Tramo salvavidas"
        sub={`${mes.salvavidas_pct_meta}% de meta libera ${mes.salvavidas_pct_bono}% del bono`}
        valor={`${mes.salvavidas_pct_meta}% / ${mes.salvavidas_pct_bono}%`}
      />
      <FilaRegla
        label="Tope de mermas sobre la bolsa"
        sub="Máximo que pueden restar"
        valor={`${mes.tope_mermas_pct}%`}
      />
      <FilaRegla
        label="Monto mínimo de merma"
        sub="Debajo se registra pero no descuenta"
        valor={pesos(mes.merma_minima)}
      />

      <div className={styles.direccionFila}>
        <div className={styles.reglaTextos}>
          <span className={styles.reglaLabel}>Liberado por decisión de dirección</span>
          <span className={styles.reglaSub}>{mes.nota_liberacion || 'Sin nota registrada.'}</span>
        </div>
        <span
          className={styles.direccionEstado}
          style={
            mes.liberado_por_direccion
              ? { background: '#eef3ec', color: '#3f6633' }
              : { background: '#f0ede8', color: '#5c5952' }
          }
        >
          {mes.liberado_por_direccion ? 'SÍ' : 'NO'}
        </span>
      </div>
    </div>
  )
}

export function DesgloseBolsa({ mes, resumen, ivaPct }) {
  const bruto16 = Number(resumen.cobrado_neto) * (1 + ivaPct / 100)
  const soloIva = bruto16 - Number(resumen.cobrado_neto)
  const bolsa = Number(resumen.bolsa)

  const items = [
    {
      n: '1',
      k: 'Cobrado bruto (con IVA)',
      sub: 'Suma de cobros y abonos del mes',
      v: pesos(bruto16),
      w: 100,
      bc: '#cdd8c6',
      negro: false,
    },
    {
      n: '2',
      k: `Menos IVA ${ivaPct}%`,
      sub: 'Lo que se va al SAT',
      v: '−' + pesos(soloIva),
      w: bruto16 > 0 ? clamp((soloIva / bruto16) * 100, 0, 100) : 0,
      bc: '#ddd8d0',
      negro: false,
    },
    {
      n: '3',
      k: 'Base para el bono',
      sub: 'Cobrado sin IVA',
      v: pesos(resumen.cobrado_neto),
      w: bruto16 > 0 ? clamp((Number(resumen.cobrado_neto) / bruto16) * 100, 0, 100) : 0,
      bc: '#8fae7f',
      fuerte: true,
    },
    {
      n: '4',
      k: `Por el ${mes.pct_bono}% del bono`,
      sub: 'Porcentaje de las reglas del mes',
      v: pesos(resumen.bolsa),
      w: 100,
      bc: '#cdd8c6',
      fuerte: true,
    },
    {
      n: '5',
      k: 'Menos mermas',
      sub: `Tope aplicado: máx. ${pesos(resumen.tope)}`,
      v: '−' + pesos(resumen.resta_mermas),
      w: bolsa > 0 ? clamp((Number(resumen.resta_mermas) / bolsa) * 100, 0, 100) : 0,
      bc: '#c98a3f',
      color: '#8a5a2b',
      fuerte: true,
    },
    {
      n: '6',
      k: 'Bolsa final a repartir',
      sub: 'Entre el equipo',
      v: pesos(resumen.bolsa_final),
      w: bolsa > 0 ? clamp((Number(resumen.bolsa_final) / bolsa) * 100, 0, 100) : 0,
      bc: '#41682f',
      fuerte: true,
    },
  ]

  return (
    <div className={styles.tarjeta}>
      <span className={styles.titulo}>Desglose de la bolsa</span>
      <p className={styles.sub}>Paso a paso, para explicarlo señalando la pantalla.</p>
      <div>
        {items.map((it) => (
          <div key={it.n} className={styles.desgloseItem}>
            <div className={styles.desgloseTop}>
              <div className={styles.desgloseIzq}>
                <span className={styles.desgloseNum}>{it.n}</span>
                <div>
                  <div className={styles.desgloseK} style={{ fontWeight: it.fuerte ? 700 : 400 }}>
                    {it.k}
                  </div>
                  <div className={styles.desgloseSub}>{it.sub}</div>
                </div>
              </div>
              <span
                className={styles.desgloseV}
                style={{ fontWeight: it.fuerte ? 700 : 400, color: it.color || '#1c1b18' }}
              >
                {it.v}
              </span>
            </div>
            <div className={styles.desgloseBarra}>
              <div className={styles.desgloseBarraLlena} style={{ width: `${it.w}%`, background: it.bc }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CierreHistorial({ historial }) {
  return (
    <div className={styles.tarjeta}>
      <span className={styles.titulo}>Meses cerrados</span>
      <p className={styles.sub}>Historial de cierres, más reciente primero.</p>
      {historial.length === 0 ? (
        <p className={styles.vacio}>Todavía no se ha cerrado ningún mes.</p>
      ) : (
        historial.map((h, i) => (
          <div key={i} className={styles.historialFila}>
            <span className={styles.historialMes}>{mesLabel(h.anio, h.mes)}</span>
            <span className={styles.historialMeta}>{pesos(h.meta)}</span>
            <span
              className={styles.historialAv}
              style={{ color: Number(h.avance_real) >= 100 ? '#3f6633' : '#8a5a2b' }}
            >
              {Number(h.avance_real).toFixed(0)}%
            </span>
            <span className={styles.historialBono}>{pesos(h.bolsa_final)}</span>
          </div>
        ))
      )}
    </div>
  )
}

function FilaRegla({ label, sub, valor }) {
  return (
    <div className={styles.reglaFila}>
      <div className={styles.reglaTextos}>
        <span className={styles.reglaLabel}>{label}</span>
        <span className={styles.reglaSub}>{sub}</span>
      </div>
      <span className={styles.reglaValor}>{valor}</span>
    </div>
  )
}

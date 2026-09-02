import { clamp, pct1, pesos } from '../../lib/formato'
import styles from './ResumenMes.module.css'

export default function ResumenMes({ mes, resumen }) {
  const meta = Number(mes.meta)
  const faltante = Math.max(0, meta - Number(resumen.neto_meta))
  const delta = Number(resumen.avance_sin_mermas) - Number(resumen.avance_real)

  const wNeto = clamp((Number(resumen.neto_meta) / meta) * 100, 0, 100)
  const wMerma = clamp((Number(resumen.mermas) / meta) * 100, 0, 100 - wNeto)
  const tickSalvavidas = clamp(Number(mes.salvavidas_pct_meta), 0, 100)

  const bolsa = Number(resumen.bolsa)
  const wBolsaFinal = bolsa > 0 ? clamp((Number(resumen.bolsa_final) / bolsa) * 100, 0, 100) : 0
  const wBolsaResta = bolsa > 0 ? clamp((Number(resumen.resta_mermas) / bolsa) * 100, 0, 100 - wBolsaFinal) : 0
  const tickTope = clamp(Number(mes.tope_mermas_pct), 0, 100)

  return (
    <div className={styles.fila}>
      <div className={styles.tarjeta}>
        <div className={styles.encabezadoAvance}>
          <div className={styles.avanceNumero}>
            <span className={styles.avanceGrande}>{pct1(resumen.avance_real)}</span>
            <div className={styles.avanceEtiquetas}>
              <span className={styles.avanceTitulo}>de la meta del mes</span>
              <span className={styles.avanceSub}>
                {pesos(resumen.neto_meta)} de {pesos(meta)}
              </span>
            </div>
          </div>
          <div className={styles.sinMermas}>
            <span className={styles.sinMermasEtiqueta}>SIN MERMAS SERÍA</span>
            <div className={styles.sinMermasValor}>
              <span className={styles.sinMermasNumero}>{pct1(resumen.avance_sin_mermas)}</span>
              <span className={styles.deltaBadge}>+{delta.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className={styles.barraWrap}>
          <div className={styles.tick} style={{ left: `${tickSalvavidas}%` }} />
          <div className={styles.tickEtiqueta} style={{ left: `${tickSalvavidas}%` }}>
            SALVAVIDAS {mes.salvavidas_pct_meta}%
          </div>
          <div className={styles.tickMeta} />
          <div className={styles.tickMetaEtiqueta}>META 100%</div>
          <div className={styles.barra}>
            <div className={styles.barraNeto} style={{ width: `${wNeto}%` }} />
            <div className={styles.barraMerma} style={{ width: `${wMerma}%` }} />
          </div>
        </div>

        <div className={styles.leyenda}>
          <ItemLeyenda color="#41682f" borde="#41682f" valor={pesos(resumen.neto_meta)} label="Neto que cuenta" />
          <ItemLeyenda
            color="#c98a3f"
            borde="#b87b34"
            valor={'−' + pesos(resumen.mermas)}
            label="Mermas del mes"
          />
          <ItemLeyenda color="#f0ede8" borde="#ddd8d0" valor={pesos(faltante)} label="Falta para la meta" />
          <ItemLeyenda color="#fff" borde="#c4beb4" valor={pesos(resumen.cobrado_neto)} label="Cobrado bruto sin IVA" />
        </div>

        <span className={styles.nota}>
          {Number(resumen.mermas) > 0 || Number(resumen.ajustes) > 0
            ? 'Las mermas y los ajustes son lo único que separa los dos números.'
            : 'Sin mermas ni ajustes todavía este mes.'}
        </span>
      </div>

      <div className={styles.tarjeta}>
        <div className={styles.bolsaEncabezado}>
          <span className={styles.bolsaTitulo}>Bolsa del bono</span>
          <span className={styles.bolsaSub}>{mes.pct_bono}% del cobrado sin IVA</span>
        </div>

        <div className={styles.bolsaBloque}>
          <div className={styles.bolsaFila}>
            <span className={styles.bolsaLabel}>Acumulada</span>
            <span className={styles.bolsaValor}>{pesos(resumen.bolsa)}</span>
          </div>
          <div className={styles.bolsaBarraFina}>
            <div className={styles.barraNeto} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className={styles.bolsaBloque}>
          <div className={styles.bolsaFila}>
            <span className={styles.bolsaLabelFuerte}>Final después de mermas</span>
            <span className={styles.bolsaValorFuerte}>{pesos(resumen.bolsa_final)}</span>
          </div>
          <div className={styles.bolsaBarraGruesa}>
            <div className={styles.barraNeto} style={{ width: `${wBolsaFinal}%` }} />
            <div className={styles.barraMerma} style={{ width: `${wBolsaResta}%` }} />
          </div>
        </div>

        <div className={styles.topeTick}>
          <div className={styles.topeTickMarca} style={{ left: `${tickTope}%` }} />
        </div>

        <span className={styles.nota}>
          La línea marca el tope: las mermas no pueden restar más del {mes.tope_mermas_pct}% de la bolsa (
          {pesos(resumen.tope)}). Restaron {pesos(resumen.resta_mermas)}.
        </span>
      </div>
    </div>
  )
}

function ItemLeyenda({ color, borde, valor, label }) {
  return (
    <div className={styles.leyendaItem}>
      <div className={styles.leyendaChip} style={{ background: color, borderColor: borde }} />
      <div className={styles.leyendaTexto}>
        <span className={styles.leyendaValor}>{valor}</span>
        <span className={styles.leyendaLabel}>{label}</span>
      </div>
    </div>
  )
}

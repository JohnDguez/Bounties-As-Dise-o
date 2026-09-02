import styles from './Escalera.module.css'

// Cuatro tramos de 25 puntos cada uno, igual que en el prototipo. El quinto
// (el rosa) solo aparece si se pasó de la meta.
const TRAMOS = [
  { desde: 0, hasta: 25, colorA: '#38bdf8', colorB: '#1d4ed8', glow: '#38bdf8', lbl: '25%' },
  { desde: 25, hasta: 50, colorA: '#4ade80', colorB: '#15803d', glow: '#4ade80', lbl: '50%' },
  { desde: 50, hasta: 75, colorA: '#fbbf24', colorB: '#b45309', glow: '#fbbf24', lbl: '75%', salvavidas: true },
  { desde: 75, hasta: 100, colorA: '#fb7185', colorB: '#f97316', glow: '#fb923c', lbl: '100%', bandera: true },
]

const ANCHO_BARRA = 74
const SEPARACION = 26
const ALTURAS = [90, 140, 190, 240, 285]
const BASE_Y = 300

function xDeBarra(i) {
  return 30 + i * (ANCHO_BARRA + SEPARACION)
}

function Bandera({ x, y, ganada }) {
  const altoAsta = 90
  return (
    <g>
      <rect
        x={x - 2}
        y={y - altoAsta}
        width="4"
        height={altoAsta}
        rx="2"
        className={ganada ? styles.astaGanada : styles.astaPendiente}
      />
      {ganada ? (
        <path
          d={`M${x},${y - altoAsta} c 20,8 40,-4 60,2 v 24 c -20,8 -40,-4 -60,2 Z`}
          className={styles.banderaOndeando}
        />
      ) : (
        <path
          d={`M${x},${y - altoAsta + 4} L${x + 32},${y - altoAsta + 12} L${x + 18},${y - altoAsta + 34} L${x + 26},${y - altoAsta + 48} L${x},${y - altoAsta + 44} Z`}
          className={styles.gallardete}
        />
      )}
    </g>
  )
}

export default function Escalera({ pct }) {
  const hayDesborde = pct > 100
  const numBarras = hayDesborde ? 5 : 4
  const anchoTotal = xDeBarra(numBarras - 1) + ANCHO_BARRA + 40

  return (
    <svg
      className={styles.escalera}
      viewBox={`0 0 ${anchoTotal} 340`}
      role="img"
      aria-label={`Avance del ${Math.round(pct)} por ciento`}
    >
      <defs>
        {TRAMOS.map((t, i) => (
          <linearGradient key={i} id={`grad-tramo-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.colorA} />
            <stop offset="100%" stopColor={t.colorB} />
          </linearGradient>
        ))}
        <linearGradient id="grad-desborde" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff2d9b" />
          <stop offset="55%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {TRAMOS.map((t, i) => {
        const x = xDeBarra(i)
        const alto = ALTURAS[i]
        const f = Math.max(0, Math.min(1, (pct - t.desde) / (t.hasta - t.desde)))
        const altoLleno = alto * f
        const lit = f > 0

        return (
          <g key={i}>
            <rect x={x} y={BASE_Y - alto} width={ANCHO_BARRA} height={alto} rx="8" className={styles.riel} />
            {lit && (
              <rect
                x={x}
                y={BASE_Y - altoLleno}
                width={ANCHO_BARRA}
                height={altoLleno}
                rx="8"
                fill={`url(#grad-tramo-${i})`}
                style={{ filter: `drop-shadow(0 0 10px ${t.glow}aa)` }}
              />
            )}
            <text
              x={x + ANCHO_BARRA / 2}
              y={BASE_Y + 22}
              textAnchor="middle"
              className={lit ? styles.etiquetaViva : styles.etiqueta}
            >
              {t.lbl}
            </text>

            {t.salvavidas && (
              <g>
                <rect
                  x={x + ANCHO_BARRA / 2 - 5}
                  y={BASE_Y - alto - 5}
                  width="10"
                  height="10"
                  transform={`rotate(45 ${x + ANCHO_BARRA / 2} ${BASE_Y - alto})`}
                  className={pct >= 75 ? styles.salvavidasOn : styles.salvavidasOff}
                />
                <text
                  x={x - 10}
                  y={BASE_Y - alto + 4}
                  textAnchor="end"
                  className={pct >= 75 ? styles.salvavidasTxtOn : styles.salvavidasTxtOff}
                >
                  SALVAVIDAS 75%
                </text>
              </g>
            )}

            {t.bandera && <Bandera x={x + ANCHO_BARRA / 2} y={BASE_Y - alto} ganada={pct >= 100} />}
          </g>
        )
      })}

      {hayDesborde &&
        (() => {
          const x = xDeBarra(4)
          const alto = ALTURAS[4]
          const f = Math.max(0, Math.min(1, (pct - 100) / 25))
          const altoLleno = alto * f
          return (
            <g>
              <rect x={x} y={BASE_Y - alto} width={ANCHO_BARRA} height={alto} rx="8" className={styles.riel} />
              <rect
                x={x}
                y={BASE_Y - altoLleno}
                width={ANCHO_BARRA}
                height={altoLleno}
                rx="8"
                fill="url(#grad-desborde)"
                style={{ filter: 'drop-shadow(0 0 14px #ff2d9baa)' }}
              />
              <text x={x + ANCHO_BARRA / 2} y={BASE_Y + 22} textAnchor="middle" className={styles.etiquetaDesborde}>
                125%
              </text>
            </g>
          )
        })()}
    </svg>
  )
}

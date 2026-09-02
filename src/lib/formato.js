export function pesos(n) {
  const v = Number(n) || 0
  const signo = v < 0 ? '−' : ''
  return signo + '$' + Math.abs(v).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function pct1(n) {
  return (Number(n) || 0).toFixed(1) + '%'
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

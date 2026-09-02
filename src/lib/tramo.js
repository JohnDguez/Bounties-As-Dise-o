// Portado directo de tramo()/pctColor/celebra del prototipo de Design.
// Nada de JSX aquí a propósito: es lógica pura, fácil de probar sola.

export function tramoInfo(pct) {
  if (pct >= 100) return { copy: '¡Meta cumplida!', tag: pct > 100 ? 'META REBASADA' : 'META CUMPLIDA' }
  if (pct >= 90) return { copy: 'Falta poquito, ya casi', tag: 'TRAMO FINAL' }
  if (pct >= 75) return { copy: 'Ya está el salvavidas asegurado', tag: 'SALVAVIDAS ASEGURADO' }
  if (pct >= 41) return { copy: 'Buen ritmo, sigan así', tag: 'EN MARCHA' }
  return { copy: 'Vamos arrancando', tag: 'ARRANQUE' }
}

export function colorInfo(pct) {
  if (pct >= 100) return { color: '#fde68a', shadow: '0 0 46px rgba(250,204,21,.35)' }
  if (pct >= 75) return { color: '#fdba74', shadow: '0 0 40px rgba(251,146,60,.22)' }
  if (pct >= 41) return { color: '#a7f3d0', shadow: '0 0 34px rgba(56,189,248,.16)' }
  return { color: '#bae6fd', shadow: '0 0 34px rgba(56,189,248,.16)' }
}

// null si todavía no toca celebrar (pct < 75)
export function celebraTexto(pct) {
  if (pct < 75) return null
  if (pct > 100) return 'Meta rebasada. La bandera sigue ondeando.'
  if (pct === 100) return 'Bandera arriba. Meta cumplida.'
  return 'Salvavidas cruzado. Ya está asegurado.'
}

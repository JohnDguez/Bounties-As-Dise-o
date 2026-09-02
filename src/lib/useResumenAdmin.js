import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

export function useResumenAdmin() {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [datos, setDatos] = useState(null)
  const vigente = useRef(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)

    try {
      const { data: mes, error: errorMes } = await supabase
        .from('meses')
        .select('*')
        .eq('estado', 'abierto')
        .order('anio', { ascending: false })
        .order('mes', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (errorMes) throw errorMes

      const { data: configRows, error: errorConfig } = await supabase
        .from('configuracion')
        .select('clave, valor')

      if (errorConfig) throw errorConfig
      const ivaPct = Number(configRows?.find((c) => c.clave === 'iva_pct')?.valor ?? 16)

      const { data: cierresRaw, error: errorCierres } = await supabase
        .from('cierres')
        .select('meta, avance_real, bolsa_final, mes_id, meses(anio, mes)')
        .order('mes_id', { ascending: false })
        .limit(6)

      if (errorCierres) throw errorCierres

      let resumen = null
      let movimientos = []

      if (mes) {
        const { data: resumenRows, error: errorResumen } = await supabase.rpc('calcular_resumen_mes', {
          p_mes_id: mes.id,
        })
        if (errorResumen) throw errorResumen
        resumen = resumenRows?.[0] ?? null

        const { data: movsRaw, error: errorMovs } = await supabase
          .from('movimientos')
          .select('*')
          .eq('mes_id', mes.id)
          .order('fecha', { ascending: true })
        if (errorMovs) throw errorMovs
        movimientos = movsRaw ?? []
      }

      const { data: pendientesRaw, error: errorPendientes } = await supabase
        .from('pendientes')
        .select('*, movimientos(monto_bruto, tipo)')
        .eq('estado', 'espera')
        .order('fecha_entrega', { ascending: true })

      if (errorPendientes) throw errorPendientes

      const pendientes = (pendientesRaw ?? []).map((p) => {
        const abonado = (p.movimientos ?? [])
          .filter((m) => m.tipo === 'cobro' || m.tipo === 'abono')
          .reduce((acc, m) => acc + Number(m.monto_bruto), 0)
        const diasEsperando = Math.max(0, Math.floor((Date.now() - new Date(p.fecha_entrega)) / 86400000))
        return { ...p, abonado, saldo: Number(p.monto_total) - abonado, dias_esperando: diasEsperando }
      })

      if (!vigente.current) return
      setDatos({
        mes,
        resumen,
        movimientos,
        pendientes,
        ivaPct,
        historial: (cierresRaw ?? []).map((c) => ({
          anio: c.meses?.anio,
          mes: c.meses?.mes,
          meta: c.meta,
          avance_real: c.avance_real,
          bolsa_final: c.bolsa_final,
        })),
      })
    } catch (err) {
      if (vigente.current) setError(err.message)
    } finally {
      if (vigente.current) setCargando(false)
    }
  }, [])

  useEffect(() => {
    vigente.current = true
    cargar()
    return () => {
      vigente.current = false
    }
  }, [cargar])

  return { cargando, error, datos, recargar: cargar }
}

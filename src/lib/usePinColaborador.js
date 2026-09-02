import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'

const CLAVE_STORAGE = 'bounties_pin_colaborador'
const INTERVALO_REFRESCO_MS = 60_000

// El PIN se guarda en sessionStorage (no localStorage): en una pantalla que
// se queda prendida todo el día esto es justo lo que se quiere — si se
// cierra la pestaña o el sistema mata la app en segundo plano, se olvida
// solo y hay que volver a escribirlo.
//
// También hay una razón técnica para guardar el PIN mismo, no solo un "ya
// entré": no existe una sesión del lado del servidor para el colaborador
// (es anon, sin login). Cada vez que se quiere refrescar el avance hay que
// volver a mandar el PIN — por eso el refresco automático de aquí abajo lo
// reenvía cada minuto en vez de solo pedir datos nuevos "porque sí".
export function usePinColaborador() {
  const [pin, setPin] = useState(() => sessionStorage.getItem(CLAVE_STORAGE))
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const intentarPin = useCallback(async (pinAProbar) => {
    setCargando(true)
    setError(null)

    const { data, error: errorRpc } = await supabase.rpc('resumen_colaborador', {
      p_pin: pinAProbar,
    })

    setCargando(false)

    if (errorRpc) {
      setError(errorRpc.message)
      return false
    }

    setDatos(data)
    setPin(pinAProbar)
    sessionStorage.setItem(CLAVE_STORAGE, pinAProbar)
    return true
  }, [])

  // Si ya había un PIN guardado de antes en esta pestaña, se usa una vez al
  // montar, sin pedirlo de nuevo.
  useEffect(() => {
    if (pin) intentarPin(pin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mientras la pantalla siga abierta, refresca el avance solo.
  useEffect(() => {
    if (!pin) return
    const intervalo = setInterval(() => intentarPin(pin), INTERVALO_REFRESCO_MS)
    return () => clearInterval(intervalo)
  }, [pin, intentarPin])

  return { datos, error, cargando, intentarPin }
}

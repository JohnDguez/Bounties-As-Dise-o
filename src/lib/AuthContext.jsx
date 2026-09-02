import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null)
  const [rol, setRol] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vigente = true

    // Estar logueado en Supabase Auth no es lo mismo que ser admin — el rol
    // vive en perfiles, así que hay que consultarlo aparte cada vez que
    // cambia la sesión (login, logout, o al recargar la página).
    async function cargarSesionYRol(sesionActual) {
      if (!vigente) return
      setSesion(sesionActual)

      if (!sesionActual) {
        setRol(null)
        setCargando(false)
        return
      }

      const { data, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', sesionActual.user.id)
        .single()

      if (!vigente) return
      setRol(error ? null : data.rol)
      setCargando(false)
    }

    supabase.auth.getSession().then(({ data }) => cargarSesionYRol(data.session))

    const { data: escucha } = supabase.auth.onAuthStateChange((_evento, sesionActual) => {
      cargarSesionYRol(sesionActual)
    })

    return () => {
      vigente = false
      escucha.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ sesion, rol, cargando }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

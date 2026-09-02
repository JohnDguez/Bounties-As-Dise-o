import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Revisa las variables ' +
      'de entorno en Vercel (o tu .env.local si corres esto en tu compu).'
  )
}

export const supabase = createClient(url, anonKey)

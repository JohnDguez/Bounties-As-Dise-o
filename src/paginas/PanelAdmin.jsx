import { Link } from 'react-router-dom'
import BandejaPendientes from '../components/admin/BandejaPendientes'
import MovimientosMes from '../components/admin/MovimientosMes'
import { CierreHistorial, DesgloseBolsa, ReglasDelMes } from '../components/admin/PanelLateral'
import ResumenMes from '../components/admin/ResumenMes'
import { useAuth } from '../lib/AuthContext'
import { useResumenAdmin } from '../lib/useResumenAdmin'
import { supabase } from '../lib/supabase'
import styles from './PanelAdmin.module.css'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export default function PanelAdmin() {
  const { sesion } = useAuth()
  const { cargando, error, datos } = useResumenAdmin()

  return (
    <main className={styles.pagina}>
      <div className={styles.contenido}>
        <header className={styles.encabezado}>
          <div className={styles.encabezadoIzq}>
            <span className={styles.marca}>Bounties As Diseño</span>
            <span className={styles.subtitulo}>
              PANEL ADMINISTRADOR{datos?.mes ? ` · ${MESES[datos.mes.mes - 1]} ${datos.mes.anio}` : ''}
            </span>
            {datos?.mes && (
              <span className={styles.estadoChip}>
                MES ABIERTO · {datos.mes.reglas_bloqueadas ? 'REGLAS FIJAS' : 'REGLAS EDITABLES'}
              </span>
            )}
          </div>
          <div className={styles.acciones}>
            <span className={styles.correo}>{sesion?.user?.email}</span>
            <Link to="/" className={styles.enlaceColaborador}>
              Ver vista de colaborador
            </Link>
            <button className={styles.boton} onClick={() => supabase.auth.signOut()}>
              Cerrar sesión
            </button>
          </div>
        </header>

        {cargando && <div className={styles.estadoCarga}>Cargando datos del mes…</div>}

        {error && <div className={styles.errorAviso}>No se pudo cargar el panel: {error}</div>}

        {!cargando && !error && datos && !datos.mes && (
          <div className={styles.estadoVacio}>
            No hay un mes abierto todavía. Abrir un mes nuevo llega en una fase próxima.
          </div>
        )}

        {!cargando && !error && datos?.mes && datos.resumen && (
          <>
            <ResumenMes mes={datos.mes} resumen={datos.resumen} />

            <div className={styles.filaPrincipal}>
              <div className={styles.columna}>
                <BandejaPendientes pendientes={datos.pendientes} />
                <MovimientosMes movimientos={datos.movimientos} />
              </div>
              <div className={styles.columna}>
                <ReglasDelMes mes={datos.mes} />
                <DesgloseBolsa mes={datos.mes} resumen={datos.resumen} ivaPct={datos.ivaPct} />
                <CierreHistorial historial={datos.historial} />
              </div>
            </div>
          </>
        )}

        {!cargando && !error && datos && !datos.mes && (
          <BandejaPendientes pendientes={datos.pendientes} />
        )}
      </div>
    </main>
  )
}

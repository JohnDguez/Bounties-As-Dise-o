import { useState } from 'react'
import { Link } from 'react-router-dom'
import Escalera from '../components/Escalera'
import RelojDeArena from '../components/RelojDeArena'
import { celebraTexto, colorInfo, tramoInfo } from '../lib/tramo'
import { usePinColaborador } from '../lib/usePinColaborador'
import styles from './VistaColaborador.module.css'

function PantallaPin({ onIntentar, error, cargando }) {
  const [valor, setValor] = useState('')

  function enviar(e) {
    e.preventDefault()
    onIntentar(valor)
  }

  return (
    <main className={styles.pantallaPin}>
      <h1 className={styles.marca}>Bounties As Diseño</h1>
      <form className={styles.formulario} onSubmit={enviar}>
        <input
          className={styles.campoPin}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          autoFocus
          value={valor}
          onChange={(e) => setValor(e.target.value.replace(/\D/g, ''))}
          placeholder="PIN de 6 dígitos"
        />
        <button className={styles.boton} type="submit" disabled={cargando || valor.length !== 6}>
          {cargando ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </main>
  )
}

function Tablero({ datos }) {
  const pct = datos.avance_pct
  const { copy, tag } = tramoInfo(pct)
  const { color, shadow } = colorInfo(pct)
  const celebra = celebraTexto(pct)

  return (
    <main className={styles.tablero}>
      <header className={styles.encabezado}>
        <div>
          <h1 className={styles.marca}>Bounties As Diseño</h1>
          <span className={styles.mesEtiqueta}>Meta del mes</span>
        </div>
      </header>

      <div className={styles.filaSuperior}>
        <div className={styles.columnaPct}>
          <div className={styles.pctNumero} style={{ color, textShadow: shadow }}>
            {Math.round(pct)}
            <span className={styles.pctSimbolo}>%</span>
          </div>
          <p className={styles.tramoCopy}>{copy}</p>
          <p className={styles.tramoTag}>{tag}</p>

          {celebra && <div className={styles.celebra}>{celebra}</div>}

          <div className={styles.diasCard}>
            <span className={styles.diasNumero}>{datos.dias_restantes}</span>
            <div className={styles.diasTexto}>
              <span>días restantes del mes</span>
            </div>
          </div>
        </div>

        <div className={styles.columnaEscalera}>
          <Escalera pct={pct} />
        </div>
      </div>

      <div className={styles.filaListas}>
        <section className={styles.lista}>
          <div className={styles.listaTitulo}>
            <span>TRABAJOS QUE SUMAN</span>
            <span className={styles.listaContador}>{datos.trabajos_suman.length}</span>
          </div>
          <div className={styles.listaItems}>
            {datos.trabajos_suman.length === 0 && (
              <p className={styles.listaVacia}>Nada registrado todavía este mes.</p>
            )}
            {datos.trabajos_suman.map((t, i) => (
              <div key={i} className={styles.itemTrabajo}>
                <div className={styles.puntoVivo} />
                <div className={styles.itemTexto}>
                  <span className={styles.itemCliente}>{t.cliente}</span>
                  <span className={styles.itemDesc}>{t.descripcion}</span>
                </div>
                <span className={styles.itemFecha}>{t.fecha}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.lista}>
          <div className={styles.listaTitulo}>
            <span>EN CAMINO</span>
            <span className={styles.listaContadorApagado}>{datos.pendientes_conteo}</span>
          </div>
          <p className={styles.listaNota}>
            Entregados y aprobados. Suman en cuanto el cliente termine de pagar.
          </p>
          <div className={styles.listaItems}>
            {datos.en_camino.length === 0 && <p className={styles.listaVacia}>Nada en espera de pago.</p>}
            {datos.en_camino.map((t, i) => (
              <div key={i} className={styles.itemEnCamino}>
                <div className={styles.itemEnCaminoTop}>
                  <span className={styles.itemCliente}>{t.cliente}</span>
                  <span className={styles.itemEspera}>hace {t.dias_esperando} días</span>
                </div>
                <div className={styles.itemDesc}>{t.descripcion}</div>
                <div className={styles.barraProgreso}>
                  <div className={styles.barraLlena} style={{ width: `${t.pct_pagado}%` }} />
                </div>
                <span className={styles.itemPct}>{t.pct_pagado}% pagado</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.listaMermas}>
          <div className={styles.listaTitulo}>
            <span>DETALLES A CUIDAR</span>
            <span>{datos.mermas.length}</span>
          </div>
          <div className={styles.listaItems}>
            {datos.mermas.length === 0 && <p className={styles.listaVacia}>Ninguna este mes. Así se debe ver.</p>}
            {datos.mermas.map((m, i) => (
              <div key={i} className={styles.itemMerma}>
                <span className={styles.itemCliente}>{m.cliente}</span>
                <span className={styles.itemDesc}>{m.descripcion}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Link className={styles.linkAdmin} to="/admin">
        Acceder como administrador
      </Link>
    </main>
  )
}

export default function VistaColaborador() {
  const { datos, error, cargando, intentarPin } = usePinColaborador()

  if (!datos) {
    return <PantallaPin onIntentar={intentarPin} error={error} cargando={cargando} />
  }

  if (datos.estado_mes === 'no_iniciado') {
    return <RelojDeArena />
  }

  return <Tablero datos={datos} />
}

function App() {
  const hoy = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="pagina">
      <h1>Bounties As Diseño</h1>
      <p className="estado">Fase 0 — tubería lista ✅</p>
      <p className="fecha">{hoy}</p>
    </main>
  )
}

export default App

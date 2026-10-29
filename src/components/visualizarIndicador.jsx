
export default function VisualizarIndicador({ indicador }) {
  if (!indicador) {
    return (
      <section className="container-fluid p-4">
        <h2>Visualizar indicador</h2>
        <p>Selecione um indicador no menu lateral.</p>
      </section>
    )
  }

  const url = indicador.Url

  let segura = false

  try {
    segura = ['http:', 'https:'].includes(
      new URL(url).protocol
    )
  } catch {
    // URL inválida
  }

  if (!segura) {
    return (
      <section className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          URL do indicador inválida.
        </div>
      </section>
    )
  }

  return (
    <section className="container-fluid p-4">
      <h2>{indicador.Nome}</h2>

      <p className="text-muted">
        {indicador.Descricao}
      </p>

      <iframe
        title={indicador.Nome}
        src={url}
        style={{
          width: '100%',
          height: '75vh',
          border: '1px solid #ddd',
          borderRadius: 8,
        }}
        referrerPolicy="strict-origin-when-cross-origin"
      />

      <p className="text-muted small mt-2">
        Se o painel não aparecer, o site pode bloquear
        a incorporação em outros aplicativos.
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-primary mt-2"
      >
        Abrir painel em nova aba
      </a>
    </section>
  )
}


import { useEffect, useState } from 'react'
import { indicadorService } from '../../services/indicadorService'

const vazio = {
  Nome: '',
  Descricao: '',
  Url: '',
}

export default function Indicadores({ atualizarMenu }) {
  const [itens, setItens] = useState([])
  const [form, setForm] = useState({ ...vazio })
  const [idEdicao, setIdEdicao] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function carregar() {
    try {
      setCarregando(true)

      const dados = await indicadorService.listar()

      if (!Array.isArray(dados)) {
        throw new Error('A API não retornou uma lista de indicadores.')
      }

      setItens(dados)
      setErro('')
    } catch (e) {
      setErro(e.message || 'Erro ao carregar os indicadores.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function alterar(event) {
    const { name, value } = event.target

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  async function salvar(event) {
    event.preventDefault()
    setErro('')

    try {
      const url = new URL(form.Url)

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('A URL deve começar com http:// ou https://')
      }

      if (idEdicao === null) {
        await indicadorService.cadastrar(form)
      } else {
        await indicadorService.atualizar(idEdicao, {
          Id: idEdicao,
          ...form,
        })
      }

      setForm({ ...vazio })
      setIdEdicao(null)

      await carregar()
      await atualizarMenu()
    } catch (e) {
      setErro(e.message || 'Falha ao salvar o indicador.')
    }
  }

  function editar(item) {
    setIdEdicao(item.Id)

    setForm({
      Nome: item.Nome ?? '',
      Descricao: item.Descricao ?? '',
      Url: item.Url ?? '',
    })

    setErro('')
  }

  async function excluir(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir este indicador?'
    )

    if (!confirmar) return

    setErro('')

    try {
      await indicadorService.excluir(id)

      if (idEdicao === id) {
        cancelarEdicao()
      }

      await carregar()
      await atualizarMenu()
    } catch (e) {
      setErro(e.message || 'Falha ao excluir o indicador.')
    }
  }

  function cancelarEdicao() {
    setIdEdicao(null)
    setForm({ ...vazio })
    setErro('')
  }

  return (
    <section className="container-fluid p-4">
      <h2 className="mb-4">Cadastro de Indicadores</h2>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      <form
        className="card card-body mb-4"
        onSubmit={salvar}
      >
        <div className="mb-3">
          <label htmlFor="Nome" className="form-label">
            Nome
          </label>

          <input
            id="Nome"
            name="Nome"
            type="text"
            value={form.Nome}
            onChange={alterar}
            className="form-control"
            maxLength={100}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Descricao" className="form-label">
            Descrição
          </label>

          <textarea
            id="Descricao"
            name="Descricao"
            value={form.Descricao}
            onChange={alterar}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Url" className="form-label">
            URL do indicador
          </label>

          <input
            id="Url"
            name="Url"
            type="url"
            value={form.Url}
            onChange={alterar}
            className="form-control"
            placeholder="https://exemplo.com/dashboard"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={carregando}
          >
            {idEdicao === null
              ? 'Cadastrar'
              : 'Salvar alterações'}
          </button>

          {idEdicao !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelarEdicao}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h4 className="mb-3">Indicadores cadastrados</h4>

      {carregando && (
        <p>Carregando indicadores...</p>
      )}

      {!carregando && !erro && itens.length === 0 && (
        <p>Nenhum indicador cadastrado.</p>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>URL</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {itens.map((item) => (
              <tr key={item.Id}>
                <td>{item.Nome}</td>

                <td>{item.Descricao}</td>

                <td className="text-break">
                  {item.Url}
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => editar(item)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => excluir(item.Id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
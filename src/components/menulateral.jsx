
import { useState } from 'react'

function MenuLateral({
  aberto,
  setTela,
  indicadores = [],
  selecionarIndicador,
}) {
  const [cadastroAberto, setCadastroAberto] = useState(false)

  function alterarCadastro() {
    setCadastroAberto((anterior) => !anterior)
  }

  return (
    <aside
      className={`menu-lateral bg-dark text-white ${
        aberto ? 'aberto' : 'fechado'
      }`}
    >
      <h2 className="h6 text-uppercase mb-3">
        Menu
      </h2>

      <div className="d-grid gap-2">
        <button
          type="button"
          className="btn btn-outline-light text-start"
          onClick={() => setTela('inicio')}
        >
          Início
        </button>

        <button
          type="button"
          className="btn btn-outline-light text-start"
          onClick={alterarCadastro}
        >
          Cadastro {cadastroAberto ? '▲' : '▼'}
        </button>

        {cadastroAberto && (
          <div className="ms-3 d-grid gap-2">
            {/* Novos cadastros integrados à API */}

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('safras')}
            >
              Safras
            </button>

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('unidades')}
            >
              Unidades
            </button>

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('unidadesMedida')}
            >
              Unidades de Medida (API)
            </button>

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('equipamentos')}
            >
              Equipamentos (API)
            </button>

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('tiposInformacao')}
            >
              Tipos de Informação (API)
            </button>

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('medicoes')}
            >
              Medições (API)
            </button>

            <hr className="border-secondary" />

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('indicadores')}
            >
              Cadastro de Indicadores
            </button>

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('funcionarios')}
            >
              Funcionários
            </button>

            <button
              type="button"
              className="btn btn-sm btn-dark text-start"
              onClick={() => setTela('usuarios')}
            >
              Usuários
            </button>
          </div>
        )}

        <hr className="border-secondary" />

        <h3 className="h6 text-uppercase mt-1">
          Indicadores
        </h3>

        {indicadores.length === 0 ? (
          <p className="small text-white-50 mb-2">
            Nenhum indicador cadastrado.
          </p>
        ) : (
          indicadores.map((item) => (
            <button
              key={item.Id}
              type="button"
              className="btn btn-outline-light text-start mb-1"
              onClick={() => selecionarIndicador(item)}
              title={item.Descricao || item.Nome}
            >
              {item.Nome}
            </button>
          ))
        )}
      </div>
    </aside>
  )
}

export default MenuLateral

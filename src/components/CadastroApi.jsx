
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CADASTROS } from '../config/cadastros';

const nomeItem = (item) =>
  item.NomeSafra ?? item.Nome ?? `#${item.Id}`;

const valorInput = (valor, tipo) => {
  if (valor == null) return '';

  if (tipo === 'datetime-local') {
    return String(valor).slice(0, 16);
  }

  if (tipo === 'date') {
    return String(valor).slice(0, 10);
  }

  return String(valor);
};

export default function CadastroApi({ recurso }) {
  const cfg = CADASTROS[recurso];

  const [lista, setLista] = useState([]);
  const [opcoes, setOpcoes] = useState({});
  const [form, setForm] = useState({});
  const [idEdicao, setIdEdicao] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    if (!cfg) {
      setErro('Cadastro desconhecido.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const dados = await api(recurso);

      if (!Array.isArray(dados)) {
        throw new Error(
          'A API deve retornar uma lista JSON.'
        );
      }

      setLista(dados);

      const origens = [
        ...new Set(
          cfg.campos
            .filter((campo) => campo.origem)
            .map((campo) => campo.origem)
        ),
      ];

      
const pares = await Promise.all(
  origens.map(async (origem) => {
    try {
      const resultado = await api(origem);

      if (!Array.isArray(resultado)) {
        throw new Error(
          `A API de ${origem} deve retornar uma lista JSON.`
        );
      }

      return [origem, resultado];
    } catch (erroOrigem) {
      console.error(
        `Falha ao carregar a dependência "${origem}":`,
        erroOrigem
      );

      throw new Error(
        `Falha ao carregar "${origem}": ${erroOrigem.message}`
      );
    }
  })
);

      setOpcoes(Object.fromEntries(pares));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    setForm({});
    setIdEdicao(null);
    setLista([]);
    setOpcoes({});
    carregar();
  }, [recurso]);

  function editar(item) {
    setIdEdicao(item.Id);

    setForm(
      Object.fromEntries(
        cfg.campos.map((campo) => [
          campo.nome,
          valorInput(item[campo.nome], campo.tipo),
        ])
      )
    );

    setErro('');
  }

  async function salvar(event) {
    event.preventDefault();
    setErro('');

    try {
      const dados = {};

      for (const campo of cfg.campos) {
        const valor = form[campo.nome] ?? '';

        if (valor === '') {
          throw new Error(
            `Preencha o campo "${campo.rotulo}".`
          );
        }

        if (
          campo.tipo === 'select' ||
          campo.tipo === 'number'
        ) {
          const numero = Number(valor);

          if (!Number.isFinite(numero)) {
            throw new Error(
              `O campo "${campo.rotulo}" deve ser numérico.`
            );
          }

          dados[campo.nome] = numero;
        } else if (campo.tipo === 'datetime-local') {
          dados[campo.nome] = `${valor}:00`;
        } else {
          dados[campo.nome] = valor;
        }
      }

      if (
        recurso === 'safras' &&
        dados.DataFim < dados.DataInicio
      ) {
        throw new Error(
          'A data final não pode ser anterior à data inicial.'
        );
      }

      if (idEdicao === null) {
        await api(recurso, 'POST', dados);
      } else {
        await api(
          recurso,
          'PUT',
          { Id: idEdicao, ...dados },
          idEdicao
        );
      }

      setForm({});
      setIdEdicao(null);

      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  async function excluir(id) {
    const confirmar = window.confirm(
      'Confirma a exclusão deste registro?'
    );

    if (!confirmar) return;

    setErro('');

    try {
      await api(recurso, 'DELETE', null, id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  if (!cfg) {
    return <p>Cadastro desconhecido.</p>;
  }

  return (
    <section className="container-fluid p-4">
      <h2 className="mb-4">{cfg.titulo}</h2>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      <form
        className="card card-body mb-4"
        onSubmit={salvar}
      >
        <h5 className="mb-3">
          {idEdicao === null
            ? 'Novo registro'
            : 'Editar registro'}
        </h5>

        {cfg.campos.map((campo) => (
          <div className="mb-3" key={campo.nome}>
            <label className="form-label">
              {campo.rotulo}
            </label>

            {campo.tipo === 'select' ? (
              <select
                className="form-select"
                required={campo.obrigatorio}
                value={form[campo.nome] ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [campo.nome]: e.target.value,
                  })
                }
              >
                <option value="">Selecione...</option>

                {(opcoes[campo.origem] ?? []).map(
                  (opcao) => (
                    <option
                      key={opcao.Id}
                      value={opcao.Id}
                    >
                      {nomeItem(opcao)}
                    </option>
                  )
                )}
              </select>
            ) : (
              <input
                className="form-control"
                type={campo.tipo}
                required={campo.obrigatorio}
                step={
                  campo.tipo === 'number'
                    ? 'any'
                    : undefined
                }
                value={form[campo.nome] ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [campo.nome]: e.target.value,
                  })
                }
              />
            )}
          </div>
        ))}

        <div>
          <button
            className="btn btn-primary me-2"
            type="submit"
            disabled={carregando}
          >
            {idEdicao === null
              ? 'Cadastrar'
              : 'Salvar alterações'}
          </button>

          {idEdicao !== null && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setIdEdicao(null);
                setForm({});
                setErro('');
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {carregando && (
        <p>Carregando registros...</p>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              {cfg.campos.map((campo) => (
                <th key={campo.nome}>
                  {campo.rotulo}
                </th>
              ))}
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {lista.map((item) => (
              <tr key={item.Id}>
                {cfg.campos.map((campo) => {
                  const valor = item[campo.nome];

                  if (!campo.origem) {
                    return (
                      <td key={campo.nome}>
                        {String(valor ?? '')}
                      </td>
                    );
                  }

                  const relacionado = (
                    opcoes[campo.origem] ?? []
                  ).find(
                    (opcao) => opcao.Id === valor
                  );

                  return (
                    <td key={campo.nome}>
                      {relacionado
                        ? nomeItem(relacionado)
                        : String(valor ?? '')}
                    </td>
                  );
                })}

                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      type="button"
                      onClick={() => editar(item)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      type="button"
                      onClick={() => excluir(item.Id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!carregando && lista.length === 0 && (
              <tr>
                <td
                  colSpan={cfg.campos.length + 1}
                  className="text-center"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

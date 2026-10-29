
const BASE = 'http://127.0.0.1:1880';

export const ROTAS = {
  safras: '/api/safras',
  unidades: '/api/unidades',
  unidadesMedida: '/api/unidades-medida',
  equipamentos: '/api/equipamentos',
  tiposInformacao: '/api/tipos-informacao',
  medicoes: '/api/medicoes',
};

export async function api(
  recurso,
  metodo = 'GET',
  dados = null,
  id = null
) {
  const rota = ROTAS[recurso];

  if (!rota) {
    throw new Error(`Rota não configurada para: ${recurso}`);
  }

  const url = BASE + rota + (id == null ? '' : `/${id}`);

  const resposta = await fetch(url, {
    method: metodo,
    headers:
      dados == null
        ? undefined
        : { 'Content-Type': 'application/json' },
    body: dados == null ? undefined : JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();

    throw new Error(
      `Erro HTTP ${resposta.status} em ${metodo} ${url}` +
      (detalhe ? `: ${detalhe}` : '')
    );
  }

  if (resposta.status === 204) {
    return null;
  }

  const texto = await resposta.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch {
    throw new Error(
      `A API ${url} retornou uma resposta que não é JSON válido.`
    );
  }
}

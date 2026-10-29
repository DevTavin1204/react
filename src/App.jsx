
import { useEffect, useState } from 'react'

import Usuarios from './components/cadastros/usuarios'
import Header from './components/Header'
import MenuLateral from './components/menulateral'
import Conteudo from './components/Conteudo'

import Indicadores from './components/cadastros/indicadores'
import Funcionarios from './components/cadastros/funcionarios'

import VisualizarIndicador from './components/visualizarIndicador'
import { indicadorService } from './services/indicadorService'

import CadastroApi from './components/CadastroApi'

import './App.css'

function App() {
  const [menuAberto, setMenuAberto] = useState(true)
  const [tela, setTela] = useState('inicio')

  const [indicadores, setIndicadores] = useState([])
  const [indicadorSelecionado, setIndicadorSelecionado] =
    useState(null)

  function alterarMenu() {
    setMenuAberto((anterior) => !anterior)
  }

  async function atualizarMenu() {
    const dados = await indicadorService.listar()

    if (!Array.isArray(dados)) {
      throw new Error(
        'A API não retornou uma lista de indicadores.'
      )
    }

    setIndicadores(dados)

    // Mantém a seleção sincronizada após editar um indicador.
    setIndicadorSelecionado((anterior) => {
      if (!anterior) return null

      return (
        dados.find((item) => item.Id === anterior.Id) ?? null
      )
    })
  }

  useEffect(() => {
    atualizarMenu().catch((erro) => {
      console.error('Erro ao carregar indicadores:', erro)
    })
  }, [])

  function selecionarIndicador(item) {
    setIndicadorSelecionado(item)
    setTela('visualizarIndicador')
  }

  return (
    <>
      <Header />

      <div className="layout">
        <MenuLateral
          aberto={menuAberto}
          setTela={setTela}
          indicadores={indicadores}
          selecionarIndicador={selecionarIndicador}
        />

        <main className="area-conteudo">
          <div className="p-3 border-bottom bg-white">
            <button
              type="button"
              className="btn btn-primary"
              onClick={alterarMenu}
            >
              Menu ☰
            </button>
          </div>

          {/* Tela inicial */}
          {tela === 'inicio' && <Conteudo />}

          {tela === 'indicadores' && (
            <Indicadores atualizarMenu={atualizarMenu} />
          )}

          {tela === 'visualizarIndicador' && (
            <VisualizarIndicador
              indicador={indicadorSelecionado}
            />
          )}

          {tela === 'funcionarios' && <Funcionarios />}

          {tela === 'usuarios' && <Usuarios />}

          {/* Novos cadastros integrados à API */}
          {tela === 'safras' && (
            <CadastroApi recurso="safras" />
          )}

          {tela === 'unidades' && (
            <CadastroApi recurso="unidades" />
          )}

          {tela === 'unidadesMedida' && (
            <CadastroApi recurso="unidadesMedida" />
          )}

          {tela === 'equipamentos' && (
            <CadastroApi recurso="equipamentos" />
          )}

          {tela === 'tiposInformacao' && (
            <CadastroApi recurso="tiposInformacao" />
          )}

          {tela === 'medicoes' && (
            <CadastroApi recurso="medicoes" />
          )}
        </main>
      </div>
    </>
  )
}

export default App

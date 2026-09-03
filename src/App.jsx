import { useState } from 'react'

import Header from './components/Header'
import MenuLateral from './components/menulateral'
import Conteudo from './components/Conteudo'

import Safra from './components/cadastros/safra'
import Unidade from './components/cadastros/unidade'
import Equipamento from './components/cadastros/equipamento'
import Medicao from './components/cadastros/medicao'
import UnidadeMedida from './components/cadastros/unidademedida'
import TipoInformacao from './components/cadastros/tipoinformacao'
import Indicadores from './components/cadastros/indicadores'
import Funcionarios from './components/cadastros/funcionarios'

import './App.css'

function App() {
  const [menuAberto, setMenuAberto] = useState(true)
  const [tela, setTela] = useState('inicio')

  function alterarMenu() {
    setMenuAberto(!menuAberto)
  }

  return (
    <>
      <Header />

      <div className="layout">

        <MenuLateral
          aberto={menuAberto}
          setTela={setTela}
        />

        <main className="area-conteudo">

          <div className="p-3 border-bottom bg-white">

            <button
              className="btn btn-primary"
              onClick={alterarMenu}
            >
              Menu ☰
            </button>

          </div>

          {tela === 'inicio' && <Conteudo />}

          {tela === 'safra' && <Safra />}

          {tela === 'unidade' && <Unidade />}

          {tela === 'equipamento' && <Equipamento />}

          {tela === 'medicao' && <Medicao />}

          {tela === 'unidademedida' && <UnidadeMedida />}

          {tela === 'tipoinformacao' && <TipoInformacao />}

          {tela === 'indicadores' && <Indicadores />}

          {tela === 'funcionarios' && <Funcionarios />}

        </main>

      </div>
    </>
  )
}

export default App
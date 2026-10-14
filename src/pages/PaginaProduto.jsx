import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { produtoTemPrecoValido } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [formulario, setFormulario] = useState({ nome: '', email: '' })
  const [avisoEnviado, setAvisoEnviado] = useState(false)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const produtoDisponivel = produto.estoque > 0 && produtoTemPrecoValido(produto)
  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        item.estoque > 0 &&
        produtoTemPrecoValido(item)
    )
    .slice(0, 4)

  function handleEnviarAviso(evento) {
    evento.preventDefault()

    if (!onRegistrarEspera || !formulario.nome.trim() || !formulario.email.trim()) {
      return
    }

    onRegistrarEspera({
      produtoId: produto.id,
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
    })

    setFormulario({ nome: '', email: '' })
    setAvisoEnviado(true)
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {produtoTemPrecoValido(produto) ? formatarPreco(produto.price) : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produtoDisponivel ? `${produto.estoque} unidades disponíveis` : 'Produto esgotado'}
          </p>

          {produtoDisponivel ? (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!produtoDisponivel}
            >
              Adicionar ao carrinho
            </button>
          ) : (
            <form onSubmit={handleEnviarAviso} className="cupom">
              <label htmlFor="alerta-nome" className="rotulo">
                Avise-me quando voltar
              </label>
              <input
                id="alerta-nome"
                value={formulario.nome}
                onChange={(evento) =>
                  setFormulario((atual) => ({ ...atual, nome: evento.target.value }))
                }
                placeholder="Seu nome"
              />
              <input
                id="alerta-email"
                value={formulario.email}
                onChange={(evento) =>
                  setFormulario((atual) => ({ ...atual, email: evento.target.value }))
                }
                placeholder="Seu e-mail"
              />
              <button className="botao botao-grande" type="submit">
                Avise-me
              </button>
              {avisoEnviado && (
                <p className="mensagem-cupom">Seu aviso foi registrado. Te avisaremos quando voltar.</p>
              )}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">{formatarPreco(item.price)}</p>
            <button className="botao" onClick={() => onAdicionar(item)} disabled={item.estoque === 0}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

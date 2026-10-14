import { Link } from 'react-router'
import { calcularRestanteParaFreteGratis, produtoTemPrecoValido, temFreteGratis } from '../utils/carrinho'
import { formatarPreco } from '../utils/formatarPreco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = produto.estoque === 0
  const indisponivel = esgotado || !produtoTemPrecoValido(produto)
  const restanteFrete = calcularRestanteParaFreteGratis(produto.price)

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">{formatarPreco(produto.price)}</span>
      </div>

      <div className="card-selos">
        {temFreteGratis(produto.price) ? (
          <span className="selo selo-frete">Frete grátis</span>
        ) : (
          <span className="selo selo-frete">Faltam {formatarPreco(restanteFrete)} para frete grátis</span>
        )}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={indisponivel}>
        Adicionar ao carrinho
      </button>
    </article>
  )
}

// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

function normalizarPreco(valor) {
  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return valor
  }

  if (typeof valor !== 'string') {
    return Number.NaN
  }

  const texto = valor.trim()
  if (!texto) {
    return Number.NaN
  }

  const semMoeda = texto.replace(/[^\d,.-]/g, '')
  if (!semMoeda) {
    return Number.NaN
  }

  if (semMoeda.includes(',') && semMoeda.includes('.')) {
    return Number(semMoeda.replace(/\./g, '').replace(',', '.'))
  }

  if (semMoeda.includes(',')) {
    return Number(semMoeda.replace(',', '.'))
  }

  return Number(semMoeda)
}

export function produtoTemPrecoValido(produto) {
  return produto && Number.isFinite(normalizarPreco(produto.price)) && normalizarPreco(produto.price) > 0
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const valor = normalizarPreco(produto?.price)
    return total + (Number.isFinite(valor) && valor > 0 ? valor : 0)
  }, 0)
}

export function temFreteGratis(valor) {
  const numero = normalizarPreco(valor)
  return Number.isFinite(numero) && numero >= 200
}

export function calcularRestanteParaFreteGratis(valor) {
  const numero = normalizarPreco(valor)
  if (!Number.isFinite(numero)) {
    return 200
  }

  return Math.max(0, 200 - numero)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}

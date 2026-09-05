const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const decimal = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

export function formatarMoeda(valor: number): string {
  return moeda.format(valor)
}

export function formatarDecimal(valor: number): string {
  return decimal.format(valor)
}

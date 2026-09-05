import { StatusCafeteria } from '../logica/tipos';

const ATRASO_SIMULADO_MS = 200;
const PRECO_MINIMO = 3;
const PRECO_MAXIMO = 12;

function limitarAleatorio(valor: number): number {
  return Math.min(1, Math.max(0, valor));
}

export function buscarStatusCafeteria(
  cafeteriaId: string
): Promise<StatusCafeteria> {
  if (cafeteriaId.trim().length === 0) {
    return Promise.reject(new Error('cafeteriaId inválido.'));
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const fatorPreco = limitarAleatorio(Math.random());
      const precoCafe = Number(
        (PRECO_MINIMO + fatorPreco * (PRECO_MAXIMO - PRECO_MINIMO)).toFixed(2)
      );
      const disponivel = Math.random() >= 0.5;

      resolve({ cafeteriaId, precoCafe, disponivel });
    }, ATRASO_SIMULADO_MS);
  });
}

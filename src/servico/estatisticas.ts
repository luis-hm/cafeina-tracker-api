import { ResultadoTracker } from '../logica/tipos';

const cafesRegistrados: number[] = [];

export function registrarResultado(resultado: ResultadoTracker): void {
  cafesRegistrados.push(resultado.cafesRecomendados);
}

export function calcularMediaCafes(): number {
  if (cafesRegistrados.length === 0) {
    return 0;
  }

  const total = cafesRegistrados.reduce((soma, quantidade) => soma + quantidade, 0);
  return total / cafesRegistrados.length;
}

export function resetarEstatisticas(): void {
  cafesRegistrados.length = 0;
}

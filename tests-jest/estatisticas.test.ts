import {
  calcularMediaCafes,
  registrarResultado,
  resetarEstatisticas
} from '../src/servico/estatisticas';
import { ResultadoTracker } from '../src/logica/tipos';

function criarResultado(cafesRecomendados: number): ResultadoTracker {
  return {
    cafesRecomendados,
    nivelRisco: 'Seguro',
    motivoExtra: 'teste'
  };
}

describe('estatísticas em memória', () => {
  beforeEach(() => {
    resetarEstatisticas();
  });

  it('@paridade:ESTATISTICAS-VAZIAS @spec:AC-012 retorna zero sem resultados', () => {
    expect(calcularMediaCafes()).toBe(0);
  });

  it('@paridade:ESTATISTICAS-MEDIA @spec:AC-013 calcula a média aritmética dos resultados', () => {
    registrarResultado(criarResultado(2));
    registrarResultado(criarResultado(4));
    registrarResultado(criarResultado(6));

    expect(calcularMediaCafes()).toBe(4);
  });

  it('@paridade:ESTATISTICAS-RESET @spec:AC-014 remove resultados registrados', () => {
    registrarResultado(criarResultado(5));
    resetarEstatisticas();

    expect(calcularMediaCafes()).toBe(0);
  });
});

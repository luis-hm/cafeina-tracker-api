import {
  MOTIVOS_EXTRAS,
  calcularCafesNecessarios,
  classificarRiscoCafeina,
  montarResultado,
  sortearMotivoExtra,
  validarPerfilDev
} from '../src/logica/tracker';
import { PerfilDev } from '../src/logica/tipos';

describe('lógica do Cafeína Tracker', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('@paridade:CALC-BASE @spec:AC-001 recomenda o café base para um dia descansado', () => {
    expect(calcularCafesNecessarios(8, 0)).toBe(1);
    expect(calcularCafesNecessarios(10, 0)).toBe(1);
  });

  it('@paridade:CALC-SONO @spec:AC-002 soma uma unidade por hora de sono em falta', () => {
    expect(calcularCafesNecessarios(6, 0)).toBe(3);
    expect(calcularCafesNecessarios(7.5, 0)).toBe(1.5);
  });

  it('@paridade:CALC-REUNIOES @spec:AC-003 soma uma unidade por duas reuniões completas', () => {
    expect(calcularCafesNecessarios(8, 1)).toBe(1);
    expect(calcularCafesNecessarios(8, 2)).toBe(2);
    expect(calcularCafesNecessarios(8, 5)).toBe(3);
  });

  it('@paridade:CALC-TETO @spec:AC-004 limita a recomendação a dez', () => {
    expect(calcularCafesNecessarios(0, 20)).toBe(10);
  });

  it('@paridade:RISCO-FAIXAS @spec:AC-005 classifica todas as fronteiras de risco', () => {
    expect(classificarRiscoCafeina(3)).toBe('Seguro');
    expect(classificarRiscoCafeina(4)).toBe('Atenção');
    expect(classificarRiscoCafeina(6)).toBe('Atenção');
    expect(classificarRiscoCafeina(7)).toBe('Risco Alto');
    expect(classificarRiscoCafeina(9)).toBe('Risco Alto');
    expect(classificarRiscoCafeina(10)).toBe('Chama o Cardiologista');
  });

  it('@paridade:MOTIVO-LISTA @spec:AC-006 sorteia itens de uma lista fixa com pelo menos cinco opções', () => {
    expect(MOTIVOS_EXTRAS).toHaveLength(5);
    jest.spyOn(Math, 'random').mockReturnValue(0.4);

    expect(sortearMotivoExtra()).toBe(MOTIVOS_EXTRAS[2]);
  });

  it('@paridade:VALIDA-SONO @spec:AC-007 aponta horas de sono inválidas', () => {
    const perfis = [
      { quantidadeReunioes: 0 },
      { horasSono: 'oito', quantidadeReunioes: 0 },
      { horasSono: Number.NaN, quantidadeReunioes: 0 },
      { horasSono: -1, quantidadeReunioes: 0 },
      { horasSono: 25, quantidadeReunioes: 0 }
    ] as unknown as PerfilDev[];

    for (const perfil of perfis) {
      expect(validarPerfilDev(perfil)).toContainEqual(
        expect.objectContaining({ campo: 'horasSono' })
      );
    }
  });

  it('@paridade:VALIDA-REUNIOES @spec:AC-008 aponta quantidades de reuniões inválidas', () => {
    const perfis = [
      { horasSono: 8 },
      { horasSono: 8, quantidadeReunioes: 'duas' },
      { horasSono: 8, quantidadeReunioes: Number.POSITIVE_INFINITY },
      { horasSono: 8, quantidadeReunioes: -1 },
      { horasSono: 8, quantidadeReunioes: 1.5 }
    ] as unknown as PerfilDev[];

    for (const perfil of perfis) {
      expect(validarPerfilDev(perfil)).toContainEqual(
        expect.objectContaining({ campo: 'quantidadeReunioes' })
      );
    }
  });

  it('@paridade:MONTA-RESULTADO @spec:AC-009 compõe um resultado completo e permite snapshot', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(montarResultado({ horasSono: 6, quantidadeReunioes: 4 })).toMatchSnapshot();
  });
});

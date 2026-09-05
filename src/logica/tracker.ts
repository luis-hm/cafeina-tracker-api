import {
  ErroValidacao,
  NivelRisco,
  PerfilDev,
  ResultadoTracker,
  ResultadoValidacaoPerfilDev
} from './tipos';

export const MOTIVOS_EXTRAS = [
  'a reunião podia ser um e-mail',
  'o build quebrou de novo',
  'é sexta-feira',
  'o bug só acontece em produção',
  'a documentação ficou para depois'
] as const;

export function calcularCafesNecessarios(
  horasSono: number,
  quantidadeReunioes: number
): number {
  const deficitSono = Math.max(0, 8 - horasSono);
  const cafesPorReunioes = Math.floor(quantidadeReunioes / 2);

  return Math.min(10, 1 + deficitSono + cafesPorReunioes);
}

export function classificarRiscoCafeina(cafesRecomendados: number): NivelRisco {
  if (cafesRecomendados <= 3) {
    return 'Seguro';
  }

  if (cafesRecomendados <= 6) {
    return 'Atenção';
  }

  if (cafesRecomendados <= 9) {
    return 'Risco Alto';
  }

  return 'Chama o Cardiologista';
}

export function sortearMotivoExtra(): string {
  const indice = Math.min(
    Math.floor(Math.random() * MOTIVOS_EXTRAS.length),
    MOTIVOS_EXTRAS.length - 1
  );

  return MOTIVOS_EXTRAS[indice] ?? 'mais um café nunca é demais';
}

function ehRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function horasSonoValidas(valor: unknown): valor is number {
  return (
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    valor >= 0 &&
    valor <= 24
  );
}

function quantidadeReunioesValida(valor: unknown): valor is number {
  return (
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    Number.isInteger(valor) &&
    valor >= 0
  );
}

export function interpretarPerfilDev(
  entrada: unknown
): ResultadoValidacaoPerfilDev {
  const dados = ehRegistro(entrada) ? entrada : {};
  const horasSono = dados.horasSono;
  const quantidadeReunioes = dados.quantidadeReunioes;
  const erros: ErroValidacao[] = [];
  const sonoValido = horasSonoValidas(horasSono);
  const reunioesValidas = quantidadeReunioesValida(quantidadeReunioes);

  if (!sonoValido) {
    erros.push({
      campo: 'horasSono',
      mensagem: 'horasSono deve ser um número finito entre 0 e 24.'
    });
  }

  if (!reunioesValidas) {
    erros.push({
      campo: 'quantidadeReunioes',
      mensagem: 'quantidadeReunioes deve ser um número inteiro não negativo.'
    });
  }

  if (!sonoValido || !reunioesValidas) {
    return { valido: false, erros };
  }

  return {
    valido: true,
    perfil: { horasSono, quantidadeReunioes }
  };
}

export function validarPerfilDev(perfil: unknown): ErroValidacao[] {
  const resultado = interpretarPerfilDev(perfil);
  return resultado.valido ? [] : resultado.erros;
}

export function montarResultado(perfil: PerfilDev): ResultadoTracker {
  const cafesRecomendados = calcularCafesNecessarios(
    perfil.horasSono,
    perfil.quantidadeReunioes
  );

  return {
    cafesRecomendados,
    nivelRisco: classificarRiscoCafeina(cafesRecomendados),
    motivoExtra: sortearMotivoExtra()
  };
}

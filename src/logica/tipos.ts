export interface PerfilDev {
  horasSono: number;
  quantidadeReunioes: number;
}

export type NivelRisco =
  | 'Seguro'
  | 'Atenção'
  | 'Risco Alto'
  | 'Chama o Cardiologista';

export interface ResultadoTracker {
  cafesRecomendados: number;
  nivelRisco: NivelRisco;
  motivoExtra: string;
}

export interface StatusCafeteria {
  cafeteriaId: string;
  precoCafe: number;
  disponivel: boolean;
}

export interface ErroValidacao {
  campo: keyof PerfilDev;
  mensagem: string;
}

export type ResultadoValidacaoPerfilDev =
  | { valido: true; perfil: PerfilDev }
  | { valido: false; erros: ErroValidacao[] };

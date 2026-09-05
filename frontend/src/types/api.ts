export interface PerfilDev {
  horasSono: number
  quantidadeReunioes: number
}

export type NivelRisco =
  | 'Seguro'
  | 'Atenção'
  | 'Risco Alto'
  | 'Chama o Cardiologista'

export interface ResultadoTracker {
  cafesRecomendados: number
  nivelRisco: NivelRisco
  motivoExtra: string
}

export interface StatusCafeteria {
  cafeteriaId: string
  precoCafe: number
  disponivel: boolean
}

export interface EstatisticasCafe {
  mediaCafes: number
}

export interface StatusApi {
  mensagem: string
}

export interface ErroValidacao {
  campo: keyof PerfilDev | string
  mensagem: string
}

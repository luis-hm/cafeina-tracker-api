import { useRef, useState } from 'react'
import { HttpError } from '../../lib/http'
import type {
  ErroValidacao,
  PerfilDev,
  ResultadoTracker,
} from '../../types/api'
import { calcularCafeina } from './api'

type WithPreviousResult = {
  resultadoAnterior?: ResultadoTracker
}

export type TrackerState =
  | { status: 'idle' }
  | ({ status: 'loading'; perfil: PerfilDev } & WithPreviousResult)
  | { status: 'success'; perfil: PerfilDev; resultado: ResultadoTracker }
  | ({
      status: 'validation-error'
      perfil: PerfilDev
      erros: ErroValidacao[]
    } & WithPreviousResult)
  | ({
      status: 'network-error'
      perfil: PerfilDev
      mensagem: string
    } & WithPreviousResult)

function saoErrosValidacao(payload: unknown): payload is ErroValidacao[] {
  return (
    Array.isArray(payload) &&
    payload.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof Reflect.get(item, 'campo') === 'string' &&
        typeof Reflect.get(item, 'mensagem') === 'string',
    )
  )
}

export function obterResultadoVisivel(
  state: TrackerState,
): ResultadoTracker | undefined {
  if (state.status === 'success') return state.resultado
  if (
    state.status === 'loading' ||
    state.status === 'validation-error' ||
    state.status === 'network-error'
  ) {
    return state.resultadoAnterior
  }
  return undefined
}

export function useTracker() {
  const [state, setState] = useState<TrackerState>({ status: 'idle' })
  const requestId = useRef(0)

  async function calcular(
    perfil: PerfilDev,
  ): Promise<ResultadoTracker | undefined> {
    const id = ++requestId.current
    const resultadoAnterior = obterResultadoVisivel(state)
    setState({ status: 'loading', perfil, resultadoAnterior })

    try {
      const resultado = await calcularCafeina(perfil)
      if (id === requestId.current) {
        setState({ status: 'success', perfil, resultado })
        return resultado
      }
    } catch (error) {
      if (id !== requestId.current) return

      if (
        error instanceof HttpError &&
        error.status === 400 &&
        saoErrosValidacao(error.payload)
      ) {
        setState({
          status: 'validation-error',
          perfil,
          erros: error.payload,
          resultadoAnterior,
        })
        return
      }

      setState({
        status: 'network-error',
        perfil,
        resultadoAnterior,
        mensagem: 'Não foi possível calcular agora. Verifique se a API está online.',
      })
    }

    return undefined
  }

  function resetar(): void {
    requestId.current += 1
    setState({ status: 'idle' })
  }

  return { state, calcular, resetar }
}

import { requestJson } from '../../lib/http'
import type { EstatisticasCafe } from '../../types/api'

export function buscarEstatisticas(): Promise<EstatisticasCafe> {
  return requestJson<EstatisticasCafe>('/estatisticas')
}

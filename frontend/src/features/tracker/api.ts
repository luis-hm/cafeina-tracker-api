import { requestJson } from '../../lib/http'
import type { PerfilDev, ResultadoTracker } from '../../types/api'

export function calcularCafeina(perfil: PerfilDev): Promise<ResultadoTracker> {
  return requestJson<ResultadoTracker>('/tracker', {
    method: 'POST',
    body: JSON.stringify(perfil),
  })
}

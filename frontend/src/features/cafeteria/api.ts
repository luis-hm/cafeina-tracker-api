import { requestJson } from '../../lib/http'
import type { StatusCafeteria } from '../../types/api'

export function buscarStatusCafeteria(
  cafeteriaId: string,
): Promise<StatusCafeteria> {
  return requestJson<StatusCafeteria>(
    `/cafeteria/${encodeURIComponent(cafeteriaId)}`,
  )
}

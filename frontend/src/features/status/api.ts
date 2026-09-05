import { requestJson } from '../../lib/http'
import type { StatusApi } from '../../types/api'

export function buscarStatusApi(): Promise<StatusApi> {
  return requestJson<StatusApi>('/health')
}

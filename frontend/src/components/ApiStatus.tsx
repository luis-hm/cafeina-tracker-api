import { CircleCheck, CircleEllipsis, CircleX, RefreshCw } from 'lucide-react'
import { Button } from './ui/Button'

export type ApiConnectionStatus = 'checking' | 'online' | 'offline'

export interface ApiStatusProps {
  status: ApiConnectionStatus
  onRetry: () => void
}

const statusCopy = {
  checking: {
    label: 'Verificando API',
    tone: 'warning',
    Icon: CircleEllipsis,
  },
  online: {
    label: 'API online',
    tone: 'success',
    Icon: CircleCheck,
  },
  offline: {
    label: 'API offline',
    tone: 'danger',
    Icon: CircleX,
  },
} as const

export function ApiStatus({ status, onRetry }: ApiStatusProps) {
  const current = statusCopy[status]
  const Icon = current.Icon

  return (
    <div aria-live="polite">
      <span className={`status-pill status-pill--${current.tone}`}>
        <Icon aria-hidden="true" size={14} strokeWidth={2.4} />
        {current.label}
      </span>
      {status === 'offline' ? (
        <Button onClick={onRetry} variant="secondary">
          <RefreshCw aria-hidden="true" size={15} />
          Tentar novamente
        </Button>
      ) : null}
    </div>
  )
}

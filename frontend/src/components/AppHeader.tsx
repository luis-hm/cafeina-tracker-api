import type { RefObject } from 'react'
import { FlaskConical } from 'lucide-react'
import type { ApiConnectionStatus } from './ApiStatus'
import { ApiStatus } from './ApiStatus'
import styles from './AppHeader.module.css'

export interface AppHeaderProps {
  apiStatus: ApiConnectionStatus
  laboratoryButtonRef: RefObject<HTMLButtonElement | null>
  onOpenLaboratory: () => void
  onRetryApi: () => void
}

export function AppHeader({
  apiStatus,
  laboratoryButtonRef,
  onOpenLaboratory,
  onRetryApi,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <p className={styles.eyebrow}>CDD / painel diário</p>
        <div className={styles.titleRow}>
          <span aria-hidden="true" className={styles.brandMark}>CT</span>
          <div>
            <h1>Cafeína Tracker</h1>
            <p>Um experimento sobre código, café e testes automatizados.</p>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <ApiStatus onRetry={onRetryApi} status={apiStatus} />
        <button
          className={styles.labButton}
          onClick={onOpenLaboratory}
          ref={laboratoryButtonRef}
          type="button"
        >
          <FlaskConical aria-hidden="true" size={18} />
          Abrir laboratório de testes
        </button>
      </div>
    </header>
  )
}

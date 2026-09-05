import { BarChart3, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui'
import { formatarDecimal } from '../../lib/formatadores'
import styles from './MediaCafes.module.css'

export type StatisticsState =
  | { status: 'loading'; value?: number }
  | { status: 'success'; value: number }
  | { status: 'error'; value?: number }

export interface MediaCafesProps {
  state: StatisticsState
  onRetry: () => void
}

export function MediaCafes({ state, onRetry }: MediaCafesProps) {
  const hasValue = state.value !== undefined && state.value > 0

  return (
    <section aria-labelledby="stats-title" className={styles.card}>
      <div className={styles.heading}>
        <div className={styles.iconPlate}>
          <BarChart3 aria-hidden="true" size={21} />
        </div>
        <div>
          <p>Memória do processo</p>
          <h2 id="stats-title">Média da sessão</h2>
        </div>
      </div>

      <div aria-busy={state.status === 'loading'} aria-live="polite">
        {hasValue ? (
          <div className={styles.metric}>
            <strong>{formatarDecimal(state.value ?? 0)}</strong>
            <span>cafés por cálculo</span>
          </div>
        ) : (
          <p className={styles.empty}>Nenhum cálculo registrado ainda.</p>
        )}
      </div>

      {state.status === 'loading' ? (
        <p className={styles.status} role="status">Atualizando média...</p>
      ) : null}
      {state.status === 'error' ? (
        <div className={styles.error} role="alert">
          <p>Não foi possível atualizar a média.</p>
          <Button onClick={onRetry} variant="secondary">
            <RefreshCw aria-hidden="true" size={16} />
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <p className={styles.note}>Reinicia quando a API reinicia.</p>
    </section>
  )
}

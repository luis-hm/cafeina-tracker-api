import { useRef, useState, type FormEvent } from 'react'
import {
  CheckCircle2,
  CircleOff,
  Coffee,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react'
import { Button, FieldMessage, StatusPill } from '../../components/ui'
import { formatarMoeda } from '../../lib/formatadores'
import type { StatusCafeteria } from '../../types/api'
import { buscarStatusCafeteria } from './api'
import styles from './CafeteriaStatus.module.css'

type CafeteriaState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: StatusCafeteria }
  | { status: 'error'; message: string }

export function CafeteriaStatus() {
  const [cafeteriaId, setCafeteriaId] = useState('central')
  const [state, setState] = useState<CafeteriaState>({ status: 'idle' })
  const requestId = useRef(0)

  async function search() {
    const normalizedId = cafeteriaId.trim()
    if (!normalizedId) {
      setState({
        status: 'error',
        message: 'Informe um identificador antes de consultar.',
      })
      return
    }

    const id = ++requestId.current
    setState({ status: 'loading' })
    try {
      const data = await buscarStatusCafeteria(normalizedId)
      if (id === requestId.current) setState({ status: 'success', data })
    } catch {
      if (id === requestId.current) {
        setState({
          status: 'error',
          message: 'A cafeteria não respondeu. Tente a consulta novamente.',
        })
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void search()
  }

  return (
    <section aria-labelledby="cafeteria-title" className={styles.card}>
      <div className={styles.heading}>
        <div className={styles.iconPlate}>
          <Coffee aria-hidden="true" size={21} />
        </div>
        <div>
          <p>Serviço assíncrono</p>
          <h2 id="cafeteria-title">Cafeteria simulada</h2>
        </div>
      </div>

      <form aria-busy={state.status === 'loading'} onSubmit={submit}>
        <label htmlFor="cafeteriaId">Identificador da cafeteria</label>
        <div className={styles.searchRow}>
          <input
            id="cafeteriaId"
            onChange={(event) => setCafeteriaId(event.target.value)}
            value={cafeteriaId}
          />
          <Button disabled={state.status === 'loading'} type="submit">
            {state.status === 'loading' ? (
              <LoaderCircle
                aria-hidden="true"
                className={styles.spinner}
                size={17}
              />
            ) : (
              <Coffee aria-hidden="true" size={17} />
            )}
            {state.status === 'loading' ? 'Extraindo café...' : 'Consultar'}
          </Button>
        </div>
        <FieldMessage>Experimente “central” ou qualquer ID curto.</FieldMessage>
      </form>

      {state.status === 'idle' ? (
        <p className={styles.empty}>Faça uma consulta para testar a Promise da cafeteria.</p>
      ) : null}
      {state.status === 'loading' ? (
        <p aria-live="polite" className={styles.empty} role="status">
          Extraindo café da API...
        </p>
      ) : null}
      {state.status === 'success' ? (
        <div aria-live="polite" className={styles.success}>
          <div>
            <span>Preço simulado</span>
            <strong>{formatarMoeda(state.data.precoCafe)}</strong>
          </div>
          <StatusPill tone={state.data.disponivel ? 'success' : 'danger'}>
            {state.data.disponivel ? (
              <CheckCircle2 aria-hidden="true" size={14} />
            ) : (
              <CircleOff aria-hidden="true" size={14} />
            )}
            {state.data.disponivel
              ? 'Disponível agora'
              : 'Indisponível no momento'}
          </StatusPill>
        </div>
      ) : null}
      {state.status === 'error' ? (
        <div className={styles.error} role="alert">
          <p>{state.message}</p>
          <Button onClick={() => void search()} variant="secondary">
            <RefreshCw aria-hidden="true" size={16} />
            Tentar novamente
          </Button>
        </div>
      ) : null}
    </section>
  )
}

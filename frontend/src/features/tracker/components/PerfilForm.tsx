import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import {
  Coffee,
  LoaderCircle,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
} from 'lucide-react'
import { Button, FieldMessage, IconButton } from '../../../components/ui'
import { formatarDecimal } from '../../../lib/formatadores'
import type { PerfilDev } from '../../../types/api'
import type { TrackerState } from '../useTracker'
import styles from './PerfilForm.module.css'

export interface PerfilFormProps {
  state: TrackerState
  onCalculate: (perfil: PerfilDev) => Promise<void>
  onReset: () => void
}

export function PerfilForm({
  state,
  onCalculate,
  onReset,
}: PerfilFormProps) {
  const [horasSono, setHorasSono] = useState('8')
  const [quantidadeReunioes, setQuantidadeReunioes] = useState('2')
  const horasSonoRef = useRef<HTMLInputElement>(null)
  const reunioesRef = useRef<HTMLInputElement>(null)
  const loading = state.status === 'loading'

  const errorsByField = useMemo(() => {
    if (state.status !== 'validation-error') return new Map<string, string>()
    return new Map(state.erros.map((error) => [error.campo, error.mensagem]))
  }, [state])

  useEffect(() => {
    if (state.status !== 'validation-error') return
    const firstField = state.erros[0]?.campo
    if (firstField === 'horasSono') horasSonoRef.current?.focus()
    if (firstField === 'quantidadeReunioes') reunioesRef.current?.focus()
  }, [state])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    void onCalculate({
      horasSono: Number(horasSono),
      quantidadeReunioes: Number(quantidadeReunioes),
    })
  }

  function updateMeetings(delta: number) {
    setQuantidadeReunioes((current) => {
      const parsed = Number.parseInt(current, 10)
      return String(Math.max(0, (Number.isFinite(parsed) ? parsed : 0) + delta))
    })
  }

  function reset() {
    setHorasSono('8')
    setQuantidadeReunioes('2')
    onReset()
  }

  const parsedMeetings = Number.parseInt(quantidadeReunioes, 10)
  const sleepError = errorsByField.get('horasSono')
  const meetingsError = errorsByField.get('quantidadeReunioes')

  return (
    <form aria-busy={loading} className={styles.form} onSubmit={submit}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Entrada / perfil do dia</p>
        <h2 id="tracker-title">Como está seu dia?</h2>
        <p>
          Ajuste os controles. A API transforma sono e reuniões em uma
          recomendação.
        </p>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="horasSono">Horas de sono</label>
          <output className={styles.value} htmlFor="horasSono">
            {formatarDecimal(Number(horasSono))} h
          </output>
        </div>
        <input
          aria-describedby={sleepError ? 'horasSono-error' : 'horasSono-hint'}
          aria-invalid={Boolean(sleepError)}
          aria-valuetext={
            formatarDecimal(Number(horasSono)) + ' horas de sono'
          }
          className={styles.range}
          id="horasSono"
          max="24"
          min="0"
          onChange={(event) => setHorasSono(event.target.value)}
          ref={horasSonoRef}
          step="0.5"
          type="range"
          value={horasSono}
        />
        <div aria-hidden="true" className={styles.rangeMarks}>
          <span>0</span>
          <span>8 · ideal</span>
          <span>24</span>
        </div>
        {sleepError ? (
          <FieldMessage id="horasSono-error" tone="error">
            {sleepError}
          </FieldMessage>
        ) : (
          <FieldMessage id="horasSono-hint">
            Use passos de meia hora.
          </FieldMessage>
        )}
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="quantidadeReunioes">
            Quantidade de reuniões
          </label>
          <span className={styles.value}>{quantidadeReunioes}</span>
        </div>
        <div className={styles.stepper}>
          <IconButton
            disabled={loading || parsedMeetings <= 0}
            icon={<Minus aria-hidden="true" size={18} />}
            label="Diminuir reuniões"
            onClick={() => updateMeetings(-1)}
          />
          <input
            aria-describedby={
              meetingsError ? 'reunioes-error' : 'reunioes-hint'
            }
            aria-invalid={Boolean(meetingsError)}
            id="quantidadeReunioes"
            inputMode="numeric"
            min="0"
            onChange={(event) => setQuantidadeReunioes(event.target.value)}
            ref={reunioesRef}
            step="1"
            type="number"
            value={quantidadeReunioes}
          />
          <IconButton
            disabled={loading}
            icon={<Plus aria-hidden="true" size={18} />}
            label="Aumentar reuniões"
            onClick={() => updateMeetings(1)}
          />
        </div>
        {meetingsError ? (
          <FieldMessage id="reunioes-error" tone="error">
            {meetingsError}
          </FieldMessage>
        ) : (
          <FieldMessage id="reunioes-hint">
            Informe somente reuniões inteiras.
          </FieldMessage>
        )}
      </div>

      {state.status === 'network-error' ? (
        <div className={styles.errorBox} role="alert">
          <p>{state.mensagem}</p>
          <Button
            onClick={() => void onCalculate(state.perfil)}
            variant="secondary"
          >
            <RefreshCw aria-hidden="true" size={17} />
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <div className={styles.actions}>
        <Button disabled={loading} type="submit">
          {loading ? (
            <LoaderCircle
              aria-hidden="true"
              className={styles.spinner}
              size={18}
            />
          ) : (
            <Coffee aria-hidden="true" size={18} />
          )}
          {loading ? 'Extraindo...' : 'Calcular meu dia'}
        </Button>
        <Button disabled={loading} onClick={reset} variant="secondary">
          <RotateCcw aria-hidden="true" size={17} />
          Reiniciar
        </Button>
      </div>

      <p aria-live="polite" className="visually-hidden" role="status">
        {loading ? 'Calculando recomendação' : ''}
      </p>
    </form>
  )
}

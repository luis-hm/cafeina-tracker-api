import { motion, useReducedMotion } from 'motion/react'
import { Coffee } from 'lucide-react'
import type { TrackerState } from '../useTracker'
import { obterResultadoVisivel } from '../useTracker'
import { RiscoGauge } from './RiscoGauge'
import { XicaraMedidor } from './XicaraMedidor'
import styles from './XicaraMedidor.module.css'

export interface ResultadoTrackerProps {
  state: TrackerState
}

export function ResultadoTracker({ state }: ResultadoTrackerProps) {
  const reducedMotion = useReducedMotion()
  const result = obterResultadoVisivel(state)
  const animationKey =
    result === undefined
      ? 'empty'
      : result.cafesRecomendados + '-' + result.motivoExtra
  const dimPrevious =
    result !== undefined &&
    (state.status === 'loading' ||
      state.status === 'validation-error' ||
      state.status === 'network-error')

  if (!result) {
    return (
      <section aria-labelledby="result-title" className={styles.resultPanel}>
        <div className={styles.panelHeading}>
          <p>Saída / extração</p>
          <h2 id="result-title">Sua recomendação aparece aqui</h2>
        </div>
        <XicaraMedidor animationKey="empty" cafes={0} />
        <p className={styles.emptyCopy}>
          Ajuste seu dia no painel e descubra a dose recomendada.
        </p>
      </section>
    )
  }

  return (
    <motion.section
      animate={{
        opacity: dimPrevious ? 0.58 : 1,
        x:
          result.nivelRisco === 'Chama o Cardiologista' && !reducedMotion
            ? [0, -4, 4, -2, 2, 0]
            : 0,
      }}
      aria-labelledby="result-title"
      aria-live="polite"
      className={styles.resultPanel}
      key={animationKey}
      transition={{ duration: reducedMotion ? 0 : 0.28 }}
    >
      <div className={styles.panelHeading}>
        <p>Saída / extração concluída</p>
        <h2 id="result-title">Recomendação do seu dia</h2>
      </div>

      <div className={styles.resultGrid}>
        <XicaraMedidor
          animationKey={animationKey}
          cafes={result.cafesRecomendados}
        />
        <RiscoGauge risk={result.nivelRisco} />
      </div>

      <blockquote className={styles.reason}>
        <Coffee aria-hidden="true" size={18} />
        <span>“{result.motivoExtra}”</span>
      </blockquote>
      <p className="visually-hidden">
        Recomendação: {result.cafesRecomendados} cafés, risco{' '}
        {result.nivelRisco}.
      </p>
    </motion.section>
  )
}

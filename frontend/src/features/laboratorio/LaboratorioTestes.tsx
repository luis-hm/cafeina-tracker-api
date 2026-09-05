import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  CheckCircle2,
  FlaskConical,
  X,
} from 'lucide-react'
import { IconButton } from '../../components/ui'
import type { PerfilDev, ResultadoTracker } from '../../types/api'
import {
  guidedTestCases,
  type TestPhase,
  type TestRunner,
} from './exemplos'
import styles from './LaboratorioTestes.module.css'

export interface LastTrackerCall {
  method: 'POST'
  path: '/tracker'
  request: PerfilDev
  status: 200
  response: ResultadoTracker
}

export interface LaboratorioTestesProps {
  isOpen: boolean
  lastCall?: LastTrackerCall
  returnFocusRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

const runners: TestRunner[] = ['jest', 'jasmine']
const phaseCopy: Record<TestPhase, string> = {
  Arrange: 'Preparar',
  Act: 'Executar',
  Assert: 'Conferir',
}

export function LaboratorioTestes({
  isOpen,
  lastCall,
  returnFocusRef,
  onClose,
}: LaboratorioTestesProps) {
  const [runner, setRunner] = useState<TestRunner>('jest')
  const [activeLine, setActiveLine] = useState(0)
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reducedMotion = useReducedMotion()
  const testCase = guidedTestCases[runner]
  const line = testCase.lines[activeLine] ?? testCase.lines[0]

  const closeLaboratory = useCallback(() => {
    setActiveLine(0)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    const returnFocusTarget = returnFocusRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeLaboratory()
        return
      }

      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      returnFocusTarget?.focus()
    }
  }, [closeLaboratory, isOpen, returnFocusRef])

  function handleOverlayMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) closeLaboratory()
  }

  function selectRunner(nextRunner: TestRunner) {
    setRunner(nextRunner)
    setActiveLine(0)
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = runners.indexOf(runner)
    let nextIndex: number | undefined

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % runners.length
    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + runners.length) % runners.length
    }
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = runners.length - 1
    if (nextIndex === undefined) return

    event.preventDefault()
    const nextRunner = runners[nextIndex]
    if (!nextRunner) return
    selectRunner(nextRunner)
    tabRefs.current[nextIndex]?.focus()
  }

  if (!isOpen || !line) return null

  return createPortal(
    <motion.div
      animate={{ opacity: 1 }}
      className={styles.overlay}
      initial={{ opacity: 0 }}
      onMouseDown={handleOverlayMouseDown}
      transition={{ duration: reducedMotion ? 0 : 0.16 }}
    >
      <motion.aside
        animate={{ opacity: 1, x: 0 }}
        aria-labelledby="laboratory-title"
        aria-modal="true"
        className={styles.dialog}
        initial={{ opacity: 0, x: reducedMotion ? 0 : 48 }}
        ref={dialogRef}
        role="dialog"
        transition={{ duration: reducedMotion ? 0 : 0.26 }}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Laboratório / testes</p>
            <h2 id="laboratory-title">Laboratório de testes</h2>
            <p>Mesma regra. Dois runners. Uma única expectativa.</p>
          </div>
          <IconButton
            icon={<X aria-hidden="true" size={20} />}
            label="Fechar laboratório"
            onClick={closeLaboratory}
            ref={closeButtonRef}
          />
        </header>

        <div aria-label="Framework de teste" className={styles.tabs} role="tablist">
          {runners.map((item, index) => {
            const selected = runner === item
            const itemCase = guidedTestCases[item]
            return (
              <button
                aria-controls={'panel-' + item}
                aria-selected={selected}
                className={styles.tab}
                id={'tab-' + item}
                key={item}
                onClick={() => selectRunner(item)}
                onKeyDown={handleTabKeyDown}
                ref={(element) => {
                  tabRefs.current[index] = element
                }}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                {itemCase.label}
              </button>
            )
          })}
        </div>

        <div
          aria-labelledby={'tab-' + runner}
          className={styles.tabPanel}
          id={'panel-' + runner}
          role="tabpanel"
        >
          <section className={styles.objective}>
            <div className={styles.objectiveIcon}>
              <FlaskConical aria-hidden="true" size={22} />
            </div>
            <div>
              <p>Objetivo do caso</p>
              <strong>{testCase.objective}</strong>
              <span>
                <Braces aria-hidden="true" size={14} />
                {testCase.fileName} · {testCase.parityMarker}
              </span>
            </div>
          </section>

          <div className={styles.phaseRail} aria-label="Etapas do teste">
            {(['Arrange', 'Act', 'Assert'] as const).map((phase) => (
              <div data-active={line.phase === phase} key={phase}>
                <span>{phase}</span>
                <strong>{phaseCopy[phase]}</strong>
              </div>
            ))}
          </div>

          <div className={styles.guideGrid}>
            <section aria-label={'Exemplo ' + testCase.label} className={styles.codePanel}>
              <div className={styles.codeHeader}>
                <span>{testCase.label.toLowerCase()} — {testCase.fileName}</span>
                <span>somente leitura</span>
              </div>
              <ol className={styles.codeLines}>
                {testCase.lines.map((item, index) => (
                  <li data-phase={item.phase.toLowerCase()} key={item.code}>
                    <button
                      aria-label={
                        'Linha ' +
                        (index + 1) +
                        ', ' +
                        item.phase +
                        ': ' +
                        item.code
                      }
                      aria-pressed={activeLine === index}
                      className={styles.codeLine}
                      onClick={() => setActiveLine(index)}
                      type="button"
                    >
                      <span aria-hidden="true" className={styles.lineNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <code>{item.code}</code>
                    </button>
                  </li>
                ))}
              </ol>
            </section>

            <section
              aria-live="polite"
              className={styles.explanation}
              key={runner + '-' + activeLine}
            >
              <div className={styles.explanationMeta}>
                <span>{line.phase} · {phaseCopy[line.phase]}</span>
                <span>Linha {activeLine + 1} de {testCase.lines.length}</span>
              </div>
              <h3>{line.title}</h3>
              <p>{line.explanation}</p>
              <div className={styles.why}>
                <strong>Por que esta linha importa?</strong>
                <p>{line.importance}</p>
              </div>
              {line.difference ? (
                <div className={styles.difference}>
                  <strong>Comparação entre runners</strong>
                  <p>{line.difference}</p>
                </div>
              ) : null}
              <div className={styles.guideActions}>
                <button
                  disabled={activeLine === 0}
                  onClick={() => setActiveLine((current) => Math.max(0, current - 1))}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" size={16} />
                  Anterior
                </button>
                <button
                  disabled={activeLine === testCase.lines.length - 1}
                  onClick={() =>
                    setActiveLine((current) =>
                      Math.min(testCase.lines.length - 1, current + 1),
                    )
                  }
                  type="button"
                >
                  Próxima
                  <ArrowRight aria-hidden="true" size={16} />
                </button>
              </div>
            </section>
          </div>

          <section className={styles.lastCall}>
            <div className={styles.lastCallHeader}>
              <div>
                <p>Última chamada</p>
                <h3>Da interface para a expectativa</h3>
              </div>
              {lastCall ? (
                <span className={styles.httpStatus}>
                  <CheckCircle2 aria-hidden="true" size={15} />
                  {lastCall.method} {lastCall.path} · {lastCall.status} OK
                </span>
              ) : null}
            </div>
            {lastCall ? (
              <>
                <div className={styles.traffic}>
                  <div>
                    <span>Envio</span>
                    <pre>{JSON.stringify(lastCall.request, null, 2)}</pre>
                  </div>
                  <ArrowRight aria-hidden="true" className={styles.trafficArrow} size={20} />
                  <div>
                    <span>Resposta</span>
                    <pre>{JSON.stringify(lastCall.response, null, 2)}</pre>
                  </div>
                </div>
                <p className={styles.connection}>
                  A expectativa lê <code>resposta.body.cafesRecomendados</code>{' '}
                  e confere o valor <strong>{lastCall.response.cafesRecomendados}</strong>{' '}
                  devolvido nesta chamada.
                </p>
              </>
            ) : (
              <p className={styles.noCall}>
                Calcule uma recomendação no painel principal para preencher
                payload, status e resposta reais nesta área.
              </p>
            )}
          </section>
        </div>
      </motion.aside>
    </motion.div>,
    document.body,
  )
}

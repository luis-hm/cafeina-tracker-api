import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AppHeader } from '../components/AppHeader'
import type { ApiConnectionStatus } from '../components/ApiStatus'
import { CafeteriaStatus } from '../features/cafeteria/CafeteriaStatus'
import { buscarEstatisticas } from '../features/estatisticas'
import {
  MediaCafes,
  type StatisticsState,
} from '../features/estatisticas/MediaCafes'
import {
  LaboratorioTestes,
  type LastTrackerCall,
} from '../features/laboratorio'
import { buscarStatusApi } from '../features/status'
import { PerfilForm } from '../features/tracker/components/PerfilForm'
import { ResultadoTracker } from '../features/tracker/components/ResultadoTracker'
import { useTracker } from '../features/tracker'
import type { PerfilDev } from '../types/api'
import styles from './App.module.css'

export function App() {
  const tracker = useTracker()
  const [apiStatus, setApiStatus] =
    useState<ApiConnectionStatus>('checking')
  const [statistics, setStatistics] = useState<StatisticsState>({
    status: 'loading',
  })
  const [laboratoryOpen, setLaboratoryOpen] = useState(false)
  const [lastCall, setLastCall] = useState<LastTrackerCall>()
  const laboratoryButtonRef = useRef<HTMLButtonElement>(null)
  const statisticsRequest = useRef(0)
  const apiRequest = useRef(0)

  useEffect(() => {
    let active = true
    void buscarStatusApi().then(
      () => {
        if (active) setApiStatus('online')
      },
      () => {
        if (active) setApiStatus('offline')
      },
    )
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    void buscarEstatisticas().then(
      (data) => {
        if (active) {
          setStatistics({ status: 'success', value: data.mediaCafes })
        }
      },
      () => {
        if (active) setStatistics({ status: 'error' })
      },
    )
    return () => {
      active = false
    }
  }, [])

  const checkApi = useCallback(async () => {
    const id = ++apiRequest.current
    setApiStatus('checking')
    try {
      await buscarStatusApi()
      if (id === apiRequest.current) setApiStatus('online')
    } catch {
      if (id === apiRequest.current) setApiStatus('offline')
    }
  }, [])

  const refreshStatistics = useCallback(async () => {
    const id = ++statisticsRequest.current
    setStatistics((current) => ({
      status: 'loading',
      value: current.value,
    }))
    try {
      const data = await buscarEstatisticas()
      if (id === statisticsRequest.current) {
        setStatistics({ status: 'success', value: data.mediaCafes })
      }
    } catch {
      if (id === statisticsRequest.current) {
        setStatistics((current) => ({
          status: 'error',
          value: current.value,
        }))
      }
    }
  }, [])

  async function calculate(perfil: PerfilDev): Promise<void> {
    const result = await tracker.calcular(perfil)
    if (!result) return

    setLastCall({
      method: 'POST',
      path: '/tracker',
      request: perfil,
      status: 200,
      response: result,
    })
    await refreshStatistics()
  }

  const closeLaboratory = useCallback(() => {
    setLaboratoryOpen(false)
  }, [])

  const openLaboratory = useCallback(() => {
    setLaboratoryOpen(true)
  }, [])

  return (
    <>
      <a className="skip-link" href="#calculo">
        Pular para o cálculo
      </a>
      <div className={styles.shell + ' app-enter'}>
        <AppHeader
          apiStatus={apiStatus}
          laboratoryButtonRef={laboratoryButtonRef}
          onOpenLaboratory={openLaboratory}
          onRetryApi={() => void checkApi()}
        />

        <main id="calculo">
          <section
            aria-labelledby="tracker-title"
            className={styles.workbench}
          >
            <div className={styles.controls}>
              <PerfilForm
                onCalculate={calculate}
                onReset={tracker.resetar}
                state={tracker.state}
              />
            </div>
            <div className={styles.result}>
              <ResultadoTracker state={tracker.state} />
            </div>
          </section>

          <div className={styles.utilities}>
            <CafeteriaStatus />
            <MediaCafes
              onRetry={() => void refreshStatistics()}
              state={statistics}
            />
          </div>

          <footer className={styles.seminarNote}>
            <p>Seminário / testes automatizados</p>
            <span>
              Use o laboratório para explicar como o mesmo comportamento é
              provado no Jest e no Jasmine.
            </span>
          </footer>
        </main>
      </div>

      <LaboratorioTestes
        isOpen={laboratoryOpen}
        lastCall={lastCall}
        onClose={closeLaboratory}
        returnFocusRef={laboratoryButtonRef}
      />
    </>
  )
}

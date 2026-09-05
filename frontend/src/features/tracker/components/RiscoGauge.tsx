import type { LucideIcon } from 'lucide-react'
import {
  Gauge as GaugeIcon,
  HeartPulse,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import type { NivelRisco } from '../../../types/api'
import styles from './XicaraMedidor.module.css'

interface RiskDefinition {
  helper: string
  Icon: LucideIcon
  tone: 'safe' | 'attention' | 'high' | 'critical'
}

const risks: Record<NivelRisco, RiskDefinition> = {
  Seguro: {
    helper: 'Dentro da rotina',
    Icon: ShieldCheck,
    tone: 'safe',
  },
  Atenção: {
    helper: 'Reduza o ritmo',
    Icon: GaugeIcon,
    tone: 'attention',
  },
  'Risco Alto': {
    helper: 'Hora de desacelerar',
    Icon: TriangleAlert,
    tone: 'high',
  },
  'Chama o Cardiologista': {
    helper: 'Limite máximo atingido',
    Icon: HeartPulse,
    tone: 'critical',
  },
}

export interface RiscoGaugeProps {
  risk: NivelRisco
}

export function RiscoGauge({ risk }: RiscoGaugeProps) {
  const definition = risks[risk]
  const Icon = definition.Icon

  return (
    <div className={styles.gauge} data-tone={definition.tone}>
      <div aria-hidden="true" className={styles.gaugeDial}>
        <span />
        <Icon size={25} strokeWidth={2.2} />
      </div>
      <div>
        <p className={styles.gaugeLabel}>Nível de risco</p>
        <strong>{risk}</strong>
        <span>{definition.helper}</span>
      </div>
    </div>
  )
}

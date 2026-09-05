import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import styles from './XicaraMedidor.module.css'

export interface XicaraMedidorProps {
  cafes: number
  animationKey: string
}

export function XicaraMedidor({
  cafes,
  animationKey,
}: XicaraMedidorProps) {
  const clipId = useId()
  const reducedMotion = useReducedMotion()
  const proportion = Math.min(1, Math.max(0, cafes / 10))
  // Measure the fill against the usable interior of the cup. The prior
  // dimensions used the SVG canvas, which left a full cup half empty.
  const liquidBottom = 250
  const liquidTop = 98
  const liquidHeight = proportion * (liquidBottom - liquidTop)
  const liquidY = liquidBottom - liquidHeight

  return (
    <figure className={styles.figure}>
      <svg
        aria-labelledby={clipId + '-title ' + clipId + '-description'}
        className={styles.cup}
        role="img"
        viewBox="0 0 300 310"
      >
        <title id={clipId + '-title'}>Xícara medidora de cafeína</title>
        <desc id={clipId + '-description'}>
          {cafes === 0
            ? 'Xícara vazia aguardando um cálculo.'
            : 'Xícara preenchida em ' +
              Math.round(proportion * 100) +
              ' por cento para representar ' +
              cafes +
              ' cafés.'}
        </desc>
        <defs>
          <clipPath id={clipId}>
            <path d="M58 88H208V193C208 237 179 260 133 260C87 260 58 237 58 193V88Z" />
          </clipPath>
        </defs>

        <path
          className={styles.cupBody}
          d="M58 88H208V193C208 237 179 260 133 260C87 260 58 237 58 193V88Z"
        />

        <motion.g
          animate={{ opacity: cafes > 0 ? 1 : 0 }}
          aria-hidden="true"
          key={animationKey + '-steam'}
          transition={{ delay: 0.5, duration: reducedMotion ? 0 : 0.9 }}
        >
          <motion.path
            animate={reducedMotion ? undefined : { pathLength: [0, 1, 0] }}
            className={styles.steam}
            d="M91 52C75 36 104 25 91 8"
            initial={reducedMotion ? undefined : { pathLength: 0 }}
            transition={{ duration: 0.9, repeat: 1 }}
          />
          <motion.path
            animate={reducedMotion ? undefined : { pathLength: [0, 1, 0] }}
            className={styles.steam}
            d="M141 52C125 35 155 26 143 7"
            initial={reducedMotion ? undefined : { pathLength: 0 }}
            transition={{ delay: 0.12, duration: 0.9, repeat: 1 }}
          />
        </motion.g>

        <g clipPath={'url(#' + clipId + ')'}>
          <motion.rect
            animate={{ height: liquidHeight, y: liquidY }}
            className={styles.liquid}
            initial={
              reducedMotion
                ? false
                : { height: Math.max(0, liquidHeight - 30), y: liquidY + 30 }
            }
            key={animationKey + '-liquid'}
            transition={{
              duration: reducedMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            width="150"
            x="58"
          />
          {cafes > 0 ? (
            <motion.ellipse
              animate={{ y: liquidY }}
              className={styles.crema}
              cx="133"
              key={animationKey + '-crema'}
              rx="75"
              ry="8"
              transition={{ duration: reducedMotion ? 0 : 0.7 }}
            />
          ) : null}
        </g>

        <path
          className={styles.handle}
          d="M208 112H226C256 112 265 138 257 164C250 189 231 204 208 204"
        />
        <path
          className={styles.outline}
          d="M58 88H208V193C208 237 179 260 133 260C87 260 58 237 58 193V88Z"
        />
        <ellipse className={styles.rim} cx="133" cy="88" rx="76" ry="11" />
        <path className={styles.saucer} d="M42 276H224" />
      </svg>
      <figcaption className={styles.caption}>
        <strong>{cafes}</strong>
        <span>{cafes === 1 ? 'café' : 'cafés'}</span>
        <small>de um limite visual de 10</small>
      </figcaption>
    </figure>
  )
}

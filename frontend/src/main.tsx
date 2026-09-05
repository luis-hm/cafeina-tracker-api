import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/manrope'
import '@fontsource/ibm-plex-mono/400.css'
import { App } from './app/App'
import './styles/tokens.css'
import './styles/reset.css'
import './styles/globals.css'
import './styles/motion.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Elemento raiz do frontend não foi encontrado.')
}

createRoot(root).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)

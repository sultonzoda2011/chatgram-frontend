import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/i18n.ts'
import './index.css'
import App from './App.tsx'
import Providers from './lib/providers/providers.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)

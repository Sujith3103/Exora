import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

{ document.documentElement.style.setProperty('--primary', 'oklch(0.205 0 0)') }
{ document.documentElement.style.setProperty('--secondary', 'oklch(0.97 0 0)') }

import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './critical.css'
import './performance.css'
import './index.css'
import './responsive-utilities.css'
import App from './App.jsx'

// Disable browser's automatic scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

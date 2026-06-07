import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRouter } from './app/router'
import { Toaster } from '@/components/ui/sonner'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
    <Toaster />
  </React.StrictMode>,
)

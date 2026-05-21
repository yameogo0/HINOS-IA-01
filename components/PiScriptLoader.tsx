// components/PiScriptLoader.tsx
'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Pi: any
  }
}

export function PiScriptLoader() {
  const [isPiReady, setIsPiReady] = useState(false)

  useEffect(() => {
    const initPiSDK = () => {
      if (typeof window !== 'undefined' && window.Pi) {
        console.log('✅ Pi SDK chargé avec succès')
        window.Pi.init({
          version: '2.0',
          sandbox: process.env.NEXT_PUBLIC_PI_NETWORK_SANDBOX === 'true'
        })
        setIsPiReady(true)
        return true
      }
      return false
    }

    // Vérification immédiate
    if (initPiSDK()) return

    // Si pas encore chargé, on vérifie toutes les 500ms
    const interval = setInterval(() => {
      if (initPiSDK()) clearInterval(interval)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return null
}
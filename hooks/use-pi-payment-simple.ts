'use client'

import { useState, useCallback } from 'react'

export interface PiPaymentConfig {
  amount: number
  planId: string
  memo: string
}

export interface PiPaymentResult {
  success: boolean
  paymentId?: string
  txid?: string
  subscription?: {
    planId: string
    active: boolean
    activatedAt: string
    expiresAt: string
  }
  error?: string
}

declare global {
  interface Window {
    Pi: {
      createPayment: (config: any, callbacks: any) => void
      authenticate: (scopes: string[], onIncomplete: (error: any) => void) => Promise<any>
    }
  }
}

export function usePiPaymentSimple() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Vérifier si Pi SDK est chargé
  const isPiSDKReady = useCallback(() => {
    return typeof window !== 'undefined' && window.Pi
  }, [])

  // Authentifier l'utilisateur
  const authenticateUser = useCallback(async () => {
    if (!isPiSDKReady()) {
      throw new Error("Pi SDK non chargé. Veuillez rafraîchir la page.")
    }

    try {
      const scopes = ['username', 'payments']
      const auth = await window.Pi.authenticate(scopes, (error: any) => {
        console.error("Erreur auth Pi:", error)
      })
      return auth
    } catch (err) {
      console.error("Erreur authentification:", err)
      throw new Error("Impossible de se connecter au wallet Pi")
    }
  }, [isPiSDKReady])

  const initiatePayment = useCallback(async (config: PiPaymentConfig): Promise<PiPaymentResult> => {
    setIsProcessing(true)
    setError(null)
    setPaymentStatus('🔄 Initialisation du paiement...')

    try {
      // Vérifier si l'utilisateur est authentifié
      const isSandbox = process.env.NEXT_PUBLIC_PI_NETWORK_SANDBOX === 'true'
      
      if (!isSandbox && !isPiSDKReady()) {
        throw new Error("SDK Pi non disponible. Vérifiez votre connexion.")
      }

      // Étape 1: Créer le paiement sur le backend
      setPaymentStatus('📝 Création du paiement...')
      const createResponse = await fetch('/api/pi/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          planId: config.planId,
          amount: config.amount
        })
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.error || 'Erreur création paiement')
      }
      
      const paymentData = await createResponse.json()
      const paymentId = paymentData.paymentId

      console.log(`✅ Paiement créé: ${paymentId}`)

      // Étape 2: Si Pi SDK est disponible (mode réel), approuver via le wallet
      if (isPiSDKReady() && !isSandbox) {
        setPaymentStatus('🟣 Approbation dans le wallet Pi...')
        
        await new Promise<void>((resolve, reject) => {
          let isResolved = false

          window.Pi.createPayment(
            {
              amount: config.amount,
              memo: config.memo,
              metadata: { planId: config.planId, paymentId }
            },
            {
              onReadyForServerApproval: async (piPaymentId: string) => {
                console.log(`📝 Approbation serveur pour: ${piPaymentId}`)
                try {
                  const approveResponse = await fetch('/api/pi/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'approve',
                      paymentId: piPaymentId
                    })
                  })
                  if (!approveResponse.ok) {
                    throw new Error('Approbation serveur échouée')
                  }
                  console.log(`✅ Paiement approuvé: ${piPaymentId}`)
                } catch (err) {
                  reject(err)
                }
              },
              onReadyForServerCompletion: async (piPaymentId: string, txid: string) => {
                console.log(`✅ Finalisation pour: ${piPaymentId} - TXID: ${txid}`)
                setPaymentStatus('✅ Finalisation du paiement...')
                try {
                  const completeResponse = await fetch('/api/pi/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'complete',
                      paymentId: piPaymentId,
                      txid,
                      planId: config.planId
                    })
                  })
                  if (!completeResponse.ok) {
                    throw new Error('Finalisation serveur échouée')
                  }
                  const result = await completeResponse.json()
                  if (!isResolved) {
                    isResolved = true
                    resolve(result)
                  }
                } catch (err) {
                  if (!isResolved) reject(err)
                }
              },
              onCancel: () => {
                console.log('❌ Paiement annulé par l\'utilisateur')
                if (!isResolved) reject(new Error('Paiement annulé'))
              },
              onError: (err: Error) => {
                console.error('❌ Erreur Pi SDK:', err)
                if (!isResolved) reject(err)
              }
            }
          )
        })
      } else {
        // Mode Sandbox - Simulation directe
        console.log('🏖️ Mode Sandbox: simulation du paiement')
        setPaymentStatus('🏖️ Mode test - Simulation du paiement...')
        
        // Simuler une petite pause pour l'expérience utilisateur
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setPaymentStatus('✅ Finalisation du paiement...')
        const completeResponse = await fetch('/api/pi/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'complete',
            paymentId,
            txid: 'sandbox_' + Date.now(),
            planId: config.planId
          })
        })

        if (!completeResponse.ok) {
          throw new Error('Finalisation échouée')
        }
        
        const result = await completeResponse.json()

        setPaymentStatus('✅ Paiement réussi!')
        setIsProcessing(false)
        return {
          success: true,
          paymentId,
          txid: 'sandbox_' + Date.now(),
          subscription: result.subscription
        }
      }

      setPaymentStatus('✅ Abonnement activé avec succès!')
      setIsProcessing(false)
      
      // Calculer la date d'expiration selon le plan
      const durationDays = config.planId === 'pro_weekly' ? 7 : 30
      
      return {
        success: true,
        paymentId,
        subscription: {
          planId: config.planId,
          active: true,
          activatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
        }
      }
      
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur de paiement'
      console.error('❌ Erreur paiement:', errorMsg)
      setError(errorMsg)
      setPaymentStatus(`❌ ${errorMsg}`)
      setIsProcessing(false)
      return { success: false, error: errorMsg }
    }
  }, [isPiSDKReady])

  const resetStatus = useCallback(() => {
    setPaymentStatus('')
    setError(null)
    setIsProcessing(false)
  }, [])

  return {
    initiatePayment,
    isProcessing,
    paymentStatus,
    error,
    resetStatus,
    isPiSDKReady: isPiSDKReady()
  }
}
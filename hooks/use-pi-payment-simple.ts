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
    }
  }
}

export function usePiPaymentSimple() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = useCallback(async (config: PiPaymentConfig): Promise<PiPaymentResult> => {
    setIsProcessing(true)
    setError(null)
    setPaymentStatus('Initialisation du paiement...')

    try {
      // Étape 1: Créer le paiement
      const createResponse = await fetch('/api/pi/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          planId: config.planId,
          amount: config.amount
        })
      })

      if (!createResponse.ok) throw new Error('Erreur création paiement')
      const paymentData = await createResponse.json()
      const paymentId = paymentData.paymentId

      setPaymentStatus('Approbation du paiement...')

      // Étape 2: Si Pi SDK est disponible, approuver via le wallet
      if (typeof window !== 'undefined' && window.Pi) {
        await new Promise<void>((resolve, reject) => {
          window.Pi.createPayment(
            {
              amount: config.amount,
              memo: config.memo,
              metadata: { planId: config.planId }
            },
            {
              onReadyForServerApproval: async (paymentId: string) => {
                const approveResponse = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'approve',
                    paymentId
                  })
                })
                if (!approveResponse.ok) reject(new Error('Approbation échouée'))
              },
              onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                setPaymentStatus('Finalisation du paiement...')
                const completeResponse = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'complete',
                    paymentId,
                    txid,
                    planId: config.planId
                  })
                })
                if (!completeResponse.ok) reject(new Error('Finalisation échouée'))
                const result = await completeResponse.json()
                resolve()
              },
              onCancel: () => {
                reject(new Error('Paiement annulé par l\'utilisateur'))
              },
              onError: (err: Error) => {
                reject(err)
              }
            }
          )
        })
      } else {
        // Mode démo/sandbox - approuver directement
        setPaymentStatus('Finalisation du paiement...')
        const completeResponse = await fetch('/api/pi/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'complete',
            paymentId,
            txid: 'demo_txid_' + Date.now(),
            planId: config.planId
          })
        })

        if (!completeResponse.ok) throw new Error('Finalisation échouée')
        const result = await completeResponse.json()

        setPaymentStatus('✅ Paiement réussi!')
        setIsProcessing(false)
        return {
          success: true,
          paymentId,
          txid: 'demo_txid_' + Date.now(),
          subscription: result.subscription
        }
      }

      setPaymentStatus('✅ Paiement réussi!')
      setIsProcessing(false)
      return {
        success: true,
        paymentId,
        subscription: {
          planId: config.planId,
          active: true,
          activatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur de paiement'
      setError(errorMsg)
      setPaymentStatus('❌ ' + errorMsg)
      setIsProcessing(false)
      return { success: false, error: errorMsg }
    }
  }, [])

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
    resetStatus
  }
}

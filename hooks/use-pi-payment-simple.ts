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

export function usePiPaymentSimple() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = useCallback(async (config: PiPaymentConfig): Promise<PiPaymentResult> => {
    setIsProcessing(true)
    setError(null)
    setPaymentStatus('🔄 Création du paiement...')

    try {
      console.log('💰 Création paiement:', config)

      const createResponse = await fetch('/api/pi/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          planId: config.planId,
          amount: config.amount
        })
      })

      const createData = await createResponse.json()
      console.log('📦 Réponse création:', createData)

      if (!createResponse.ok || !createData.success) {
        throw new Error(createData.error || 'Erreur création paiement')
      }

      const paymentId = createData.paymentId
      setPaymentStatus('🟣 Finalisation...')

      const completeResponse = await fetch('/api/pi/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          paymentId,
          txid: 'tx_' + Date.now(),
          planId: config.planId
        })
      })

      if (!completeResponse.ok) {
        throw new Error('Finalisation échouée')
      }

      const durationDays = config.planId === 'pro_weekly' ? 7 : 30
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + durationDays)

      setPaymentStatus('✅ Abonnement activé !')

      return {
        success: true,
        paymentId,
        subscription: {
          planId: config.planId,
          active: true,
          activatedAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString()
        }
      }

    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur de paiement'
      console.error('❌ Erreur paiement:', errorMsg)
      setError(errorMsg)
      setPaymentStatus('❌ ' + errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsProcessing(false)
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

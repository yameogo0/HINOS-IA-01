'use client'

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
    setPaymentStatus('🔄 Activation de l\'abonnement...')

    try {
      console.log('💰 Activation du plan:', config.planId)

      // Simulation directe - pas d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Calculer la date d'expiration
      const durationDays = config.planId === 'pro_weekly' ? 7 : 30
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + durationDays)
      
      const subscriptionData = {
        planId: config.planId,
        active: true,
        activatedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem('hinos_subscription', JSON.stringify(subscriptionData))
      
      setPaymentStatus('✅ Abonnement activé avec succès !')
      
      return {
        success: true,
        paymentId: 'simulation_' + Date.now(),
        subscription: subscriptionData
      }
      
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur d\'activation'
      console.error('❌ Erreur:', errorMsg)
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
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
    setPaymentStatus('🔄 Initialisation du paiement...')

    try {
      console.log('💰 Paiement sandbox:', config)
      
      // Simuler un délai de traitement
      setPaymentStatus('📝 Traitement en cours...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Générer des IDs fictifs
      const paymentId = 'sandbox_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
      const txid = '0x' + Math.random().toString(16).slice(2, 42)
      
      // Calculer la date d'expiration (30 jours par défaut)
      const durationDays = config.planId === 'pro_weekly' ? 7 : 30
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + durationDays)
      
      setPaymentStatus('✅ Paiement réussi !')
      
      // Retourner un succès immédiat
      return {
        success: true,
        paymentId,
        txid,
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
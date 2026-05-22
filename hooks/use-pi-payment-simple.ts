'use client'

import { useState } from 'react'

export function usePiPaymentSimple() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [error, setError] = useState(null)

  const initiatePayment = async (config) => {
    console.log('💰 Paiement démarré:', config)
    setIsProcessing(true)
    setPaymentStatus('🔄 Activation...')
    
    // Simulation d'attente
    await new Promise(r => setTimeout(r, 1500))
    
    // Sauvegarde de l'abonnement
    const subscription = {
      planId: config.planId,
      active: true,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    localStorage.setItem('hinos_subscription', JSON.stringify(subscription))
    
    setPaymentStatus('✅ Activé !')
    setIsProcessing(false)
    
    return { success: true, subscription }
  }

  const resetStatus = () => {
    setPaymentStatus('')
    setError(null)
    setIsProcessing(false)
  }

  return {
    initiatePayment,
    isProcessing,
    paymentStatus,
    error,
    resetStatus
  }
}

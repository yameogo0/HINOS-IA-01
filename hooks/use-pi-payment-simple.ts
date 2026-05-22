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

      // 1. Créer le paiement via l'API
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
      setPaymentStatus('🟣 Approbation dans le wallet Pi...')

      // 2. Si SDK Pi disponible, lancer la demande de paiement
      if (typeof window !== 'undefined' && window.Pi) {
        await new Promise<void>((resolve, reject) => {
          window.Pi.createPayment(
            {
              amount: config.amount,
              memo: config.memo,
              metadata: { planId: config.planId }
            },
            {
              onReadyForServerApproval: async (piPaymentId: string) => {
                console.log('Approbation serveur:', piPaymentId)
                const approveResponse = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'approve',
                    paymentId: piPaymentId
                  })
                })
                if (!approveResponse.ok) {
                  reject(new Error('Approbation échouée'))
                }
              },
              onReadyForServerCompletion: async (piPaymentId: string, txid: string) => {
                console.log('Finalisation:', piPaymentId, txid)
                setPaymentStatus('✅ Finalisation...')
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
                  reject(new Error('Finalisation échouée'))
                }
                const result = await completeResponse.json()
                resolve(result)
              },
              onCancel: () => reject(new Error('Paiement annulé')),
              onError: (err: Error) => reject(err)
            }
          )
        })
      } else {
        // Mode sans SDK - compléter directement
        setPaymentStatus('✅ Finalisation...')
        const completeResponse = await fetch('/api/pi/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'complete',
            paymentId,
            txid: 'demo_' + Date.now(),
            planId: config.planId
          })
        })
        if (!completeResponse.ok) {
          throw new Error('Finalisation échouée')
        }
      }

      // Calculer la date d'expiration
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
'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Pi: any
  }
}

interface PiUser {
  uid: string
  username: string
  accessToken: string
  walletAddress?: string
}

interface Subscription {
  tier: string
  activatedAt: string
  expiresAt: string
  status: 'active' | 'expired' | 'cancelled'
  paymentId?: string
  txid?: string
}

export function usePiWallet() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<PiUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isPiSDKReady, setIsPiSDKReady] = useState(false)

  // Vérifier si le SDK Pi est chargé
  useEffect(() => {
    const checkPiSDK = () => {
      if (typeof window !== 'undefined' && window.Pi) {
        setIsPiSDKReady(true)
        console.log('✅ Pi SDK chargé')
        return true
      }
      return false
    }

    if (checkPiSDK()) return

    const interval = setInterval(() => {
      if (checkPiSDK()) clearInterval(interval)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Vérifier l'abonnement actuel
  const checkSubscription = () => {
    const saved = localStorage.getItem('hinos_subscription')
    if (saved) {
      try {
        const sub = JSON.parse(saved)
        const now = new Date()
        const expires = new Date(sub.expiresAt)
        
        if (expires > now) {
          setSubscription({ ...sub, status: 'active' })
          return sub
        } else {
          localStorage.removeItem('hinos_subscription')
          setSubscription(null)
          return null
        }
      } catch (e) {
        console.error('Erreur chargement abonnement:', e)
        localStorage.removeItem('hinos_subscription')
      }
    }
    return null
  }

  // Sauvegarder l'abonnement
  const saveSubscription = (tier: string, paymentId?: string, txid?: string) => {
    const now = new Date()
    let expiresAt = new Date()
    
    if (tier === 'pro') {
      expiresAt.setDate(now.getDate() + 7) // 7 jours Pro
    } else if (tier === 'premium') {
      expiresAt.setDate(now.getDate() + 30) // 30 jours Premium
    } else {
      return null
    }
    
    const subscriptionData: Subscription = {
      tier,
      activatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'active',
      paymentId,
      txid
    }
    
    localStorage.setItem('hinos_subscription', JSON.stringify(subscriptionData))
    setSubscription(subscriptionData)
    return subscriptionData
  }

  // Connexion Pi Wallet (réelle)
  const login = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Mode production avec SDK Pi réel
      if (isPiSDKReady) {
        const scopes = ['username', 'payments', 'wallet_address']
        
        const auth = await window.Pi.authenticate(scopes, (err: any) => {
          console.error('Erreur auth Pi:', err)
          setError(err?.message || 'Erreur d\'authentification')
        })
        
        if (auth && auth.user) {
          const userData: PiUser = {
            uid: auth.user.uid,
            username: auth.user.username,
            accessToken: auth.accessToken,
            walletAddress: auth.user.wallet_address
          }
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem('pi_user', JSON.stringify(userData))
          checkSubscription()
          return true
        }
      } 
      
      // Mode sandbox / démo
      console.log('🏖️ Mode sandbox - Connexion simulée')
      const demoUser: PiUser = {
        uid: 'demo_' + Date.now(),
        username: 'demo_user',
        accessToken: 'demo_token_' + Date.now(),
        walletAddress: '0x' + Math.random().toString(36).slice(2, 10)
      }
      setUser(demoUser)
      setIsAuthenticated(true)
      localStorage.setItem('pi_user', JSON.stringify(demoUser))
      checkSubscription()
      return true
      
    } catch (err: any) {
      console.error('Erreur connexion:', err)
      setError(err.message || 'Erreur de connexion')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Déconnexion
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setSubscription(null)
    localStorage.removeItem('pi_user')
    localStorage.removeItem('hinos_subscription')
    console.log('🔓 Déconnexion effectuée')
  }

  // Traitement du paiement avec appel API réel
  const processPayment = async (data: { amount: number; memo: string; metadata: { tier: string } }) => {
    setIsLoading(true)
    setError(null)
    
    console.log('💰 Traitement paiement:', data)
    
    try {
      // Appel à l'API de paiement
      const response = await fetch('/api/pi/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          planId: data.metadata.tier === 'pro' ? 'pro_weekly' : 'premium_monthly',
          amount: data.amount,
          userId: user?.uid
        })
      })

      if (!response.ok) {
        throw new Error('Erreur création paiement')
      }

      const paymentResult = await response.json()
      console.log('✅ Paiement créé:', paymentResult)

      // Si SDK Pi disponible, lancer le vrai paiement
      if (isPiSDKReady && paymentResult.paymentId) {
        // Ici vous pouvez intégrer le vrai flux de paiement Pi
        // Pour l'instant, on simule la confirmation
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Sauvegarder l'abonnement
      const subscriptionData = saveSubscription(
        data.metadata.tier,
        paymentResult.paymentId,
        paymentResult.txid
      )

      console.log('💰 Abonnement sauvegardé:', subscriptionData)
      
      return { 
        success: true, 
        subscription: subscriptionData,
        paymentId: paymentResult.paymentId
      }
      
    } catch (err: any) {
      console.error('❌ Erreur paiement:', err)
      setError(err.message || 'Erreur de paiement')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Vérifier si l'utilisateur a accès à une fonctionnalité Premium
  const hasPremiumAccess = () => {
    if (!subscription) return false
    const now = new Date()
    const expires = new Date(subscription.expiresAt)
    return subscription.status === 'active' && expires > now
  }

  // Obtenir le nom du tier actuel
  const getCurrentTier = () => {
    if (!subscription) return 'basic'
    return subscription.tier === 'pro' ? '⭐ Pro' : 
           subscription.tier === 'premium' ? '👑 Premium' : '🔓 Basic'
  }

  // Temps restant avant expiration
  const getTimeRemaining = () => {
    if (!subscription) return null
    const now = new Date()
    const expires = new Date(subscription.expiresAt)
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) {
      // Nettoyer l'abonnement expiré
      localStorage.removeItem('hinos_subscription')
      setSubscription(null)
      return null
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`
    return "Moins d'une heure"
  }

  // Rafraîchir l'abonnement depuis le serveur
  const refreshSubscription = async () => {
    if (!user?.uid) return
    
    try {
      const response = await fetch(`/api/subscription/status?userId=${user.uid}`)
      if (response.ok) {
        const data = await response.json()
        if (data.subscription) {
          setSubscription(data.subscription)
          localStorage.setItem('hinos_subscription', JSON.stringify(data.subscription))
        }
      }
    } catch (err) {
      console.error('Erreur rafraîchissement:', err)
    }
  }

  // Session persistante
  useEffect(() => {
    const savedUser = localStorage.getItem('pi_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
        setIsAuthenticated(true)
      } catch (e) {
        console.error('Erreur chargement session:', e)
      }
    }
    checkSubscription()
    setIsLoading(false)
  }, [])

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    subscription,
    isPiSDKReady,
    login,
    logout,
    processPayment,
    hasPremiumAccess,
    getCurrentTier,
    getTimeRemaining,
    refreshSubscription
  }
}
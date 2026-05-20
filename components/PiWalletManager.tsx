'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, LogOut, RefreshCw, Copy, Check } from 'lucide-react'

interface WalletUser {
  uid: string
  username: string
  walletAddress?: string
  balance?: number
}

export function PiWalletManager() {
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState<WalletUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)

  // Charger les données du wallet depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pi_wallet_user')
    if (saved) {
      try {
        const userData = JSON.parse(saved)
        setUser(userData)
        setIsConnected(true)
        setBalance(userData.balance || 0)
      } catch (e) {
        console.error('Erreur chargement wallet:', e)
      }
    }
  }, [])

  // Connexion au Pi Wallet
  const handleConnect = async () => {
    setIsLoading(true)
    try {
      if (typeof window !== 'undefined' && window.Pi) {
        const scopes = ['username', 'wallet_address']
        const auth = await window.Pi.authenticate(scopes)
        
        if (auth && auth.user) {
          const walletData: WalletUser = {
            uid: auth.user.uid,
            username: auth.user.username,
            walletAddress: auth.user.wallet_address || 'Non disponible',
            balance: 0
          }
          
          setUser(walletData)
          setIsConnected(true)
          setBalance(0)
          localStorage.setItem('pi_wallet_user', JSON.stringify(walletData))
          console.log('✅ Wallet Pi connecté:', walletData)
        }
      } else {
        // Mode démo
        const demoUser: WalletUser = {
          uid: 'pi_' + Date.now(),
          username: 'demo_user_' + Math.floor(Math.random() * 1000),
          walletAddress: '0x' + Math.random().toString(16).slice(2),
          balance: 50
        }
        setUser(demoUser)
        setIsConnected(true)
        setBalance(50)
        localStorage.setItem('pi_wallet_user', JSON.stringify(demoUser))
        console.log('🎭 Mode démo - Wallet simulé:', demoUser)
      }
    } catch (error) {
      console.error('❌ Erreur connexion wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Déconnexion
  const handleDisconnect = () => {
    setUser(null)
    setIsConnected(false)
    setBalance(null)
    localStorage.removeItem('pi_wallet_user')
    console.log('🚪 Wallet déconnecté')
  }

  // Copier l'adresse du wallet
  const handleCopyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Actualiser le solde
  const handleRefreshBalance = async () => {
    setIsLoading(true)
    try {
      // Simuler une récupération du solde
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newBalance = Math.floor(Math.random() * 100)
      setBalance(newBalance)
      
      if (user) {
        const updated = { ...user, balance: newBalance }
        setUser(updated)
        localStorage.setItem('pi_wallet_user', JSON.stringify(updated))
      }
      console.log('💰 Solde mis à jour:', newBalance)
    } catch (error) {
      console.error('❌ Erreur actualisation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Wallet className="w-5 h-5" />
            Wallet Pi Network
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Connectez votre portefeuille Pi pour accéder aux paiements et aux abonnements premium.
          </p>
          <Button 
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? '⏳ Connexion...' : '🔗 Connecter Wallet Pi'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-900">
            <Wallet className="w-5 h-5" />
            <span>{user?.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              {balance !== null ? `${balance} π` : 'Chargement...'}
            </span>
            <button
              onClick={handleRefreshBalance}
              disabled={isLoading}
              className="p-1 hover:bg-green-200 rounded transition"
              title="Actualiser le solde"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Affichage de l'adresse */}
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <p className="text-xs text-gray-500 mb-1">Adresse du Wallet</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-gray-100 p-2 rounded break-all">
              {user?.walletAddress}
            </code>
            <button
              onClick={handleCopyAddress}
              className="p-2 hover:bg-gray-200 rounded transition"
              title="Copier l'adresse"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Informations du compte */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <p className="text-xs text-gray-500">ID</p>
            <p className="font-mono text-xs truncate">{user?.uid}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <p className="text-xs text-gray-500">État</p>
            <p className="font-semibold text-green-600">✓ Connecté</p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2 pt-3 border-t border-green-200">
          <Button
            onClick={handleRefreshBalance}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button
            onClick={handleDisconnect}
            variant="destructive"
            className="flex-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnecter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

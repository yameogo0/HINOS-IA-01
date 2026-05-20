'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PiWalletManager } from '@/components/PiWalletManager'
import { PiSubscriptionPlans } from '@/components/PiSubscriptionPlans'
import { Wallet, CreditCard, Settings } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('wallet')

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Gérez votre wallet Pi et vos abonnements</p>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Abonnement</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Wallet */}
          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Pi Network</CardTitle>
                <CardDescription>
                  Connectez et gérez votre portefeuille Pi Network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PiWalletManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Abonnement */}
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plans d&apos;abonnement</CardTitle>
                <CardDescription>
                  Accédez à des fonctionnalités premium avec Hinos IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PiSubscriptionPlans />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Compte */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>
                  Gérez les paramètres de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">🔐 Sécurité:</span> Vos données sont stockées localement et synchronisées avec le réseau Pi Network.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">✅ Confidentialité:</span> Nous ne partageons jamais vos informations personnelles avec des tiers.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">🚀 À propos:</span> Hinos IA v1.0 - Intégration complète Pi Network
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

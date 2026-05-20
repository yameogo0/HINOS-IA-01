'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet, CreditCard, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function PiWalletDemoPage() {
  const [step, setStep] = useState('intro')
  const [isConnected, setIsConnected] = useState(false)
  const [walletData, setWalletData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('pi_wallet_user')
    if (saved) {
      setWalletData(JSON.parse(saved))
      setIsConnected(true)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">Wallet Pi Network</h1>
          <p className="text-lg text-gray-600">Démonstration interactive - Créer un wallet et payer en Pi</p>
        </div>

        {/* Status actuel */}
        <Card className={isConnected ? 'border-green-300 bg-green-50' : 'border-gray-300'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}>
                {isConnected ? <CheckCircle className="w-6 h-6 text-white" /> : <AlertCircle className="w-6 h-6 text-white" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {isConnected ? '✅ Wallet Connecté' : '❌ Wallet Non Connecté'}
                </p>
                <p className="text-sm text-gray-600">
                  {isConnected 
                    ? `Bienvenue ${walletData?.username}` 
                    : 'Connectez votre wallet Pi pour commencer'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets */}
        <Tabs value={step} onValueChange={setStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intro">Intro</TabsTrigger>
            <TabsTrigger value="connect">Connecter</TabsTrigger>
            <TabsTrigger value="pay">Payer</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Onglet Intro */}
          <TabsContent value="intro" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  À propos du Pi Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Qu'est-ce que Pi?</h3>
                  <p className="text-gray-700">Pi Network est une cryptomonnaie décentralisée mobile-first. Contrairement à Bitcoin ou Ethereum, Pi peut être mined sur votre téléphone sans drainer la batterie.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">✅ Avantages</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Décentralisé et sécurisé</li>
                      <li>• Faibles frais de transaction</li>
                      <li>• Accessible sur mobile</li>
                      <li>• Communauté mondiale</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Use Cases</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Paiements entre amis</li>
                      <li>• Abonnements numériques</li>
                      <li>• Services en ligne</li>
                      <li>• Microtransactions</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Bonus:</span> Hinos IA utilise le mode Sandbox par défaut. Vous pouvez tester GRATUITEMENT sans argent réel!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mode Sandbox vs Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">🎭 Mode Sandbox (Actuellement)</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ Aucune configuration requise</li>
                      <li>✓ Argent simulé (50π)</li>
                      <li>✓ Transactions fictives</li>
                      <li>✓ Parfait pour tester</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">🚀 Mode Production (Optionnel)</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Argent réel (Pi coins)</li>
                      <li>• Clé API requise</li>
                      <li>• Transactions vérifiées</li>
                      <li>• Blockchain Pi Network</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Connecter */}
          <TabsContent value="connect" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  Connecter votre Wallet Pi
                </CardTitle>
                <CardDescription>
                  Étapes pour connecter votre portefeuille Pi Network à Hinos IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* Étape 1 */}
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="font-semibold text-gray-900">Télécharger Pi Network</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Téléchargez l'app officielle Pi Network</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">iOS App Store</Button>
                      <Button variant="outline" size="sm">Google Play</Button>
                    </div>
                  </div>

                  {/* Étape 2 */}
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="font-semibold text-gray-900">Créer un compte</h4>
                    </div>
                    <p className="text-sm text-gray-600">Entrez votre numéro de téléphone, vérifiez le code SMS</p>
                  </div>

                  {/* Étape 3 */}
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="font-semibold text-gray-900">Activer le Wallet</h4>
                    </div>
                    <p className="text-sm text-gray-600">Créez et confirmez votre phrase secrète (12 mots)</p>
                  </div>

                  {/* Étape 4 */}
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <h4 className="font-semibold text-gray-900">Retourner à Hinos IA</h4>
                    </div>
                    <p className="text-sm text-gray-600">Cliquez sur le bouton ci-dessous</p>
                  </div>
                </div>

                <Link href="/settings?tab=wallet">
                  <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Wallet className="w-4 h-4 mr-2" />
                    Aller aux Paramètres du Wallet
                  </Button>
                </Link>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">💡 Conseil:</span> Vous êtes actuellement en mode Sandbox. Cliquez sur "Connecter Wallet Pi" pour obtenir un wallet de démonstration (50π).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Payer */}
          <TabsContent value="pay" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Processus de Paiement
                </CardTitle>
                <CardDescription>
                  Comment payer votre abonnement Hinos IA en Pi coins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">📊 PRO WEEKLY</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-3">5.99π</div>
                    <ul className="text-sm text-gray-700 space-y-1 mb-4">
                      <li>✓ 50 messages/jour</li>
                      <li>✓ Analyse d'images</li>
                      <li>✓ Rapport hebdo</li>
                    </ul>
                    <p className="text-xs text-gray-600">Valide 7 jours</p>
                  </div>

                  <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50 relative">
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">BEST</div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">💎 PREMIUM MONTHLY</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-3">19.99π</div>
                    <ul className="text-sm text-gray-700 space-y-1 mb-4">
                      <li>✓ Messages illimités</li>
                      <li>✓ Analyse vidéo</li>
                      <li>✓ Export PDF</li>
                      <li>✓ Support prioritaire</li>
                    </ul>
                    <p className="text-xs text-gray-600">Valide 30 jours</p>
                  </div>
                </div>

                {/* Étapes */}
                <div className="space-y-3 mt-6">
                  <h4 className="font-semibold text-gray-900">Étapes du paiement:</h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <p className="font-semibold text-gray-900">Connecter le wallet</p>
                        <p className="text-sm text-gray-600">Allez à /settings → Wallet → Connecter</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <p className="font-semibold text-gray-900">Choisir un plan</p>
                        <p className="text-sm text-gray-600">Allez à /settings → Abonnement → Choisir</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <p className="font-semibold text-gray-900">Confirmer le paiement</p>
                        <p className="text-sm text-gray-600">Cliquez sur "Approuver" pour confirmer</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                      <div>
                        <p className="font-semibold text-gray-900">Paiement complété!</p>
                        <p className="text-sm text-gray-600">Votre abonnement est actif immédiatement</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/settings?tab=subscription">
                  <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Aller aux Plans d'Abonnement
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet FAQ */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Questions Fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Est-ce que c'est gratuit?</h4>
                    <p className="text-sm text-gray-600">Oui! Le mode Sandbox est complètement gratuit pour tester. Vous recevez 50π fictifs pour expérimenter.</p>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Quand changerez-vous vers la production?</h4>
                    <p className="text-sm text-gray-600">Vous pouvez activer la production à tout moment en ajoutant une clé API Pi Network. Le mode Sandbox restera disponible pour les tests.</p>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Où sont stockées mes données?</h4>
                    <p className="text-sm text-gray-600">En mode Sandbox, tout est stocké localement dans votre navigateur (localStorage). Aucune donnée n'est envoyée à un serveur.</p>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Comment puis-je réinitialiser mon wallet?</h4>
                    <p className="text-sm text-gray-600">Allez à /settings → Wallet → Déconnecter. Ou ouvrez la console (F12) et exécutez: localStorage.clear();</p>
                  </div>

                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Puis-je transférer mon solde?</h4>
                    <p className="text-sm text-gray-600">En mode Sandbox non (c'est fictif). En production, oui via l'app Pi Network officielle.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dois-je configurer quelque chose?</h4>
                    <p className="text-sm text-gray-600">Non! Tout est pré-configuré. Cliquez simplement sur "Connecter Wallet" et commencez!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-gray-600 mb-4">
              Besoin d'aide? Consultez la documentation complète:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/GUIDE_COMPLET_WALLET_PI_HINOS.md" target="_blank">
                <Button variant="outline" size="sm">Guide Complet</Button>
              </Link>
              <a href="https://developers.minepi.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">Docs Pi Network</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

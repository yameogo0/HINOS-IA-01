'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap } from 'lucide-react'
import { usePiPaymentSimple } from '@/hooks/use-pi-payment-simple'

interface Plan {
  id: string
  name: string
  price: number
  duration: string
  description: string
  features: string[]
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'pro_weekly',
    name: 'Pro',
    price: 5.99,
    duration: '7 jours',
    description: 'Parfait pour tester',
    features: [
      'Analyses illimitées',
      'Support par email',
      'Export des rapports',
      'Accès à la communauté'
    ]
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 19.99,
    duration: '30 jours',
    description: 'Notre meilleur plan',
    features: [
      'Tout ce qui est dans Pro',
      'Support prioritaire 24/7',
      'API personnalisée',
      'Rapports avancés',
      'Conseils personnalisés',
      'Pas de publicités'
    ],
    popular: true
  }
]

export function PiSubscriptionPlans() {
  const { initiatePayment, isProcessing, paymentStatus } = usePiPaymentSimple()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubscribe = async (plan: Plan) => {
    setSelectedPlan(plan.id)
    
    const result = await initiatePayment({
      amount: plan.price,
      planId: plan.id,
      memo: `Abonnement ${plan.name} - ${plan.duration}`
    })

    if (result.success) {
      // Sauvegarder l'abonnement
      localStorage.setItem('hinos_subscription', JSON.stringify(result.subscription))
      alert('✅ Abonnement activé avec succès!')
      window.location.reload()
    } else {
      alert('❌ Erreur: ' + result.error)
    }

    setSelectedPlan(null)
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Plans d&apos;abonnement</h2>
        <p className="text-gray-600">Choisissez le plan qui vous convient le mieux</p>
      </div>

      {/* Statut du paiement */}
      {paymentStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">{paymentStatus}</p>
        </div>
      )}

      {/* Grille des plans */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div key={plan.id} className="relative">
            {/* Badge populaire */}
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  ⭐ Populaire
                </span>
              </div>
            )}

            <Card className={`h-full transition-all ${
              plan.popular ? 'border-2 border-purple-500 shadow-lg' : 'border-gray-200'
            } ${selectedPlan === plan.id ? 'opacity-75' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  {plan.popular && <Zap className="w-5 h-5 text-yellow-500" />}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Prix */}
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-gray-900">
                    {plan.price}π
                  </div>
                  <p className="text-sm text-gray-600">pour {plan.duration}</p>
                </div>

                {/* Bouton d'action */}
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isProcessing || selectedPlan !== null}
                  className={`w-full py-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-800 hover:bg-gray-900'
                  } text-white transition-all`}
                >
                  {selectedPlan === plan.id && isProcessing ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      💳 S&apos;abonner avec Pi
                    </>
                  )}
                </Button>

                {/* Caractéristiques */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Information supplémentaire */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-sm text-amber-800">
          🎯 Vous avez besoin d&apos;aide? <a href="#" className="font-semibold hover:underline">Contactez notre support</a>
        </p>
      </div>
    </div>
  )
}

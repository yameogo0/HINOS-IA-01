'use client'

import { useState } from 'react'
import Chatbot from '@/components/Chatbot'
import Link from 'next/link'
import { Wallet, CreditCard, Zap } from 'lucide-react'

export default function Home() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-xl text-gray-800">Hinos IA</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              🌍 Français • Português • English
            </div>
            <Link href="/settings" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-emerald-600 text-white text-sm font-medium hover:shadow-lg transition">
              ⚙️ Paramètres
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Hinos IA
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Assistant IA pour Agriculture • Élevage • Pisciculture • Transformation
          </p>
          
          {/* Banneau des caractéristiques Pi Network */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Wallet className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Wallet Pi Network</h3>
              <p className="text-sm text-gray-600">Connectez votre portefeuille Pi</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CreditCard className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Paiements en Pi</h3>
              <p className="text-sm text-gray-600">Payez vos abonnements facilement</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <Zap className="w-6 h-6 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Premium Features</h3>
              <p className="text-sm text-gray-600">Accédez à des analyses avancées</p>
            </div>
          </div>

          <p className="text-gray-500 mb-6">
            🇫🇷 Français | 🇵🇹 Português | 🇬🇧 English
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-12 max-w-4xl">
        <Chatbot />
      </div>
    </main>
  )
}

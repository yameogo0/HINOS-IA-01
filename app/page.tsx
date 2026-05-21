// app/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0

import Chatbot from '@/components/Chatbot'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Bandeau Pi Network */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <span className="text-2xl">π</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Hinos IA</h2>
                <p className="text-white/80 text-sm">Assistant IA pour Agriculture • Élevage • Pisciculture • Transformation</p>
              </div>
            </div>
            <Link href="/settings">
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition flex items-center gap-2">
                ⚙️ Paramètres
              </button>
            </Link>
          </div>
        </div>

        {/* Chatbot */}
        <Chatbot />
      </div>
    </main>
  )
}
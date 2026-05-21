import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hinos IA",
  description: "Votre Partenaire Intelligence Artificielle pour une Production Animale et Agroalimentaire d'Excellence",
  generator: 'v0.app',
  keywords: "agriculture, élevage, pisciculture, IA, Pi Network, Burkina Faso, Angola",
  authors: [{ name: "Hinos IA" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Hinos IA",
    description: "Assistant IA pour l'agriculture en Afrique",
    type: "website",
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7C3AED",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        {/* Pi Network SDK - Chargement automatique */}
        <script
          src="https://sdk.minepi.com/pi-sdk.js"
          async
          onLoad={() => {
            if (typeof window !== 'undefined' && window.Pi) {
              console.log('✅ Pi SDK chargé avec succès')
              window.Pi.init({
                version: '2.0',
                sandbox: process.env.NEXT_PUBLIC_PI_NETWORK_SANDBOX === 'true'
              })
            }
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
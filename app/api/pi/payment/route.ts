import { NextRequest, NextResponse } from "next/server"

// Mode sandbox (test)
const PI_SANDBOX = process.env.NEXT_PUBLIC_PI_NETWORK_SANDBOX === 'true'

// Prix des abonnements
const PRICES: Record<string, number> = {
  pro_weekly: 5.99,
  premium_monthly: 19.99
}

interface PaymentTransaction {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  txid?: string
}

// Stockage en mémoire (à remplacer par une base de données)
const transactions: Map<string, PaymentTransaction> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("💰 Pi Payment API - Requête reçue:", { action: body.action, planId: body.planId })

    const { action, planId, amount, paymentId, txid, userId } = body

    // Mode sandbox - Simulation
    if (PI_SANDBOX || !process.env.PI_API_KEY) {
      console.log(`[SANDBOX MODE] Action: ${action}`)
      
      // Créer un paiement
      if (action === "create") {
        const price = PRICES[planId] || amount
        const newPaymentId = "sandbox_" + Date.now() + "_" + Math.random().toString(36).slice(2)
        
        const transaction: PaymentTransaction = {
          id: newPaymentId,
          amount: price,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
        transactions.set(newPaymentId, transaction)
        
        console.log(`✅ [SANDBOX] Paiement créé: ${newPaymentId} - ${price}π`)
        return NextResponse.json({
          success: true,
          paymentId: newPaymentId,
          status: "pending",
          amount: price,
          memo: `Abonnement ${planId} - Hinos IA`
        })
      }
      
      // Approuver un paiement
      if (action === "approve") {
        const transaction = transactions.get(paymentId)
        if (transaction) {
          transaction.status = 'pending'
          console.log(`✅ [SANDBOX] Paiement approuvé: ${paymentId}`)
          return NextResponse.json({ 
            success: true, 
            status: "approved",
            paymentId 
          })
        }
      }
      
      // Compléter un paiement
      if (action === "complete") {
        const transaction = transactions.get(paymentId)
        if (transaction) {
          transaction.status = 'completed'
          transaction.txid = txid
          console.log(`✅ [SANDBOX] Paiement complété: ${paymentId} - TXID: ${txid}`)
          
          return NextResponse.json({
            success: true,
            status: "completed",
            paymentId,
            txid,
            subscription: { 
              planId, 
              active: true, 
              activatedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          })
        }
      }
      
      // Vérifier un paiement
      if (action === "verify") {
        const transaction = transactions.get(paymentId)
        if (transaction) {
          return NextResponse.json({
            success: true,
            verified: true,
            status: transaction.status,
            txid: transaction.txid || "N/A"
          })
        }
      }

      // Obtenir l'historique des paiements
      if (action === "history") {
        const history = Array.from(transactions.values()).map(t => ({
          ...t,
          amount: `${t.amount}π`
        }))
        return NextResponse.json({
          success: true,
          transactions: history
        })
      }

      return NextResponse.json({ 
        success: false, 
        error: "Paiement non trouvé" 
      }, { status: 404 })
    }
    
    // Mode production - Appel réel API Pi
    if (action === "create") {
      const response = await fetch("https://api.minepi.com/v2/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${process.env.PI_API_KEY}`
        },
        body: JSON.stringify({
          amount: PRICES[planId],
          memo: `Abonnement ${planId} - Hinos IA`,
          metadata: { planId, userId }
        })
      })
      
      if (!response.ok) {
        throw new Error(`Erreur API Pi: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Paiement créé via API Pi: ${data.id}`)
      return NextResponse.json(data)
    }

    // Completer un paiement en production
    if (action === "complete" && paymentId) {
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${process.env.PI_API_KEY}`
        },
        body: JSON.stringify({ txid })
      })

      if (!response.ok) {
        throw new Error(`Erreur complétude paiement: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Paiement complété: ${paymentId}`)
      return NextResponse.json({ success: true, ...data })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Action invalide" 
    }, { status: 400 })
    
  } catch (error: any) {
    console.error("❌ Erreur paiement Pi:", error.message)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Erreur serveur" 
    }, { status: 500 })
  }
}

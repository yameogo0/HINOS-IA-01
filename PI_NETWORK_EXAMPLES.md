# Exemples d'Utilisation - Intégration Pi Network

## 1. Utiliser le PiWalletManager

### Affichage simple du wallet
```typescript
import { PiWalletManager } from '@/components/PiWalletManager'

export function MyPage() {
  return (
    <div>
      <h1>Mon Wallet</h1>
      <PiWalletManager />
    </div>
  )
}
```

### Résultat:
- ✅ Interface de connexion/déconnexion
- ✅ Affichage solde
- ✅ Adresse wallet copiable
- ✅ Actualisation solde

---

## 2. Implémenter des Paiements

### Hook simple
```typescript
import { usePiPaymentSimple } from '@/hooks/use-pi-payment-simple'

export function PaymentButton() {
  const { initiatePayment, isProcessing, paymentStatus } = usePiPaymentSimple()

  const handlePay = async () => {
    const result = await initiatePayment({
      amount: 19.99,
      planId: 'premium_monthly',
      memo: 'Abonnement Premium - Hinos IA'
    })

    if (result.success) {
      console.log('✅ Paiement réussi!', result)
      // Sauvegarder abonnement
      localStorage.setItem('hinos_subscription', JSON.stringify(result.subscription))
    } else {
      console.error('❌ Erreur:', result.error)
    }
  }

  return (
    <div>
      <button onClick={handlePay} disabled={isProcessing}>
        {isProcessing ? 'Traitement...' : 'Payer 19.99π'}
      </button>
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  )
}
```

---

## 3. Vérifier l'Abonnement Premium

### Utiliser le hook usePiWallet
```typescript
import { usePiWallet } from '@/hooks/use-pi-wallet'

export function PremiumContent() {
  const { hasPremiumAccess, subscription, getTimeRemaining } = usePiWallet()

  if (!hasPremiumAccess()) {
    return <p>❌ Abonnement requis</p>
  }

  return (
    <div>
      <h2>✅ Contenu Premium</h2>
      <p>Plan: {subscription?.tier}</p>
      <p>Expire dans: {getTimeRemaining()}</p>
    </div>
  )
}
```

---

## 4. Créer un Composant d'Abonnement Personnalisé

```typescript
'use client'

import { useState } from 'react'
import { usePiPaymentSimple } from '@/hooks/use-pi-payment-simple'

interface CustomPlanProps {
  planId: string
  name: string
  price: number
  duration: string
}

export function CustomPlan({ planId, name, price, duration }: CustomPlanProps) {
  const { initiatePayment, isProcessing } = usePiPaymentSimple()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubscribe = async () => {
    const result = await initiatePayment({
      amount: price,
      planId: planId,
      memo: `${name} - ${duration}`
    })

    if (result.success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Recharger page ou mettre à jour UI
      window.location.reload()
    }
  }

  return (
    <div className="plan-card">
      <h3>{name}</h3>
      <p className="price">{price}π</p>
      <p className="duration">{duration}</p>
      
      {showSuccess && <div className="success">✅ Activé!</div>}
      
      <button 
        onClick={handleSubscribe} 
        disabled={isProcessing}
      >
        {isProcessing ? '⏳ Traitement...' : '💳 S\'abonner'}
      </button>
    </div>
  )
}

// Utilisation
<CustomPlan 
  planId="pro_weekly"
  name="Plan Pro"
  price={5.99}
  duration="7 jours"
/>
```

---

## 5. Afficher l'Historique des Paiements

```typescript
'use client'

import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  amount: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  txid?: string
}

export function PaymentHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/pi/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'history' })
        })
        
        const data = await response.json()
        if (data.success) {
          setTransactions(data.transactions)
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) return <p>Chargement...</p>

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Montant</th>
          <th>Statut</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{tx.id.slice(0, 10)}...</td>
            <td>{tx.amount}</td>
            <td>
              <span className={`badge ${tx.status}`}>
                {tx.status}
              </span>
            </td>
            <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## 6. Intégration dans le Header

```typescript
'use client'

import { usePiWallet } from '@/hooks/use-pi-wallet'
import Link from 'next/link'

export function AppHeader() {
  const { hasPremiumAccess, getCurrentTier, getTimeRemaining } = usePiWallet()
  const isPremium = hasPremiumAccess()
  const tier = getCurrentTier()
  const remaining = getTimeRemaining()

  return (
    <header>
      <h1>Hinos IA</h1>
      
      <nav>
        {isPremium ? (
          <div className="premium-badge">
            👑 {tier.toUpperCase()}
            {remaining && <span className="time-left">{remaining}</span>}
          </div>
        ) : (
          <Link href="/settings?tab=subscription">
            <button>💰 Abonnement</button>
          </Link>
        )}
        
        <Link href="/settings">
          <button>⚙️ Paramètres</button>
        </Link>
      </nav>
    </header>
  )
}
```

---

## 7. Protection de Routes/Features

```typescript
'use client'

import { usePiWallet } from '@/hooks/use-pi-wallet'
import { ReactNode } from 'react'

interface ProtectedContentProps {
  children: ReactNode
  requiredTier?: 'pro' | 'premium'
  fallback?: ReactNode
}

export function ProtectedContent({ 
  children, 
  requiredTier = 'pro',
  fallback 
}: ProtectedContentProps) {
  const { hasPremiumAccess, getCurrentTier } = usePiWallet()
  
  const hasAccess = hasPremiumAccess() && 
    (requiredTier ? getCurrentTier() === requiredTier : true)

  if (!hasAccess) {
    return fallback || (
      <div className="access-denied">
        <p>❌ Cette fonctionnalité nécessite un abonnement {requiredTier}</p>
        <a href="/settings">Mettre à niveau</a>
      </div>
    )
  }

  return <>{children}</>
}

// Utilisation
<ProtectedContent requiredTier="premium">
  <AdvancedAnalytics />
</ProtectedContent>
```

---

## 8. Gestion d'Erreurs Avancée

```typescript
'use client'

import { usePiPaymentSimple } from '@/hooks/use-pi-payment-simple'
import { useState } from 'react'

export function PaymentWithErrorHandling() {
  const { initiatePayment, error, resetStatus } = usePiPaymentSimple()
  const [customError, setCustomError] = useState<string | null>(null)

  const handlePayment = async () => {
    try {
      setCustomError(null)

      const result = await initiatePayment({
        amount: 19.99,
        planId: 'premium_monthly',
        memo: 'Test Payment'
      })

      if (!result.success) {
        setCustomError(result.error || 'Erreur inconnue')
        return
      }

      // Succès
      console.log('✅ Paiement réussi')
      resetStatus()
    } catch (err) {
      setCustomError('Erreur réseau, veuillez réessayer')
    }
  }

  return (
    <div>
      <button onClick={handlePayment}>Payer</button>

      {error && (
        <div className="error-alert">
          <strong>❌ Erreur:</strong> {error}
          <button onClick={resetStatus}>✕</button>
        </div>
      )}

      {customError && (
        <div className="error-alert">
          <strong>❌ Erreur:</strong> {customError}
          <button onClick={() => setCustomError(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
```

---

## 9. Tests en Mode Sandbox

```typescript
// test.ts
describe('Pi Payment Integration', () => {
  it('devrait créer un paiement en sandbox', async () => {
    const response = await fetch('/api/pi/payment', {
      method: 'POST',
      body: JSON.stringify({
        action: 'create',
        planId: 'pro_weekly',
        amount: 5.99
      })
    })

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.paymentId).toBeDefined()
    expect(data.status).toBe('pending')
  })

  it('devrait compléter un paiement', async () => {
    // Créer paiement
    const createRes = await fetch('/api/pi/payment', {
      method: 'POST',
      body: JSON.stringify({
        action: 'create',
        planId: 'pro_weekly',
        amount: 5.99
      })
    })
    const { paymentId } = await createRes.json()

    // Compléter paiement
    const completeRes = await fetch('/api/pi/payment', {
      method: 'POST',
      body: JSON.stringify({
        action: 'complete',
        paymentId,
        txid: 'demo_txid_123',
        planId: 'pro_weekly'
      })
    })

    const result = await completeRes.json()
    expect(result.success).toBe(true)
    expect(result.status).toBe('completed')
  })
})
```

---

## 10. Configuration Production

```env
# .env.local (Ne JAMAIS commiter)

# Mode Production (optionnel)
NEXT_PUBLIC_PI_NETWORK_SANDBOX=false

# Clé API Pi Network (optionnel)
PI_API_KEY=your_actual_api_key_here

# Backend URLs
NEXT_PUBLIC_PI_BACKEND_URL=https://api.minepi.com

# App ID (si applicable)
NEXT_PUBLIC_PI_APP_ID=your_app_id
```

---

## Checklist d'Implémentation

- [ ] Importer les components
- [ ] Intégrer PiWalletManager dans settings
- [ ] Ajouter PiSubscriptionPlans
- [ ] Tester paiements en sandbox
- [ ] Vérifier localStorage persiste
- [ ] Tester reconnexion utilisateur
- [ ] Ajouter messages d'erreur
- [ ] Tester multi-navigateur
- [ ] Vérifier mobile responsive
- [ ] Documenter pour équipe

---

## Troubleshooting Rapide

| Problème | Cause | Solution |
|----------|-------|----------|
| Wallet ne se connecte pas | Pi SDK pas chargé | Vérifier console, rafraîchir page |
| Paiement échoue | API erreur | Vérifier logs API, mode sandbox |
| localStorage vide | Navigateur incognito | Tester mode privé/normal |
| Abonnement expire immédiatement | Timezone | Vérifier date système |

---

**Happy Coding!** 🚀

# Guide d'Intégration Pi Network - Hinos IA

## Vue d'ensemble

Hinos IA dispose maintenant d'une **intégration complète Pi Network** avec :
- ✅ Connexion au Wallet Pi Network
- ✅ Paiements en Pi coins
- ✅ Gestion des abonnements
- ✅ Stockage du profil utilisateur

---

## Architecture

### 1. Components
- **PiWalletManager** (`components/PiWalletManager.tsx`)
  - Interface de connexion/gestion du wallet
  - Affichage du solde Pi
  - Actions: Connecter, Déconnecter, Actualiser

- **PiSubscriptionPlans** (`components/PiSubscriptionPlans.tsx`)
  - Affichage des plans (Pro Weekly, Premium Monthly)
  - Intégration paiement Pi
  - Sauvegarde automatique de l'abonnement

### 2. Hooks
- **usePiWallet()** (`hooks/use-pi-wallet.ts`)
  - Gestion authentification wallet
  - Vérification d'abonnement
  - Persistance localStorage

- **usePiPaymentSimple()** (`hooks/use-pi-payment-simple.ts`)
  - Initiation paiements
  - Tracking état paiement
  - Gestion erreurs

- **usePiNetworkAuthentication()** (`hooks/use-pi-network-authentication.ts`)
  - Authentification Pi SDK
  - Support iframe (App Studio)
  - Fallback mode démo

### 3. API
- **POST /api/pi/payment** (`app/api/pi/payment/route.ts`)
  - Mode Sandbox (test) par défaut
  - Actions: create, approve, complete, verify, history
  - Support production API Pi

### 4. Pages
- **Settings Page** (`app/settings/page.tsx`)
  - Onglet Wallet: Gestion wallet Pi
  - Onglet Abonnement: Plans d'abonnement
  - Onglet Compte: Paramètres généraux

---

## Flux de Paiement

```
1. Utilisateur clique "S'abonner avec Pi"
   ↓
2. usePiPaymentSimple() initie le paiement
   ↓
3. /api/pi/payment crée une transaction
   ↓
4. Pi SDK affiche le popup de paiement
   ↓
5. Utilisateur approuve et signe
   ↓
6. Paiement complété, abonnement sauvegardé
   ↓
7. localStorage.hinos_subscription mis à jour
```

---

## Environnements

### Mode Sandbox (DÉFAUT)
```env
NEXT_PUBLIC_PI_NETWORK_SANDBOX=true
```
- ✅ Pas besoin de clé API
- ✅ Simulation complète des paiements
- ✅ Parfait pour les tests

### Mode Production
```env
NEXT_PUBLIC_PI_NETWORK_SANDBOX=false
PI_API_KEY=your_pi_api_key_here
```
- Appels réels à l'API Pi Network
- Paiements authentiques
- Synchronisation wallet réelle

---

## Utilisation

### 1. Connexion Wallet
```javascript
import { PiWalletManager } from '@/components/PiWalletManager'

<PiWalletManager />
```

### 2. Paiements
```javascript
import { usePiPaymentSimple } from '@/hooks/use-pi-payment-simple'

const { initiatePayment, isProcessing } = usePiPaymentSimple()

await initiatePayment({
  amount: 19.99,
  planId: 'premium_monthly',
  memo: 'Abonnement Premium'
})
```

### 3. Vérifier Abonnement
```javascript
const { hasPremiumAccess, subscription } = usePiWallet()

if (hasPremiumAccess()) {
  // Afficher contenu premium
}
```

---

## Données Stockées (localStorage)

### pi_wallet_user
```json
{
  "uid": "pi_xxx",
  "username": "user@pi",
  "walletAddress": "0x...",
  "balance": 50
}
```

### hinos_subscription
```json
{
  "tier": "premium",
  "activatedAt": "2024-05-19T...",
  "expiresAt": "2024-06-19T...",
  "status": "active"
}
```

---

## Configuration Pi Network

Fichier: `lib/system-config.ts`

```typescript
export const PI_NETWORK_CONFIG = {
  SDK_URL: 'https://sdk.minepi.com/sdk.js',
  SANDBOX: process.env.NEXT_PUBLIC_PI_NETWORK_SANDBOX === 'true',
  // ... autres config
}
```

---

## Points d'Accès

1. **Header du Chatbot**
   - Bouton Crown (👑 Premium)
   - Indicateur d'abonnement actif

2. **Page Settings**
   - Lien complet vers wallet et abonnements
   - URL: `/settings`

3. **Suggestions Chatbot**
   - "💰 Voir les abonnements"

---

## Statuts de Paiement

| Statut | Signification | Action |
|--------|---------------|--------|
| pending | En attente d'approbation | Afficher popup SDK |
| approved | Approuvé par Pi | Attendre transaction |
| completed | Transaction réussie | Activer abonnement |
| failed | Échoué | Afficher erreur |

---

## Gestion Erreurs

Les erreurs sont capturées à plusieurs niveaux:

1. **Frontend**: try/catch dans hooks
2. **API**: Validation des requêtes
3. **UX**: Messages d'erreur localisés (FR/PT/EN)

Exemple:
```javascript
{
  success: false,
  error: "Erreur de paiement",
  paymentId?: "xxx"
}
```

---

## Prochaines Étapes (Optionnelles)

1. **Backend Persistance**
   - Base de données (Supabase/Neon)
   - Authentification utilisateur

2. **Webhook Pi**
   - Notifications événements paiement
   - Synchronisation temps réel

3. **Analytics**
   - Suivi des paiements
   - Métriques utilisateurs

4. **Référral Program**
   - Bonus Pi pour réferrals
   - Tracking des références

---

## Support & Documentation

- Pi Network SDK: https://docs.minepi.com/
- API Reference: https://developers.minepi.com/
- Mode Sandbox: Toujours disponible, test gratuit

---

**Version**: 1.0  
**Dernière mise à jour**: Mai 2024  
**Statut**: Production Ready ✅

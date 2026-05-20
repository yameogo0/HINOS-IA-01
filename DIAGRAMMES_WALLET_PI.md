## 🎨 Diagrammes Visuels - Wallet Pi & Paiements Hinos IA

---

## 1️⃣ Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         HINOS IA APP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐               │
│  │  CHATBOT PAGE    │         │  SETTINGS PAGE   │               │
│  │  /app/page.tsx   │         │  /settings       │               │
│  └──────────────────┘         └──────────────────┘               │
│                                        ↓                          │
│                                ┌────────────────┐                │
│                                │ 3 ONGLETS:     │                │
│                                │ • Wallet       │                │
│                                │ • Abonnement   │                │
│                                │ • Compte       │                │
│                                └────────────────┘                │
│                                        ↓                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          COMPOSANTS REACT                                │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ PiWalletManager.tsx    │ PiSubscriptionPlans.tsx         │   │
│  │ • Connexion            │ • Plans Pro/Premium             │   │
│  │ • Affichage profil     │ • Paiements intégrés            │   │
│  │ • Solde                │ • Gestion d'état                │   │
│  │ • Copier adresse       │ • Notifications                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                        ↓                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          HOOKS REACT                                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ use-pi-payment-simple.ts  | use-pi-wallet.ts            │   │
│  │ • Logique paiements       | • Gestion état wallet        │   │
│  │ • Appels API              | • Persistance localStorage    │   │
│  │ • Gestion transactions    | • Récupération profil        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                        ↓                          │
└─────────────────────────────────────────────────────────────────┘
                          ↓
     ┌────────────────────────────────────────┐
     │    BACKEND API                         │
     │    /api/pi/payment/route.ts           │
     │                                        │
     │  Actions:                              │
     │  • create    → Crée paiement          │
     │  • approve   → Approuve transaction   │
     │  • complete  → Confirme avec TXID     │
     │  • verify    → Vérifie état          │
     │  • history   → Historique trans.      │
     └────────────────────────────────────────┘
                          ↓
     ┌────────────────────────────────────────┐
     │    PI NETWORK SDK                      │
     │    window.Pi.authenticate()            │
     │    window.Pi.createPayment()           │
     └────────────────────────────────────────┘
                          ↓
     ┌────────────────────────────────────────┐
     │    BLOCKCHAIN Pi NETWORK               │
     │    • Signatures                         │
     │    • Confirmation TXID                  │
     │    • Mise à jour solde                  │
     └────────────────────────────────────────┘
```

---

## 2️⃣ Flux de Connexion Wallet

```
UTILISATEUR
    ↓
Clique "Connecter Wallet"
    ↓
┌─────────────────────────────────┐
│ PiWalletManager.tsx             │
│ handleConnect()                 │
└─────────────────────────────────┘
    ↓
window.Pi.authenticate(['username', 'wallet_address'])
    ↓
┌──────────────────────────────────┐
│ Pi Network Authentification      │
│ • Affiche popup authentification │
│ • Demande PIN/Biométrie         │
│ • Récupère profil utilisateur    │
└──────────────────────────────────┘
    ↓
Retour: { uid, username, wallet_address }
    ↓
┌──────────────────────────────────┐
│ Mise à jour État React           │
│ • setIsConnected(true)           │
│ • setUser(userData)              │
│ • setBalance(0)                  │
└──────────────────────────────────┘
    ↓
localStorage.setItem('pi_wallet_user', JSON.stringify(userData))
    ↓
┌──────────────────────────────────┐
│ Affichage Interface              │
│ • Profil utilisateur             │
│ • Adresse wallet (copyable)      │
│ • Bouton "Actualiser solde"      │
│ • Bouton "Quitter"               │
└──────────────────────────────────┘
```

---

## 3️⃣ Flux de Paiement Complet

```
PHASE 1: SÉLECTION
    ↓
Utilisateur clique "S'abonner" sur plan
    ↓
PiSubscriptionPlans.tsx affiche modale de confirmation
    ↓
    
PHASE 2: CRÉATION
    ↓
POST /api/pi/payment
{
  action: "create",
  planId: "pro_weekly"
}
    ↓
API retourne:
{
  paymentId: "pi_pay_123_456",
  status: "pending",
  amount: 5.99
}
    ↓

PHASE 3: APPROBATION
    ↓
Utilisateur clique "Approuver"
    ↓
window.Pi.payment_interface.approve(paymentId)
    ↓
┌──────────────────────────────┐
│ Pi Network Payment Interface │
│ • Affiche montant             │
│ • Demande confirmation        │
│ • Demande authentification    │
└──────────────────────────────┘
    ↓
Utilisateur approuve et reçoit TXID
    ↓

PHASE 4: CONFIRMATION
    ↓
POST /api/pi/payment
{
  action: "complete",
  paymentId: "pi_pay_123_456",
  txid: "0x7f3a9c..."
}
    ↓
API valide et retourne:
{
  success: true,
  subscription: {
    planId: "pro_weekly",
    active: true,
    expiresAt: "2024-05-26T10:30:00Z"
  }
}
    ↓

PHASE 5: ACTIVATION
    ↓
localStorage.setItem('subscription', {...})
    ↓
┌──────────────────────────────┐
│ ✅ PAIEMENT RÉUSSI!         │
│ • Abonnement activé          │
│ • Accès premium débloqué      │
│ • Date d'expiration affichée  │
│ • Reçu TXID                   │
└──────────────────────────────┘
```

---

## 4️⃣ Structure localStorage

```
┌────────────────────────────────────────────────┐
│         NAVIGATEUR - localStorage              │
├────────────────────────────────────────────────┤
│                                                 │
│ KEY: "pi_wallet_user"                          │
│ VALUE: {                                       │
│   uid: "user_123",                            │
│   username: "john_doe",                       │
│   walletAddress: "0x2d...7f",                │
│   balance: 125.50                             │
│ }                                              │
│                                                 │
│ KEY: "subscription"                            │
│ VALUE: {                                       │
│   planId: "premium_monthly",                  │
│   status: "active",                           │
│   activatedAt: "2024-05-19T10:30:00Z",       │
│   expiresAt: "2024-06-19T10:30:00Z",        │
│   txid: "0x7f3a9c..."                        │
│ }                                              │
│                                                 │
│ KEY: "payment_history"                         │
│ VALUE: [                                       │
│   {                                            │
│     id: "pi_pay_123_1",                       │
│     amount: 5.99,                             │
│     status: "completed",                      │
│     txid: "0x7f3a9c...",                      │
│     date: "2024-05-19T09:00:00Z"             │
│   },                                           │
│   {                                            │
│     id: "pi_pay_123_2",                       │
│     amount: 19.99,                            │
│     status: "completed",                      │
│     txid: "0x2d1234...",                      │
│     date: "2024-05-18T14:30:00Z"             │
│   }                                            │
│ ]                                              │
│                                                 │
└────────────────────────────────────────────────┘
```

---

## 5️⃣ États du Paiement

```
LIFECYCLE D'UN PAIEMENT

pendng ─┐
        │
        ├─→ approved ─┐
        │             │
        │             ├─→ completed ✅
        │             │
        │             └─→ failed ❌
        │
        └─→ failed ❌


STATUTS DÉTAILLÉS:

┌──────────────────────────────────────┐
│ PENDING                              │
│ • Paiement créé                      │
│ • En attente d'approbation utilisateur
│ • Pas de TXID encore                 │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ APPROVED                             │
│ • Utilisateur a approuvé             │
│ • Transaction signée                 │
│ • En attente de confirmation TXID    │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ COMPLETED ✅                         │
│ • TXID reçu                          │
│ • Transaction confirmée              │
│ • Abonnement activé                  │
│ • Accès premium débloqué             │
└──────────────────────────────────────┘
```

---

## 6️⃣ Hiérarchie des Composants

```
<Home>
  └─ <Chatbot>
       ├─ Header
       │  └─ Affiche langue détectée
       │  └─ Affiche statut abonnement
       │  └─ Lien vers /settings
       ├─ Chat Area
       └─ Input Area
       
<SettingsPage>
  └─ <Tabs>
       ├─ Wallet Tab
       │  └─ <PiWalletManager>
       │       ├─ État: isConnected, user, balance
       │       ├─ Boutons: Connecter, Actualiser, Copier
       │       └─ Affichage: Profil + Solde
       │
       ├─ Subscription Tab
       │  └─ <PiSubscriptionPlans>
       │       ├─ Plans: Pro, Premium
       │       ├─ États: loading, paying, success
       │       └─ Fonctions: handleSubscribe()
       │
       └─ Account Tab
           └─ Info & paramètres
```

---

## 7️⃣ Flux d'Actualisation du Solde

```
Utilisateur clique "↻ Actualiser"
    ↓
setIsLoading(true)
    ↓
window.Pi.getUserPayments() [si disponible]
    ou
Simulation avec delai de 1-2 secondes
    ↓
setBalance(newBalance)
    ↓
setIsLoading(false)
    ↓
Affichage: "💰 Solde: 125.50 Pi"
```

---

## 8️⃣ Tableau de Bord de l'Utilisateur

```
┌─────────────────────────────────────────────┐
│  HINOS IA - PARAMÈTRES                      │
├─────────────────────────────────────────────┤
│                                             │
│  [WALLET] [ABONNEMENT] [COMPTE]            │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ WALLET PI NETWORK                   │   │
│  ├─────────────────────────────────────┤   │
│  │                                     │   │
│  │ [Connecter Wallet Pi Network]       │   │
│  │        ↓ (après connexion)          │   │
│  │ ✅ Connecté                         │   │
│  │ 👤 john_doe                         │   │
│  │ 📍 0x2d...7f [Copier]              │   │
│  │ 💰 125.50 Pi [↻ Actualiser]        │   │
│  │ [Quitter]                           │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ PLANS D'ABONNEMENT                  │   │
│  ├─────────────────────────────────────┤   │
│  │                                     │   │
│  │ 📦 PRO              ⭐ PREMIUM      │   │
│  │ 5.99π               19.99π          │   │
│  │ 7 jours             30 jours        │   │
│  │                                     │   │
│  │ [S'abonner] [S'abonner]            │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ STATUT ABONNEMENT                   │   │
│  ├─────────────────────────────────────┤   │
│  │ ✅ Premium actif                    │   │
│  │ Expire le: 2024-06-19               │   │
│  │ Jours restants: 31                  │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 9️⃣ Cycle de Vie d'un Abonnement

```
JOUR 1: Achat
   └─ Utilisateur paye 19.99π
   └─ Status: "active"
   └─ activatedAt: 2024-05-19
   └─ expiresAt: 2024-06-19

JOUR 15: Actif
   └─ Accès premium complet
   └─ Jours restants: 16

JOUR 30: Dernier jour
   └─ Notification: "Votre abonnement expire demain"
   └─ Jours restants: 1

JOUR 31: Expiration
   └─ Status: "expired"
   └─ Accès premium désactivé
   └─ Message: "Renouvelez pour continuer"
   └─ Bouton: "Réabonner"

NOUVEAU CYCLE:
   └─ Utilisateur clique "Réabonner"
   └─ Nouveau paiement
   └─ Nouveau cycle de 30 jours
```

---

## 🔟 Comparaison Plans

```
                  PRO         PREMIUM
┌───────────────────────────────────────┐
│ Prix              5.99π      19.99π    │
│ Durée             7 jours    30 jours  │
│ Coût par jour     0.85π      0.67π     │
├───────────────────────────────────────┤
│ Analyses illimitées   ✅        ✅      │
│ Support email         ✅        ✅      │
│ Export rapports       ✅        ✅      │
│ Accès communauté      ✅        ✅      │
│ Support prioritaire   ❌        ✅      │
│ API personnalisée     ❌        ✅      │
│ Rapports avancés      ❌        ✅      │
│ Conseils personnalisés ❌       ✅      │
│ Pas de publicités      ❌       ✅      │
└───────────────────────────────────────┘

RECOMMANDATION:
  • Pro: Pour essayer (7 jours)
  * Premium: Pour usage sérieux (meilleur rapport)
```

---

**Diagrammes**: ✅ Complets  
**Clarté**: ✅ Visuelle et textuelle  
**Statut**: 🚀 Production Ready

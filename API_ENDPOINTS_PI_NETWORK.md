## 🔌 Endpoints API Pi Network - Hinos IA

### Base URL
```
POST /api/pi/payment
```

---

## 📡 Actions Disponibles

### 1️⃣ CREATE - Créer un Paiement

**Endpoint**: `POST /api/pi/payment`

**Requête**:
```javascript
{
  "action": "create",
  "planId": "pro_weekly",      // ou "premium_monthly"
  "userId": "user_123",        // optionnel
  "amount": 5.99               // optionnel (utilise prix du plan)
}
```

**Réponse Succès** (200):
```javascript
{
  "success": true,
  "paymentId": "pi_pay_1716120600123_0.789",
  "status": "pending",
  "amount": 5.99,
  "memo": "Abonnement pro_weekly - Hinos IA"
}
```

**Réponse Erreur** (500):
```javascript
{
  "success": false,
  "error": "Message d'erreur détaillé"
}
```

**Exemple d'appel**:
```javascript
const response = await fetch('/api/pi/payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create',
    planId: 'pro_weekly'
  })
})
const data = await response.json()
console.log(data.paymentId) // Utilisé pour approuver
```

---

### 2️⃣ APPROVE - Approuver un Paiement

**Endpoint**: `POST /api/pi/payment`

**Requête**:
```javascript
{
  "action": "approve",
  "paymentId": "pi_pay_1716120600123_0.789"
}
```

**Réponse Succès**:
```javascript
{
  "success": true,
  "status": "approved",
  "paymentId": "pi_pay_1716120600123_0.789"
}
```

**Utilisation**:
```javascript
// Après que l'utilisateur approuve dans Pi Network
await fetch('/api/pi/payment', {
  method: 'POST',
  body: JSON.stringify({
    action: 'approve',
    paymentId: paymentId
  })
})
```

---

### 3️⃣ COMPLETE - Compléter un Paiement

**Endpoint**: `POST /api/pi/payment`

**Requête**:
```javascript
{
  "action": "complete",
  "paymentId": "pi_pay_1716120600123_0.789",
  "txid": "0x7f3a9c1d8e2f4b5c6d7e8f9a0b1c2d3e",    // TXID de la transaction
  "planId": "pro_weekly"                             // optionnel mais recommandé
}
```

**Réponse Succès**:
```javascript
{
  "success": true,
  "status": "completed",
  "paymentId": "pi_pay_1716120600123_0.789",
  "txid": "0x7f3a9c1d8e2f4b5c6d7e8f9a0b1c2d3e",
  "subscription": {
    "planId": "pro_weekly",
    "active": true,
    "activatedAt": "2024-05-19T10:30:00Z",
    "expiresAt": "2024-05-26T10:30:00Z"
  }
}
```

**Utilisation Complète** (Flux Complet):
```javascript
// 1. Créer
const createRes = await fetch('/api/pi/payment', {
  method: 'POST',
  body: JSON.stringify({ action: 'create', planId: 'pro_weekly' })
})
const { paymentId } = await createRes.json()

// 2. Attendre l'approbation utilisateur...
// L'utilisateur approuve dans Pi Network
// Et reçoit un TXID

// 3. Compléter
const completeRes = await fetch('/api/pi/payment', {
  method: 'POST',
  body: JSON.stringify({
    action: 'complete',
    paymentId: paymentId,
    txid: userTransactionId,
    planId: 'pro_weekly'
  })
})
const { subscription } = await completeRes.json()
console.log(subscription.active) // true
```

---

### 4️⃣ VERIFY - Vérifier un Paiement

**Endpoint**: `POST /api/pi/payment`

**Requête**:
```javascript
{
  "action": "verify",
  "paymentId": "pi_pay_1716120600123_0.789"
}
```

**Réponse Succès**:
```javascript
{
  "success": true,
  "verified": true,
  "status": "completed",
  "txid": "0x7f3a9c1d8e2f4b5c6d7e8f9a0b1c2d3e"
}
```

**Utilisation**:
```javascript
// Vérifier l'état d'un paiement
const res = await fetch('/api/pi/payment', {
  method: 'POST',
  body: JSON.stringify({
    action: 'verify',
    paymentId: paymentId
  })
})
const { verified, status } = await res.json()

if (verified && status === 'completed') {
  console.log('Paiement confirmé!')
}
```

---

### 5️⃣ HISTORY - Obtenir l'Historique

**Endpoint**: `POST /api/pi/payment`

**Requête**:
```javascript
{
  "action": "history"
}
```

**Réponse Succès**:
```javascript
{
  "success": true,
  "transactions": [
    {
      "id": "pi_pay_123_1",
      "amount": "5.99π",
      "status": "completed",
      "createdAt": "2024-05-19T09:00:00Z",
      "txid": "0x7f3a9c..."
    },
    {
      "id": "pi_pay_123_2",
      "amount": "19.99π",
      "status": "completed",
      "createdAt": "2024-05-18T14:30:00Z",
      "txid": "0x2d1234..."
    }
  ]
}
```

**Utilisation**:
```javascript
const res = await fetch('/api/pi/payment', {
  method: 'POST',
  body: JSON.stringify({ action: 'history' })
})
const { transactions } = await res.json()

transactions.forEach(tx => {
  console.log(`${tx.id}: ${tx.amount} - ${tx.status}`)
})
```

---

## 🧪 Tests des Endpoints

### Avec cURL

```bash
# 1. Créer un paiement
curl -X POST http://localhost:3000/api/pi/payment \
  -H "Content-Type: application/json" \
  -d '{"action":"create","planId":"pro_weekly"}'

# 2. Vérifier un paiement
curl -X POST http://localhost:3000/api/pi/payment \
  -H "Content-Type: application/json" \
  -d '{"action":"verify","paymentId":"pi_pay_123"}'

# 3. Compléter un paiement
curl -X POST http://localhost:3000/api/pi/payment \
  -H "Content-Type: application/json" \
  -d '{"action":"complete","paymentId":"pi_pay_123","txid":"0x..."}'

# 4. Récupérer l'historique
curl -X POST http://localhost:3000/api/pi/payment \
  -H "Content-Type: application/json" \
  -d '{"action":"history"}'
```

### Avec JavaScript/Fetch

```javascript
// Fonction utilitaire
async function callPaymentAPI(action, data = {}) {
  const response = await fetch('/api/pi/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data })
  })
  return response.json()
}

// Utilisation
const payment = await callPaymentAPI('create', { planId: 'pro_weekly' })
const verified = await callPaymentAPI('verify', { paymentId: payment.paymentId })
const completed = await callPaymentAPI('complete', { 
  paymentId: payment.paymentId,
  txid: 'user_transaction_id'
})
```

### Avec Postman

```
1. Créer une requête POST
2. URL: http://localhost:3000/api/pi/payment
3. Body (JSON):
   {
     "action": "create",
     "planId": "pro_weekly"
   }
4. Cliquer "Send"
```

---

## 🔄 Flux Complet d'Intégration

```
┌────────────────────────────────┐
│ Frontend - usePiPaymentSimple   │
└────────────────────────────────┘
         │
         │ 1. createPayment()
         ↓
┌────────────────────────────────┐
│ API - POST /api/pi/payment     │
│ action: "create"               │
└────────────────────────────────┘
         │
         │ ← paymentId
         ↓
┌────────────────────────────────┐
│ Pi Network SDK                 │
│ L'utilisateur approuve         │
└────────────────────────────────┘
         │
         │ ← TXID
         ↓
┌────────────────────────────────┐
│ Frontend - completePayment()    │
└────────────────────────────────┘
         │
         │ 2. POST /api/pi/payment
         │    action: "complete"
         ↓
┌────────────────────────────────┐
│ API traite et confirme         │
└────────────────────────────────┘
         │
         │ ← subscription active
         ↓
┌────────────────────────────────┐
│ Frontend - Affiche succès ✅    │
│ localStorage met à jour        │
└────────────────────────────────┘
```

---

## ❌ Gestion des Erreurs

### Erreur: Paiement non trouvé

```javascript
{
  "success": false,
  "error": "Paiement non trouvé"
}
```

**Solution**: Vérifiez que le paymentId est correct

### Erreur: Action invalide

```javascript
{
  "success": false,
  "error": "Action invalide"
}
```

**Solution**: L'action doit être: create, approve, complete, verify, ou history

### Erreur: Erreur serveur

```javascript
{
  "success": false,
  "error": "Erreur serveur"
}
```

**Solution**: 
- Vérifiez les logs serveur
- Vérifiez que PI_API_KEY est correctement configurée (si mode production)
- Vérifiez la connexion réseau

---

## 📊 Codes de Statut HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 400 | Bad Request - Données invalides |
| 404 | Not Found - Ressource non trouvée |
| 500 | Server Error - Erreur serveur |

---

## 🔒 Rate Limiting

Actuellement: **Pas de rate limiting**

Pour la production, considérez:
```javascript
// Limiter à 10 requêtes par minute par IP
// Limiter à 100 paiements par jour
```

---

## 📝 Logging

L'API loggue les actions importantes:

```javascript
console.log("💰 Pi Payment API - Requête reçue:", { action, planId })
console.log(`✅ [SANDBOX] Paiement créé: ${paymentId} - ${price}π`)
console.log(`✅ Paiement complété: ${paymentId} - TXID: ${txid}`)
```

Consultez les logs serveur pour déboguer.

---

**Version API**: 1.0  
**Dernière mise à jour**: Mai 2024  
**Statut**: Production Ready ✅

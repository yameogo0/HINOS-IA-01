# Démarrage Rapide - Hinos IA + Pi Network

## ⚡ En 5 minutes

### 1. Accéder aux Paramètres
```
URL: http://localhost:3000/settings
```

### 2. Onglet "Wallet"
- Cliquez "🔗 Connecter Wallet Pi"
- Mode Démo activé (pas de clé API requise)
- Voir votre solde Pi simulé

### 3. Onglet "Abonnement"
- Voyez les plans (Pro 7j / Premium 30j)
- Cliquez "💳 S'abonner avec Pi"
- Paiement simulé en sandbox
- ✅ Abonnement actif!

### 4. Onglet "Compte"
- Informations de sécurité
- À propos de l'app

---

## 📋 Checklist de Vérification

### ✅ Frontend
- [ ] PiWalletManager affiche bien
- [ ] Boutons "Connecter" cliquables
- [ ] Plans d'abonnement visibles
- [ ] Design responsive (mobile/desktop)

### ✅ Paiements
- [ ] Clic paiement → statut "Traitement..."
- [ ] Paiement complété → message succès
- [ ] localStorage.hinos_subscription créé
- [ ] Header Chatbot affiche abonnement

### ✅ Data
- [ ] Reconnexion charge le wallet
- [ ] Solde s'affiche correctement
- [ ] Abonnement persiste après refresh
- [ ] Expiration détectée

---

## 🔧 Configuration Rapide

### Mode Sandbox (DÉFAUT) ✅
```env
NEXT_PUBLIC_PI_NETWORK_SANDBOX=true
# C'est automatique, aucune clé requise!
```

### Mode Production (Optionnel)
```env
NEXT_PUBLIC_PI_NETWORK_SANDBOX=false
PI_API_KEY=your_key_here_from_pi_network
```

---

## 🎯 Fichiers Clés

| Fichier | Rôle | Location |
|---------|------|----------|
| PiWalletManager.tsx | Interface wallet | `/components/` |
| PiSubscriptionPlans.tsx | Plans paiement | `/components/` |
| use-pi-payment-simple.ts | Hook paiements | `/hooks/` |
| /api/pi/payment | API paiements | `/app/api/` |
| /settings | Dashboard | `/app/settings/` |

---

## 💡 Points d'Accès

### Pour les utilisateurs:
1. **Header Chatbot** → Bouton "👑 Premium"
2. **Page /settings** → Tous les outils
3. **Chatbot suggestions** → "💰 Voir abonnements"

### Pour les développeurs:
```typescript
// Importer et utiliser
import { PiWalletManager } from '@/components/PiWalletManager'
import { usePiPaymentSimple } from '@/hooks/use-pi-payment-simple'
```

---

## 🚀 Tests Rapides

### Test 1: Connexion Wallet
```
1. /settings
2. Onglet "Wallet"
3. Clic "Connecter Wallet Pi"
4. Voir profil simulé ✅
```

### Test 2: Paiement
```
1. Onglet "Abonnement"
2. Clic "S'abonner" sur Premium
3. Voir "Traitement..."
4. Succès avec localStorage créé ✅
```

### Test 3: Persistance
```
1. F5 (refresh)
2. Wallet doit charger automatiquement
3. Abonnement doit être actif ✅
```

---

## 🐛 Problèmes Courants

### Q: Je vois "Non connecté" au wallet
**R:** Normal en mode démo. Cliquez "Connecter" pour activer.

### Q: Le paiement reste en "Traitement"
**R:** Attendez 2-3 secondes en mode sandbox. C'est normal.

### Q: localStorage est vide après reconnexion
**R:** Vérifiez que vous n'êtes pas en incognito/private mode.

### Q: Comment passer en production?
**R:** Ajoutez `PI_API_KEY` et changez `SANDBOX=false`.

---

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Tablet (768px-1024px)
- ✅ Mobile (< 768px)

Testez sur devTools (F12) → Device Toolbar

---

## 🔒 Sécurité

- ✅ Pas de clés privées stockées
- ✅ Authentification Pi Network
- ✅ localStorage sécurisé
- ✅ HTTPS en production

---

## 📚 Documentation Complète

- `PI_NETWORK_INTEGRATION_GUIDE.md` - Architecture détaillée
- `PI_NETWORK_INTEGRATION_SUMMARY.md` - Vue d'ensemble
- `PI_NETWORK_EXAMPLES.md` - 10 exemples d'utilisation

---

## 🎓 Prochaines Étapes

1. **Explorer les examples** (PI_NETWORK_EXAMPLES.md)
2. **Tester paiements** (tous les modes)
3. **Intégrer à votre appli** (copier components)
4. **Déployer en production** (configurer clé API)

---

## 📞 Besoin d'Aide?

### Console Browser (F12)
```javascript
// Vérifier wallet
console.log(window.Pi)

// Vérifier localStorage
console.log(localStorage.getItem('pi_wallet_user'))
console.log(localStorage.getItem('hinos_subscription'))

// Vérifier API
fetch('/api/pi/payment', {
  method: 'POST',
  body: JSON.stringify({ action: 'history' })
}).then(r => r.json()).then(console.log)
```

### Documentation externe
- https://docs.minepi.com/
- https://developers.minepi.com/

---

## ✅ Résumé

Vous avez maintenant:
- ✅ Gestionnaire de wallet Pi
- ✅ Système de paiement complet
- ✅ Gestion des abonnements
- ✅ Mode sandbox pour tester
- ✅ Documentation complète

**Prêt à déployer!** 🚀

---

*Créé: 19 Mai 2024*  
*Version: 1.0*  
*Statut: Production Ready*

# 🎯 GUIDE COMPLET: Créer un Wallet Pi et Intégrer les Paiements dans Hinos IA

## 📋 Table des matières
1. [Démarrage rapide (1 min)](#démarrage-rapide)
2. [Créer votre Wallet Pi](#créer-votre-wallet-pi)
3. [Utiliser les Paiements](#utiliser-les-paiements)
4. [Configuration complète](#configuration-complète)
5. [Tests et vérification](#tests-et-vérification)

---

## 🚀 Démarrage rapide

### Étape 1: Accéder aux paramètres (30 secondes)
```
1. Ouvrez Hinos IA
2. Cliquez sur "⚙️ Paramètres" (en haut à droite)
3. Allez à l'onglet "Wallet"
```

### Étape 2: Connecter votre Wallet (30 secondes)
```
1. Cliquez sur "🔗 Connecter Wallet Pi"
2. Acceptez les permissions
3. Voilà! Votre wallet est connecté ✅
```

---

## 🏗️ Créer votre Wallet Pi

### Option 1: Pi Network Mobile App (Recommandé)

**Étape 1: Télécharger l'app**
- iOS: Allez sur App Store et cherchez "Pi Network"
- Android: Allez sur Google Play et cherchez "Pi Network"

**Étape 2: Créer un compte**
```
1. Ouvrez l'app Pi Network
2. Cliquez sur "Créer un compte"
3. Entrez votre numéro de téléphone
4. Vérifiez le code SMS
5. Créez un nom d'utilisateur (ex: "mon_hinos_wallet")
6. Acceptez les conditions
```

**Étape 3: Configurer votre Wallet**
```
1. Allez à "Wallet" dans l'app
2. Créez une phrase secrète (12 mots) - SAUVEGARDEZ-LA!
3. Confirmez la phrase secrète
4. Notez votre adresse wallet (commence par "0x")
```

**Étape 4: Ajouter des Pi coins (optionnel)**
```
Pour tester les paiements:
- Vous pouvez miner gratuitement (1 Pi/jour en mode gratuit)
- Ou acheter du Pi Network sur des exchanges
```

### Option 2: Pi Browser (Alternative)

Si vous utilisez le navigateur Pi officiel:
```
1. Ouvrez Pi Browser
2. Allez à https://pi.app
3. Connectez-vous avec vos identifiants
4. Votre wallet est automatiquement activé
```

---

## 💳 Utiliser les Paiements dans Hinos IA

### Processus complet de paiement

**Étape 1: Allez à l'onglet "Abonnement"**
```
1. Cliquez sur "⚙️ Paramètres"
2. Sélectionnez l'onglet "Abonnement"
3. Vous voyez les plans disponibles
```

**Étape 2: Choisir un plan**

Les plans disponibles:
```
📊 PRO WEEKLY - 5.99 π
  ✓ 50 messages/jour
  ✓ Analyse d'images
  ✓ Rapport hebdomadaire
  Durée: 7 jours

💎 PREMIUM MONTHLY - 19.99 π
  ✓ Illimité messages
  ✓ Analyse vidéo
  ✓ Export PDF
  ✓ Support prioritaire
  Durée: 30 jours
```

**Étape 3: Initier le paiement**
```
1. Cliquez sur "Activer [NOM_PLAN]"
2. Vérifiez le montant en π
3. Cliquez sur "Continuer avec Pi Network"
```

**Étape 4: Confirmer la transaction**
```
L'application affiche:
- ID de paiement
- Montant en Pi
- Adresse de destination
- Bouton "Approuver le paiement"

Cliquez sur "Approuver" pour confirmer
```

**Étape 5: Compléter la transaction**
```
Vous recevez une confirmation:
- ✅ Paiement approuvé
- Transaction ID (TXID)
- Votre abonnement est maintenant ACTIF
- Durée d'activité affichée
```

---

## ⚙️ Configuration Complète

### Variables d'environnement requises (optionnel)

Par défaut, Hinos IA fonctionne en mode **Sandbox** (simulation). Pour la production:

**Fichier: `.env.local`**
```env
# Mode Sandbox (défaut - aucune clé API requise)
NEXT_PUBLIC_PI_NETWORK_SANDBOX=true

# Mode Production (optionnel)
NEXT_PUBLIC_PI_NETWORK_SANDBOX=false
PI_API_KEY=sk_live_xxxxx
NEXT_PUBLIC_PI_MERCHANT_ID=merchant_xxxxx
```

### Fichiers importants de configuration

```
📁 Hinos IA - Structure Pi Network
│
├── 🎨 COMPOSANTS
│   ├── components/PiWalletManager.tsx       (Gestion du wallet)
│   ├── components/PiSubscriptionPlans.tsx   (Plans d'abonnement)
│   └── components/Chatbot.tsx               (Intégration dans chat)
│
├── 🪝 HOOKS
│   ├── hooks/use-pi-wallet.ts               (État du wallet)
│   ├── hooks/use-pi-payment.ts              (État des paiements)
│   ├── hooks/use-pi-payment-simple.ts       (Paiements simplifiés)
│   └── hooks/use-pi-network-authentication.ts (Authentification)
│
├── 🔌 API
│   └── app/api/pi/payment/route.ts          (Endpoint paiements)
│
├── 📄 PAGES
│   ├── app/page.tsx                         (Accueil)
│   ├── app/settings/page.tsx                (Paramètres avec wallet)
│   └── components/Chatbot.tsx               (Chat principal)
│
└── 📚 STOCKAGE
    └── localStorage: "pi_wallet_user"       (Données wallet)
```

---

## 🧪 Tests et Vérification

### Mode Sandbox - Tester sans argent réel

Hinos IA est en **mode Sandbox par défaut** = Tout est simulé!

**Tester la connexion wallet:**
```
1. Allez à /settings → Wallet
2. Cliquez "Connecter Wallet Pi"
3. Vous recevez un wallet de démo avec 50π
4. ✅ Les données sont sauvegardées localement
```

**Tester un paiement:**
```
1. Allez à /settings → Abonnement
2. Choisissez un plan (par ex: PRO WEEKLY - 5.99π)
3. Cliquez "Activer PRO WEEKLY"
4. Le paiement est simulé (pas d'argent réel!)
5. ✅ Votre abonnement devient ACTIF
6. Vérifiez dans l'en-tête du chat: affichage statut
```

### Vérifier les paiements passés

```
1. /settings → Wallet → Historique
2. Vous voyez tous vos paiements simulés
3. Format: Date | Montant | Statut | TXID
```

### Affichage du statut d'abonnement

En haut du chat, vous voyez:
```
PRO ✓ (Expire dans 6 jours 23h)
```

---

## 🔐 Sécurité et Stockage

### Où sont stockées mes données?

```
✅ Wallet User: localStorage
   - Adresse wallet
   - Nom d'utilisateur
   - Solde simulé (mode sandbox)
   - Pas d'informations sensibles

✅ Historique de paiements: localStorage
   - Transactions simulées
   - Timestamps
   - Montants

⚠️ En production:
   - Données chiffrées
   - Vérification API Pi Network officielle
   - Conformité sécurité
```

### Réinitialiser les données

Si vous voulez recommencer:

```javascript
// Dans la console du navigateur (F12):
localStorage.removeItem('pi_wallet_user');
localStorage.removeItem('pi_payment_history');
location.reload();
```

---

## 📱 Utilisation en Production (Optionnel)

Si vous voulez vraiment accepter des paiements Pi:

### 1️⃣ S'inscrire comme Merchant
```
1. Allez sur https://pi.app/developers
2. Créez un compte développeur
3. Demandez l'accès Merchant API
4. Recevez une clé API
```

### 2️⃣ Configurer votre application
```env
NEXT_PUBLIC_PI_NETWORK_SANDBOX=false
PI_API_KEY=sk_live_votre_cle_api
NEXT_PUBLIC_PI_MERCHANT_ID=merchant_xxxxx
```

### 3️⃣ Vérifier les paiements
```
Les paiements sont vérifiés automatiquement par:
- L'API officielle Pi Network
- Blockchain Pi Network
- Système de vérification d'abonnement
```

---

## ❓ FAQ

### Q: Et si je perte ma phrase secrète?
R: Conservez-la dans un endroit sûr (gestionnaire de mots de passe, papier sécurisé). Vous ne pourrez pas récupérer votre wallet sans elle.

### Q: Puis-je tester sans Pi Network mobile?
R: Oui! Utilisez le mode Sandbox (défaut). Les paiements sont simulés localement.

### Q: Quand le mode Sandbox devrait-il passer en production?
R: Généralement après test complet et création de compte Merchant Pi Network.

### Q: Comment retirer mon solde Pi?
R: Via l'app Pi Network officielle → Wallet → Send → Choisir adresse destinataire.

### Q: Est-ce gratuit?
R: Oui pour le mode Sandbox! Vous testez gratuitement. En production, Pi Network facture une commission (environ 1-2%).

---

## 📞 Support et Ressources

**Documentation officielle Pi Network:**
- https://developers.minepi.com

**Forum communauté:**
- https://pi.app/community

**Troubleshooting:**
Voir `VERIFICATION_FINALE_PI.md`

---

## ✅ Résumé - Ce que vous pouvez faire MAINTENANT

| Action | Où? | Temps |
|--------|-----|-------|
| Connecter wallet | /settings → Wallet | 30s |
| Voir solde | /settings → Wallet → Affichage balance | Instantané |
| Acheter abonnement Pro | /settings → Abonnement | 1min |
| Vérifier paiements | /settings → Wallet → Historique | Instantané |
| Déconnecter wallet | /settings → Wallet → Logout | 5s |

**🎉 Vous êtes prêt! Lancez Hinos IA et explorez le wallet Pi maintenant!**

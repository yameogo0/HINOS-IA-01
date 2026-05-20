# 🔧 Troubleshooting - Problèmes et Solutions

## ❌ Le wallet ne se connecte pas

### Problème 1: "Window.Pi is undefined"
```
Cause: L'app n'est pas en mode Pi Browser
Solution:
1. Vous êtes en mode Sandbox (normal!)
2. Cliquez sur "Connecter" pour obtenir un wallet démo
3. En production, utilisez Pi Browser officiel
```

### Problème 2: Erreur "Permission denied"
```
Cause: Les permissions n'ont pas été acceptées
Solution:
1. Ouvrez Pi Network app
2. Allez à Paramètres → Permissions
3. Acceptez les permissions pour Hinos IA
4. Réessayez
```

### Problème 3: Les données ne sont pas sauvegardées
```
Cause: localStorage est désactivé
Solution:
1. Vérifiez que les cookies/stockage sont activés
2. Ouvrez les paramètres du navigateur
3. Recherchez "Site data" ou "Cookies"
4. Assurez-vous que c'est autorisé pour hinos-ia.com
```

---

## ❌ Les paiements ne fonctionnent pas

### Problème 1: "Payment creation failed"
```
Cause: L'API Pi Network n'a pas répondu
Solution:
1. Vérifiez votre connexion Internet
2. Attendez quelques secondes
3. Réessayez
4. Si cela persiste, contactez le support
```

### Problème 2: Paiement "stuck" en mode pending
```
Cause: La transaction n'a pas été approuvée
Solution:
1. Vérifiez que vous aviez assez de Pi coins
2. Vérifiez votre connexion réseau
3. Essayez de rafraîchir la page
4. Vérifiez l'historique des transactions
```

### Problème 3: "Invalid amount"
```
Cause: Le montant n'est pas valide
Solution:
1. Les montants doivent être en décimal (ex: 5.99)
2. Vérifiez que vous choisissez un plan valide
3. Le montant minimum est généralement 0.01π
```

---

## ❌ Le statut d'abonnement ne s'affiche pas

### Problème: "Abonnement non affiché après paiement"
```
Cause: Cache non rafraîchi
Solution:
1. Rafraîchissez la page (F5 ou Ctrl+R)
2. Allez à /settings → Wallet pour vérifier
3. Vérifiez l'historique des paiements
4. Attendez 1-2 minutes pour la synchronisation
```

---

## ❌ Je veux réinitialiser tout

### Méthode 1: Via l'interface
```
1. Allez à /settings → Wallet
2. Cliquez sur "Déconnecter"
3. Les données sont supprimées
```

### Méthode 2: Console JavaScript
```javascript
// Ouvrez F12 → Console
localStorage.removeItem('pi_wallet_user');
localStorage.removeItem('pi_subscription');
localStorage.removeItem('pi_payment_history');
location.reload();
// Tout est réinitialisé!
```

### Méthode 3: Réinitialiser le navigateur
```
Navigateur Chrome:
1. Paramètres → Confidentialité et sécurité
2. Effacer les données de navigation
3. Sélectionnez "Tous les temps"
4. Cochez "Cookies et données de site"
5. Cliquez "Effacer les données"
```

---

## ❌ Mode Production - Problèmes

### Problème 1: Clé API invalide
```
Symptôme: "Unauthorized - Invalid API Key"
Solution:
1. Vérifiez la clé API dans .env.local
2. Assurez-vous qu'elle commence par "sk_live_" ou "sk_test_"
3. Vérifiez qu'elle n'a pas d'espaces
4. Demandez une nouvelle clé si nécessaire
```

### Problème 2: Le paiement est refusé
```
Cause: Solde insuffisant ou adresse invalide
Solution:
1. Vérifiez votre solde Pi Network (app officielle)
2. Assurez-vous d'avoir au moins le montant requis
3. Vérifiez l'adresse destination
4. Contactez le support Pi Network
```

### Problème 3: Transaction lente ou timeout
```
Cause: Réseau Pi Network surchargé ou problème réseau
Solution:
1. Attendez 5-10 minutes
2. Vérifiez la blockchain Pi (explorateur)
3. Si timeout, contactez support@pi.app
```

---

## ✅ Tests à faire

### Checklist de base
```
□ Je peux me connecter au wallet (mode Sandbox)
□ Le solde affiche 50π
□ Je peux déconnecter et reconnecter
□ Les données persistent après refresh
□ Je peux voir l'historique des paiements
```

### Checklist paiements
```
□ Je peux créer un paiement
□ L'ID de paiement s'affiche
□ Je peux approuver le paiement
□ Le paiement se complète
□ L'abonnement devient actif
□ L'abonnement s'affiche en haut du chat
```

### Checklist production
```
□ Clé API configurée correctement
□ Merchant ID valide
□ Mode Sandbox désactivé
□ Paiements vérifiés sur blockchain Pi
□ Notifications d'abonnement reçues
```

---

## 📞 Obtenir de l'aide

### Ressources
- **Documentation officielle**: https://developers.minepi.com
- **Forum community**: https://pi.app/community
- **Status API Pi**: https://status.minepi.com

### Rapporter un bug
```
Si vous trouvez un bug, incluez:
1. Les étapes pour reproduire
2. Le message d'erreur exact (console F12)
3. Votre navigateur et version
4. Votre système d'exploitation
5. Screenshot si possible
```

### Logs de debug
```javascript
// Pour voir les logs détaillés:
// Ouvrez F12 → Console
// Vous verrez:
// - Connexion wallet ✅ Wallet Pi connecté
// - Création paiement 💰 Payment created
// - Approbation 💳 Payment approved
// - Complétion ✅ Payment completed
```

---

## 🎯 Mode Sandbox vs Production - Comparaison

| Aspect | Sandbox | Production |
|--------|---------|------------|
| Configuration | Aucune | Clé API requise |
| Argent réel | Non (fictif) | Oui (vraie) |
| Vérification blockchain | Non | Oui |
| Transactions | Simulées | Réelles |
| Frais | 0% | ~1-2% |
| Idéal pour | Tests/démos | Production |
| Temps réponse | Instantané | 5-30 secondes |

---

## 🚀 Prochaines étapes

### Si vous êtes en Sandbox:
1. ✅ Testez la connexion wallet
2. ✅ Testez les paiements
3. ✅ Vérifiez l'affichage des abonnements
4. → Quand prêt, passez à la production

### Si vous êtes en Production:
1. ✅ Obtenez une clé API Pi
2. ✅ Configurez les variables d'env
3. ✅ Testez avec petit montant (0.01π)
4. ✅ Vérifiez sur blockchain Pi
5. ✅ Lancez officiellement!

---

**Besoin d'aide supplémentaire?**
Consultez `GUIDE_COMPLET_WALLET_PI_HINOS.md` pour un guide complet.

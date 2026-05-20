## 🎯 Guide Complet: Wallet Pi & Paiements dans Hinos IA

### 📋 Table des matières
1. [Démarrage rapide](#démarrage-rapide)
2. [Connexion du Wallet](#connexion-du-wallet)
3. [Affichage du solde](#affichage-du-solde)
4. [Paiements et abonnements](#paiements-et-abonnements)
5. [Gestion des paiements](#gestion-des-paiements)
6. [Dépannage](#dépannage)

---

## Démarrage Rapide

### Étape 1: Accéder aux paramètres
1. Cliquez sur le bouton **⚙️ Paramètres** en haut à droite
2. Vous verrez 3 onglets: **Wallet**, **Abonnement**, **Compte**

### Étape 2: Connecter votre wallet Pi
1. Allez à l'onglet **Wallet**
2. Cliquez sur **Connecter Wallet Pi Network**
3. Suivez les instructions d'authentification Pi Network
4. Votre profil s'affichera automatiquement

### Étape 3: Souscrire à un plan
1. Allez à l'onglet **Abonnement**
2. Choisissez entre **Pro** (5.99π) ou **Premium** (19.99π)
3. Cliquez sur **S'abonner maintenant**
4. Confirmez la transaction dans Pi Network

---

## Connexion du Wallet

### Interface de connexion

```
┌─────────────────────────────────────┐
│  Wallet Pi Network                  │
├─────────────────────────────────────┤
│                                     │
│  [Connecter Wallet Pi Network]      │
│                                     │
│  Vous pouvez aussi:                 │
│  • Voir votre profil                │
│  • Vérifier votre solde             │
│  • Accéder à l'historique           │
│                                     │
└─────────────────────────────────────┘
```

### Données Stockées

Une fois connecté, vos données (chiffrées) sont stockées en local:
- **UID**: Identifiant unique Pi Network
- **Nom d'utilisateur**: Votre pseudo Pi
- **Adresse Wallet**: Votre adresse Pi (non modifiable)
- **Solde**: Mis à jour à chaque transaction

### Sécurité

- ✅ Aucun mot de passe stocké
- ✅ Authentification via Pi Network SDK
- ✅ Données stockées en localStorage (chiffrement client)
- ✅ Aucun partage de données avec des tiers

---

## Affichage du Solde

### Dashboard Wallet

Après connexion, vous verrez:

```
┌──────────────────────────────────────┐
│  👤 [Votre Nom]                      │
│  Adresse: 0x2d...7f                  │
│                                      │
│  💰 Solde: 125.50 Pi                 │
│                                      │
│  [↻ Actualiser]  [Copier]  [Quitter]│
└──────────────────────────────────────┘
```

### Actualiser le solde

1. Cliquez sur le bouton **↻ Actualiser**
2. Le solde est mis à jour depuis Pi Network
3. Un message de confirmation s'affiche

### Copier l'adresse

1. Cliquez sur **Copier** sous votre adresse wallet
2. L'adresse est copiée dans le presse-papiers
3. Vous verrez une notification "✅ Copié!"

---

## Paiements et Abonnements

### Plans Disponibles

#### Plan PRO (5.99 Pi)
- Durée: 7 jours
- Accès illimité aux analyses
- Support par email
- Export des rapports
- Accès à la communauté

#### Plan PREMIUM (19.99 Pi) ⭐
- Durée: 30 jours
- **Tout ce qui est dans Pro**
- Support prioritaire 24/7
- API personnalisée
- Rapports avancés
- Conseils personnalisés
- Pas de publicités

### Processus d'achat

```
1. Aller à "Paramètres" > "Abonnement"
   ↓
2. Choisir un plan
   ↓
3. Cliquer "S'abonner maintenant"
   ↓
4. Approuver la transaction Pi Network
   ↓
5. Saisir le TXID (Transaction ID)
   ↓
6. Paiement confirmé! ✅
```

### Flux de Paiement Détaillé

**Phase 1: Création du paiement**
- Hinos IA crée une requête de paiement
- Pi Network génère un ID de paiement unique
- Vous recevez le montant exact à payer (5.99π ou 19.99π)

**Phase 2: Approbation**
- Vous approvez la transaction dans votre wallet Pi
- Pi Network signe la transaction

**Phase 3: Confirmation**
- Vous recevez un TXID (identifiant de transaction)
- Vous le saisissez dans Hinos IA
- Le paiement est marqué comme complété

**Phase 4: Activation**
- Votre abonnement s'active immédiatement
- Une date d'expiration est définie
- Vous accédez aux fonctionnalités premium

---

## Gestion des Paiements

### Historique des Paiements

Vos transactions sont conservées localement:

```json
{
  "paymentId": "pi_pay_123456",
  "amount": 19.99,
  "status": "completed",
  "txid": "0x7f3a9c...",
  "date": "2024-05-19T10:30:00Z"
}
```

### Statuts de Paiement

- **pending**: En attente d'approbation
- **approved**: Approuvé, en attente de confirmation
- **completed**: Transaction réussie ✅
- **failed**: Transaction échouée ❌

### Renouvellement de l'abonnement

- L'abonnement expire après la durée définie
- Vous recevrez une notification avant l'expiration
- Pour continuer, réabonnez-vous au plan de votre choix

---

## Dépannage

### Je n'arrive pas à me connecter

**Problème**: Le bouton "Connecter" ne fonctionne pas

**Solutions**:
1. Vérifiez que vous êtes sur le réseau Pi Network (Mainnet ou Testnet)
2. Assurez-vous que Pi Browser ou l'extension Pi Network est installée
3. Rechargez la page (F5)
4. Videz le cache et les cookies
5. Vérifiez la console pour les erreurs (F12)

### Le solde ne s'affiche pas

**Problème**: Votre solde affiche "0 Pi"

**Solutions**:
1. Cliquez sur "Actualiser" pour mettre à jour le solde
2. Vérifiez que votre wallet Pi a des fonds
3. Attendez quelques secondes, le solde peut être en cours de chargement
4. Reconnectez-vous en cliquant "Quitter" puis "Connecter"

### La transaction n'est pas confirmée

**Problème**: Le paiement reste en attente

**Solutions**:
1. Attendez 1-2 minutes que la blockchain confirme la transaction
2. Vérifiez le TXID dans l'explorateur Pi Network
3. Contactez le support si le paiement n'est pas confirmé après 10 minutes

### Je vois une erreur "Mode Sandbox"

**Problème**: Vous testez en mode sandbox (développement)

**Info**: C'est normal! En mode sandbox:
- Les paiements sont simulés
- Aucun Pi réel n'est utilisé
- Les transactions ont des IDs générés automatiquement
- C'est parfait pour tester sans risque

### L'abonnement n'est pas actif

**Problème**: Vous n'avez pas accès aux fonctionnalités premium

**Solutions**:
1. Vérifiez que votre paiement a le statut "completed" ✅
2. Vérifiez la date d'expiration de votre abonnement
3. Rechargez la page pour actualiser votre statut
4. Si l'abonnement est expiré, réabonnez-vous

---

## Questions Fréquentes

### Q: Est-ce sûr de connecter mon wallet?
**R**: Oui! Hinos IA n'accède qu'aux permissions que vous accordez. Vous contrôlez toujours votre wallet.

### Q: Puis-je utiliser Hinos IA sans abonnement?
**R**: Oui! Les fonctionnalités de base sont gratuites. L'abonnement ajoute seulement des fonctionnalités premium.

### Q: Comment puis-je voir ma transaction sur la blockchain?
**R**: Utilisez l'explorateur Pi Network avec votre TXID: https://explorer.minepi.com

### Q: Puis-je annuler un paiement?
**R**: Une fois approuvé et confirmé, le paiement ne peut pas être annulé. Contactez le support pour un remboursement.

### Q: Comment change-t-on d'abonnement?
**R**: Vous pouvez upgrade/downgrade à tout moment. Le nouveau plan s'active immédiatement.

---

## Support

Pour toute question ou problème:
- Consultez cette documentation
- Vérifiez la section **Dépannage**
- Contactez le support Pi Network
- Consultez la documentation officielle: https://developers.minepi.com

---

**Version**: 1.0  
**Dernière mise à jour**: Mai 2024  
**Statut**: Production Ready ✅

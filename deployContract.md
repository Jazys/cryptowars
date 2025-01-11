# Déploiement du Smart Contract Flag Manager

Guide de déploiement et de mise à jour du smart contract Flag Manager sur Fantom Testnet.

## Configuration Initiale

### Prérequis
- Node.js v16+
- npm ou yarn
- Un compte Fantom Testnet avec des FTM de test ([Faucet Fantom](https://faucet.fantom.network/))
- MetaMask configuré avec le réseau Fantom Testnet

### Configuration de hardhat

```
fantomTestnet: {
      url: "https://rpc.testnet.fantom.network/",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 4002
    }
```
Il faut prendre la chaine souhaitée

### Configuration du .env
```env
NEXT_PUBLIC_INFURA_URL=https://rpc.testnet.soniclabs.com
PRIVATE_KEY_=8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b
NEXT_PUBLIC_CONTRACT_ADDRESS=0x06caFcac0D4E188C09E8E722c31fad036C6F0353
```

## Déploiement Initial

1. Installation des dépendances :
```bash
npm install
```

2. Déploiement du contrat proxy :
```bash
npx hardhat run scripts/deploy_flag_proxy.ts --network fantomTestnet
```

3. Résultat attendu :
```
Deploying FlagManager...
FlagManager proxy deployed to: 0x...
Implementation deployed to: 0x...
Admin proxy deployed to: 0x...

Initialisation des cryptos...
Crypto Bitcoin ajoutée avec 10 drapeaux
Crypto Ethereum ajoutée avec 8 drapeaux
Crypto Fantom ajoutée avec 5 drapeaux
```

4. **IMPORTANT** : Copier l'adresse du proxy dans votre .env : 
c'est à dire la première ligne "FlagManager proxy deployed to: 0x..."
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<adresse_du_proxy>
```

## Mise à Jour du Contrat (V2)

1. Pour upgrader vers la version 2 :
```bash
npx hardhat run scripts/upgrade_to_v2.ts --network fantomTestnet
```
Il faut changer la ligne  const PROXY_ADDRESS = "0x5854e3ebb827546cefBd85c544f899c9436BAC13";  par l'adresse du proxy dans votre .env .

2. Résultat attendu :
```
Version actuelle du contrat : 1.0.0
Upgrading proxy...
Proxy upgraded
Implementation deployed to: 0x...
Initial price: 0.01 FTM

Initialisation des cryptos pour V2...
Crypto Bitcoin ajoutée avec 10 drapeaux
Crypto Ethereum ajoutée avec 8 drapeaux
Crypto Fantom ajoutée avec 5 drapeaux

New version: 2.0.0
```

## Ajout de nouvelle crypto
Quand on deploie le contrats, on ajoute les cryptos que l'on veut et on vérifie bien que ces cryptos sont ajoutés
==> donc rajouter dans le contrat les cryptos que l'on veut
Il faut modifier le fichier gameConfig.ts dans src/config/gameConfig.ts afin de rajouter 
- l'emplacement des crypto
- les chain utilisées

Il faut aussi modifier le fichier iconMapping.ts dans src/lib/iconMapping.ts pour rajouter les images des crypto
Ne pas oublier de modifier le endGameCron.ts dans scripts/endGameCron.ts pour gérer les matchs

## Gestion des Parties

Pour configurer la partie web :
Il faut modifier les fichiers suivants : 
app\components\WalletConnect.tsx en changeant 
```
const NETWORK = {
  chainId: '0xfa2',
  chainName: 'Fantom Testnet',
  nativeCurrency: {
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18
  },
  rpcUrls: ['https://rpc.testnet.fantom.network/'],
  blockExplorerUrls: ['https://testnet.ftmscan.com/']
}
```
par l'adresse du réseau

### Terminer une partie en cours
```bash
ts-node scripts/endGameCron.ts
```

Il faut configurer le provider en changeant 
```
const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network/');
```
par le provider souhaité

Résultat attendu :
```
Admin address: 0x...
Wallet address: 0x...
Checking game state...

Checking flags for Bitcoin...
Found 10 flags
[Liste des drapeaux assignés]

Game state valid, proceeding with endGame...
Estimated gas: XXXXX
Transaction sent: 0x...
Game ended successfully!

Winner Information:
-------------------
Country: XX
Winner Address: 0x...
Flag Count: X
Prize Claimed: No
```

## Vérifications Post-Déploiement

1. Vérifier que le contrat est bien déployé :
   - Explorer Fantom Testnet : https://testnet.ftmscan.com/
   - Rechercher l'adresse du proxy

2. Vérifier les droits admin :
   - L'adresse qui a déployé doit être admin
   - Peut terminer les parties
   - Peut mettre à jour le contrat

3. Vérifier les fonctionnalités :
   - Assignation de drapeaux
   - Comptage des points
   - Fin de partie
   - Réclamation des prix

## Résolution des Problèmes

### Erreurs Communes

1. "Not the contract admin"
   - Solution : Utiliser le bon compte avec les droits admin
   - Vérifier PRIVATE_KEY dans .env

2. "Insufficient funds"
   - Solution : Obtenir des FTM de test
   - [Faucet Fantom Testnet](https://faucet.fantom.network/)

3. "Contract not deployed"
   - Solution : Vérifier l'adresse du contrat
   - Redéployer si nécessaire

### Support

Pour plus d'aide :
- Vérifier les logs de transaction sur [FTMScan](https://testnet.ftmscan.com/)
- Utiliser hardhat console pour le debug
- Consulter la documentation du contrat 
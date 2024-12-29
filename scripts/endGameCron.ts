const FlagManagerABI = [
  "function endGame() external",
  "function owner() view returns (address)",
  "function admin() view returns (address)",
  "function lastGameEndTime() view returns (uint256)",
  "function getCryptoFlags(string) view returns (tuple(bool isAssigned, string countryCode)[])",
  "function getWinner() external view returns (tuple(string countryCode, address winnerAddress, uint256 flagCount, bool hasClaimed))"
];

interface Flag {
  isAssigned: boolean;
  countryCode: string;
}

async function endGame() {
    const { ethers } = require('ethers');
    const dotenv = require('dotenv');
    dotenv.config();
    
    try {
        // Connexion au réseau Fantom Testnet
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network/');
        
        // Utiliser la clé privée depuis les variables d'environnement
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || 'c00987121a87f28fa21fa86c160b70a62399f9c4d8a44fe5f1e6ac70008d1069', provider);
        
        // Connexion au contrat
        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS || '0x06caFcac0D4E188C09E8E722c31fad036C6F0353',
            FlagManagerABI,
            wallet
        );

        // Vérifier le code du contrat
        const code = await provider.getCode(contract.address);
        if (code === '0x') {
            console.log('Contract not deployed at this address');
            return;
        }

        // Vérifier si l'adresse est admin
        try {
            const admin = await contract.admin();
            console.log('Admin address:', admin);
            console.log('Wallet address:', wallet.address);
            
            if (admin.toLowerCase() !== wallet.address.toLowerCase()) {
                console.log('Not the contract admin');
                return;
            }
        } catch (error) {
            console.log('Error getting admin, trying owner...');
            const owner = await contract.owner();
            console.log('Owner address:', owner);
            console.log('Wallet address:', wallet.address);
            
            if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
                console.log('Not the contract owner');
                return;
            }
        }

        // Vérifier l'état du jeu
        console.log('Checking game state...');
        
        // Vérifier les drapeaux assignés
        const cryptos = ['Bitcoin', 'Ethereum', 'Fantom'];
        let hasAssignedFlags = false;
        
        for (const crypto of cryptos) {
            console.log(`\nChecking flags for ${crypto}...`);
            try {
                const flags: Flag[] = await contract.getCryptoFlags(crypto);
                console.log(`Found ${flags.length} flags`);
                
                for (const flag of flags) {
                    if (flag && flag.isAssigned) {
                        console.log(`Found assigned flag: ${flag.countryCode}`);
                        hasAssignedFlags = true;
                    }
                }
            } catch (error) {
                console.log(`Error checking flags for ${crypto}:`, error);
                continue;
            }
        }

        if (!hasAssignedFlags) {
            console.log('No flags assigned yet, cannot end game');
            return;
        }

        console.log('\nGame state valid, proceeding with endGame...');
        
        // Ajout des options de transaction avec gas limit explicite et nonce
        const nonce = await wallet.getTransactionCount();
        const gasPrice = await provider.getGasPrice();
        
        const estimatedGas = await contract.estimateGas.endGame();
        console.log('Estimated gas:', estimatedGas.toString());
        
        const tx = await contract.endGame({
            gasLimit: estimatedGas.mul(120).div(100), // 20% de plus que l'estimation
            gasPrice: gasPrice.mul(2), // Double du gas price actuel
            nonce: nonce
        });
        
        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        
        if (receipt.status === 0) {
            throw new Error('Transaction failed');
        }
        
        console.log('Game ended successfully!');

        // Récupérer et afficher les informations du gagnant
        const winner = await contract.getWinner();
        console.log('\nWinner Information:');
        console.log('-------------------');
        console.log(`Country: ${winner.countryCode}`);
        console.log(`Winner Address: ${winner.winnerAddress}`);
        console.log(`Flag Count: ${winner.flagCount.toString()}`);
        console.log(`Prize Claimed: ${winner.hasClaimed ? 'Yes' : 'No'}`);
        
    } catch (error: any) {
        console.error('Error ending game:', error);
        if (error.reason) {
            console.error('Reason:', error.reason);
        }
        if (error.error) {
            console.error('Error details:', error.error);
        }
        if (error.transaction) {
            console.error('Transaction details:', {
                from: error.transaction.from,
                to: error.transaction.to,
                data: error.transaction.data,
                gasLimit: error.transaction.gasLimit?.toString(),
                gasPrice: error.transaction.gasPrice?.toString()
            });
        }
    }
}

// Exécuter la fonction
endGame()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }); 
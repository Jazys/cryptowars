const { ethers, upgrades  } = require("hardhat");

async function main() {
  // Adresse du contrat déployé
  const contractAddress = "0x6F42DC1CFd6D9904084349066E4948129eAb175a";

  console.log("Vérification du contrat FlagManager...");
  
  // Récupérer le contrat
  const FlagManager = await ethers.getContractFactory("FlagManager");
  const flagManager = await FlagManager.attach(contractAddress);

  try {
    // Vérifier chaque crypto
    const cryptos = ['Bitcoin', 'Ethereum', 'Fantom'];
    console.log("\nVérification des cryptos :");
    for (const crypto of cryptos) {
      const count = await flagManager.getCryptoFlagCount(crypto);
      console.log(`${crypto}: ${count.toString()} drapeaux`);
    }

    // Vérifier le prix d'assignation
    const price = await flagManager.assignmentPrice();
    console.log(`\nPrix d'assignation: ${ethers.utils.formatEther(price)} FTM`);

    // Récupérer le propriétaire
    const owner = await flagManager.owner();
    console.log(`Propriétaire du contrat: ${owner}`);

  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
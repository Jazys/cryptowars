async function deployFlag() {
   const { ethers } = require("hardhat");
  // Prix d'assignation initial (0.01 FTM)
  const INITIAL_PRICE = ethers.utils.parseEther("0.01");

  // Déployer le contrat FlagManager
  console.log("Déploiement du contrat FlagManager...");
  const FlagManager = await ethers.getContractFactory("FlagManager");
  const flagManager = await FlagManager.deploy(INITIAL_PRICE);
  await flagManager.deployed();

  console.log("FlagManager déployé à l'adresse:", flagManager.address);

  // Ajouter quelques cryptos par défaut (optionnel)
  console.log("Ajout des cryptos initiales...");
  
  const initialCryptos = [
    { name: "Bitcoin", flagCount: 10 },
    { name: "Ethereum", flagCount: 8 },
    { name: "Fantom", flagCount: 5 }
  ];

  for (const crypto of initialCryptos) {
    const tx = await flagManager.addCrypto(crypto.name, crypto.flagCount);
    await tx.wait();
    console.log(`Crypto ${crypto.name} ajoutée avec ${crypto.flagCount} drapeaux`);
  }

  console.log("Déploiement terminé !");
}

deployFlag()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors du déploiement:", error);
    process.exit(1);
  }); 
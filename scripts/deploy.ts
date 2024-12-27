

async function deploy() {
  const { ethers, upgrades  } = require("hardhat");
   // Déployer le contrat SymbolicLottery
   const SymbolicLottery = await ethers.getContractFactory("SymbolicLottery");
   //const symbolicLottery = await SymbolicLottery.deploy();
   //await symbolicLottery.deployed();
   //console.log("SymbolicLottery déployé à l'adresse:", symbolicLottery.address);
   const proxy = await upgrades.deployProxy(SymbolicLottery, [
    ethers.utils.parseEther("0.01"), // entryFee
    86400,                         // drawInterval
    1,                             // maxBetsPerPlayer
    100                            // maxBets
  ]);
  console.log("Proxy deployed at:", proxy.address);

  const version = await proxy.version();
  console.log("Version du contrat déployé :", version);
  
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors du déploiement:", error);
    process.exit(1);
  });

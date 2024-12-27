

async function upgrade() {

  const { ethers, upgrades } = require("hardhat");

  const proxyAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  // Charger la nouvelle version du contrat
  const SymbolicLotteryV2 = await ethers.getContractFactory("SymbolicLotteryV2");

  // Afficher la version actuelle
  const proxy = await ethers.getContractAt("SymbolicLottery", proxyAddress);
  const currentVersion = await proxy.version();
  console.log("Version actuelle du contrat :", currentVersion);

  // Mettre à jour le contrat avec la nouvelle implémentation
  console.log("Mise à jour du contrat vers SymbolicLotteryV2...");
  const upgradedProxy = await upgrades.upgradeProxy(proxyAddress, SymbolicLotteryV2);
  await upgradedProxy.deployed();

  // Vérifier la version après l'upgrade
  const newVersion = await upgradedProxy.version();
  console.log("Version après mise à jour :", newVersion);
}

upgrade()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

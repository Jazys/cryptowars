async function main() {
  const { ethers, upgrades } = require("hardhat");
  const PROXY_ADDRESS = "0x5854e3ebb827546cefBd85c544f899c9436BAC13";

  // Prix d'assignation initial (0.01 FTM)
  const INITIAL_PRICE = ethers.utils.parseEther("0.01");

  console.log("Deploying FlagManagerV2...");
  const FlagManagerV2 = await ethers.getContractFactory("FlagManagerV2");

  // Afficher la version actuelle
  const proxy = await ethers.getContractAt("FlagManager", PROXY_ADDRESS);
  const currentVersion = await proxy.getVersion();
  console.log("Version actuelle du contrat :", currentVersion);
  
  console.log("Upgrading proxy...");
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, FlagManagerV2, {
    initializer: ['initialize']
  });
  await upgraded.deployed();

  console.log("Proxy upgraded");
  console.log("Implementation deployed to:", await upgrades.erc1967.getImplementationAddress(PROXY_ADDRESS));
  console.log("Initial price:", ethers.utils.formatEther(INITIAL_PRICE), "FTM");

  // Initialiser les cryptos pour V2
  console.log("\nInitialisation des cryptos pour V2...");
  const initialCryptos = [
    { name: "Bitcoin", flagCount: 10 },
    { name: "Ethereum", flagCount: 8 },
    { name: "Fantom", flagCount: 5 }
  ];

  for (const crypto of initialCryptos) {
    const tx = await upgraded.addCrypto(crypto.name, crypto.flagCount);
    await tx.wait();
    console.log(`Crypto ${crypto.name} ajoutée avec ${crypto.flagCount} drapeaux`);
  }

  const newVersion = await upgraded.getVersion();
  console.log("\nNew version:", newVersion);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
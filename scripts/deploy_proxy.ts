

async function deployProxy() {
  const { ethers } = require("hardhat");
  const implementationAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // Adresse de SymbolicLottery

  if (!ethers.utils.isAddress(implementationAddress)) {
    throw new Error("L'adresse de l'implémentation n'est pas valide.");
  }

  // Déployer le contrat ProxyApp
  const ProxyApp = await ethers.getContractFactory("ProxyApp");
  const proxyApp = await ProxyApp.deploy(implementationAddress);

  
  console.log("Adresse d'implémentation :",  await proxyApp.implementation());

  await proxyApp.deployed();
  console.log("ProxyApp déployé à l'adresse:", proxyApp.address);

  // Interagir avec le proxy via l'ABI de SymbolicLottery
  const symbolicLotteryABI = [
    "function initialize() external",
  ];
  const proxyWithSymbolicLottery = new ethers.Contract(
    proxyApp.address,
    symbolicLotteryABI,
    (await ethers.getSigners())[0]
  );

  console.log("Appel de la fonction initialize via le proxy...");
  const tx = await proxyWithSymbolicLottery.initialize({ gasLimit: 500000 });
  await tx.wait();
  console.log("Contrat initialisé via le proxy !");
}

deployProxy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors du déploiement:", error);
    process.exit(1);
  });

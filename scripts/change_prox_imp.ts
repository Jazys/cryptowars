async function changeImplementation() {
  const { ethers } = require("hardhat");
  const proxyAddress = "0xBd30B101E7AE64FC159Af5169c9F6fC6DdD913De"; // Adresse du proxy
  const newImplementationAddress = "0x0DDc04af7BE9CF11Ce98E51F3680497E12a80c24"; // Nouvelle implémentation

  const ProxyAppABI = [
    "function upgrade(address newImplementation) external",
    "function implementation() view returns (address)",
    "function admin() view returns (address)"
  ];

  const SymbolicLotteryABI = [
    "function initialize() external",
  ];

  const signer = (await ethers.getSigners())[0];
  const proxy = new ethers.Contract(proxyAddress, ProxyAppABI, signer);

  // Vérifier l'admin et mettre à jour l'implémentation
  const adminAddress = await proxy.admin();
  if (signer.address.toLowerCase() !== adminAddress.toLowerCase()) {
    throw new Error("Vous n'êtes pas l'admin !");
  }

  const txUpgrade = await proxy.upgrade(newImplementationAddress);
  await txUpgrade.wait();
  console.log("Nouvelle implémentation mise à jour :", await proxy.implementation());

  // Appeler initialize via le proxy
  const proxyWithImplementation = new ethers.Contract(
    proxyAddress,
    SymbolicLotteryABI,
    signer
  );

  console.log("Appel de la fonction initialize...");
  const txInitialize = await proxyWithImplementation.initialize({ gasLimit: 500000 });
  await txInitialize.wait();
  console.log("Contrat initialisé via le proxy !");
}

changeImplementation()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur :", error);
    process.exit(1);
  });

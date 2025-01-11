async function deployContract() {
  const { ethers, upgrades } = require("hardhat");
   
  const FlagManager = await ethers.getContractFactory("FlagManager");
  console.log("Deploying FlagManager...");

  const proxy = await upgrades.deployProxy(FlagManager,  {
    initializer: 'initialize',
  });
  await proxy.deployed();

  console.log("FlagManager proxy deployed to:", proxy.address);
  console.log("Implementation deployed to:", await upgrades.erc1967.getImplementationAddress(proxy.address));
  console.log("Admin proxy deployed to:", await upgrades.erc1967.getAdminAddress(proxy.address));

  // Initialiser les cryptos
  console.log("\nInitialisation des cryptos...");
  const initialCryptos = [
    { name: "Bitcoin", flagCount: 10 },
    { name: "Ethereum", flagCount: 8 },
    { name: "Bera", flagCount: 15 }
  ];
  const cryptos = ['Bitcoin', 'Ethereum', 'Bera'];

  for (const crypto of initialCryptos) {
    const tx = await proxy.addCrypto(crypto.name, crypto.flagCount);
    await tx.wait();
    console.log(`Crypto ${crypto.name} ajoutée avec ${crypto.flagCount} drapeaux`);
  }

  console.log("\nVérification des cryptos après upgrade:");
  for (const crypto of cryptos) {
    const count = await proxy.getCryptoFlagCount(crypto);
    console.log(`${crypto}: ${count.toString()} drapeaux`);

    const crypt = await proxy.getCryptoFlags(crypto);
    console.log(`${crypto}: ${crypt.toString()} drapeaux`);


  }

  const version = await proxy.getVersion();
  console.log("\nContract version:", version);
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("dotenv/config");

const config = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    localhost: {
        url: "http://127.0.0.1:8545",
    },
    base: {
      url: process.env.NEXT_PUBLIC_INFURA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
    fantomTestnet: {
      url: "https://rpc.testnet.fantom.network/",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 4002
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
    tsconfig: "./tsconfig.hardhat.json",
  },
};

module.exports = config;

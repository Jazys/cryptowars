import { cryptoIcons, networkIcons } from '@/lib/iconMapping'

export const cryptoLocations = [
  { id: 'Bitcoin', name: 'Bitcoin', x: 25, y: 10, flagCount: 10 },
  { id: 'Ethereum', name: 'Ethereum', x: 75, y: 30, flagCount: 8 },
  { id: 'Fantom', name: 'Fantom', x: 50, y: 70, flagCount: 5 }
]

export const allFlags = [
  { code: 'fr', type: 'European' },
  { code: 'us', type: 'North American' },
  { code: 'gb', type: 'European' },
  { code: 'de', type: 'European' },
  { code: 'jp', type: 'Asian' },
  { code: 'cn', type: 'Asian' },
  { code: 'kr', type: 'Asian' },
  { code: 'in', type: 'Asian' },
  { code: 'ca', type: 'North American' },
  { code: 'au', type: 'Oceanian' },
  { code: 'br', type: 'South American' },
  { code: 'ru', type: 'European' },
  { code: 'za', type: 'African' },
  { code: 'eg', type: 'African' },
  { code: 'ng', type: 'African' },
  { code: 'mx', type: 'North American' },
  { code: 'ar', type: 'South American' },
  { code: 'sa', type: 'Asian' },
  { code: 'tr', type: 'European' },
  { code: 'id', type: 'Asian' },
]

export const AVAILABLE_CRYPTOS_CFG = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    primaryIcon: cryptoIcons.bitcoin.primary,
    fallbackIcon: cryptoIcons.bitcoin.fallback,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    primaryIcon: cryptoIcons.ethereum.primary,
    fallbackIcon: cryptoIcons.ethereum.fallback,
  },
  {
    name: 'Fantom',
    symbol: 'FTM',
    primaryIcon: cryptoIcons.fantom.primary,
    fallbackIcon: cryptoIcons.fantom.fallback,
  }
]

export const NETWORKS_CFG = [
  {
    name: 'Fantom Testnet',
    chainId: '0xfa2',
    rpc: 'https://rpc.testnet.fantom.network/',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    icon: networkIcons.fantom,
    available: false,
  },
  {
    name: 'Base Testnet',
    chainId: '0x14a33',
    rpc: 'https://goerli.base.org',
    contractAddress: process.env.NEXT_PUBLIC_BASE_TESTNET_CONTRACT,
    icon: networkIcons.base,
    available: false,
  },
  {
    name: 'Base Mainnet',
    chainId: '0x2105',
    rpc: 'https://mainnet.base.org',
    contractAddress: process.env.NEXT_PUBLIC_BASE_MAINNET_CONTRACT,
    icon: networkIcons.base,
    available: false,
  },
  {
    name: 'Sonic Testnet',
    chainId: '0xdede',
    rpc: 'https://rpc.blaze.soniclabs.com',
    contractAddress: process.env.NEXT_PUBLIC_SONIC_TESTNET_CONTRACT,
    icon: networkIcons.sonic,
    available: true,
  }
]

export const TRANSACTION_AMOUNT = "0.1" // Montant en FTM
export const REFRESH_INTERVAL = 10000 // 10 secondes en millisecondes 
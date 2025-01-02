"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MapCrypto from './MapCrypto'
import CryptoIcon from './CryptoIcon'
import FlagGrid from './FlagGrid'
import DominantCountry from './DominantCountry'
import WalletConnect from './WalletConnect'
import { useContract } from '@/hooks/useContract'
import WinnerInfo from './WinnerInfo'
import ClaimButton from './ClaimButton'
import { cryptoIcons, networkIcons } from '@/lib/iconMapping'
import GuildBanner from './GuildBanner'

const cryptoLocations = [
  { id: 'Bitcoin', name: 'Bitcoin', x: 25, y: 30, flagCount: 10 },
  { id: 'Ethereum', name: 'Ethereum', x: 75, y: 30, flagCount: 8 },
  { id: 'Fantom', name: 'Fantom', x: 50, y: 70, flagCount: 5 }
]

const allFlags = [
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

// Adresse du destinataire des transactions
const RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const TRANSACTION_AMOUNT = "0.1" // Montant en FTM

console.log("RECIPIENT_ADDRESS", RECIPIENT_ADDRESS);
interface GameProps {
  params: {
    network?: string;
    rpc?: string;
    contract?: string;
  }
}

// Configuration centralisée des cryptos disponibles dans le jeu
export const AVAILABLE_CRYPTOS = [
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

// Configuration des réseaux disponibles
export const NETWORKS = [
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

export default function Game({ params }: GameProps) {
  const [placedFlags, setPlacedFlags] = useState<Record<string, string[]>>({})
  const [selectedFlag, setSelectedFlag] = useState('')
  const [expandedCrypto, setExpandedCrypto] = useState<string | null>(null)
  const [dominantCountry, setDominantCountry] = useState<string>('')
  const mapRef = useRef<HTMLDivElement>(null)
  const [browserLanguage, setBrowserLanguage] = useState('')
  const [transactionPending, setTransactionPending] = useState(false)
  const [transactionError, setTransactionError] = useState<string>('')
  const { assignFlag, getCryptoFlags, isReady, contractInfo } = useContract()
  const [contractFlags, setContractFlags] = useState<Record<string, any[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const loadingRef = useRef(false)
  const [lastUpdate, setLastUpdate] = useState<number>(0)
  const REFRESH_INTERVAL = 10000 // 10 secondes en millisecondes

  useEffect(() => {
    const lang = navigator.language.toLowerCase()
    const countryCode = lang.split('-')[0]
    setBrowserLanguage(countryCode)
    const matchingFlag = allFlags.find(flag => flag.code === countryCode)
    if (matchingFlag) {
      setSelectedFlag(matchingFlag.code)
    }
  }, [])

  const loadFlags = useCallback(async () => {
    // Vérifier si assez de temps s'est écoulé depuis la dernière mise à jour
    const now = Date.now()
    if (now - lastUpdate < REFRESH_INTERVAL) {
      return;
    }

    if (loadingRef.current || !isReady) return;
    
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const flags: Record<string, any[]> = {};
      
      for (const crypto of cryptoLocations) {
        try {
          const cryptoFlags = await getCryptoFlags(crypto.id);
          flags[crypto.id] = cryptoFlags;
        } catch (err) {
          console.error(`Erreur pour ${crypto.id}:`, err);
          flags[crypto.id] = Array(crypto.flagCount).fill({ isAssigned: false, countryCode: '' });
        }
      }

      const newPlacedFlags: Record<string, string[]> = {};
      for (const [cryptoId, cryptoFlags] of Object.entries(flags)) {
        newPlacedFlags[cryptoId] = Array.isArray(cryptoFlags) 
          ? cryptoFlags.map(flag => flag?.isAssigned ? flag.countryCode : '')
          : Array(cryptoLocations.find(c => c.id === cryptoId)?.flagCount || 0).fill('');
      }

      setContractFlags(flags);
      setPlacedFlags(newPlacedFlags);
      setLastUpdate(now); // Mettre à jour le timestamp
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [isReady, getCryptoFlags, lastUpdate, REFRESH_INTERVAL]);

  // Chargement initial
  useEffect(() => {
    loadFlags();
  }, [loadFlags]);

  // Rafraîchissement périodique
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      loadFlags();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isReady, loadFlags]);

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask n'est pas installé")
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      
      // Vérifier que l'utilisateur est connecté
      const accounts = await provider.listAccounts()
      if (accounts.length === 0) {
        throw new Error("Veuillez vous connecter à MetaMask")
      }

      // Créer la transaction
      const tx = {
        to: RECIPIENT_ADDRESS,
        value: ethers.utils.parseEther(TRANSACTION_AMOUNT),
      }

      setTransactionPending(true)
      setTransactionError('')

      // Envoyer la transaction
      const transaction = await signer.sendTransaction(tx)
      
      // Attendre la confirmation
      await transaction.wait()
      
      setTransactionPending(false)
      return true
    } catch (error: any) {
      console.error("Erreur lors de la transaction:", error)
      setTransactionError(error.message)
      setTransactionPending(false)
      return false
    }
  }

  const handleFlagClick = useCallback(async (cryptoId: string, index: number) => {
    if (selectedFlag && !transactionPending) {
      try {
        setTransactionPending(true);
        setTransactionError('');

        // Appeler la fonction du contrat pour assigner le drapeau
        const tx = await assignFlag(cryptoId, index, selectedFlag);
        if (!tx) throw new Error("Transaction failed");
        
        // Mettre à jour l'état local immédiatement
        setPlacedFlags(prev => {
          const newFlags = { ...prev };
          if (!newFlags[cryptoId]) {
            newFlags[cryptoId] = Array(cryptoLocations.find(c => c.id === cryptoId)?.flagCount || 0).fill('');
          }
          newFlags[cryptoId][index] = selectedFlag;
          return newFlags;
        });

        // Recharger les données du contrat
        await loadFlags();

       
        setTransactionPending(false);
      } catch (error: any) {
        console.error("Error in handleFlagClick:", error);
        setTransactionError(error.message);
        setTransactionPending(false);

        // Recharger les drapeaux en cas d'erreur pour s'assurer de la synchronisation
        await loadFlags();
      }
    }
  }, [selectedFlag, transactionPending, assignFlag, loadFlags]);

  const handleFlagSelect = useCallback((flagCode: string) => {
    setSelectedFlag(flagCode)
  }, [])

  const handleCryptoClick = useCallback((cryptoId: string) => {
    setExpandedCrypto(prev => prev === cryptoId ? null : cryptoId)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setExpandedCrypto(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getRepresentativeFlagForCrypto = useCallback((cryptoId: string) => {
    const cryptoFlags = contractFlags[cryptoId] || [];
    const assignedFlags = cryptoFlags
      .filter(flag => flag?.isAssigned)
      .map(flag => flag.countryCode.toLowerCase());

    if (assignedFlags.length === 0) return '';

    const flagCounts = assignedFlags.reduce((acc, flag) => {
      acc[flag] = (acc[flag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let dominantFlag = '';
    let maxCount = 0;

    (Object.entries(flagCounts) as [string, number][]).forEach(([flag, count]) => {
      if (count > maxCount) {
        dominantFlag = flag;
        maxCount = count;
      }
    });

    return dominantFlag;
  }, [contractFlags]);

  const calculateDominantCountry = useCallback(() => {
    // Récupérer tous les drapeaux assignés depuis contractFlags
    const allFlags = Object.values(contractFlags).flatMap(cryptoFlags => 
      cryptoFlags
        .filter(flag => flag?.isAssigned)
        .map(flag => flag.countryCode.toLowerCase())
    );

    // Compter les occurrences de chaque drapeau
    const flagCounts: Record<string, number> = allFlags.reduce((acc, flag) => {
      if (flag) {
        acc[flag] = (acc[flag] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Trouver le drapeau le plus fréquent
    let dominantFlag = '';
    let maxCount = 0;

    (Object.entries(flagCounts) as [string, number][]).forEach(([flag, count]) => {
      if (count > maxCount) {
        dominantFlag = flag;
        maxCount = count;
      }
    });

    return dominantFlag;
  }, [contractFlags]);

  // Mettre à jour le pays dominant quand les drapeaux changent
  useEffect(() => {
    const dominant = calculateDominantCountry();
    if (dominant) {
      setDominantCountry(dominant);
    }
  }, [contractFlags, calculateDominantCountry]);

  // Afficher les informations du contrat
  const renderContractInfo = () => {
    if (!contractInfo) return null;

    return (
      <div className="absolute top-20 right-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Informations du contrat</h3>
        <div className="text-sm space-y-1">
          <p>Prix d'assignation: {contractInfo.assignmentPrice} FTM</p>
          <div className="space-y-1">
            {Object.entries(contractInfo.flagCounts).map(([crypto, count]) => (
              <p key={crypto}>{crypto}: {count} drapeaux</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="relative w-full h-[calc(100vh-2rem)] overflow-hidden">
      <MapCrypto />
      <div className="absolute top-4 right-4 z-10 flex gap-4">
        <DominantCountry country={dominantCountry} />       
        <WalletConnect />
        <GuildBanner />
      </div>
      
     {/* {renderContractInfo()} */}
      
      {/* Afficher l'erreur de transaction si elle existe */}
      {transactionError && (
        <div className="absolute top-16 right-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {transactionError}
        </div>
      )}
      
      {/* Afficher l'indicateur de transaction en cours */}
      {transactionPending && (
        <div className="absolute top-16 right-4 z-10 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded">
          Transaction en cours...
        </div>
      )}

      <Select 
        value={selectedFlag} 
        onValueChange={handleFlagSelect}
      >
        <SelectTrigger className="absolute top-4 left-4 z-10 w-[200px] bg-white/90 backdrop-blur-sm text-primary border-primary">
          <SelectValue placeholder="Select a flag" />
        </SelectTrigger>
        <SelectContent className="bg-white/90 backdrop-blur-sm border-primary">
          {allFlags.map((flag) => (
            <SelectItem 
              key={flag.code} 
              value={flag.code}
              className="text-primary hover:bg-primary/10"
            >
              <div className="flex items-center gap-2">
                <img
                  src={`https://flagcdn.com/w20/${flag.code}.png`}
                  srcSet={`https://flagcdn.com/w40/${flag.code}.png 2x`}
                  width="20"
                  height="14"
                  alt={`Flag of ${flag.code.toUpperCase()}`}
                  className="rounded-sm"
                />
                <span>{flag.type} - {flag.code.toUpperCase()}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {cryptoLocations.map(crypto => {
        const cryptoFlags = placedFlags[crypto.id] || [];
        const contractCryptoFlags = contractFlags[crypto.id] || [];
        const representativeFlag = getRepresentativeFlagForCrypto(crypto.id);
        
        return (
          <div 
            key={crypto.id} 
            className="absolute" 
            style={{ 
              left: `${crypto.x}%`, 
              top: `${crypto.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: expandedCrypto === crypto.id ? 10 : 1
            }}
          >
            <CryptoIcon 
              name={crypto.name} 
              onClick={() => handleCryptoClick(crypto.id)}
              representativeFlag={representativeFlag}
            />
            {expandedCrypto === crypto.id && (
              <FlagGrid
                flags={cryptoFlags}
                onFlagClick={(index) => handleFlagClick(crypto.id, index)}
                totalFlags={crypto.flagCount}
                selectedFlag={selectedFlag}
                disabled={transactionPending}
                contractFlags={contractCryptoFlags}
              />
            )}
          </div>
        );
      })}
      <div className="absolute bottom-4 right-4 flex items-center">
        <WinnerInfo />
        <ClaimButton />
      </div>
    </Card>
  )
}


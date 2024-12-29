import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import FlagManagerABI from "../../artifacts/contracts/FlagManager.sol/FlagManager.json";

const CONTRACT_ADDRESS =  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

export function useContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [contractInfo, setContractInfo] = useState<{
    flagCounts: Record<string, number>;
    assignmentPrice: string;
    owner: string;
  } | null>(null)

  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum) {
        console.log("No ethereum object found");
        setIsReady(true); // Mettre à true même si pas de MetaMask
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          FlagManagerABI.abi,
          signer
        )
        setContract(contract)
        setSigner(signer)

        // Vérifier le contrat immédiatement
        await verifyContract(contract)
        
        setIsReady(true)
      } catch (error) {
        console.error("Error initializing contract:", error)
        setIsReady(true) // Mettre à true même en cas d'erreur
      }
    }

    initContract()
  }, [])

  const verifyContract = async (contractInstance: ethers.Contract | null = contract) => {
    if (!contractInstance) throw new Error("Contract not initialized")
    
    try {
      const cryptos = ['Bitcoin', 'Ethereum', 'Fantom']
      const flagCounts: Record<string, number> = {}
      
      // Récupérer les informations pour chaque crypto
      for (const crypto of cryptos) {
        const count = await contractInstance.getCryptoFlagCount(crypto)
        flagCounts[crypto] = count.toNumber()
      }
      
      // Récupérer le prix d'assignation
      const price = await contractInstance.assignmentPrice()
      
      // Récupérer le propriétaire
      const owner = "";

      const info = {
        flagCounts,
        assignmentPrice: ethers.utils.formatEther(price),
        owner
      }
      
      setContractInfo(info)


      const versionContract = await contractInstance.getVersion();
      console.log("\nCurrent version:", versionContract);
      return info
    } catch (error) {
      console.error("Erreur lors de la vérification du contrat:", error)
      return null
    }
  }

  const assignFlag = async (cryptoId: string, flagIndex: number, countryCode: string) => {
    if (!contract) throw new Error("Contract not initialized")
    if (!contractInfo) throw new Error("Contract info not loaded")
    
    try {
      const tx = await contract.assignFlag(
        cryptoId,
        flagIndex,
        countryCode,
        {
          value: ethers.utils.parseEther(contractInfo.assignmentPrice)
        }
      )
      await tx.wait()
      return true
    } catch (error) {
      console.error("Error assigning flag:", error)
      throw error
    }
  }

  const getCryptoFlags = async (cryptoId: string) => {
    if (!contract) throw new Error("Contract not initialized")
    
    try {
        console.log("getCryptoFlags", cryptoId);
      const flags = await contract.getCryptoFlags(cryptoId)
      return flags
    } catch (error) {
      console.error("Error getting flags:", error)
      throw error
    }
  }

  return {
    contract,
    signer,
    assignFlag,
    getCryptoFlags,
    isReady,
    verifyContract,
    contractInfo
  }
} 
"use client"

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import FlagManagerABI from "../../artifacts/contracts/FlagManager.sol/FlagManager.json"
import { useSearchParams } from 'next/navigation'

export function useContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [contractInfo, setContractInfo] = useState<{
    flagCounts: Record<string, number>;
    assignmentPrice: string;
    owner: string;
  } | null>(null)

  const searchParams = useSearchParams()
  const networkId = searchParams.get('network')
  const rpcUrl = searchParams.get('rpc')
  const contractAddress = searchParams.get('contract')

  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum || !networkId || !rpcUrl || !contractAddress) {
        console.log("Missing required parameters");
        setIsReady(true);
        return;
      }

      try {
        // Demander à MetaMask de changer de réseau
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkId }],
        }).catch(async (switchError: any) => {
          // Si le réseau n'existe pas, l'ajouter
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: networkId,
                rpcUrls: [rpcUrl],
                chainName: 'Custom Network',
                nativeCurrency: {
                  name: 'Native Token',
                  symbol: 'ETH',
                  decimals: 18
                }
              }],
            })
          }
        })

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          contractAddress,
          FlagManagerABI.abi,
          signer
        )

        setProvider(provider)
        setContract(contract)
        setSigner(signer)

        await verifyContract(contract)
        setIsReady(true)
      } catch (error) {
        console.error("Error initializing contract:", error)
        setIsReady(true)
      }
    }

    initContract()
  }, [networkId, rpcUrl, contractAddress])

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
    provider,
    assignFlag,
    getCryptoFlags,
    isReady,
    verifyContract,
    contractInfo
  }
} 
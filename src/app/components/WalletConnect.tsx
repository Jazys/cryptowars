"use client"

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'

const ABI = [
  "function getCryptoFlags(string) public view returns (tuple(bool isAssigned, string countryCode)[])",
  "function getWinner() external view returns (tuple(string countryCode, address winnerAddress, uint256 flagCount, bool hasClaimed))"
]

export default function WalletConnect() {
  const [address, setAddress] = useState('')
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
  const networkId = searchParams.get('network')
  const rpcUrl = searchParams.get('rpc')

  const checkConnection = async () => {
    if (!window.ethereum || !networkId) return;

    try {
      const savedAddress = localStorage.getItem('walletAddress')
      if (savedAddress) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.includes(savedAddress)) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
          const network = await web3Provider.getNetwork()
          
          if (network.chainId === parseInt(networkId, 16)) {
            setProvider(web3Provider)
            setAddress(savedAddress)
          }
        } else {
          localStorage.removeItem('walletAddress')
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la connexion:", error)
    }
  }

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress('')
          setProvider(null)
          localStorage.removeItem('walletAddress')
        } else {
          setAddress(accounts[0])
          localStorage.setItem('walletAddress', accounts[0])
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [networkId])

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask n'est pas installé")
      return
    }

    try {
      setError('')
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkId }],
      }).catch(async (switchError: any) => {
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

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(web3Provider)
      setAddress(accounts[0])
      localStorage.setItem('walletAddress', accounts[0])
    } catch (error) {
      setError("Erreur de connexion")
    }
  }

  return (
    <Card className="p-4 space-y-4">
      {!address ? (
        <Button onClick={connectWallet} variant="outline">
          Connecter MetaMask
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm">
            Connecté: {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </p>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </Card>
  )
} 
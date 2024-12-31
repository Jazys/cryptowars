"use client"

import { useState, useEffect } from 'react'
import { useContract } from '@/hooks/useContract'
import { ethers } from 'ethers'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ABI = [
  "function getWinner() external view returns (tuple(string countryCode, address winnerAddress, uint256 flagCount, bool hasClaimed))"
]

export default function WinnerInfo() {
  const [lastWinner, setLastWinner] = useState<string>('')
  const { provider } = useContract()

  const fetchLastWinner = async () => {
    if (!provider || !CONTRACT_ADDRESS) return;
    
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const winner = await contract.getWinner();
      
      // Vérifier si l'adresse est valide avant de la définir
      if (winner && 
          winner.winnerAddress && 
          ethers.utils.isAddress(winner.winnerAddress) && 
          winner.winnerAddress !== ethers.constants.AddressZero) {
        setLastWinner(winner.winnerAddress);
      }
    } catch (error: any) {
      // Si l'erreur est due à l'absence de gagnant, on ne fait rien
      if (error?.code === 'CALL_EXCEPTION') {
        console.log("Pas encore de gagnant");
        return;
      }
      console.error("Erreur détaillée lors de la récupération du dernier gagnant:", error);
    }
  };

  useEffect(() => {
    if (provider) {
      fetchLastWinner();
    }
  }, [provider]);

  if (!lastWinner) return null;

  return (
    <div className="flex items-center bg-black/50 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-gray-700/50">
        <p className="text-sm text-white">
          Dernier gagnant: {`${lastWinner.slice(0, 6)}...${lastWinner.slice(-4)}`}
        </p>
      </div>
    </div>
  );
} 
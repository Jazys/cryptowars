"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useContract } from '@/hooks/useContract'
import { ethers } from 'ethers'

export default function ClaimButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [canClaim, setCanClaim] = useState(false)
  const { contract } = useContract()

  useEffect(() => {
    const checkCanClaim = async () => {
      if (!contract) return;
      
      try {
        const winner = await contract.getWinner();
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const currentAddress = accounts[0];
        
        setCanClaim(
          winner && 
          winner.winnerAddress && 
          winner.winnerAddress.toLowerCase() === currentAddress.toLowerCase() && 
          !winner.hasClaimed
        );
      } catch (err) {
        console.error("Error checking claim status:", err);
        setCanClaim(false);
      }
    };

    checkCanClaim();
  }, [contract]);

  const handleClaim = async () => {
    if (!contract || !canClaim) return;
    
    try {
      setIsLoading(true);
      setError('');

      const tx = await contract.claimPrize();
      await tx.wait();

      setCanClaim(false);
      alert("Prix réclamé avec succès !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClaim}
      disabled={!canClaim || isLoading}
      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-r-lg rounded-l-none transition-colors"
    >
      {isLoading ? "Claiming..." : "Claim price"}
    </Button>
  );
} 
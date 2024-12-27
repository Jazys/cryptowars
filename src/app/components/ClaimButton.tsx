"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useContract } from '@/hooks/useContract'
import { ethers } from 'ethers'

export default function ClaimButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { contract } = useContract()

  const handleClaim = async () => {
    if (!contract) return
    
    try {
      setIsLoading(true)
      setError('')

      const tx = await contract.claimPrize()
      await tx.wait()

      // Afficher un message de succès
      alert("Prix réclamé avec succès !")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <Button 
        onClick={handleClaim}
        disabled={isLoading}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
      >
        {isLoading ? "Claiming..." : "Claim price"}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
} 
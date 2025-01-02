"use client"

import { useSearchParams } from 'next/navigation'
import Game from '../components/Game'
import { useEffect, useState } from 'react'
import GuildBanner from '../components/GuildBanner'

export default function GamePage() {
  const searchParams = useSearchParams()
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const network = searchParams.get('network')
    const rpc = searchParams.get('rpc')
    const contract = searchParams.get('contract')

    if (network && rpc && contract) {
      // Stocker les paramètres dans le localStorage pour une utilisation ultérieure
      localStorage.setItem('selectedNetwork', JSON.stringify({
        chainId: network,
        rpc,
        contractAddress: contract
      }))
      setIsValid(true)
    }
  }, [searchParams])

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Invalid network parameters</p>
      </div>
    )
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-4">
        <Game params={{
          network: undefined,
          rpc: undefined,
          contract: undefined
        }} />
      </main>
    </>
  )
} 
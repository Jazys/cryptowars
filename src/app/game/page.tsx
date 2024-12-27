"use client"

import Game from '../components/Game'
import Countdown from '../components/Countdown'
import ClaimButton from '../components/ClaimButton'

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Countdown />
      </div>
      <Game flagsPerCrypto={12} />
      <ClaimButton />
    </main>
  )
} 
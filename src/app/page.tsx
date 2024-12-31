import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import NetworkSelector from './components/NetworkSelector'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600">
          Crypto Wars
        </h1>
        
        <div className="relative w-[800px] h-[400px] rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="/crypto-wars.webp"
            alt="Crypto Wars"
            fill
            className="object-cover"
            priority
          />
        </div>

        <NetworkSelector />
      </div>
    </main>
  )
}


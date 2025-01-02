"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GameRules from './GameRules'
import { NETWORKS } from './Game'

interface Network {
  name: string;
  chainId: string;
  rpc: string;
  contractAddress: string | undefined;
  icon: string;
  available: boolean;
}

export default function NetworkSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [showRules, setShowRules] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const router = useRouter()

  const handlePlay = () => {
    if (!selectedNetwork) return;
    
    const network = NETWORKS.find(n => n.name === selectedNetwork);
    if (!network) return;

    setShowRules(true);
  }

  const handleCloseRules = () => {
    setShowRules(false);
  }

  const selectedNetworkParams = selectedNetwork ? {
    network: NETWORKS.find(n => n.name === selectedNetwork)?.chainId || '',
    rpc: NETWORKS.find(n => n.name === selectedNetwork)?.rpc || '',
    contract: NETWORKS.find(n => n.name === selectedNetwork)?.contractAddress || ''
  } : null;

  return (
    <>
      <Card className="p-8 space-y-6 max-w-md mx-auto bg-white/10 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-white">
          Select Network
        </h2>
        
        <div className="space-y-4">
          <Select
            value={selectedNetwork}
            onValueChange={(value) => {
              const network = NETWORKS.find(n => n.name === value);
              if (network?.available) {
                setSelectedNetwork(value);
              } else {
                setShowComingSoon(true);
              }
            }}
          >
            <SelectTrigger className="w-full bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Choose a network" />
            </SelectTrigger>
            <SelectContent>
              {NETWORKS.map((network) => (
                <SelectItem 
                  key={network.chainId} 
                  value={network.name}
                  disabled={!network.available}
                  className={!network.available ? 
                    'opacity-50 cursor-not-allowed bg-gray-100' : 
                    'cursor-pointer'
                  }
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={network.icon}
                      alt={network.name}
                      className={`w-6 h-6 ${!network.available ? 'grayscale' : ''}`}
                      loading="lazy"
                    />
                    <span className={!network.available ? 'text-gray-400' : ''}>
                      {network.name}
                      {!network.available && ' (Coming soon)'}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handlePlay}
            disabled={!selectedNetwork}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
          >
            Play
          </Button>
        </div>
      </Card>

      {showRules && selectedNetworkParams && (
        <GameRules 
          networkParams={selectedNetworkParams}
          onClose={handleCloseRules}
        />
      )}
    </>
  )
} 
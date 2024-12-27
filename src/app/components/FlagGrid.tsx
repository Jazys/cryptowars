import { Card } from "@/components/ui/card"
import Flag from './Flag'

interface FlagGridProps {
  flags: string[]
  onFlagClick: (index: number) => void
  totalFlags: number
  selectedFlag: string
  disabled?: boolean
  contractFlags?: any[]
}

export default function FlagGrid({ 
  flags, 
  onFlagClick, 
  totalFlags, 
  selectedFlag, 
  disabled,
  contractFlags = []
}: FlagGridProps) {
  const columns = Math.ceil(Math.sqrt(totalFlags))

  return (
    <Card 
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex flex-wrap gap-2 bg-white/90 p-2 rounded-lg justify-center shadow-lg"
      style={{ 
        width: `${columns * 40 + (columns - 1) * 8 + 16}px`,
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? 'none' : 'auto'
      }}
    >
      {Array.from({ length: totalFlags }, (_, i) => {
        const contractFlag = contractFlags[i] || {}
        return (
          <Flag
            key={i}
            country={flags[i] || ''}
            onClick={() => onFlagClick(i)}
            selectedFlag={selectedFlag}
            disabled={disabled}
            owner={contractFlag.owner}
            lastUpdateTime={contractFlag.lastUpdateTime}
          />
        )
      })}
    </Card>
  )
}


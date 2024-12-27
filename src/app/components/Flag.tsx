"use client"

import { Button } from "@/components/ui/button"

interface FlagProps {
  country: string
  onClick: () => void
  selectedFlag: string
  disabled?: boolean
  owner: any
  lastUpdateTime: any
}

export default function Flag({ country, onClick, selectedFlag, disabled, owner, lastUpdateTime }: FlagProps) {
  const isPlaceholder = !country

  return (
    <Button
      variant="outline"
      size="icon"
      className={`w-8 h-8 p-0 rounded-full overflow-hidden ${
        isPlaceholder ? 'bg-gray-100 hover:bg-gray-200' : ''
      }`}
      onClick={onClick}
    >
      {isPlaceholder ? (
        <span className="text-xs">{selectedFlag ? '+' : '?'}</span>
      ) : (
        <img
          src={`https://flagcdn.com/w40/${country}.png`}
          srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
          width="40"
          height="40"
          alt={`Flag of ${country}`}
          className="object-cover w-full h-full"
        />
      )}
    </Button>
  )
}


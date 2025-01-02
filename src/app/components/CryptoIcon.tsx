import { AVAILABLE_CRYPTOS } from './Game'

interface CryptoIconProps {
  name: string
  onClick: () => void
  representativeFlag?: string
  size?: number
}

export default function CryptoIcon({ name, onClick, representativeFlag, size = 40 }: CryptoIconProps) {
  const crypto = AVAILABLE_CRYPTOS.find(c => c.name === name)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement
    if (crypto && img.src !== crypto.fallbackIcon) {
      img.src = crypto.fallbackIcon
    }
  }

  if (!crypto) return null

  return (
    <div className="relative cursor-pointer group">
      {representativeFlag && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white rounded-full p-1 shadow-md">
            <img
              src={`https://flagcdn.com/w20/${representativeFlag.toLowerCase()}.png`}
              alt={`Flag of ${representativeFlag}`}
              width="20"
              height="14"
              className="rounded-sm"
            />
          </div>
        </div>
      )}
      
      <div 
        onClick={onClick}
        className="relative bg-white rounded-full p-2 shadow-lg transition-transform transform group-hover:scale-110"
      >
        <div className="relative w-[40px] h-[40px]">
          <img
            src={crypto.primaryIcon}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  )
}


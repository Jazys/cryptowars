import Image from 'next/image'

interface CryptoIconProps {
  name: string
  onClick: () => void
  representativeFlag?: string
  size?: number
}

const cryptoToSymbol: Record<string, string> = {
  'Bitcoin': 'btc',
  'Ethereum': 'eth',
  'Fantom': 'ftm'
}

export default function CryptoIcon({ name, onClick, representativeFlag, size = 40 }: CryptoIconProps) {
  const symbol = cryptoToSymbol[name] || name.toLowerCase()
  const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol}.png`
  
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
            src={iconUrl}
            alt={name}
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  )
}


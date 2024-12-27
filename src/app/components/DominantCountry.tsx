import { Card } from "@/components/ui/card"

interface DominantCountryProps {
  country: string
}

export default function DominantCountry({ country }: DominantCountryProps) {
  if (!country) return null

  return (
    <Card className="p-2 flex items-center">
      <span className="mr-2 text-sm font-semibold">Dominant Country:</span>
      <img
        src={`https://flagcdn.com/w40/${country}.png`}
        srcSet={`https://flagcdn.com/w80/${country}.png 2x`}
        width="30"
        height="20"
        alt={`Flag of ${country}`}
        className="rounded-sm"
      />
    </Card>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import LootGrid from "./LootGrid"

interface LootItem {
  id: string
  name: string
  image: string
}

interface Location {
  title: string
  description: string
  thumbnail: string
  possibleLoot: LootItem[]
}

interface LocationCardProps {
  location: Location
  onClose: () => void
}

export default function LocationCard({ location, onClose }: LocationCardProps) {
  return (
    <Card className="absolute left-4 bottom-4 w-80 bg-slate-900 border-slate-800 text-slate-100">
      <CardHeader className="relative pb-2">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="text-lg font-medium">{location.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <Image src={location.thumbnail} alt={location.title} fill className="object-cover" />
        </div>
        <p className="text-sm text-slate-400">{location.description}</p>
        <LootGrid loot={location.possibleLoot} />
      </CardContent>
    </Card>
  )
}

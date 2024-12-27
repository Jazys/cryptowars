import Image from "next/image"

interface LootItem {
  id: string
  name: string
  image: string
}

interface LootGridProps {
  loot: LootItem[]
}

export default function LootGrid({ loot }: LootGridProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Possible loot</h3>
      <div className="grid grid-cols-3 gap-2">
        {loot.map((item) => (
          <div
            key={item.id}
            className="relative aspect-square rounded border border-slate-700 bg-slate-800 p-1"
          >
            <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  )
}

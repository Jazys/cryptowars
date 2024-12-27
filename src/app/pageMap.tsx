"use client"

import { useState } from "react"
import Map from "./components/Map"
import LocationCard from "./components/LocationCard"

interface LootItem {
  id: string
  name: string
  image: string
}

interface Location {
  id: string
  x: number
  y: number
  title: string
  type: string
  description: string
  thumbnail: string
  connections: {
    in: string
    to: string
    color: string
  }[]
  possibleLoot: LootItem[]
}

const locations: Location[] = [
  { 
    id: "1", 
    x: 100, 
    y: 100,
    type: "location",
    title: "Pinecrest Grove Construction Site",
    description: "Tools and safety gear are left as they were, hastily discarded by workers fleeing the scene.",
    thumbnail: "/placeholder.svg?height=200&width=200",
    connections: [
      { in: "1", to: "2", color: "stroke-pink-500" },
      { in: "1", to: "3", color: "stroke-orange-400" }
    ],
    possibleLoot: [
      { id: "1", name: "Hammer", image: "/placeholder.svg?height=50&width=50" },
      { id: "2", name: "Safety Helmet", image: "/placeholder.svg?height=50&width=50" },
      { id: "3", name: "Toolbox", image: "/placeholder.svg?height=50&width=50" },
      { id: "4", name: "Gloves", image: "/placeholder.svg?height=50&width=50" },
      { id: "5", name: "Flashlight", image: "/placeholder.svg?height=50&width=50" },
      { id: "6", name: "First Aid Kit", image: "/placeholder.svg?height=50&width=50" },
    ]
  },
  { 
    id: "2", 
    x: 250, 
    y: 150,
    title: "Abandoned Warehouse",
    type: "building",
    description: "A large, eerie structure with broken windows and rusted machinery inside.",
    thumbnail: "/placeholder.svg?height=200&width=200",
    connections: [
      { in: "2", to: "1", color: "stroke-pink-500" },
      { in: "2", to: "3", color: "stroke-yellow-400" }
    ],
    possibleLoot: [
      { id: "7", name: "Rusty Key", image: "/placeholder.svg?height=50&width=50" },
      { id: "8", name: "Old Document", image: "/placeholder.svg?height=50&width=50" },
      { id: "9", name: "Broken Radio", image: "/placeholder.svg?height=50&width=50" },
    ]
  },
  { 
    id: "3", 
    x: 400, 
    y: 80,
    title: "Overgrown Park",
    type: "home",
    description: "Once a bustling community park, now reclaimed by nature with overgrown vegetation.",
    thumbnail: "/placeholder.svg?height=200&width=200",
    connections: [
      { in: "3", to: "1", color: "stroke-orange-400" },
      { in: "3", to: "2", color: "stroke-yellow-400" }
    ],
    possibleLoot: [
      { id: "10", name: "Wild Berries", image: "/placeholder.svg?height=50&width=50" },
      { id: "11", name: "Rusty Playground Part", image: "/placeholder.svg?height=50&width=50" },
      { id: "12", name: "Old Coin", image: "/placeholder.svg?height=50&width=50" },
    ]
  },
]

export default function Component() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const selectedLocation = locations.find((loc) => loc.id === selectedNode)

  return (
    <div className="w-full h-[600px] bg-slate-900 relative overflow-hidden rounded-lg">
      <Map
        locations={locations}
        selectedNode={selectedNode}
        onNodeClick={setSelectedNode}
      />
      {selectedLocation && (
        <LocationCard
          location={selectedLocation}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}

"use client"

import { useState } from 'react'

interface FlagTypeInputProps {
  onFlagTypeChange: (flagType: string) => void
}

export default function FlagTypeInput({ onFlagTypeChange }: FlagTypeInputProps) {
  const [flagType, setFlagType] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFlagTypeChange(flagType)
  }

  return (
    <form onSubmit={handleSubmit} className="absolute top-4 left-4 z-10">
      <input
        type="text"
        value={flagType}
        onChange={(e) => setFlagType(e.target.value)}
        placeholder="Enter flag type"
        className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Filter
      </button>
    </form>
  )
}


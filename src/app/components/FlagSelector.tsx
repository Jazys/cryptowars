"use client"

import { useState } from 'react'

interface FlagSelectorProps {
  flags: { code: string; type: string }[]
  onFlagSelect: (flagCode: string) => void
}

export default function FlagSelector({ flags, onFlagSelect }: FlagSelectorProps) {
  const [selectedFlag, setSelectedFlag] = useState('')

  const handleFlagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const flagCode = e.target.value
    setSelectedFlag(flagCode)
    onFlagSelect(flagCode)
  }

  return (
    <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded-md shadow-md">
      <select
        value={selectedFlag}
        onChange={handleFlagSelect}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a flag</option>
        {flags.map((flag) => (
          <option key={flag.code} value={flag.code}>
            {flag.type} - {flag.code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}


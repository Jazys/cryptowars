"use client"

import { useState, useEffect } from 'react'

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      
      let diff = midnight.getTime() - now.getTime()
      
      // Si on est après minuit, on calcule pour le prochain minuit
      if (diff < 0) {
        midnight.setDate(midnight.getDate() + 1)
        diff = midnight.getTime() - now.getTime()
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      }
    }

    const updateTimer = () => {
      const { hours, minutes, seconds } = calculateTimeLeft()
      setTimeLeft(`${hours}:${minutes}:${seconds}`)
    }

    // Mettre à jour immédiatement
    updateTimer()

    // Mettre à jour chaque seconde
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-xl font-mono bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full text-white shadow-lg">
      End war in {timeLeft}
    </div>
  )
} 
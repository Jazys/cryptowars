"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { translations } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { Flag, Coins, Trophy, ChevronRight, Lightbulb } from 'lucide-react'

interface GameRulesProps {
  networkParams: {
    network: string;
    rpc: string;
    contract: string;
  };
  onClose: () => void;
}

export default function GameRules({ networkParams, onClose }: GameRulesProps) {
  const router = useRouter()
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]
    setLang(translations[browserLang] ? browserLang : 'en')
  }, [])

  const t = translations[lang]

  const handlePlay = () => {
    const params = new URLSearchParams(networkParams);
    router.push(`/game?${params.toString()}`);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <Card className="max-w-4xl mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-gray-50 shadow-xl border-t border-white/50">
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            {t.title}
          </motion.h2>
          
          <div className="space-y-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
                <Trophy className="w-6 h-6" />
                {t.objective.title}
              </h3>
              <p className="mt-1 text-lg text-gray-700">{t.objective.description}</p>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-700">
                <Flag className="w-6 h-6" />
                {t.rules.title}
              </h3>
              <ul className="mt-2 space-y-1">
                {t.rules.items.map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 text-lg text-gray-700"
                  >
                    <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 text-yellow-700">
                <Coins className="w-6 h-6" />
                {t.rewards.title}
              </h3>
              <p className="mt-1 text-lg text-gray-700">{t.rewards.description}</p>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 text-green-700">
                <Lightbulb className="w-6 h-6" />
                {t.upcomingFeatures.title}
              </h3>
              <ul className="mt-2 space-y-1">
                {t.upcomingFeatures.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-lg text-gray-700">
                    <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-4 pt-2"
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 py-2 text-lg hover:bg-gray-100 border-2"
            >
              {t.buttons.back}
            </Button>
            <Button
              onClick={handlePlay}
              className="px-8 py-2 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
            >
              {t.buttons.letsGo}
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  )
} 
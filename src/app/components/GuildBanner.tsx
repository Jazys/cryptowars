import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Users, ChevronDown, ChevronUp, Menu } from 'lucide-react'

export default function GuildBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg hover:opacity-90 transition-opacity"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Menu className="w-8 h-8" />
      </motion.button>
    )
  }

  return (
    <motion.div 
      className="fixed top-0 right-0 h-screen w-80 bg-gradient-to-l from-indigo-500 to-purple-500 text-white shadow-lg rounded-l-2xl"
      style={{ zIndex: 9999 }}
      initial={{ x: 320, borderRadius: 24 }}
      animate={{ 
        x: 0,
        borderRadius: 24,
        transition: { duration: 0.3 }
      }}
      exit={{ x: 320 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Guild Menu</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center gap-2 p-3 hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          
          <button className="w-full flex items-center gap-2 p-3 hover:bg-white/10 rounded-lg transition-colors">
            <Users className="w-5 h-5" />
            <span>Online Members</span>
          </button>

          <div className="pt-4 border-t border-white/10">
            <p className="font-semibold mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
                Create Guild
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
                Join Guild
              </button>
              <button className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
                Guild Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 
import { create } from 'zustand'
import { ethers } from 'ethers'

type Web3Store = {
  address: string
  isConnected: boolean
  setAddress: (address: string) => void
  setIsConnected: (isConnected: boolean) => void
  reset: () => void
}

const initialState = {
  address: '',
  isConnected: false
}

export const useWeb3Store = create<Web3Store>((set) => ({
  ...initialState,
  setAddress: (address: string) => set({ address }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
  reset: () => set(initialState)
}))

declare global {
  interface Window {
    ethereum?: any
  }
} 
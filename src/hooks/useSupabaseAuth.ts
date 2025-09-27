import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { SupabaseService } from '@/lib/supabaseService'
import { User } from '@/lib/supabase'

export function useSupabaseAuth() {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      handleWalletConnection(address)
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [isConnected, address])

  const handleWalletConnection = async (walletAddress: string) => {
    try {
      setLoading(true)
      const userData = await SupabaseService.signInWithWallet(walletAddress)
      setUser(userData)
    } catch (error) {
      console.error('Failed to authenticate with Supabase:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await SupabaseService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut
  }
}

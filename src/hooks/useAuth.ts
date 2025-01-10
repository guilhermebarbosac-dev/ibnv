import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(checkUser)
    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      const { data: user } = await supabase.auth.getUser()
      setIsAdmin(user?.user?.email === 'pastor@ibnv.com.br')
      setLoading(false)
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAdmin(false)
      setLoading(false)
    }
  }

  return { isAdmin, loading }
}
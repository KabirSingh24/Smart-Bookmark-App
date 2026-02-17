'use client'

import { supabase } from "../../lib/supabase"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://smart-bookmark-app-gold-gamma.vercel.app/dashboard'
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md border border-gray-100">

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Smart Bookmark
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Save and access your bookmarks anywhere
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition cursor-pointer"
        >
          <span>Continue with Google</span>
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          Secure login powered by Google OAuth
        </p>
      </div>

    </div>
  )
}

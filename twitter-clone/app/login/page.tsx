'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

const loginMutation = useMutation({
  mutationFn: ({ email, password }: { email: string; password: string }) =>
    login(email, password),

  onSuccess: () => {
    router.push('/')
  },

  onError: (err: any) => {
    console.log("Login1: ", err)
    setError(err.message)
    setLoading(false)
  }
})

async function handleLogin() {
  setLoading(true)
  setError('')

  try {
     loginMutation.mutate({
  email: form.email,
  password: form.password,
})
  } catch (err) {
    console.log("Login: ", err)
    // handled in onError
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-110 bg-black border border-[#2f3336] rounded-2xl p-8 relative">

        <Link href="/" className="absolute top-4 left-4 text-white hover:bg-[#1a1a1a] p-2 rounded-full flex items-center justify-center">
          ✕
        </Link>

        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>

        <h1 className="text-[28px] font-black text-white mb-6">
          Sign in to X
        </h1>

        {/* google */}
        <button className="flex items-center justify-center gap-3 w-full py-2.5 rounded-full border border-[#333] text-white font-semibold text-sm hover:bg-[#111] transition-colors mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#2f3336]" />
          <span className="text-[#71767b] text-sm">or</span>
          <div className="flex-1 h-px bg-[#2f3336]" />
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Email or username"
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={e => update('password', e.target.value)}
            error={error}
          />
        </div>

        <div className="text-right mt-2 mb-6">
          <a href="#" className="text-accent text-sm hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          onClick={handleLogin}
          disabled={!form.email || !form.password || loading}
          className="w-full py-3 rounded-full bg-white text-black font-black text-base hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-[#71767b] text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { register } from '@/lib/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/utils/Portfolio'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    username:     '',
    handle:   '',
    email:    '',
    password: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }
  
  const addMutation = useMutation({
    mutationFn: createUser,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["register"]});
      setForm({
          username:     '',
          handle:   '',
          email:    '',
          password: '',
        });

    }
  });

  async function handleSubmit() {
  try {
    setError('')

    // 1. Create user in Firebase Auth
    const user = await register(form.email, form.password)

    // 2. Save extra data in Firestore via backend
    await addMutation.mutateAsync({
      uid: user.uid,
      name: form.username,
      handle: form.handle,
      email: form.email,
    })

    // 3. redirect
    window.location.href = '/'
  } catch (err: any) {
    
    setError(err.message)
  }
}


  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-[440px] bg-black border border-[#2f3336] rounded-2xl p-8 relative">

        {/* close — goes back to landing */}
        <Link href="/" className="absolute top-4 left-4 text-white hover:bg-[#1a1a1a] p-2 rounded-full flex items-center justify-center">
          ✕
        </Link>

        {/* logo */}
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>

        {step === 1 && (
          <>
            <h1 className="text-[28px] font-black text-white mb-6">
              Create your account
            </h1>

            <div className="flex flex-col gap-4">
              <Input
                label="Name"
                type="text"
                value={form.username}
                onChange={e => update('username', e.target.value)}
                maxLength={50}
              />
              <Input
                label="Username"
                type="text"
                value={form.handle}
                onChange={e => update('handle', e.target.value.replace(/\s/g, ''))}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.username || !form.handle || !form.email}
              className="w-full mt-8 py-3 rounded-full bg-white text-black font-black text-base hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>

            <p className="text-[#71767b] text-sm text-center mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[#71767b] text-sm mb-1">Step 2 of 2</p>
            <h1 className="text-[28px] font-black text-white mb-6">
              You'll need a password
            </h1>

            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              error={error}
            />

            <p className="text-[#71767b] text-xs mt-2 mb-6">
              Make sure it's 8+ characters.
            </p>

            <button
              onClick={handleSubmit}
              disabled={form.password.length < 8 || addMutation.isPending}
              className="w-full py-3 rounded-full bg-white text-black font-black text-base hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addMutation.isPending ? 'Creating...' : 'Create account'}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 py-3 text-[#71767b] text-sm hover:text-white transition-colors"
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
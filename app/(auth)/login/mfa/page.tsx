'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MFA() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initiateMFA = async () => {
      try {
        // Get the current user's MFA factors
        const { data, error: factorsError } = await supabase.auth.mfa.listFactors()
        const factors = (data as any)?.factors || []
        
        if (factorsError) throw factorsError
        
        const totpFactor = factors?.totp?.[0]
        if (!totpFactor) {
          // If no TOTP factor is set up, redirect to setup
          router.push('/login/mfa/setup')
          return
        }
        
        // Challenge the TOTP factor
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: totpFactor.id
        })
        
        if (challengeError) throw challengeError
        
        setChallengeId(challengeData.id)
      } catch (error: any) {
        setError(error.message)
      }
    }
    
    initiateMFA()
  }, [supabase, router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!challengeId) return
    
    setLoading(true)
    setError(null)

    try {
      // Extract factorId from challengeId (format: factorId-challengeId)
      const factorId = challengeId.split('-')[0]
      
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: otp
      })

      if (error) throw error

      // MFA verification successful, redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verificación de dos factores
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa el código de tu aplicación de autenticación
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div>
            <label htmlFor="otp" className="sr-only">
              Código de verificación
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
              placeholder="------"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/ssr'
import QRCode from 'qrcode.react'

export default function MFASetup() {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const setupMFA = async () => {
      try {
        // Enroll a new TOTP factor
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp'
        })
        
        if (error) throw error
        
        setQrCodeData(data.totp.qr_code)
        setSecret(data.totp.secret)
        setFactorId(data.id)
      } catch (error: any) {
        setError(error.message)
      }
    }
    
    setupMFA()
  }, [supabase])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!factorId) return
    
    setLoading(true)
    setError(null)

    try {
      // Verify the TOTP factor with the code entered by the user
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: otp
      })

      if (error) throw error

      // MFA setup successful, redirect to dashboard
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
            Configurar autenticación de dos factores
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
          </p>
        </div>
        
        {qrCodeData ? (
          <div className="flex flex-col items-center">
            <QRCode value={qrCodeData} size={200} className="mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Si no puedes escanear el QR, ingresa este código secreto en tu aplicación:
            </p>
            <code className="bg-gray-100 p-2 rounded text-sm mb-4">{secret}</code>
            
            <form className="w-full space-y-6" onSubmit={handleVerify}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center text-xl tracking-widest"
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
                  {loading ? 'Verificando...' : 'Verificar y completar configuración'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <p>Cargando configuración de MFA...</p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
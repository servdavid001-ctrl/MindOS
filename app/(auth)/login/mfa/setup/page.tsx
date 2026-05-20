'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MFASetup() {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const setupMFA = async () => {
      try {
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

  useEffect(() => {
    if (qrCodeData && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
        }
        img.src = qrCodeData
      }
    }
  }, [qrCodeData])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!factorId) return
    
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: otp
      })

      if (error) throw error

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
            <canvas ref={canvasRef} width={200} height={200} className="mb-4 border rounded"></canvas>
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
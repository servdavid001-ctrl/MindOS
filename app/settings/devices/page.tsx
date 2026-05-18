'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface DeviceSession {
  id: string
  device_name: string
  last_active: string
  created_at: string
  revoked: boolean
}

export default function DeviceManagerPage() {
  const [devices, setDevices] = useState<DeviceSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('device_sessions')
        .select('*')
        .order('last_active', { ascending: false })
      
      if (error) throw error
      setDevices(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const revokeDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('device_sessions')
        .update({ revoked: true })
        .eq('id', deviceId)
      
      if (error) throw error
      
      setDevices(devices.map(device => 
        device.id === deviceId ? { ...device, revoked: true } : device
      ))
    } catch (error: any) {
      setError(error.message)
    }
  }

  const refreshSessions = async () => {
    setLoading(true)
    await fetchDevices()
  }

  if (loading) {
    return <div className="p-4">Cargando dispositivos...</div>
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dispositivos conectados</h1>
        <button 
          onClick={refreshSessions}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refrescar
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {devices.map((device) => (
            <li key={device.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {device.device_name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {device.device_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Último acceso: {new Date(device.last_active).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Registrado: {new Date(device.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div>
                  {device.revoked ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Revocado
                    </span>
                  ) : (
                    <button
                      onClick={() => revokeDevice(device.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Revocar
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {devices.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron dispositivos registrados.</p>
        </div>
      )}
    </div>
  )
}
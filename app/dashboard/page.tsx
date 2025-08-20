'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'

interface DashboardData {
  user: {
    id: string
    email: string
    metadata: any
  }
  gym: {
    id: string
    name: string
    address: string
    phone: string
    email: string
    monthly_fee: number
    sinpe_phone: string
    is_active: boolean
  }
  stats: {
    total: number
    active: number
    pending: number
    expired: number
    inactive: number
  }
  recentPayments: Array<{
    id: string
    amount: number
    status: string
    payment_date: string
    memberships: {
      users: {
        first_name: string
        last_name: string
        email: string
      }
    }
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'ES'>('EN')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Detect browser language
    const browserLanguage = navigator.language || navigator.languages[0]
    const isSpanish = browserLanguage.toLowerCase().startsWith('es')
    setCurrentLanguage(isSpanish ? 'ES' : 'EN')

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()

      if (response.ok) {
        setDashboardData(data)
      } else {
        if (response.status === 401) {
          router.push('/login')
        } else if (response.status === 403) {
          router.push('/payment')
        } else {
          setError(data.error || 'Failed to load dashboard')
        }
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setError('An error occurred while loading the dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (language: 'EN' | 'ES') => {
    setCurrentLanguage(language)
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getContent = () => {
    if (currentLanguage === 'ES') {
      return {
        title: 'Panel de Control',
        welcome: 'Bienvenido',
        gymInfo: 'Información del Gimnasio',
        membershipStats: 'Estadísticas de Membresías',
        recentPayments: 'Pagos Recientes',
        total: 'Total',
        active: 'Activas',
        pending: 'Pendientes',
        expired: 'Vencidas',
        inactive: 'Inactivas',
        signOut: 'Cerrar Sesión',
        noPayments: 'No hay pagos recientes',
        status: {
          pending: 'Pendiente',
          approved: 'Aprobado',
          rejected: 'Rechazado',
          cancelled: 'Cancelado'
        }
      }
    }
    return {
      title: 'Dashboard',
      welcome: 'Welcome',
      gymInfo: 'Gym Information',
      membershipStats: 'Membership Statistics',
      recentPayments: 'Recent Payments',
      total: 'Total',
      active: 'Active',
      pending: 'Pending',
      expired: 'Expired',
      inactive: 'Inactive',
      signOut: 'Sign Out',
      noPayments: 'No recent payments',
      status: {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        cancelled: 'Cancelled'
      }
    }
  }

  const content = getContent()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D37FF] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2D37FF] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Error</h1>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 bg-white text-[#2D37FF] px-6 py-2 rounded-full"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentLanguage={currentLanguage} 
        onLanguageChange={handleLanguageChange} 
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Romagothic, sans-serif' }}>
              {content.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {content.welcome}, {dashboardData.user.metadata?.first_name || dashboardData.user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {content.signOut}
          </button>
        </div>

        {/* Gym Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{content.gymInfo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre</label>
              <p className="text-gray-900">{dashboardData.gym.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Dirección</label>
              <p className="text-gray-900">{dashboardData.gym.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Teléfono</label>
              <p className="text-gray-900">{dashboardData.gym.phone || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{dashboardData.gym.email || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mensualidad</label>
              <p className="text-gray-900">₡{dashboardData.gym.monthly_fee.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">SINPE</label>
              <p className="text-gray-900">{dashboardData.gym.sinpe_phone}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{dashboardData.stats.total}</div>
            <div className="text-sm text-gray-600">{content.total}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">{dashboardData.stats.active}</div>
            <div className="text-sm text-gray-600">{content.active}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-yellow-600">{dashboardData.stats.pending}</div>
            <div className="text-sm text-gray-600">{content.pending}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-orange-600">{dashboardData.stats.expired}</div>
            <div className="text-sm text-gray-600">{content.expired}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-red-600">{dashboardData.stats.inactive}</div>
            <div className="text-sm text-gray-600">{content.inactive}</div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{content.recentPayments}</h2>
          {dashboardData.recentPayments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{content.noPayments}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Monto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.memberships.users.first_name} {payment.memberships.users.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{payment.memberships.users.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">₡{payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {content.status[payment.status as keyof typeof content.status] || payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
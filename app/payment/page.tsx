'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getStripe } from '@/lib/stripe'
import Header from '../components/Header'

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'ES'>('EN')
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const gymId = searchParams.get('gymId')
  const userId = searchParams.get('userId')

  useEffect(() => {
    // Detect browser language
    const browserLanguage = navigator.language || navigator.languages[0]
    const isSpanish = browserLanguage.toLowerCase().startsWith('es')
    setCurrentLanguage(isSpanish ? 'ES' : 'EN')

    // Redirect if missing required params
    if (!gymId || !userId) {
      router.push('/onboarding')
    }
  }, [gymId, userId, router])

  const handleLanguageChange = (language: 'EN' | 'ES') => {
    setCurrentLanguage(language)
  }

  const getContent = () => {
    if (currentLanguage === 'ES') {
      return {
        title: 'Activar Gimnasio',
        subtitle: 'Complete el pago para activar su gimnasio',
        monthly: 'Mensual',
        yearly: 'Anual',
        yearlyDiscount: 'Ahorra 2 meses',
        features: [
          'Gestión completa de membresías',
          'Seguimiento de pagos automatizado',
          'Panel de control en tiempo real',
          'Soporte técnico prioritario',
          'Reportes detallados',
        ],
        proceedPayment: 'Proceder al Pago',
        backToRegistration: 'Volver al Registro'
      }
    }
    return {
      title: 'Activate Gym',
      subtitle: 'Complete payment to activate your gym',
      monthly: 'Monthly',
      yearly: 'Yearly',
      yearlyDiscount: 'Save 2 months',
      features: [
        'Complete membership management',
        'Automated payment tracking',
        'Real-time dashboard',
        'Priority technical support',
        'Detailed reports',
      ],
      proceedPayment: 'Proceed to Payment',
      backToRegistration: 'Back to Registration'
    }
  }

  const content = getContent()

  // Base prices (from your pricing page logic)
  const baseMonthly = 51
  const baseYearly = 549
  const currentPrice = isYearly ? baseYearly : baseMonthly
  const monthlySavings = isYearly ? Math.round((baseMonthly * 12 - baseYearly) / 12) : 0

  const handlePayment = async () => {
    if (!gymId || !userId) {
      alert('Missing required information')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gymId,
          userId,
          billingPeriod: isYearly ? 'yearly' : 'monthly'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const stripe = await getStripe()
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId })
        }
      } else {
        alert(data.error || 'Failed to create payment session')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred while processing payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#2D37FF] flex flex-col">
      <Header 
        currentLanguage={currentLanguage} 
        onLanguageChange={handleLanguageChange} 
      />

      <main className="flex-1 flex items-center justify-center px-6 lg:px-8 py-12">
        <div className="w-full max-w-lg mx-auto">
          <p className="text-white/90 text-xl text-center mb-12 font-light">
            {content.subtitle}
          </p>

          <div className="bg-white rounded-3xl p-10 shadow-2xl border border-white/20">
            <h1 className="text-2xl font-bold text-[#2D37FF] text-center mb-8" style={{ fontFamily: 'Romagothic, sans-serif' }}>
              {content.title}
            </h1>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center mb-10">
              <span className={`text-gray-700 mr-4 text-sm ${!isYearly ? 'font-semibold' : 'font-normal'}`}>
                {content.monthly}
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-12 h-6 bg-gray-200 rounded-full transition-colors duration-300 focus:outline-none hover:bg-gray-300"
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#2D37FF] rounded-full transition-transform duration-300 shadow-sm ${
                    isYearly ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
              <span className={`text-gray-700 ml-4 text-sm ${isYearly ? 'font-semibold' : 'font-normal'}`}>
                {content.yearly}
              </span>
              {isYearly && (
                <span className="ml-3 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  {content.yearlyDiscount}
                </span>
              )}
            </div>

            {/* Price Display */}
            <div className="text-center mb-10">
              <div className="mb-4">
                <div className="text-6xl font-light text-[#2D37FF] mb-2">
                  ${currentPrice}
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  {isYearly ? (currentLanguage === 'ES' ? 'por año' : 'per year') : (currentLanguage === 'ES' ? 'por mes' : 'per month')}
                </div>
              </div>
              {isYearly && monthlySavings > 0 && (
                <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {currentLanguage === 'ES' ? 'Ahorras' : 'Save'} ${monthlySavings}/{currentLanguage === 'ES' ? 'mes' : 'month'}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="cursor-pointer w-full bg-[#2D37FF] text-white py-4 rounded-2xl text-lg font-semibold hover:bg-[#1e2bcc] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (currentLanguage === 'ES' ? 'Procesando...' : 'Processing...') : content.proceedPayment}
              </button>
              
              <button
                onClick={() => router.push('/onboarding')}
                className="cursor-pointer w-full border-2 border-gray-300 text-gray-600 py-3 rounded-2xl text-sm font-medium hover:border-gray-400 hover:text-gray-700 transition-all duration-300"
              >
                {content.backToRegistration}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
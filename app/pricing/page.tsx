'use client'

import { useState, useEffect } from "react";
import Header from "../components/Header";

interface PricingData {
  monthly: number;
  yearly: number;
  currency: string;
  symbol: string;
  exchangeRate?: number;
  lastUpdated?: string;
}

export default function PricingPage() {
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'ES'>('EN');
  const [currentCurrency, setCurrentCurrency] = useState<'USD' | 'CRC'>('USD');
  const [isDark, setIsDark] = useState(true);
  const [pricing, setPricing] = useState<PricingData>({
    monthly: 51,
    yearly: 549,
    currency: 'USD',
    symbol: '$'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Detect browser language on mount
    const browserLanguage = navigator.language || navigator.languages[0];
    const isSpanish = browserLanguage.toLowerCase().startsWith('es');
    setCurrentLanguage(isSpanish ? 'ES' : 'EN');
  }, []);

  useEffect(() => {
    fetchPricing(currentCurrency);
  }, [currentCurrency]);

  const fetchPricing = async (currency: 'USD' | 'CRC') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/currency?currency=${currency}`);
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: 'EN' | 'ES') => {
    setCurrentLanguage(language);
  };

  const handleCurrencyChange = (currency: 'USD' | 'CRC') => {
    setCurrentCurrency(currency);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const themeColors = {
    bg: isDark ? '#373737' : '#F0F0F0',
    text: isDark ? '#F0F0F0' : '#373737',
    textSecondary: isDark ? '#F0F0F0CC' : '#373737CC'
  };

  const getContent = () => {
    if (currentLanguage === 'ES') {
      return {
        title: 'PRECIOS SIMPLES',
        subtitle: 'Elige el plan perfecto para tu gimnasio',
        monthly: 'MENSUAL',
        yearly: 'ANUAL',
        yearlyDiscount: 'Ahorra 2 meses',
        features: [
          'Gestión completa de membresías',
          'Seguimiento de pagos automatizado',
          'Panel de control en tiempo real',
          'Soporte técnico prioritario',
          'Reportes detallados',
        ],
        getStarted: 'Comenzar Ahora',
        currency: 'Moneda'
      };
    }
    return {
      title: 'SIMPLE PRICING',
      subtitle: 'Choose the perfect plan for your gym',
      monthly: 'MONTHLY',
      yearly: 'YEARLY',
      yearlyDiscount: 'SAVE 2 MONTHS',
      features: [
        'Complete membership management',
        'Automated payment tracking',
        'Real-time dashboard',
        'Priority technical support',
        'Detailed reports',
      ],
      getStarted: 'Get Started',
      currency: 'Currency'
    };
  };

  const content = getContent();
  const monthlySavings = Math.round((pricing.monthly * 12 - pricing.yearly) / 12);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeColors.bg }}>
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />

      <main className="flex-1 px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4" style={{
              fontFamily: 'Romagothic, sans-serif',
              color: themeColors.text
            }}>
              {content.title}
            </h1>
            <p className="text-xl font-light" style={{
              color: themeColors.textSecondary,
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              {content.subtitle}
            </p>
          </div>

          {/* Currency Selector */}
          <div className="flex justify-center mb-12">
            <div className="rounded-2xl p-1.5 flex" style={{
              backgroundColor: `${themeColors.text}10`,
              backdropFilter: 'blur(4px)'
            }}>
              <button
                onClick={() => handleCurrencyChange('USD')}
                className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: currentCurrency === 'USD' ? themeColors.text : 'transparent',
                  color: currentCurrency === 'USD' ? themeColors.bg : themeColors.text,
                }}
              >
                USD ($)
              </button>
              <button
                onClick={() => handleCurrencyChange('CRC')}
                className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: currentCurrency === 'CRC' ? themeColors.text : 'transparent',
                  color: currentCurrency === 'CRC' ? themeColors.bg : themeColors.text,
                }}
              >
                CRC (₡)
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="rounded-3xl p-8 shadow-2xl relative" style={{
              backgroundColor: themeColors.bg,
              border: `1px solid ${themeColors.text}20`
            }}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{
                  color: themeColors.text,
                  fontFamily: 'Romagothic, sans-serif'
                }}>{content.monthly}</h3>
                <div className="mb-4">
                  {loading ? (
                    <div className="text-4xl font-light animate-pulse" style={{
                      color: themeColors.textSecondary,
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>Loading...</div>
                  ) : (
                    <div className="text-5xl font-light mb-2" style={{
                      color: themeColors.text,
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>
                      {pricing.symbol}{pricing.monthly.toLocaleString()}
                    </div>
                  )}
                  <div className="text-sm font-medium" style={{
                    color: themeColors.textSecondary,
                    fontFamily: 'TestUnifiedSerif, serif'
                  }}>
                    {currentLanguage === 'ES' ? 'por mes' : 'per month'}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm leading-relaxed"
                      style={{
                        color: isDark ? '#F0F0F0CC' : '#373737CC'
                      }}
                    >{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="cursor-pointer w-full py-4 rounded-2xl text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{
                backgroundColor: themeColors.text,
                color: themeColors.bg,
              }}>
                {content.getStarted}
              </button>
            </div>

            {/* Yearly Plan */}
            <div className="rounded-3xl p-8 shadow-2xl relative" style={{
              backgroundColor: themeColors.bg,
              border: `1px solid ${themeColors.text}20`
            }}>
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-2 rounded-full text-sm font-medium" style={{
                  backgroundColor: themeColors.text,
                  color: themeColors.bg,
                  fontFamily: 'Romagothic, sans-serif'
                }}>
                  {content.yearlyDiscount}
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{
                  color: themeColors.text,
                  fontFamily: 'Romagothic, sans-serif'
                }}>{content.yearly}</h3>
                <div className="mb-4">
                  {loading ? (
                    <div className="text-4xl font-light animate-pulse" style={{
                      color: themeColors.textSecondary,
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>Loading...</div>
                  ) : (
                    <div className="text-5xl font-light mb-2" style={{
                      color: themeColors.text,
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>
                      {pricing.symbol}{pricing.yearly.toLocaleString()}
                    </div>
                  )}
                  <div className="text-sm font-medium" style={{
                    color: themeColors.textSecondary,
                    fontFamily: 'TestUnifiedSerif, serif'
                  }}>
                    {currentLanguage === 'ES' ? 'por año' : 'per year'}
                  </div>
                </div>
                {monthlySavings > 0 && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium" style={{
                    backgroundColor: `${themeColors.text}10`,
                    color: themeColors.text,
                    fontFamily: 'TestUnifiedSerif, serif'
                  }}>
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {currentLanguage === 'ES' ? 'Ahorras' : 'Save'} {pricing.symbol}{monthlySavings.toLocaleString()}/{currentLanguage === 'ES' ? 'mes' : 'month'}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm leading-relaxed"
                      style={{
                        color: isDark ? '#F0F0F0CC' : '#373737CC'
                      }}
                    >{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="cursor-pointer w-full py-4 rounded-2xl text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{
                backgroundColor: themeColors.text,
                color: themeColors.bg,
              }}>
                {content.getStarted}
              </button>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {currentCurrency === 'CRC' && pricing.exchangeRate && (
            <div className="mt-12 text-center">
              <div className="inline-block rounded-2xl px-6 py-4" style={{
                backgroundColor: isDark ? '#F0F0F010' : '#37373710',
                backdropFilter: 'blur(4px)'
              }}>
                <div className="text-sm leading-relaxed" style={{
                  color: themeColors.textSecondary,
                  fontFamily: 'TestUnifiedSerif, serif'
                }}>
                  {currentLanguage === 'ES'
                    ? `Tipo de cambio: $1 USD = ₡${pricing.exchangeRate.toFixed(2)} CRC`
                    : `Exchange rate: $1 USD = ₡${pricing.exchangeRate.toFixed(2)} CRC`
                  }
                  <br />
                  <span style={{
                    color: isDark ? '#F0F0F080' : '#37373780'
                  }}>
                    {currentLanguage === 'ES' ? 'Actualizado recientemente' : 'Recently updated'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
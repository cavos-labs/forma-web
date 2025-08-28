'use client'

import { useState, useEffect } from "react";
import Header from "./components/Header";

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'ES'>('EN');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Detect browser language on mount
    const browserLanguage = navigator.language || navigator.languages[0];
    const isSpanish = browserLanguage.toLowerCase().startsWith('es');
    setCurrentLanguage(isSpanish ? 'ES' : 'EN');
  }, []);

  const handleLanguageChange = (language: 'EN' | 'ES') => {
    setCurrentLanguage(language);
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
        title: "FORMA",
        description: "Simplifica la gestión de tu gimnasio. Controla membresías, pagos y clientes en una sola plataforma intuitiva."
      };
    }
    return {
      title: "FORMA",
      description: "Streamline your gym operations. Manage memberships, payments, and clients in one intuitive platform."
    };
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeColors.bg }}>
      <Header 
        currentLanguage={currentLanguage} 
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto">
          {/* Logo */}
          <div className="mb-12 mt-20">
            <img 
              src={isDark ? "/images/forma-logo-white.png" : "/images/forma-logo-black.png"}
              alt="FORMA"
              className="mx-auto h-32 md:h-48 lg:h-64 xl:h-80"
            />
          </div>
          
          <p className="text-lg sm:text-xl lg:text-2xl font-light max-w-3xl mx-auto leading-relaxed mb-12" style={{ 
            color: themeColors.textSecondary,
            fontFamily: 'TestUnifiedSerif, serif'
          }}>
            {content.description}
          </p>
          
          {/* CTA Section */}
          <div className="flex justify-center items-center">
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="cursor-pointer px-8 py-4 rounded-full text-lg hover:shadow-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1"
              style={{ 
                backgroundColor: themeColors.text,
                color: themeColors.bg,
              }}
            >
              {currentLanguage === 'ES' ? 'Ver Precios' : 'View Pricing'}
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: themeColors.bg }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-6xl lg:text-7xl font-bold mb-6 tracking-tight" style={{ 
              fontFamily: 'Romagothic, sans-serif',
              color: themeColors.text
            }}>
              {currentLanguage === 'ES' ? 'TODO LO QUE' : 'EVERYTHING'} <br />
              <span style={{ opacity: 0.9 }}>{currentLanguage === 'ES' ? 'NECESITAS' : 'YOU NEED'}</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ 
              color: themeColors.textSecondary,
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              {currentLanguage === 'ES' 
                ? 'Herramientas modernas para gestionar tu gimnasio de manera eficiente'
                : 'Modern tools to manage your gym efficiently'
              }
            </p>
          </div>

          {/* Features */}
          <div className="space-y-32">
            
            {/* Feature 1 - Member Registration */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-4 p-1 rounded-full" style={{ 
                  backgroundColor: isDark ? '#37373720' : '#F0F0F020',
                  backdropFilter: 'blur(4px)'
                }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                    backgroundColor: isDark ? '#373737' : '#F0F0F0'
                  }}>
                    <span className="text-sm font-bold" style={{ 
                      color: isDark ? '#F0F0F0' : '#373737',
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>01</span>
                  </div>
                  <span className="text-sm font-medium pr-4" style={{ 
                    color: isDark ? '#373737' : '#F0F0F0',
                    fontFamily: 'Romagothic, sans-serif'
                  }}>
                    {currentLanguage === 'ES' ? 'REGISTRO' : 'REGISTRATION'}
                  </span>
                </div>
                <h3 className="text-4xl font-bold leading-tight" style={{ 
                  color: themeColors.text,
                  fontFamily: 'Romagothic, sans-serif'
                }}>
                  {currentLanguage === 'ES' ? 'REGISTRO RÁPIDO DE MIEMBROS' : 'QUICK MEMBER REGISTRATION'}
                </h3>
                <p className="text-xl leading-relaxed" style={{ 
                  color: isDark ? '#F0F0F0CC' : '#373737CC',
                  fontFamily: 'TestUnifiedSerif, serif'
                }}>
                  {currentLanguage === 'ES' 
                    ? 'Formularios intuitivos que simplifican el proceso de registro para nuevos miembros'
                    : 'Intuitive forms that streamline the registration process for new members'
                  }
                </p>
              </div>
              
              <div className="relative">
                <div className="rounded-3xl p-8 transform hover:scale-105 transition-transform duration-700 ease-out" style={{
                  backgroundColor: isDark ? '#F0F0F0' : '#373737'
                }}>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 rounded-2xl shadow-sm transform translate-x-0 hover:translate-x-2 transition-transform duration-500" style={{
                      backgroundColor: themeColors.bg
                    }}>
                      <div className="w-12 h-12 rounded-full" style={{
                        backgroundColor: `${themeColors.text}10`
                      }}></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 rounded-full w-3/4" style={{
                          backgroundColor: `${themeColors.text}30`
                        }}></div>
                        <div className="h-2 rounded-full w-1/2" style={{
                          backgroundColor: `${themeColors.text}20`
                        }}></div>
                      </div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                        backgroundColor: themeColors.text
                      }}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{
                          color: themeColors.bg
                        }}>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-2xl shadow-sm transform translate-x-0 hover:translate-x-2 transition-transform duration-500 delay-100" style={{
                      backgroundColor: themeColors.bg
                    }}>
                      <div className="w-12 h-12 rounded-full animate-pulse" style={{
                        backgroundColor: `${themeColors.text}20`
                      }}></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 rounded-full w-2/3" style={{
                          backgroundColor: `${themeColors.text}30`
                        }}></div>
                        <div className="h-2 rounded-full w-1/3" style={{
                          backgroundColor: `${themeColors.text}20`
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Subscription Tracking */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="rounded-3xl p-8 transform hover:scale-105 transition-transform duration-700 ease-out" style={{
                  backgroundColor: isDark ? '#373737' : '#F0F0F0'
                }}>
                  <div className="space-y-4">
                    {[
                      { name: 'Juan Pérez', status: 'active', delay: '0ms' },
                      { name: 'María López', status: 'warning', delay: '200ms' },
                      { name: 'Carlos Silva', status: 'expired', delay: '400ms' }
                    ].map((member, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-2xl shadow-sm transform translate-x-0 hover:translate-x-2 transition-all duration-500"
                        style={{ 
                          transitionDelay: member.delay,
                          backgroundColor: isDark ? '#F0F0F0' : '#373737'
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full`} style={{
                            backgroundColor: member.status === 'active' ? (isDark ? '#F0F0F0' : '#373737') :
                              member.status === 'warning' ? (isDark ? '#F0F0F0AA' : '#373737AA') :
                              (isDark ? '#F0F0F0AA' : '#373737AA')
                          }}></div>
                          <span className="font-medium" style={{ 
                            color: isDark ? '#373737' : '#F0F0F0',
                            fontFamily: 'TestUnifiedSerif, serif'
                          }}>{member.name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          member.status === 'active' ? 'animate-pulse' : ''
                        }`} style={{
                          backgroundColor: member.status === 'active' ? (isDark ? '#373737' : '#F0F0F0') :
                            (isDark ? '#37373750' : '#F0F0F050')
                        }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 space-y-8">
                <div className="inline-flex items-center space-x-4 p-1 rounded-full" style={{
                  backgroundColor: isDark ? '#F0F0F020' : '#37373720',
                  backdropFilter: 'blur(4px)'
                }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                    backgroundColor: isDark ? '#F0F0F0' : '#373737'
                  }}>
                    <span className="text-sm font-bold" style={{ 
                      color: isDark ? '#373737' : '#F0F0F0',
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>02</span>
                  </div>
                  <span className="text-sm font-medium pr-4" style={{
                    color: isDark ? '#F0F0F0' : '#373737',
                    fontFamily: 'Romagothic, sans-serif'
                  }}>
                    {currentLanguage === 'ES' ? 'SEGUIMIENTO' : 'TRACKING'}
                  </span>
                </div>
                <h3 className="text-4xl font-bold leading-tight" style={{
                  color: themeColors.text,
                  fontFamily: 'Romagothic, sans-serif'
                }}>
                  {currentLanguage === 'ES' ? 'CONTROL DE SUSCRIPCIONES' : 'SUBSCRIPTION CONTROL'}
                </h3>
                <p className="text-xl leading-relaxed" style={{
                  color: isDark ? '#F0F0F0CC' : '#373737CC',
                  fontFamily: 'TestUnifiedSerif, serif'
                }}>
                  {currentLanguage === 'ES' 
                    ? 'Monitorea el estado de todas las membresías en tiempo real'
                    : 'Monitor the status of all memberships in real time'
                  }
                </p>
              </div>
            </div>

            {/* Feature 3 - Analytics */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-4 p-1 rounded-full" style={{
                  backgroundColor: isDark ? '#37373720' : '#F0F0F020',
                  color: isDark ? '#F0F0F0CC' : '#373737CC',
                  backdropFilter: 'blur(4px)'
                }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                    backgroundColor: isDark ? '#373737' : '#F0F0F0'
                  }}>
                    <span className="text-sm font-bold" style={{ 
                      color: isDark ? '#F0F0F0' : '#373737',
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>03</span>
                  </div>
                  <span className="text-sm font-medium pr-4" style={{
                    color: isDark ? '#F0F0F0CC' : '#373737CC',
                    fontFamily: 'Romagothic, sans-serif'
                  }}>
                    {currentLanguage === 'ES' ? 'ANÁLISIS' : 'ANALYTICS'}
                  </span>
                </div>
                <h3 className="text-4xl font-bold leading-tight" style={{
                  color: isDark ? '#F0F0F0' : '#373737',
                  fontFamily: 'Romagothic, sans-serif'
                }}>
                  {currentLanguage === 'ES' ? 'REPORTES DETALLADOS' : 'DETAILED REPORTS'}
                </h3>
                <p className="text-xl leading-relaxed" style={{
                  color: isDark ? '#F0F0F0CC' : '#373737CC',
                  fontFamily: 'TestUnifiedSerif, serif'
                }}>
                  {currentLanguage === 'ES' 
                    ? 'Visualiza el crecimiento y rendimiento de tu gimnasio'
                    : 'Visualize your gym\'s growth and performance'
                  }
                </p>
              </div>
              
              <div className="relative">
                <div className="rounded-3xl p-8 transform hover:scale-105 transition-transform duration-700 ease-out" style={{
                  backgroundColor: themeColors.bg
                }}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold" style={{
                      color: themeColors.text,
                      fontFamily: 'Romagothic, sans-serif'
                    }}>
                      {currentLanguage === 'ES' ? 'MIEMBROS ACTIVOS' : 'ACTIVE MEMBERS'}
                    </h4>
                    <span className="text-3xl font-bold" style={{
                      color: themeColors.text,
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>247</span>
                  </div>
                  <div className="h-40 flex items-end space-x-3">
                    {[40, 60, 80, 100, 90, 70, 85].map((height, index) => (
                      <div 
                        key={index}
                        className="flex-1 rounded-t-lg transform hover:scale-y-110 transition-transform duration-500"
                        style={{ 
                          height: `${height}%`,
                          opacity: 0.3 + (height / 100) * 0.7,
                          transitionDelay: `${index * 100}ms`,
                          backgroundColor: themeColors.text
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - SINPE Payments */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="rounded-3xl p-8 transform hover:scale-105 transition-transform duration-700 ease-out" style={{
                  backgroundColor: themeColors.bg
                }}>
                  <div className="rounded-2xl p-6" style={{
                    backgroundColor: `${themeColors.text}10`,
                    backdropFilter: 'blur(4px)'
                  }}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                        backgroundColor: `${themeColors.text}20`
                      }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                          color: themeColors.text
                        }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium" style={{
                          color: themeColors.text,
                          fontFamily: 'Romagothic, sans-serif'
                        }}>{currentLanguage === 'ES' ? 'PAGO RECIBIDO' : 'PAYMENT RECEIVED'}</div>
                        <div className="text-sm" style={{
                          color: themeColors.textSecondary,
                          fontFamily: 'TestUnifiedSerif, serif'
                        }}>Juan Pérez - ₡25,000</div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse" style={{
                        backgroundColor: themeColors.text
                      }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{
                          color: themeColors.bg
                        }}>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs" style={{
                      color: `${themeColors.text}80`,
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>
                      {currentLanguage === 'ES' ? 'Hace 2 minutos' : '2 minutes ago'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 space-y-8">
                <div className="inline-flex items-center space-x-4 p-1 rounded-full" style={{
                  backgroundColor: isDark ? '#F0F0F010' : '#37373710',
                  backdropFilter: 'blur(4px)'
                }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                    backgroundColor: isDark ? '#F0F0F0' : '#373737'
                  }}>
                    <span className="text-sm font-bold" style={{ 
                      color: isDark ? '#373737' : '#F0F0F0',
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}>04</span>
                  </div>
                  <span className="text-sm font-medium pr-4" style={{
                    color: isDark ? '#F0F0F0' : '#373737',
                    fontFamily: 'Romagothic, sans-serif'
                  }}>
                    {currentLanguage === 'ES' ? 'PAGOS' : 'PAYMENTS'}
                  </span>
                </div>
                <h3 className="text-4xl font-bold leading-tight" style={{
                  color: themeColors.text,
                  fontFamily: 'Romagothic, sans-serif'
                }}>
                  {currentLanguage === 'ES' ? 'SINPE MÓVIL' : 'SINPE MOBILE'}
                </h3>
                <p className="text-xl leading-relaxed" style={{
                  color: isDark ? '#F0F0F0CC' : '#373737CC',
                  fontFamily: 'TestUnifiedSerif, serif'
                }}>
                  {currentLanguage === 'ES' 
                    ? 'Confirma pagos automáticamente con integración SINPE'
                    : 'Confirm payments automatically with SINPE integration'
                  }
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 lg:px-8" style={{ backgroundColor: isDark ? '#373737' : '#F0F0F0' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ 
            fontFamily: 'Romagothic, sans-serif',
            color: isDark ? '#F0F0F0' : '#373737'
          }}>
            {currentLanguage === 'ES' ? 'HABLEMOS' : 'LET\'S TALK'}
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto" style={{
            color: isDark ? '#F0F0F0CC' : '#373737CC',
            fontFamily: 'TestUnifiedSerif, serif'
          }}>
            {currentLanguage === 'ES' 
              ? '¿Tienes preguntas sobre FORMA? Contáctanos y te ayudaremos a encontrar la mejor solución para tu gimnasio.'
              : 'Have questions about FORMA? Contact us and we\'ll help you find the best solution for your gym.'
            }
          </p>
          
          {/* WhatsApp Contact with Compliance */}
          <div className="space-y-6">
            <a 
              href="https://wa.me/50686766484"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center space-x-4 px-8 py-4 rounded-full text-lg font hover:shadow-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1"
              style={{
                backgroundColor: isDark ? '#F0F0F0' : '#373737',
                color: isDark ? '#373737' : '#F0F0F0',
              }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
              </svg>
              <span>
                {currentLanguage === 'ES' ? 'Escríbenos por WhatsApp' : 'Message us on WhatsApp'}
              </span>
            </a>
            
            {/* WhatsApp Business Compliance Notice */}
            <div className="max-w-lg mx-auto text-xs text-center p-4 rounded-lg border" style={{
              backgroundColor: isDark ? '#37373710' : '#F0F0F010',
              borderColor: isDark ? '#37373730' : '#F0F0F030',
              color: isDark ? '#F0F0F080' : '#37373780',
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              {currentLanguage === 'ES' ? (
                <>
                  Al contactarnos por WhatsApp, aceptas recibir información sobre FORMA y nuestros servicios. 
                  Puedes cancelar en cualquier momento respondiendo &quot;STOP&quot;. 
                  <a href="/privacy" className="underline hover:opacity-70" style={{color: isDark ? '#F0F0F0' : '#373737'}}>Ver política de privacidad</a>
                </>
              ) : (
                <>
                  By contacting us via WhatsApp, you agree to receive information about FORMA and our services. 
                  You can opt out anytime by replying &quot;STOP&quot;. 
                  <a href="/privacy" className="underline hover:opacity-70" style={{color: isDark ? '#F0F0F0' : '#373737'}}>View privacy policy</a>
                </>
              )}
            </div>
          </div>
          
          {/* Business Contact Information */}
          <div className="mt-8 space-y-2">
            <div className="text-sm" style={{
              color: isDark ? '#F0F0F080' : '#37373780',
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              +506 8676-6484
            </div>
            <div className="text-xs" style={{
              color: isDark ? '#F0F0F060' : '#37373760',
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              {currentLanguage === 'ES' ? 'FORMA Costa Rica • Gestión de Gimnasios' : 'FORMA Costa Rica • Gym Management'}
            </div>
            <div className="text-xs" style={{
              color: isDark ? '#F0F0F060' : '#37373760',
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              adrianvrj@cavos.xyz • www.formacr.com
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Compliance Information */}
      <footer className="py-12 px-6 lg:px-8 border-t" style={{ 
        backgroundColor: isDark ? '#37373710' : '#F0F0F010',
        borderColor: isDark ? '#37373730' : '#F0F0F030'
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ 
                color: themeColors.text,
                fontFamily: 'Romagothic, sans-serif'
              }}>
                FORMA
              </h3>
              <p className="text-sm leading-relaxed" style={{ 
                color: themeColors.textSecondary,
                fontFamily: 'TestUnifiedSerif, serif'
              }}>
                {currentLanguage === 'ES' 
                  ? 'Plataforma líder en gestión de gimnasios en Costa Rica. Simplificamos la administración de membresías, pagos y clientes.'
                  : 'Leading gym management platform in Costa Rica. We simplify membership, payment, and client administration.'
                }
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold" style={{ 
                color: themeColors.text,
                fontFamily: 'Romagothic, sans-serif'
              }}>
                {currentLanguage === 'ES' ? 'CONTACTO' : 'CONTACT'}
              </h4>
              <div className="space-y-2 text-sm" style={{ 
                color: themeColors.textSecondary,
                fontFamily: 'TestUnifiedSerif, serif'
              }}>
                <div>+506 8676-6484</div>
                <div>adrianvrj@cavos.xyz</div>
                <div>Alajuela, Costa Rica</div>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold" style={{ 
                color: themeColors.text,
                fontFamily: 'Romagothic, sans-serif'
              }}>
                {currentLanguage === 'ES' ? 'LEGAL' : 'LEGAL'}
              </h4>
              <div className="space-y-2">
                <a 
                  href="/privacy" 
                  className="block text-sm hover:opacity-70 transition-opacity" 
                  style={{ 
                    color: themeColors.textSecondary,
                    fontFamily: 'TestUnifiedSerif, serif'
                  }}
                >
                  {currentLanguage === 'ES' ? 'Política de Privacidad' : 'Privacy Policy'}
                </a>
                <a 
                  href="/terms" 
                  className="block text-sm hover:opacity-70 transition-opacity" 
                  style={{ 
                    color: themeColors.textSecondary,
                    fontFamily: 'TestUnifiedSerif, serif'
                  }}
                >
                  {currentLanguage === 'ES' ? 'Términos de Servicio' : 'Terms of Service'}
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Business Compliance */}
          <div className="border-t pt-8 space-y-4" style={{ 
            borderColor: isDark ? '#37373730' : '#F0F0F030'
          }}>
            <div className="text-xs leading-relaxed" style={{ 
              color: themeColors.textSecondary,
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              <strong>
                {currentLanguage === 'ES' ? 'Política de Comunicación WhatsApp Business:' : 'WhatsApp Business Communication Policy:'}
              </strong>{' '}
              {currentLanguage === 'ES' ? (
                <>
                  Al contactarnos, usted acepta recibir mensajes informativos sobre nuestros servicios de gestión de gimnasios. 
                  Solo enviamos información relevante sobre FORMA, actualizaciones de productos, y soporte técnico. 
                  Nunca compartimos su información con terceros. Puede cancelar estas comunicaciones en cualquier momento 
                  respondiendo "STOP" o "CANCELAR" a cualquier mensaje.
                </>
              ) : (
                <>
                  By contacting us, you agree to receive informational messages about our gym management services. 
                  We only send relevant information about FORMA, product updates, and technical support. 
                  We never share your information with third parties. You can opt out of these communications at any time 
                  by replying "STOP" to any message.
                </>
              )}
            </div>

            <div className="text-xs" style={{ 
              color: isDark ? '#F0F0F060' : '#37373760',
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              © 2024 FORMA Costa Rica. {currentLanguage === 'ES' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client'

import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function Terms() {
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeColors.bg }}>
      <Header 
        currentLanguage={currentLanguage} 
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />

      {/* Main Content */}
      <main className="flex-1 px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ 
              fontFamily: 'Romagothic, sans-serif',
              color: themeColors.text
            }}>
              {currentLanguage === 'ES' ? 'TÉRMINOS DE SERVICIO' : 'TERMS OF SERVICE'}
            </h1>
            <p className="text-lg" style={{ 
              color: themeColors.textSecondary,
              fontFamily: 'TestUnifiedSerif, serif'
            }}>
              {currentLanguage === 'ES' 
                ? 'Última actualización: Diciembre 2024'
                : 'Last updated: December 2024'
              }
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none" style={{ 
            color: themeColors.text,
            fontFamily: 'TestUnifiedSerif, serif'
          }}>
            {currentLanguage === 'ES' ? (
              <>
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    1. ACEPTACIÓN DE LOS TÉRMINOS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Al acceder y utilizar FORMA (en adelante, "el Servicio"), usted acepta estar sujeto a estos Términos de Servicio ("Términos"). Si no está de acuerdo con estos términos, no debe utilizar nuestro servicio.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    FORMA es un servicio de gestión de gimnasios que incluye administración de membresías, confirmación de pagos vía SINPE, y comunicación con clientes a través de múltiples canales incluyendo WhatsApp Business.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    2. DESCRIPCIÓN DEL SERVICIO
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    FORMA proporciona una plataforma integral para la gestión de gimnasios que incluye:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Registro y gestión de miembros</li>
                    <li>Confirmación y registro de pagos vía SINPE Móvil</li>
                    <li>Integración con SINPE Móvil para validación de pagos</li>
                    <li>Comunicación automatizada con miembros</li>
                    <li>Reportes y análisis de rendimiento</li>
                    <li>Soporte técnico y atención al cliente</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    3. CUENTA DE USUARIO Y RESPONSABILIDADES
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Para utilizar FORMA, debe crear una cuenta y proporcionar información precisa y completa. Usted es responsable de:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Mantener la confidencialidad de su cuenta y contraseña</li>
                    <li>Todas las actividades que ocurran bajo su cuenta</li>
                    <li>Notificar inmediatamente cualquier uso no autorizado</li>
                    <li>Proporcionar información veraz sobre su gimnasio y miembros</li>
                    <li>Cumplir con las leyes locales aplicables</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    4. SUSCRIPCIÓN Y FACTURACIÓN
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Los términos de suscripción incluyen:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Las tarifas se cobran mensualmente según el plan seleccionado</li>
                    <li>FORMA no procesa pagos - usted maneja los pagos con sus clientes directamente</li>
                    <li>Los reembolsos de suscripción están sujetos a nuestra política</li>
                    <li>Los precios pueden cambiar con previo aviso de 30 días</li>
                    <li>El incumplimiento de pago de suscripción puede resultar en suspensión del servicio</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    5. USO ACEPTABLE
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Al utilizar FORMA, usted se compromete a NO:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Utilizar el servicio para propósitos ilegales o no autorizados</li>
                    <li>Violar cualquier ley local, nacional o internacional</li>
                    <li>Transmitir contenido que sea dañino, ofensivo o inapropiado</li>
                    <li>Intentar acceder sin autorización a otros sistemas</li>
                    <li>Interferir con el funcionamiento del servicio</li>
                    <li>Enviar spam o comunicaciones no solicitadas a través de nuestra plataforma</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    6. COMUNICACIONES Y WHATSAPP BUSINESS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Al utilizar nuestros servicios de comunicación:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Acepta recibir comunicaciones operacionales y de soporte</li>
                    <li>Las comunicaciones de marketing requieren consentimiento explícito</li>
                    <li>Puede optar por no recibir comunicaciones respondiendo "STOP"</li>
                    <li>Cumplimos con las políticas de WhatsApp Business</li>
                    <li>No utilizamos su información para propósitos no autorizados</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    7. PROPIEDAD INTELECTUAL
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    El servicio FORMA, incluyendo su software, diseño, contenido y marca registrada, es propiedad exclusiva de FORMA Costa Rica. Usted conserva los derechos sobre los datos que ingresa en el sistema.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    8. LIMITACIÓN DE RESPONSABILIDAD
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    FORMA se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables por daños indirectos, incidentales o consecuenciales que puedan surgir del uso del servicio.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    9. TERMINACIÓN
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Cualquier parte puede terminar estos términos en cualquier momento. Nos reservamos el derecho de suspender o terminar su cuenta si viola estos términos. Al terminar, su acceso al servicio cesará inmediatamente.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    10. CAMBIOS A LOS TÉRMINOS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos se notificarán con al menos 30 días de anticipación. El uso continuado del servicio constituye aceptación de los términos modificados.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    11. LEY APLICABLE
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Estos términos se rigen por las leyes de Costa Rica. Cualquier disputa será resuelta en los tribunales de Alajuela, Costa Rica.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    12. CONTACTO
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Para preguntas sobre estos términos, contáctenos en:
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg" style={{
                    backgroundColor: isDark ? '#37373720' : '#F0F0F020'
                  }}>
                    <p><strong>Email:</strong> adrianvrj@cavos.xyz</p>
                    <p><strong>Teléfono:</strong> +506 8676-6484</p>
                    <p><strong>Dirección:</strong> Alajuela, Costa Rica</p>
                  </div>
                </section>
              </>
            ) : (
              <>
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    1. ACCEPTANCE OF TERMS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    By accessing and using FORMA (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these terms, you should not use our service.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    FORMA is a gym management service that includes membership administration, payment confirmation via SINPE, and client communication through multiple channels including WhatsApp Business.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    2. SERVICE DESCRIPTION
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    FORMA provides a comprehensive gym management platform that includes:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Member registration and management</li>
                    <li>Payment confirmation and recording via SINPE Mobile</li>
                    <li>SINPE Mobile integration for payment validation in Costa Rica</li>
                    <li>Automated member communication</li>
                    <li>Performance reports and analytics</li>
                    <li>Technical support and customer service</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    3. USER ACCOUNT AND RESPONSIBILITIES
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    To use FORMA, you must create an account and provide accurate and complete information. You are responsible for:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Maintaining the confidentiality of your account and password</li>
                    <li>All activities that occur under your account</li>
                    <li>Immediately notifying us of any unauthorized use</li>
                    <li>Providing truthful information about your gym and members</li>
                    <li>Complying with applicable local laws</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    4. SUBSCRIPTION AND BILLING
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Subscription terms include:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Fees are charged monthly according to the selected plan</li>
                    <li>FORMA does not process payments - you handle payments with your clients directly</li>
                    <li>Subscription refunds are subject to our refund policy</li>
                    <li>Prices may change with 30 days advance notice</li>
                    <li>Subscription payment failure may result in service suspension</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    5. ACCEPTABLE USE
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    By using FORMA, you agree NOT to:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Use the service for illegal or unauthorized purposes</li>
                    <li>Violate any local, national, or international laws</li>
                    <li>Transmit content that is harmful, offensive, or inappropriate</li>
                    <li>Attempt unauthorized access to other systems</li>
                    <li>Interfere with the service's operation</li>
                    <li>Send spam or unsolicited communications through our platform</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    6. COMMUNICATIONS AND WHATSAPP BUSINESS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    By using our communication services:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>You agree to receive operational and support communications</li>
                    <li>Marketing communications require explicit consent</li>
                    <li>You can opt out of communications by replying "STOP"</li>
                    <li>We comply with WhatsApp Business policies</li>
                    <li>We do not use your information for unauthorized purposes</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    7. INTELLECTUAL PROPERTY
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    The FORMA service, including its software, design, content, and trademarks, is the exclusive property of FORMA Costa Rica. You retain rights to the data you input into the system.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    8. LIMITATION OF LIABILITY
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    FORMA is provided "as is" without warranties of any kind. We shall not be liable for indirect, incidental, or consequential damages that may arise from using the service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    9. TERMINATION
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Either party may terminate these terms at any time. We reserve the right to suspend or terminate your account if you violate these terms. Upon termination, your access to the service will cease immediately.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    10. CHANGES TO TERMS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    We reserve the right to modify these terms at any time. Significant changes will be notified at least 30 days in advance. Continued use of the service constitutes acceptance of the modified terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    11. GOVERNING LAW
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    These terms are governed by Costa Rican law. Any disputes will be resolved in the courts of Alajuela, Costa Rica.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    12. CONTACT
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    For questions about these terms, contact us at:
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg" style={{
                    backgroundColor: isDark ? '#37373720' : '#F0F0F020'
                  }}>
                    <p><strong>Email:</strong> adrianvrj@cavos.xyz</p>
                    <p><strong>Phone:</strong> +506 8676-6484</p>
                    <p><strong>Address:</strong> Alajuela, Costa Rica</p>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <a 
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                backgroundColor: themeColors.text,
                color: themeColors.bg,
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>
                {currentLanguage === 'ES' ? 'Volver al inicio' : 'Back to home'}
              </span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
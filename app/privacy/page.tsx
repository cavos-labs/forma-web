'use client'

import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function Privacy() {
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
              {currentLanguage === 'ES' ? 'POLÍTICA DE PRIVACIDAD' : 'PRIVACY POLICY'}
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
                    1. INFORMACIÓN QUE RECOPILAMOS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    En FORMA recopilamos información cuando usted se registra en nuestro servicio, utiliza nuestras aplicaciones o se comunica con nosotros. Esta información incluye:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Información de registro: nombre, correo electrónico, número de teléfono</li>
                    <li>Información del gimnasio: nombre del negocio, dirección, información de contacto</li>
                    <li>Datos de miembros: información proporcionada sobre los miembros de su gimnasio</li>
                    <li>Información de pago: referencias de pagos SINPE para confirmación</li>
                    <li>Datos de uso: cómo utiliza nuestros servicios y características que utiliza</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    2. CÓMO UTILIZAMOS SU INFORMACIÓN
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Utilizamos la información recopilada para:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Proporcionar y mantener nuestros servicios de gestión de gimnasios</li>
                    <li>Confirmar y registrar pagos recibidos vía SINPE</li>
                    <li>Comunicarnos con usted sobre actualizaciones del servicio y soporte</li>
                    <li>Mejorar nuestros servicios y desarrollar nuevas características</li>
                    <li>Enviar comunicaciones de marketing (con su consentimiento)</li>
                    <li>Cumplir con obligaciones legales y regulatorias</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    3. COMUNICACIONES POR WHATSAPP BUSINESS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Cuando se comunica con nosotros a través de WhatsApp Business:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Solo enviamos mensajes relacionados con nuestros servicios de gestión de gimnasios</li>
                    <li>Incluimos información sobre productos, actualizaciones y soporte técnico</li>
                    <li>Nunca compartimos su número de teléfono con terceros</li>
                    <li>Puede cancelar estas comunicaciones respondiendo "STOP" o "CANCELAR"</li>
                    <li>Respetamos su privacidad y solo contactamos durante horarios comerciales</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    4. SEGURIDAD DE LOS DATOS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Cifrado de datos en tránsito y en reposo</li>
                    <li>Acceso restringido a información personal</li>
                    <li>Monitoreo regular de nuestros sistemas</li>
                    <li>Capacitación regular del personal en privacidad y seguridad</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    5. SUS DERECHOS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Usted tiene los siguientes derechos respecto a su información personal:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Derecho de acceso: puede solicitar una copia de sus datos personales</li>
                    <li>Derecho de rectificación: puede corregir información inexacta</li>
                    <li>Derecho de eliminación: puede solicitar la eliminación de sus datos</li>
                    <li>Derecho de portabilidad: puede solicitar la transferencia de sus datos</li>
                    <li>Derecho de oposición: puede oponerse al procesamiento de sus datos</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    6. CONTACTO
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede contactarnos en:
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
                    1. INFORMATION WE COLLECT
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    At FORMA, we collect information when you register for our service, use our applications, or communicate with us. This information includes:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Registration information: name, email address, phone number</li>
                    <li>Gym information: business name, address, contact information</li>
                    <li>Member data: information you provide about your gym members</li>
                    <li>Payment information: SINPE payment references for confirmation</li>
                    <li>Usage data: how you use our services and features you utilize</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    2. HOW WE USE YOUR INFORMATION
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    We use the collected information to:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Provide and maintain our gym management services</li>
                    <li>Confirm and record payments received via SINPE</li>
                    <li>Communicate with you about service updates and support</li>
                    <li>Improve our services and develop new features</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Comply with legal and regulatory obligations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    3. WHATSAPP BUSINESS COMMUNICATIONS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    When you communicate with us through WhatsApp Business:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>We only send messages related to our gym management services</li>
                    <li>We include information about products, updates, and technical support</li>
                    <li>We never share your phone number with third parties</li>
                    <li>You can opt out of these communications by replying "STOP"</li>
                    <li>We respect your privacy and only contact during business hours</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    4. DATA SECURITY
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Data encryption in transit and at rest</li>
                    <li>Restricted access to personal information</li>
                    <li>Regular monitoring of our systems</li>
                    <li>Regular staff training on privacy and security</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    5. YOUR RIGHTS
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Right of access: you can request a copy of your personal data</li>
                    <li>Right of rectification: you can correct inaccurate information</li>
                    <li>Right of erasure: you can request deletion of your data</li>
                    <li>Right of portability: you can request transfer of your data</li>
                    <li>Right of objection: you can object to processing of your data</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ 
                    fontFamily: 'Romagothic, sans-serif',
                    color: themeColors.text
                  }}>
                    6. CONTACT
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    If you have questions about this Privacy Policy or wish to exercise your rights, you can contact us at:
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
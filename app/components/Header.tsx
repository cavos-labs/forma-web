'use client'

import Image from "next/image";
import { useState, useEffect } from "react";

interface HeaderProps {
  currentLanguage?: 'EN' | 'ES';
  onLanguageChange?: (language: 'EN' | 'ES') => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export default function Header({ currentLanguage = 'EN', onLanguageChange, isDark = true, onThemeToggle }: HeaderProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);

  const handleLanguageSelect = (language: 'EN' | 'ES') => {
    onLanguageChange?.(language);
    setIsLanguageDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 300);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isMenuOpen || isLanguageDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, isLanguageDropdownOpen]);

  const getNavigationLinks = () => {
    if (currentLanguage === 'ES') {
      return [
        { label: 'Home', href: '/' },
        { label: 'Características', href: '#features' },
        { label: 'Contacto', href: '#contact' },
        { label: 'Precios', href: '/pricing' }
      ];
    }
    return [
      { label: 'Home', href: '/' },
      { label: 'Features', href: '#features' },
      { label: 'Contact', href: '#contact' },
      { label: 'Pricing', href: '/pricing' },
    ];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <>
      <nav className="flex items-center justify-between p-6 lg:p-8 relative z-40">
        <div className="flex items-center">
          <button 
            onClick={toggleMenu}
            className="cursor-pointer backdrop-blur-sm px-6 py-3 rounded text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 mr-8"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              backgroundColor: `${isDark ? '#F0F0F0' : '#373737'}10`,
              color: isDark ? '#F0F0F0' : '#373737'
            }}
          >
            <span className="transform transition-transform duration-200">MENU</span>
          </button>
          
          {/* Forma Icon */}
          <img 
            src={isDark ? "/images/forma-icon-white.png" : "/images/forma-icon-black.png"}
            alt="FORMA Icon"
            className="h-8 w-8"
          />
        </div>
        
        <div className="hidden lg:flex items-center space-x-8">
          {navigationLinks.map((link, index) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="hover:opacity-80 transition-all duration-200 text-sm font-medium relative group scroll-smooth"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                color: isDark ? '#F0F0F0' : '#373737'
              }}
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault();
                  const target = document.querySelector(link.href);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{
                backgroundColor: `${isDark ? '#F0F0F0' : '#373737'}60`
              }}></span>
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={onThemeToggle}
            className="cursor-pointer hover:opacity-80 transition-all duration-200 transform hover:-translate-y-0.5"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            style={{ color: isDark ? '#F0F0F0' : '#373737' }}
          >
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          
          {/* CTA Button */}
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="cursor-pointer px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hidden sm:block"
            style={{
              backgroundColor: isDark ? '#F0F0F0' : '#373737',
              color: isDark ? '#373737' : '#F0F0F0',
            }}
          >
            {currentLanguage === 'ES' ? 'Ver Precios' : 'View Pricing'}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="cursor-pointer text-sm hover:opacity-80 transition-all duration-200 flex items-center space-x-1 transform hover:-translate-y-0.5"
              style={{ color: isDark ? '#F0F0F0' : '#373737' }}
            >
              <span>{currentLanguage}</span>
              <svg 
                className={`w-3 h-3 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 backdrop-blur-sm rounded border py-1 min-w-[60px] animate-fadeIn" style={{
                backgroundColor: `${isDark ? '#F0F0F0' : '#373737'}10`,
                borderColor: `${isDark ? '#F0F0F0' : '#373737'}20`
              }}>
                <button 
                  onClick={() => handleLanguageSelect('EN')}
                  className="block w-full text-left px-3 py-2 text-sm transition-all duration-200"
                  style={{
                    color: isDark ? '#F0F0F0' : '#373737',
                    backgroundColor: currentLanguage === 'EN' ? `${isDark ? '#F0F0F0' : '#373737'}10` : 'transparent'
                  }}
                >
                  EN
                </button>
                <button 
                  onClick={() => handleLanguageSelect('ES')}
                  className="block w-full text-left px-3 py-2 text-sm transition-all duration-200"
                  style={{
                    color: isDark ? '#F0F0F0' : '#373737',
                    backgroundColor: currentLanguage === 'ES' ? `${isDark ? '#F0F0F0' : '#373737'}10` : 'transparent'
                  }}
                >
                  ES
                </button>
              </div>
            )}
          </div>
          <button className="cursor-pointer hover:opacity-80 transition-all duration-200 transform hover:-translate-y-0.5" style={{ 
            color: isDark ? '#F0F0F0' : '#373737' 
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile/Desktop Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${isMenuClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
            onClick={closeMenu}
          ></div>
          
          {/* Sidebar */}
          <div className={`fixed left-0 top-0 h-full w-80 shadow-2xl flex flex-col ${isMenuClosing ? 'animate-slideOutLeft' : 'animate-slideInLeft'}`} style={{
            backgroundColor: isDark ? '#373737' : '#F0F0F0'
          }}>
            {/* Header */}
            <div className="p-8 border-b" style={{
              borderColor: isDark ? '#F0F0F020' : '#37373720'
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={isDark ? "/images/forma-icon-white.png" : "/images/forma-icon-black.png"}
                    alt="FORMA Icon"
                    className="h-8 w-8"
                  />
                </div>
                <button 
                  onClick={closeMenu}
                  className="cursor-pointer transition-colors text-sm font-medium px-3 py-1 rounded"
                  style={{
                    color: isDark ? '#F0F0F0AA' : '#373737AA',
                    fontFamily: 'TestUnifiedSerif, serif'
                  }}
                >
                  {currentLanguage === 'ES' ? 'CERRAR' : 'CLOSE'}
                </button>
              </div>
            </div>
            
            {/* Main Navigation Links */}
            <div className="flex-1 pt-12 pb-6">
              <div className="px-8">
                {navigationLinks.map((link, index) => (
                  <div key={link.href} className="mb-2">
                    <a 
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          const target = document.querySelector(link.href);
                          if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                        closeMenu();
                      }}
                      className="hover:opacity-80 transition-all duration-200 text-3xl font-light block leading-tight"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        fontFamily: 'Romagothic, sans-serif',
                        color: isDark ? '#F0F0F0' : '#373737'
                      }}
                    >
                      {link.label.toUpperCase()} {index < navigationLinks.length - 1 && <span style={{ color: isDark ? '#F0F0F0' : '#373737' }}>+</span>}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-8 border-t" style={{
              borderColor: isDark ? '#F0F0F020' : '#37373720'
            }}>
              <div className="flex items-center justify-between text-sm">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleLanguageSelect('EN')}
                    className="cursor-pointer transition-colors"
                    style={{
                      color: currentLanguage === 'EN' ? (isDark ? '#F0F0F0' : '#373737') : (isDark ? '#F0F0F080' : '#37373780'),
                      fontWeight: currentLanguage === 'EN' ? '600' : '400',
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => handleLanguageSelect('ES')}
                    className="cursor-pointer transition-colors"
                    style={{
                      color: currentLanguage === 'ES' ? (isDark ? '#F0F0F0' : '#373737') : (isDark ? '#F0F0F080' : '#37373780'),
                      fontWeight: currentLanguage === 'ES' ? '600' : '400',
                      fontFamily: 'TestUnifiedSerif, serif'
                    }}
                  >
                    Español
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideInLeft {
          from { 
            transform: translateX(-100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutLeft {
          from { 
            transform: translateX(0);
            opacity: 1;
          }
          to { 
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.2s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out forwards;
        }
        
        .animate-slideOutLeft {
          animation: slideOutLeft 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
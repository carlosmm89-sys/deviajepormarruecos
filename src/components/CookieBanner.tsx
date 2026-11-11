import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

type CookieConsent = {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  personalization_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  security_storage: 'granted'; // Always granted
};

const defaultConsent: CookieConsent = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  personalization_storage: 'denied',
  functionality_storage: 'denied',
  security_storage: 'granted',
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsent>(defaultConsent);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedConsent = localStorage.getItem('cookie_consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as CookieConsent;
        updateGtagConsent(parsed);
        setPreferences(parsed);
      } catch (e) {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const updateGtagConsent = (consentOptions: CookieConsent) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      window.gtag('consent', 'update', consentOptions);
      if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push({ event: 'consent_updated' });
      }
    }
  };

  const saveConsent = (newPreferences: CookieConsent) => {
    localStorage.setItem('cookie_consent', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    updateGtagConsent(newPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
      personalization_storage: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });
  };

  const handleRejectAll = () => {
    saveConsent(defaultConsent);
  };

  const handleSaveSettings = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof CookieConsent) => {
    if (key === 'security_storage') return; 
    
    setPreferences((prev) => {
      const isCurrentlyGranted = prev[key] === 'granted';
      const newValue = isCurrentlyGranted ? 'denied' : 'granted';
      
      const newPrefs = { ...prev, [key]: newValue };
      
      if (key === 'ad_storage') {
        newPrefs.ad_user_data = newValue;
        newPrefs.ad_personalization = newValue;
      }
      
      return newPrefs;
    });
  };

  if (!isMounted) return null;
  if (!showBanner && !showSettings) return null;

  return (
    <>
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <Cookie className="h-6 w-6 text-brand-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 font-playfair">Preferencias de Privacidad</h2>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <p className="text-gray-600 text-[15px] leading-relaxed">
                Utilizamos cookies para garantizar el funcionamiento básico del sitio y, con tu consentimiento explícito, para mejorar tu experiencia a través del análisis de tráfico y mostrar publicidad personalizada de acuerdo con tu navegación.
              </p>
              
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                  <div className="p-4 flex items-center justify-between border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900 block">Estrictamente necesarias</span>
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-brand-primary mt-1 block">Siempre activas</span>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-primary/80 cursor-not-allowed">
                      <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed bg-white">
                    Estas cookies son esenciales para que puedas navegar por la web y no se pueden desactivar. Incluyen ajustes de seguridad y la retención del propio consentimiento interactivo.
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                    <span className="font-medium text-gray-900">Estadísticas y Analítica</span>
                    <button 
                      onClick={() => togglePreference('analytics_storage')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${preferences.analytics_storage === 'granted' ? 'bg-brand-primary' : 'bg-gray-200'}`}
                      aria-label="Toggle analíticas"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.analytics_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed">
                    Permiten medir y analizar el tráfico de forma anónima para que podamos mejorar nuestra estructura web y la experiencia general de los visitantes.
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                    <span className="font-medium text-gray-900">Marketing y Publicidad (Consent Mode v2)</span>
                    <button 
                      onClick={() => togglePreference('ad_storage')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${preferences.ad_storage === 'granted' ? 'bg-brand-primary' : 'bg-gray-200'}`}
                      aria-label="Toggle publicidad"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.ad_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed">
                    Se emplean para registrar el comportamiento de navegación y ser capaces de ofrecer anuncios atractivos, personalizados y de interés para ti en plataformas externas y redes sociales.
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                    <span className="font-medium text-gray-900">Personalización de Experiencia</span>
                    <button 
                      onClick={() => togglePreference('personalization_storage')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${preferences.personalization_storage === 'granted' ? 'bg-brand-primary' : 'bg-gray-200'}`}
                      aria-label="Toggle personalización"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.personalization_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed">
                    Facilitan que el sitio web recuerde información que cambie la forma en que el sitio se comporta o se ve, como tu idioma preferido o la moneda seleccionada.
                  </div>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
              <button
                onClick={handleRejectAll}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                Rechazar Todas
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 text-sm font-medium w-full sm:w-auto text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-sm"
              >
                Guardar Preferencias
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 text-sm font-medium w-full sm:w-auto text-white bg-brand-primary rounded-xl hover:bg-brand-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
              >
                Aceptar Todas
              </button>
            </div>
          </div>
        </div>
      )}

      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-[90] p-4 sm:p-6 pb-6 pointer-events-none animate-fade-in-up">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-5 sm:p-6 pointer-events-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8">
              
              <div className="flex-1 flex gap-4">
                <div className="hidden sm:flex flex-shrink-0 mt-1">
                  <div className="p-3 bg-brand-primary/10 rounded-xl">
                    <Cookie className="h-6 w-6 text-brand-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-gray-900 font-bold text-lg">Respetamos tu privacidad</h3>
                  <p className="text-gray-600 text-sm leading-relaxed pr-0 md:pr-4">
                    Utilizamos cookies para garantizar el funcionamiento de la web, personalizar nuestros servicios y ofrecerte contenido útil mediante el análisis de la forma en que interactúas con nuestro sitio web, cumpliendo con la normativa del Consent Mode.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 text-center"
                >
                  Configurar
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 whitespace-nowrap text-center"
                >
                  Rechazar
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-brand-primary shadow-sm rounded-xl hover:shadow hover:bg-brand-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 whitespace-nowrap text-center"
                >
                  Aceptar todas
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

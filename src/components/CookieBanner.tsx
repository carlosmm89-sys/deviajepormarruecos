import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

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
  const { tr } = useTranslation();
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
                <h2 className="text-xl font-semibold text-gray-900 font-playfair">{tr({ es: 'Preferencias de Privacidad', en: 'Privacy preferences', fr: 'Préférences de confidentialité' })}</h2>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={tr({ es: 'Cerrar', en: 'Close', fr: 'Fermer' })}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <p className="text-gray-600 text-[15px] leading-relaxed">
                {tr({ es: 'Utilizamos cookies para garantizar el funcionamiento básico del sitio y, con tu consentimiento explícito, para mejorar tu experiencia a través del análisis de tráfico y mostrar publicidad personalizada de acuerdo con tu navegación.', en: 'We use cookies to ensure the basic operation of the site and, with your explicit consent, to improve your experience through traffic analysis and to show personalised advertising based on your browsing.', fr: 'Nous utilisons des cookies pour assurer le fonctionnement de base du site et, avec votre consentement explicite, pour améliorer votre expérience grâce à l’analyse du trafic et afficher des publicités personnalisées selon votre navigation.' })}
              </p>
              
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                  <div className="p-4 flex items-center justify-between border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900 block">{tr({ es: 'Estrictamente necesarias', en: 'Strictly necessary', fr: 'Strictement nécessaires' })}</span>
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-brand-primary mt-1 block">{tr({ es: 'Siempre activas', en: 'Always active', fr: 'Toujours actifs' })}</span>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-brand-primary/80 cursor-not-allowed">
                      <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed bg-white">
                    {tr({ es: 'Estas cookies son esenciales para que puedas navegar por la web y no se pueden desactivar. Incluyen ajustes de seguridad y la retención del propio consentimiento interactivo.', en: 'These cookies are essential for browsing the website and cannot be disabled. They include security settings and storing your consent choice.', fr: 'Ces cookies sont indispensables pour naviguer sur le site et ne peuvent pas être désactivés. Ils incluent les paramètres de sécurité et la conservation de votre choix de consentement.' })}
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                    <span className="font-medium text-gray-900">{tr({ es: 'Estadísticas y Analítica', en: 'Statistics and analytics', fr: 'Statistiques et analyse' })}</span>
                    <button 
                      onClick={() => togglePreference('analytics_storage')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${preferences.analytics_storage === 'granted' ? 'bg-brand-primary' : 'bg-gray-200'}`}
                      aria-label="Toggle analíticas"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.analytics_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed">
                    {tr({ es: 'Permiten medir y analizar el tráfico de forma anónima para que podamos mejorar nuestra estructura web y la experiencia general de los visitantes.', en: 'They let us measure and analyse traffic anonymously so we can improve the website and the overall visitor experience.', fr: 'Ils permettent de mesurer et d’analyser le trafic de façon anonyme afin d’améliorer le site et l’expérience des visiteurs.' })}
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                    <span className="font-medium text-gray-900">{tr({ es: 'Marketing y Publicidad (Consent Mode v2)', en: 'Marketing and advertising (Consent Mode v2)', fr: 'Marketing et publicité (Consent Mode v2)' })}</span>
                    <button 
                      onClick={() => togglePreference('ad_storage')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${preferences.ad_storage === 'granted' ? 'bg-brand-primary' : 'bg-gray-200'}`}
                      aria-label="Toggle publicidad"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.ad_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed">
                    {tr({ es: 'Se emplean para registrar el comportamiento de navegación y ser capaces de ofrecer anuncios atractivos, personalizados y de interés para ti en plataformas externas y redes sociales.', en: 'They are used to record browsing behaviour so we can show you relevant, personalised ads on external platforms and social networks.', fr: 'Ils servent à enregistrer le comportement de navigation afin de vous proposer des publicités personnalisées et pertinentes sur des plateformes externes et les réseaux sociaux.' })}
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors bg-white">
                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                    <span className="font-medium text-gray-900">{tr({ es: 'Personalización de Experiencia', en: 'Personalisation', fr: 'Personnalisation' })}</span>
                    <button 
                      onClick={() => togglePreference('personalization_storage')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${preferences.personalization_storage === 'granted' ? 'bg-brand-primary' : 'bg-gray-200'}`}
                      aria-label="Toggle personalización"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.personalization_storage === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="p-4 pt-3 text-sm text-gray-500 leading-relaxed">
                    {tr({ es: 'Facilitan que el sitio web recuerde información que cambie la forma en que el sitio se comporta o se ve, como tu idioma preferido o la moneda seleccionada.', en: 'They let the website remember information that changes how it behaves or looks, such as your preferred language or selected currency.', fr: 'Ils permettent au site de mémoriser des informations qui modifient son comportement ou son apparence, comme votre langue préférée ou la devise choisie.' })}
                  </div>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
              <button
                onClick={handleRejectAll}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                {tr({ es: 'Rechazar Todas', en: 'Reject all', fr: 'Tout refuser' })}
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 text-sm font-medium w-full sm:w-auto text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-sm"
              >
                {tr({ es: 'Guardar Preferencias', en: 'Save preferences', fr: 'Enregistrer les préférences' })}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 text-sm font-medium w-full sm:w-auto text-white bg-brand-primary rounded-xl hover:bg-brand-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
              >
                {tr({ es: 'Aceptar Todas', en: 'Accept all', fr: 'Tout accepter' })}
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
                  <h3 className="text-gray-900 font-bold text-lg">{tr({ es: 'Respetamos tu privacidad', en: 'We respect your privacy', fr: 'Nous respectons votre vie privée' })}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed pr-0 md:pr-4">
                    {tr({ es: 'Utilizamos cookies para garantizar el funcionamiento de la web, personalizar nuestros servicios y ofrecerte contenido útil mediante el análisis de la forma en que interactúas con nuestro sitio web, cumpliendo con la normativa del Consent Mode.', en: 'We use cookies to make the website work, personalise our services and offer you useful content by analysing how you interact with our website, in line with Consent Mode rules.', fr: 'Nous utilisons des cookies pour faire fonctionner le site, personnaliser nos services et vous proposer un contenu utile en analysant votre utilisation du site, conformément au Consent Mode.' })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 text-center"
                >
                  {tr({ es: 'Configurar', en: 'Settings', fr: 'Paramètres' })}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 whitespace-nowrap text-center"
                >
                  {tr({ es: 'Rechazar', en: 'Reject', fr: 'Refuser' })}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-brand-primary shadow-sm rounded-xl hover:shadow hover:bg-brand-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 whitespace-nowrap text-center"
                >
                  {tr({ es: 'Aceptar todas', en: 'Accept all', fr: 'Tout accepter' })}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

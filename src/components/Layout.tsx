import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Map, User, LogOut, Menu, X, Shield, Heart, BookOpen, Globe, DollarSign, ChevronDown, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';
import { BusinessSettings } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage, Language } from '../context/LanguageContext';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import QuoteWizard from './QuoteWizard';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<BusinessSettings | null>(null);
  const location = useLocation();
  const isAdminLoggedIn = user?.role === 'admin';

  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { currencyCode, setCurrencyCode } = useCurrency();
  const [isI18nOpen, setIsI18nOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.i18n-dropdown-container')) {
        setIsI18nOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  React.useEffect(() => {
    dbService.getBusinessSettings().then(data => {
      if (data) {
        setSettings(data);
        if (data.favicon_url) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.favicon_url;
        }
      }
    });
  }, []);

  type NavItem = {
    name: string;
    path: string;
    icon: any;
    subItems?: { name: string; path: string }[];
  };

  const navLinks: NavItem[] = [
    { name: t('nav_destinations') || 'Destinos', path: '/destinations', icon: Map },
    { 
      name: 'Viajes Exclusivos', 
      path: '#', 
      icon: MapPin,
      subItems: [
        { name: 'Luna de Miel', path: '/coleccion/luna-de-miel' },
        { name: 'Entrega de Anillo', path: '/coleccion/entrega-de-anillo' },
        { name: 'Viajes en Familia', path: '/coleccion/viajes-en-familia' },
        { name: 'Viajes de Lujo', path: '/coleccion/viajes-de-lujo' },
        { name: 'Viajes en Grupo', path: '/coleccion/viajes-en-grupo' },
      ]
    },
    { name: t('nav_tours') || 'Tours', path: '/tours', icon: MapPin },
    { name: 'Actividades', path: '/actividades', icon: MapPin },
    { name: 'Galería', path: '/galeria', icon: MapPin },
    { name: t('nav_blog') || 'Blog', path: '/blog', icon: BookOpen },
  ];

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link to="/" className="flex items-center space-x-3">
              {settings?.logo_url ? (
                <img src={settings.logo_url} width="150" height="80" alt="Marruecos Experiencia Logo" className="h-20 max-h-[85px] w-auto object-contain" />
              ) : (
                <>
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                    <Compass className="text-white w-7 h-7" />
                  </div>
                  <span className="text-3xl font-serif font-bold tracking-tight text-gray-900">{settings?.site_name || 'Marruecos Experiencia'}</span>
                </>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.subItems ? (
                    <div className="flex items-center space-x-1 cursor-pointer text-[14px] font-bold text-gray-700 hover:text-brand-primary transition-colors py-4">
                      <span className="uppercase tracking-wide">{link.name}</span>
                      <ChevronDown className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-300" />
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-1 text-[14px] font-bold py-4 transition-colors hover:text-brand-primary uppercase tracking-wide ${
                        location.pathname === link.path ? 'text-brand-primary' : 'text-gray-700'
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  )}

                  {link.subItems && (
                     <div className="absolute top-[100%] left-0 w-64 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top scale-95 group-hover:scale-100 pt-2">
                      <div className="py-2">
                        {link.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-6 py-3 text-xs font-bold text-gray-600 hover:text-brand-primary hover:bg-gray-50 transition-colors uppercase tracking-widest"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center space-x-6 ml-4 pl-4 border-l border-gray-200">
                <Link to="/favoritos" className="text-gray-600 hover:text-brand-accent transition-colors flex items-center" title="Favoritos">
                  <Heart className="w-5 h-5" />
                </Link>

                {/* FORCE VITE HMR UPDATE - Context Dropdown (Lang / Currency) */}
                <div className="relative i18n-dropdown-container flex items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsI18nOpen(!isI18nOpen); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-bold text-gray-700"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="uppercase">{language}</span>
                    <span className="text-gray-300">|</span>
                    <span>{currencyCode}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isI18nOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isI18nOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2"
                      >
                        <div className="p-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Idioma</p>
                          <div className="grid grid-cols-1 gap-1">
                            {(['es', 'en', 'fr'] as Language[]).map((l) => (
                              <button
                                key={l}
                                onClick={() => { setLanguage(l); setIsI18nOpen(false); }}
                                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${language === l ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-gray-50 text-gray-700'}`}
                              >
                                <span>{l === 'es' ? '🇪🇸 Español' : l === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-2 border-t border-gray-50 mt-1 pt-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Moneda</p>
                          <div className="grid grid-cols-2 gap-1">
                            {(['EUR', 'USD', 'GBP', 'MAD'] as CurrencyCode[]).map((c) => (
                              <button
                                key={c}
                                onClick={() => { setCurrencyCode(c); setIsI18nOpen(false); }}
                                className={`flex items-center justify-center py-2 text-sm font-bold rounded-xl transition-colors ${currencyCode === c ? 'bg-brand-accent/10 text-brand-accent' : 'hover:bg-gray-50 text-gray-700'}`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={() => setIsWizardOpen(true)} className="btn-primary text-sm flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> Diseña tu viaje
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-xl"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <div key={link.name} className="flex flex-col space-y-3 pb-2">
                    {link.subItems ? (
                      <>
                        <div className="flex items-center space-x-2 text-base font-bold text-gray-900 border-b border-gray-50 pb-2">
                          <span className="uppercase">{link.name}</span>
                        </div>
                        <div className="pl-4 flex flex-col space-y-4 pt-1 pb-2">
                          {link.subItems.map(subItem => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setIsMenuOpen(false)}
                              className="text-sm font-bold text-gray-500 hover:text-brand-primary uppercase tracking-wider"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-base font-bold text-gray-900 border-b border-gray-50 pb-2"
                      >
                        <span className="uppercase">{link.name}</span>
                      </Link>
                    )}
                  </div>
                ))}

                <Link
                  to="/favoritos"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-lg font-medium text-gray-700 pb-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>{t('nav_favorites') || 'Favoritos'}</span>
                </Link>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Idioma</p>
                    <div className="flex flex-wrap gap-2">
                      {(['es', 'en', 'fr'] as Language[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLanguage(l)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors uppercase ${language === l ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Divisa</p>
                    <div className="flex flex-wrap gap-2">
                       {(['EUR', 'USD', 'GBP', 'MAD'] as CurrencyCode[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => setCurrencyCode(c)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${currencyCode === c ? 'bg-brand-accent text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <a
                  href="#contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary w-full text-center mt-4"
                >
                  Contacto
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer id="contacto" className="bg-[#1A1A1A] border-t border-gray-900 pt-16 pb-8 text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Logo & About */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center space-x-3">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} width="120" height="64" alt="De Viaje por Marruecos" className="h-16 w-auto object-contain brightness-0 invert" />
                ) : (
                  <>
                    <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                      <Compass className="text-white w-7 h-7" />
                    </div>
                    <span className="text-xl font-serif font-bold tracking-tight text-white">{settings?.site_name || 'Marruecos Experiencia'}</span>
                  </>
                )}
              </Link>
              <p className="text-gray-400 leading-relaxed text-sm">
                Especialistas en viajes a medida por Marruecos. Descubre la magia del Magreb con expertos locales, durmiendo bajo las estrellas y cruzando el Atlas.
              </p>
            </div>

            {/* Column 2: Enlaces Rápidos */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Navegación</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-brand-accent transition-colors">Inicio</Link></li>
                <li><Link to="/destinations" className="hover:text-brand-accent transition-colors">Destinos</Link></li>
                <li><Link to="/tours" className="hover:text-brand-accent transition-colors">Experiencias y Rutas</Link></li>
                <li><Link to="/blog" className="hover:text-brand-accent transition-colors">Blog y Consejos</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Información Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/aviso-legal" className="hover:text-brand-accent transition-colors">Aviso Legal</Link></li>
                <li><Link to="/privacidad" className="hover:text-brand-accent transition-colors">Política de Privacidad</Link></li>
                <li><Link to="/cookies" className="hover:text-brand-accent transition-colors">Política de Cookies</Link></li>
                <li><Link to="/condiciones" className="hover:text-brand-accent transition-colors">Términos y Condiciones</Link></li>
              </ul>
            </div>

            {/* Column 4: Contacto */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Contacto Rápido</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span>Marrakech, Marruecos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 text-brand-accent flex-shrink-0">✉</span>
                  <a href="mailto:info@marruecosexperiencia.com" className="hover:text-white transition-colors">info@marruecosexperiencia.com</a>
                </li>
                <li className="flex items-start gap-3 pt-2">
                  <span className="flex items-center justify-center w-5 h-5 text-brand-accent flex-shrink-0">📞</span>
                  <a href={`https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || ''}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors font-bold text-lg text-white">
                    {settings?.whatsapp_number || '+212 600 000 000'}
                  </a>
                </li>
              </ul>
            </div>
            
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>© {new Date().getFullYear()} Vivir Marruecos. Todos los derechos reservados.</p>
            
            <div className="flex items-center gap-6">
              {isAdminLoggedIn ? (
                <>
                  <Link to="/admin/destinations" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Shield className="w-4 h-4" /> Panel Admin
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 transition-colors border-l border-white/10 pl-6">
                    <LogOut className="w-4 h-4" /> Salir
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors" title="Acceso Privado">
                  <Shield className="w-4 h-4" /> Intranet
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || ''}${settings?.whatsapp_welcome_message ? `?text=${encodeURIComponent(settings.whatsapp_welcome_message)}` : ''}`}
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 lg:bottom-10 right-6 lg:right-10 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
          ¡Hablemos de tu viaje!
        </span>
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
      {/* Floating Quote Wizard Button */}
      <button 
        onClick={() => setIsWizardOpen(true)}
        className="fixed bottom-6 lg:bottom-10 left-6 lg:left-10 z-50 bg-[#D97D3A] text-white p-4 rounded-full shadow-[0_4px_24px_rgba(217,125,58,0.4)] hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <span className="absolute left-full ml-4 bg-white text-gray-800 text-sm font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Diseña tu viaje a medida
        </span>
        <Map className="w-8 h-8" />
      </button>

      {/* Quote Wizard Modal */}
      <QuoteWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} settings={settings} />
    </div>
  );
}

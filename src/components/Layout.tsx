import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Map, User, LogOut, Menu, X, Shield, Heart, BookOpen, Globe, DollarSign, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';
import { BusinessSettings } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage, Language } from '../context/LanguageContext';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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

  const navLinks = [
    { name: t('nav_home'), path: '/', icon: Compass },
    { name: t('nav_destinations'), path: '/destinations', icon: Map },
    { name: t('nav_blog'), path: '/blog', icon: BookOpen },
    { name: t('nav_favorites'), path: '/favoritos', icon: Heart },
  ];

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-morphism">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link to="/" className="flex items-center space-x-3">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={settings?.site_name || 'Logo'} className="h-16 w-auto object-contain" />
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
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 text-base font-medium transition-colors hover:text-brand-primary ${
                    location.pathname === link.path ? 'text-brand-primary' : 'text-gray-700'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="flex items-center space-x-6 ml-4 pl-4 border-l border-gray-200">
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
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-2"
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

                {isAdminLoggedIn ? (
                  <>
                    <Link 
                      to="/admin/destinations" 
                      className="btn-primary text-sm flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Panel Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Salir</span>
                    </button>
                  </>
                ) : (
                  <>
                    <a href="#contacto" className="btn-primary text-sm flex items-center justify-center">
                      Contacto
                    </a>
                    <Link to="/admin/login" className="p-2 text-gray-400 hover:text-brand-primary transition-colors rounded-full hover:bg-orange-50" title="Acceso Admin">
                      <Shield className="w-5 h-5" />
                    </Link>
                  </>
                )}
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
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-lg font-medium text-gray-700"
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}

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
                
                {isAdminLoggedIn ? (
                  <>
                    <Link
                      to="/admin/destinations"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 text-lg font-medium text-brand-primary"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Panel Admin</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-lg font-medium text-red-500 pt-4 border-t border-gray-100"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                ) : (
                  <a
                    href="#contacto"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary w-full text-center mt-4"
                  >
                    Contacto
                  </a>
                )}
                
                {!isAdminLoggedIn && (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex justify-center text-gray-300 hover:text-brand-primary pt-6"
                    title="Acceso Admin"
                  >
                    <Shield className="w-6 h-6" />
                  </Link>
                )}
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

      <footer id="contacto" className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {settings?.site_name || 'Marruecos Experiencia'}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

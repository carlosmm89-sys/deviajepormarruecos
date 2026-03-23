import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Map, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isAdminLoggedIn = localStorage.getItem('admin_session') === 'true';

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Compass },
    { name: 'Destinos', path: '/destinations', icon: Map },
  ];

  if (isAdminLoggedIn) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-morphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                <Compass className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">Marruecos Experiencia</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-brand-accent ${
                    location.pathname === link.path ? 'text-brand-accent' : 'text-gray-600'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              ))}
              
              {isAdminLoggedIn ? (
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors border-l border-gray-200 pl-4 ml-4"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Admin</span>
                </button>
              ) : (
                <Link to="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Acceso Admin
                </Link>
              )}

              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                {user ? (
                  <>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <button
                      onClick={() => signOut()}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button onClick={signIn} className="btn-primary text-sm">
                    Iniciar Sesión
                  </button>
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
                
                {isAdminLoggedIn && (
                  <button
                    onClick={() => {
                      handleAdminLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-lg font-medium text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Admin</span>
                  </button>
                )}

                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-lg font-medium text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      signIn();
                      setIsMenuOpen(false);
                    }}
                    className="btn-primary w-full"
                  >
                    Iniciar Sesión
                  </button>
                )}
                
                {!isAdminLoggedIn && (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center text-sm text-gray-400 pt-4"
                  >
                    Acceso Admin
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

      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Marruecos Experiencia. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

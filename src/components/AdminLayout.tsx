import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Map, LogOut, Settings, Users, BookOpen, Menu, X, Home, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Destinos', path: '/admin/destinations', icon: Map },
    { name: 'Tours', path: '/admin/tours', icon: Compass },
    { name: 'Blog', path: '/admin/blog', icon: BookOpen },
    { name: 'Galería', path: '/admin/gallery', icon: Image },
    { name: 'Leads', path: '/admin/leads', icon: Users },
    { name: 'Configuración', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#1e293b] border-r border-[#0f172a] text-slate-300 z-20 shadow-xl">
        <div className="h-20 flex items-center px-6 border-b border-slate-700/50 bg-[#0f172a]/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center group-hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-white leading-tight">Admin</span>
              <span className="text-xs text-brand-primary font-medium tracking-wider uppercase">Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Gestión</p>
          {navItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' || location.pathname === '/admin/' 
              : location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 translate-x-1' 
                    : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-[#0f172a]/30">
          <div className="flex items-center gap-3 px-4 py-2 mb-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-brand-primary font-medium truncate">Superadmin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#1e293b] border-b border-[#0f172a] flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold text-lg text-white">Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-72 bg-[#1e293b] border-r border-[#0f172a] text-slate-300 z-50 flex flex-col shadow-2xl md:hidden"
              >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700/50 bg-[#0f172a]/50">
                  <span className="font-serif font-bold text-xl text-white">Menú</span>
                  <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = item.path === '/admin' 
                      ? location.pathname === '/admin' || location.pathname === '/admin/' 
                      : location.pathname.includes(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-brand-primary text-white shadow-md' 
                            : 'hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="p-4 border-t border-slate-700/50 bg-[#0f172a]/30">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileOpen(false);
                    }}
                    className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-slate-800 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full p-4 md:p-8 md:pt-10"
            >
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}

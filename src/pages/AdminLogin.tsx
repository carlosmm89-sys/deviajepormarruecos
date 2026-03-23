import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, AlertCircle, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in as admin
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/destinations');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      navigate('/admin/destinations');
    } catch (err: any) {
      console.error(err);
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu email.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });

      if (resetError) throw resetError;
      
      setSuccess('Si el correo existe, recibirás un enlace para recuperar tu contraseña.');
    } catch (err: any) {
      console.error(err);
      setError('Ocurrió un error al intentar solicitar la recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 z-10 relative"
      >
        <AnimatePresence mode="wait">
          {!isRecoveryMode ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Lock className="text-brand-primary w-8 h-8" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Portal Admin</h1>
                <p className="text-slate-500">Accede con tus credenciales seguras</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm border border-red-100"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all pl-11"
                      placeholder="admin@tonwy.com"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all pl-11 pr-11"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(true);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-sm text-brand-primary hover:text-brand-accent font-medium transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-accent text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="recovery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver al login
                </button>
              </div>

              <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-slate-700 w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">Recuperar Acceso</h2>
                <p className="text-slate-500 text-sm">Ingresa tu email y te enviaremos las instrucciones</p>
              </div>

              <form onSubmit={handleRecovery} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm border border-red-100"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 text-sm border border-green-100"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </motion.div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 focus:bg-white transition-all pl-11"
                      placeholder="admin@tonwy.com"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Enviar Instrucciones'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BusinessSettings } from '../types';
import { Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { dbService } from '../services/dbService';

export default function AdminSettings() {
  const location = useLocation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<BusinessSettings>();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await dbService.getBusinessSettings();
      if (data) {
        setSettings(data);
        reset(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: BusinessSettings) => {
    try {
      setError(null);
      setSuccess(null);
      await dbService.saveBusinessSettings(data);
      setSuccess('Configuración guardada correctamente.');
      fetchSettings();
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError('Error al guardar la configuración.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <p>{success}</p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Panel de Administración</h1>
          <div className="flex gap-4">
            <Link 
              to="/admin/destinations" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('destinations') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Destinos
            </Link>
            <Link 
              to="/admin/tours" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('tours') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Tours
            </Link>
            <Link 
              to="/admin/leads" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('leads') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Leads
            </Link>
            <Link 
              to="/admin/settings" 
              className={`text-sm font-bold pb-1 border-b-2 transition-all ${location.pathname.includes('settings') ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Configuración
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Configuración del Negocio</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Nombre del Sitio</label>
              <input {...register('site_name')} className="input-field" placeholder="Marruecos Experiencia" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Email de Contacto</label>
              <input type="email" {...register('admin_email')} className="input-field" placeholder="info@ejemplo.com" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Número de WhatsApp</label>
              <input {...register('whatsapp_number')} className="input-field" placeholder="+34 600 000 000" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Mensaje de Bienvenida WhatsApp</label>
              <textarea {...register('whatsapp_welcome_message')} className="input-field min-h-[100px]" placeholder="Hola, me gustaría más información..." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">URL Instagram</label>
              <input {...register('instagram_url')} className="input-field" placeholder="https://instagram.com/..." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">URL Facebook</label>
              <input {...register('facebook_url')} className="input-field" placeholder="https://facebook.com/..." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">URL TripAdvisor</label>
              <input {...register('tripadvisor_url')} className="input-field" placeholder="https://tripadvisor.com/..." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Dirección Footer</label>
              <textarea {...register('footer_address')} className="input-field min-h-[80px]" placeholder="Marrakech, Marruecos..." />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save className="w-5 h-5" /> Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

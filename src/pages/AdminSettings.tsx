import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BusinessSettings } from '../types';
import { Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { dbService } from '../services/dbService';
import ImageUpload from '../components/ImageUpload';

export default function AdminSettings() {
  const location = useLocation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<BusinessSettings>();

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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 mt-1">Administra los ajustes del negocio y SEO.</p>
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

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold mb-4">Recursos Gráficos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Controller
                  name="logo_url"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload 
                      label="Logo del Sitio Gráfico" 
                      value={field.value || ''} 
                      onChange={field.onChange} 
                    />
                  )}
                />
                
                <Controller
                  name="favicon_url"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload 
                      label="Favicon (Icono de Pestaña)" 
                      value={field.value || ''} 
                      onChange={field.onChange} 
                    />
                  )}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold mb-4">Widgets Externos (HTML/Scripts)</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 block">Widget de Google Reviews (Ficha de Google)</label>
                  <p className="text-xs text-gray-500 mb-2">Pega aquí el código HTML proporcionado por Elfsight o Trustindex para mostrar tus reseñas de Google en la web.</p>
                  <textarea {...register('google_reviews_widget')} className="input-field font-mono text-xs min-h-[120px]" placeholder="<script src='...'></script>\n<div class='elfsight-app-...'></div>" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 block">Widget de Feed de Instagram (Galería)</label>
                  <p className="text-xs text-gray-500 mb-2">Pega aquí el código HTML para inyectar tu galería interactiva de Instagram en la página de inicio.</p>
                  <textarea {...register('instagram_widget')} className="input-field font-mono text-xs min-h-[120px]" placeholder="<script src='...'></script>\n<div class='elfsight-app-...'></div>" />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold mb-4">Configuración de Correo (SMTP)</h3>
              <p className="text-sm text-gray-500 mb-6">Configura los datos del servidor para el envío de correos automatizados del sistema.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Servidor SMTP (Host)</label>
                  <input {...register('smtp_host')} className="input-field" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Puerto SMTP</label>
                  <input {...register('smtp_port')} className="input-field" placeholder="587 o 465" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Usuario SMTP</label>
                  <input {...register('smtp_user')} className="input-field" placeholder="correo@ejemplo.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Contraseña SMTP</label>
                  <input type="password" {...register('smtp_password')} className="input-field" placeholder="••••••••••••" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Remitente: Email</label>
                  <input type="email" {...register('smtp_from_email')} className="input-field" placeholder="no-reply@ejemplo.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Remitente: Nombre</label>
                  <input {...register('smtp_from_name')} className="input-field" placeholder="Marruecos Experiencia" />
                </div>
              </div>
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

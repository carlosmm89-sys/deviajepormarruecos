import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';
import { BusinessSettings } from '../types';
import toast from 'react-hot-toast';
import { 
  X, MapPin, Calendar, Users, Mail, ArrowRight, ArrowLeft, Send
} from 'lucide-react';

interface QuoteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings | null;
}

export default function QuoteWizard({ isOpen, onClose, settings }: QuoteWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    destination: '',
    travelDate: '',
    duration: '',
    adults: 2,
    children: 0,
    firstName: '',
    email: '',
    phone: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setDestination = (val: string) => {
    setFormData(prev => ({ ...prev, destination: val }));
    handleNext();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) {
      toast.error('Error de configuración. Intente de nuevo.');
      return;
    }
    setIsSubmitting(true);
    try {
      const paxDetails = `Adultos: ${formData.adults}, Niños: ${formData.children}`;
      
      const newLead = {
        form_type: 'wizard_quote',
        first_name: formData.firstName,
        email: formData.email,
        phone: formData.phone || '',
        approximate_date: formData.travelDate || new Date().toISOString().split('T')[0],
        passengers_count: Number(formData.adults) + Number(formData.children),
        message: `[Cotizador Mágico]\nDestino Ideal: ${formData.destination}\nDuración: ${formData.duration}\nFamilia: ${paxDetails}\n\nMensaje:\n${formData.message}`,
        status: 'new' as const
      };

      await dbService.createLead(newLead);

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: newLead, settings, tour_title: `Cotización Personalizada` })
      }).catch(err => console.error('SMTP fetch fail:', err));

      setIsSuccess(true);
    } catch (error) {
       console.error(error);
       toast.error('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const destinations = ['Desierto del Sahara', 'Norte de Marruecos', 'Ciudades Imperiales', 'Costa Atlántica', 'Gran Tour de Marruecos', 'Actividades', 'Mixto / Aún no lo sé'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between z-10 bg-white">
          <div>
            <h2 className="text-xl font-bold font-serif text-gray-900 leading-tight">Diseña tu Viaje a Medida</h2>
            {!isSuccess && <p className="text-sm text-gray-500 font-medium mt-1">Paso {step} de 4</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isSuccess && (
          <div className="w-full h-1 bg-gray-100 z-10">
            <div 
              className="h-full bg-brand-accent transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 relative bg-gray-50">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-10 h-10 text-green-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold font-serif text-gray-900 mb-2">¡Solicitud Enviada!</h3>
                  <p className="text-gray-500">Nuestro equipo experto en Marruecos revisará tus preferencias y te contactará en menos de 24 horas con una propuesta a medida.</p>
                </div>
                <button onClick={onClose} className="mt-8 btn-primary px-8 relative z-50">
                  Volver a la Web
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col justify-center min-h-[300px]"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary mb-6">
                      <MapPin className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">¿Qué zona te gustaría explorar?</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {destinations.map(d => (
                        <button
                          key={d}
                          onClick={() => setDestination(d)}
                          className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                            formData.destination === d 
                            ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' 
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:shadow-sm'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary mb-6">
                      <Calendar className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">¿Cuándo tienes pensado viajar?</h3>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Fecha aproximada de llegada</label>
                        <input 
                          type="date" 
                          name="travelDate"
                          value={formData.travelDate}
                          onChange={handleChange}
                          className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-gray-700" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">¿Cuántos días te gustaría estar?</label>
                        <select 
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-gray-700"
                        >
                          <option value="">Selecciona la duración</option>
                          <option value="1-3 días">Escapada (1-3 días)</option>
                          <option value="4-7 días">Media (4-7 días)</option>
                          <option value="8-12 días">Viaje Completo (8-12 días)</option>
                          <option value="+12 días">Gran Aventura (+12 días)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary mb-6">
                      <Users className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">¿Quiénes viajan?</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Adultos (+12 años)</label>
                        <div className="flex items-center">
                          <button onClick={() => setFormData(p => ({...p, adults: Math.max(1, p.adults - 1)}))} className="w-12 h-12 bg-white border border-gray-200 rounded-l-xl font-bold hover:bg-gray-50">-</button>
                          <div className="flex-1 h-12 bg-white border-y border-gray-200 flex items-center justify-center font-bold">{formData.adults}</div>
                          <button onClick={() => setFormData(p => ({...p, adults: p.adults + 1}))} className="w-12 h-12 bg-white border border-gray-200 rounded-r-xl font-bold hover:bg-gray-50">+</button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Niños (0-11 años)</label>
                        <div className="flex items-center">
                          <button onClick={() => setFormData(p => ({...p, children: Math.max(0, p.children - 1)}))} className="w-12 h-12 bg-white border border-gray-200 rounded-l-xl font-bold hover:bg-gray-50">-</button>
                          <div className="flex-1 h-12 bg-white border-y border-gray-200 flex items-center justify-center font-bold">{formData.children}</div>
                          <button onClick={() => setFormData(p => ({...p, children: p.children + 1}))} className="w-12 h-12 bg-white border border-gray-200 rounded-r-xl font-bold hover:bg-gray-50">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary mb-6">
                      <Mail className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">Tus datos de contacto</h3>
                    </div>
                    
                    <form id="wizard-form" onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre completo" className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" />
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono / WhatsApp" className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" />
                      </div>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo electrónico" className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" />
                      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="¿Algún detalle o petición especial? (Opcional)" className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent min-h-[100px] resize-none" />
                      <div className="flex gap-3 pt-2">
                        <input required type="checkbox" className="mt-1 flex-shrink-0 w-4 h-4 text-brand-accent border-gray-300 rounded focus:ring-brand-accent" />
                        <span className="text-xs text-gray-500">Acepto los términos de privacidad y el uso de mis datos para ser contactado.</span>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center z-10">
            {step > 1 ? (
              <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-2 transition-colors">
                 <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
            ) : <div />}
            
            {step < 4 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.destination} 
                className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                form="wizard-form"
                type="submit"
                disabled={isSubmitting} 
                className="bg-[#D97D3A] hover:bg-[#c66c2d] text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#D97D3A]/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Pedir Presupuesto'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

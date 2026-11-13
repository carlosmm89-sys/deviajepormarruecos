import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';
import { BusinessSettings } from '../types';
import toast from 'react-hot-toast';
import { 
  X, MapPin, Calendar, Users, Mail, ArrowRight, ArrowLeft, Send, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

// Opciones del formulario: el valor se guarda en español (lo lee el equipo); se muestran traducidas.
const OPTION_LABELS: Record<string, { en: string; fr: string }> = {
  'Desierto del Sahara': { en: 'Sahara Desert', fr: 'Désert du Sahara' },
  'Norte de Marruecos': { en: 'Northern Morocco', fr: 'Nord du Maroc' },
  'Ciudades Imperiales': { en: 'Imperial cities', fr: 'Villes impériales' },
  'Costa Atlántica': { en: 'Atlantic coast', fr: 'Côte atlantique' },
  'Gran Tour de Marruecos': { en: 'Grand tour of Morocco', fr: 'Grand tour du Maroc' },
  'Mixto / Aún no lo sé': { en: 'Mixed / Not sure yet', fr: 'Mixte / Je ne sais pas encore' },
  'Paseo en Camello / Noche en jaima': { en: 'Camel ride / Night in a tent', fr: 'Balade à dromadaire / Nuit sous la tente' },
  'Quad o Buggy': { en: 'Quad or buggy', fr: 'Quad ou buggy' },
  'Vuelo en Globo Aerostático': { en: 'Hot-air balloon flight', fr: 'Vol en montgolfière' },
  'Trekking guiado': { en: 'Guided trekking', fr: 'Trekking guidé' },
  'Hammám Spa Tradicional': { en: 'Traditional hammam spa', fr: 'Hammam traditionnel' },
  'Guía Histórico / Cultural': { en: 'Historical / cultural guide', fr: 'Guide historique / culturel' },
};

interface QuoteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings | null;
}

export default function QuoteWizard({ isOpen, onClose, settings }: QuoteWizardProps) {
  const { tr, currentLanguage } = useTranslation();
  const optLabel = (v: string) => currentLanguage === 'es' ? v : ((OPTION_LABELS[v] as any)?.[currentLanguage] || v);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    destination: '',
    travelDate: '',
    duration: '',
    adults: 2,
    children: 0,
    extras: [] as string[],
    firstName: '',
    email: '',
    phone: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setDestination = (val: string) => {
    setFormData(prev => ({ ...prev, destination: val }));
    handleNext();
  };

  const toggleExtra = (extra: string) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.includes(extra) 
        ? prev.extras.filter(e => e !== extra)
        : [...prev.extras, extra]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const activeSettings = settings || await dbService.getBusinessSettings();
      const paxDetails = `Adultos: ${formData.adults}, Niños: ${formData.children}`;
      const extrasDetails = formData.extras.length > 0 ? formData.extras.join(', ') : 'Ninguna';
      
      const newLead = {
        form_type: 'wizard_quote',
        first_name: formData.firstName,
        email: formData.email,
        phone: formData.phone || '',
        approximate_date: formData.travelDate || new Date().toISOString().split('T')[0],
        passengers_count: Number(formData.adults) + Number(formData.children),
        message: `[Cotizador Mágico]\nDestino Ideal: ${formData.destination}\nDuración: ${formData.duration}\nFamilia: ${paxDetails}\nActividades Extra: ${extrasDetails}\n\nMensaje:\n${formData.message}`,
        status: 'new' as const
      };

      await dbService.createLead(newLead);

      if (activeSettings) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead: newLead, settings: activeSettings, tour_title: `Cotización Personalizada` })
        }).catch(err => console.error('SMTP fetch fail:', err));
      }

      setIsSuccess(true);
    } catch (error) {
       console.error(error);
       toast.error(tr({ es: 'Ocurrió un error. Inténtalo de nuevo.', en: 'Something went wrong. Please try again.', fr: 'Une erreur est survenue. Réessayez.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const destinations = ['Desierto del Sahara', 'Norte de Marruecos', 'Ciudades Imperiales', 'Costa Atlántica', 'Gran Tour de Marruecos', 'Mixto / Aún no lo sé'];
  const possibleExtras = ['Paseo en Camello / Noche en jaima', 'Quad o Buggy', 'Vuelo en Globo Aerostático', 'Trekking guiado', 'Hammám Spa Tradicional', 'Guía Histórico / Cultural'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between z-10 bg-white">
          <div>
            <h2 className="text-xl font-bold font-serif text-gray-900 leading-tight">{tr({ es: 'Diseña tu Viaje a Medida', en: 'Design your tailor-made trip', fr: 'Créez votre voyage sur mesure' })}</h2>
            {!isSuccess && <p className="text-sm text-gray-500 font-medium mt-1">{tr({ es: 'Paso', en: 'Step', fr: 'Étape' })} {step} {tr({ es: 'de', en: 'of', fr: 'sur' })} 5</p>}
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
              style={{ width: `${(step / 5) * 100}%` }}
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
                  <h3 className="text-3xl font-bold font-serif text-gray-900 mb-2">{tr({ es: '¡Solicitud Enviada!', en: 'Request sent!', fr: 'Demande envoyée !' })}</h3>
                  <p className="text-gray-500">{tr({ es: 'Nuestro equipo experto en Marruecos revisará tus preferencias y te contactará en menos de 24 horas con una propuesta a medida.', en: 'Our Morocco experts will review your preferences and contact you within 24 hours with a tailor-made proposal.', fr: 'Nos experts du Maroc étudieront vos préférences et vous contacteront sous 24 heures avec une proposition sur mesure.' })}</p>
                </div>
                <button onClick={onClose} className="mt-8 btn-primary px-8 relative z-50">
                  {tr({ es: 'Volver a la Web', en: 'Back to the website', fr: 'Retour au site' })}
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
                      <h3 className="text-2xl font-bold">{tr({ es: '¿Qué zona te gustaría explorar?', en: 'Which area would you like to explore?', fr: 'Quelle région aimeriez-vous explorer ?' })}</h3>
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
                          {optLabel(d)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary mb-6">
                      <Calendar className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">{tr({ es: '¿Cuándo tienes pensado viajar?', en: 'When are you planning to travel?', fr: 'Quand pensez-vous voyager ?' })}</h3>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{tr({ es: 'Fecha aproximada de llegada', en: 'Approximate arrival date', fr: 'Date d’arrivée approximative' })}</label>
                        <input 
                          type="date" 
                          name="travelDate"
                          value={formData.travelDate}
                          onChange={handleChange}
                          className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-gray-700" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{tr({ es: '¿Cuántos días te gustaría estar?', en: 'How many days would you like to stay?', fr: 'Combien de jours aimeriez-vous rester ?' })}</label>
                        <select 
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-gray-700"
                        >
                          <option value="">{tr({ es: 'Selecciona la duración', en: 'Choose the duration', fr: 'Choisissez la durée' })}</option>
                          <option value="1-3 días">{tr({ es: 'Escapada (1-3 días)', en: 'Short break (1-3 days)', fr: 'Escapade (1-3 jours)' })}</option>
                          <option value="4-7 días">{tr({ es: 'Media (4-7 días)', en: 'Medium (4-7 days)', fr: 'Moyen (4-7 jours)' })}</option>
                          <option value="8-12 días">{tr({ es: 'Viaje Completo (8-12 días)', en: 'Full trip (8-12 days)', fr: 'Voyage complet (8-12 jours)' })}</option>
                          <option value="+12 días">{tr({ es: 'Gran Aventura (+12 días)', en: 'Big adventure (12+ days)', fr: 'Grande aventure (+12 jours)' })}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary mb-6">
                      <Users className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">{tr({ es: '¿Quiénes viajan?', en: 'Who is travelling?', fr: 'Qui voyage ?' })}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">{tr({ es: 'Adultos (+12 años)', en: 'Adults (12+ years)', fr: 'Adultes (+12 ans)' })}</label>
                        <div className="flex items-center">
                          <button onClick={() => setFormData(p => ({...p, adults: Math.max(1, p.adults - 1)}))} className="w-12 h-12 bg-white border border-gray-200 rounded-l-xl font-bold hover:bg-gray-50">-</button>
                          <div className="flex-1 h-12 bg-white border-y border-gray-200 flex items-center justify-center font-bold">{formData.adults}</div>
                          <button onClick={() => setFormData(p => ({...p, adults: p.adults + 1}))} className="w-12 h-12 bg-white border border-gray-200 rounded-r-xl font-bold hover:bg-gray-50">+</button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">{tr({ es: 'Niños (0-11 años)', en: 'Children (0-11 years)', fr: 'Enfants (0-11 ans)' })}</label>
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
                      <Sparkles className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">{tr({ es: '¿Te gustaría añadir alguna actividad al viaje?', en: 'Would you like to add any activities?', fr: 'Souhaitez-vous ajouter des activités ?' })}</h3>
                    </div>
                    <p className="text-gray-500 mb-4">{tr({ es: 'Selecciona las experiencias extras que te interesen (opcional):', en: 'Choose any extra experiences you are interested in (optional):', fr: 'Choisissez les expériences supplémentaires qui vous intéressent (facultatif) :' })}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {possibleExtras.map(extra => (
                        <button
                          key={extra}
                          onClick={() => toggleExtra(extra)}
                          className={`p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between ${
                            formData.extras.includes(extra) 
                            ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' 
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:shadow-sm'
                          }`}
                        >
                          <span className="text-sm">{optLabel(extra)}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.extras.includes(extra) ? 'border-brand-accent' : 'border-gray-300'}`}>
                            {formData.extras.includes(extra) && <div className="w-2.5 h-2.5 bg-brand-accent rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary mb-6">
                      <Mail className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">{tr({ es: 'Tus datos de contacto', en: 'Your contact details', fr: 'Vos coordonnées' })}</h3>
                    </div>
                    
                    <form id="wizard-form" onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder={tr({ es: 'Nombre completo', en: 'Full name', fr: 'Nom complet' })} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" />
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={tr({ es: 'Teléfono / WhatsApp', en: 'Phone / WhatsApp', fr: 'Téléphone / WhatsApp' })} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" />
                      </div>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder={tr({ es: 'Correo electrónico', en: 'Email', fr: 'E-mail' })} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent" />
                      <textarea name="message" value={formData.message} onChange={handleChange} placeholder={tr({ es: '¿Algún detalle o petición especial? (Opcional)', en: 'Any details or special requests? (Optional)', fr: 'Des détails ou des demandes particulières ? (Facultatif)' })} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent min-h-[100px] resize-none" />
                      <div className="flex gap-3 pt-2">
                         <input required type="checkbox" className="mt-1 flex-shrink-0 w-4 h-4 text-brand-accent border-gray-300 rounded focus:ring-brand-accent cursor-pointer" />
                        <span className="text-xs text-gray-500">
                          {tr({ es: 'He leído y acepto la', en: 'I have read and accept the', fr: 'J’ai lu et j’accepte la' })} <Link to="/privacidad" className="underline hover:text-brand-primary transition-colors">{tr({ es: 'Política de Privacidad', en: 'Privacy Policy', fr: 'Politique de confidentialité' })}</Link>.
                        </span>
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
                 <ArrowLeft className="w-4 h-4" /> {tr({ es: 'Atrás', en: 'Back', fr: 'Retour' })}
              </button>
            ) : <div />}
            
            {step < 5 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.destination} 
                className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tr({ es: 'Siguiente', en: 'Next', fr: 'Suivant' })} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                form="wizard-form"
                type="submit"
                disabled={isSubmitting} 
                className="bg-[#D97D3A] hover:bg-[#c66c2d] text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#D97D3A]/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? tr({ es: 'Enviando...', en: 'Sending...', fr: 'Envoi...' }) : tr({ es: 'Pedir Presupuesto', en: 'Get a quote', fr: 'Demander un devis' })}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

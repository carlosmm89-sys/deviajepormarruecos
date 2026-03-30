import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Carolina M.',
    location: 'Madrid, España',
    date: 'Hace 2 semanas',
    avatar: 'https://i.pravatar.cc/150?u=carolina',
    text: 'Una experiencia transformadora. Nuestro viaje de 5 días al desierto superó cualquier expectativa. Brahim y nuestro chófer Youssef fueron impecables. Los alojamientos en los riads eran espectaculares y la noche en el desierto es algo que nunca olvidaremos.',
    tour: 'Aventura en el Sahara',
    rating: 5,
    platform: 'Google'
  },
  {
    id: 2,
    name: 'Javier y Elena',
    location: 'Valencia, España',
    date: 'Hace 1 mes',
    avatar: 'https://i.pravatar.cc/150?u=javier',
    text: 'Era nuestra luna de miel y queríamos algo especial, íntimo pero aventurero. Marruecos Experiencia nos diseñó un recorrido perfecto por las Ciudades Imperiales. Cada detalle sumaba: los guías locales hablaban español perfecto y se conocían cada secreto de Fez.',
    tour: 'Luna de Miel Imperial',
    rating: 5,
    platform: 'TripAdvisor'
  },
  {
    id: 3,
    name: 'Familia Ortiz',
    location: 'Bogotá, Colombia',
    date: 'Hace 2 meses',
    avatar: 'https://i.pravatar.cc/150?u=ortiz',
    text: 'Viajar con niños siempre es un reto, pero la logística fue de 10. La furgoneta comodísima, paradas frecuentes y actividades que encantaron a los peques. El paseo en dromedario fue el punto alto de las vacaciones. Muy recomendados y muy seguros.',
    tour: 'Viaje en Familia',
    rating: 5,
    platform: 'Trustpilot'
  },
  {
    id: 4,
    name: 'Sofía L.',
    location: 'Barcelona, España',
    date: 'Hace 3 meses',
    avatar: 'https://i.pravatar.cc/150?u=sofia',
    text: 'El norte de Marruecos es mágico y Chefchaouen te roba el aliento. Gracias a la organización no tuvimos que preocuparnos de nada. Transporte puntual, riads preciosos y recomendaciones de comida local excelentes. Volveremos para hacer el sur sin duda.',
    tour: 'Tesoros del Norte',
    rating: 5,
    platform: 'Google'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(ellipse at top right, #EB662B, transparent 50%)' }} />
           
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center items-center gap-2 text-brand-accent">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Hacemos Realidad tus Sueños
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Más de 500 viajeros hispanohablantes ya han descubierto la magia de Marruecos con nosotros.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Controles Ocultos en Mobile, Visibles en Desktop */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-brand-accent transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-brand-accent transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-xl border border-gray-100/50 relative">
            <Quote className="absolute top-8 right-8 md:top-12 md:right-12 w-16 h-16 text-gray-50 opacity-50" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img 
                      src={TESTIMONIALS[currentIndex].avatar} 
                      alt={TESTIMONIALS[currentIndex].name}
                      className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white" title="Usuario Verificado">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{TESTIMONIALS[currentIndex].name}</h3>
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
                       {TESTIMONIALS[currentIndex].location} <span className="w-1 h-1 rounded-full bg-gray-300"/> {TESTIMONIALS[currentIndex].date}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{TESTIMONIALS[currentIndex].platform}</span>
                    </div>
                  </div>
                </div>

                <div className="relative text-gray-700 leading-relaxed text-lg md:text-xl font-medium italic">
                  "{TESTIMONIALS[currentIndex].text}"
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-primary bg-brand-primary/5 px-4 py-2 rounded-full">
                    {TESTIMONIALS[currentIndex].tour}
                  </span>
                  
                  <div className="flex gap-2">
                    {TESTIMONIALS.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setCurrentIndex(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-brand-accent w-8' : 'bg-gray-200 hover:bg-gray-300'}`}
                        aria-label={`Ver testimonio ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

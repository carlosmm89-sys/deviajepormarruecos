import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Search } from 'lucide-react';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REVIEWS = [
  {
    id: 1,
    name: 'Carlos',
    origin: 'Madrid, España',
    date: 'octubre de 2025',
    text: 'Una experiencia inolvidable. La organización fue perfecta desde el primer momento, los guías muy atentos y los paisajes del desierto son algo que hay que ver al menos una vez en la vida. Totalmente recomendado.',
    avatar: 'https://i.pravatar.cc/150?u=carlos'
  },
  {
    id: 2,
    name: 'Laura',
    origin: 'Buenos Aires, Argentina',
    date: 'septiembre de 2025',
    text: 'Todo superó nuestras expectativas. Los riads elegidos eran mágicos y la excursión en camello al atardecer fue espectacular. El conductor Youssef se aseguró de que estuviéramos cómodos en todo momento.',
    avatar: 'https://i.pravatar.cc/150?u=laura'
  },
  {
    id: 3,
    name: 'Javier',
    origin: 'Valencia, España',
    date: 'agosto de 2025',
    text: 'El viaje estuvo muy bien estructurado. Tuvimos tiempo para explorar los zocos, descansar y disfrutar de la gastronomía local. Destaco especialmente la noche en las dunas bajo las estrellas.',
    avatar: 'https://i.pravatar.cc/150?u=javier'
  },
  {
    id: 4,
    name: 'Elena',
    origin: 'Santiago, Chile',
    date: 'julio de 2025',
    text: 'Marruecos es un país fascinante y hacerlo con esta agencia fue la mejor decisión. Nos sentimos seguras, aprendimos muchísimo sobre la cultura bereber y los alojamientos fueron de primer nivel.',
    avatar: 'https://i.pravatar.cc/150?u=elena'
  }
];

export default function ReviewsModal({ isOpen, onClose }: ReviewsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-6 h-6 fill-current" /> 5,0 <span className="text-gray-500 text-lg font-normal">· 14 evaluaciones</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 md:p-8 flex-1">
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-b border-gray-100 pb-12">
              {[
                { label: 'Limpieza', score: '5,0' },
                { label: 'Veracidad', score: '4,9' },
                { label: 'Organización', score: '5,0' },
                { label: 'Comunicación', score: '5,0' },
                { label: 'Ubicación', score: '4,8' },
                { label: 'Calidad-precio', score: '4,9' },
              ].map((cat) => (
                <div key={cat.label} className="flex flex-col">
                  <span className="text-gray-900 font-medium mb-1">{cat.label}</span>
                  <span className="text-lg font-semibold">{cat.score}</span>
                </div>
              ))}
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {REVIEWS.map((review) => (
                <div key={review.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-500">{review.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <div className="flex text-black">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500 font-medium">{review.date}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

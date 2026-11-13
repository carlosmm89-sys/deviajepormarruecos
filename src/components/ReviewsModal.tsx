import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { REVIEWS, REVIEW_TOTALS, TRIPADVISOR_URL, GOOGLE_REVIEWS_URL, localizeReviewMeta } from '../data/homeContent';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Opiniones reales de Tripadvisor y Google (las mismas de la portada, en src/data/homeContent.js).
export default function ReviewsModal({ isOpen, onClose }: ReviewsModalProps) {
  const { tr, currentLanguage } = useTranslation();

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
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              <Star className="w-6 h-6 fill-current" /> {REVIEW_TOTALS.tripadvisor.rating}
              <span className="text-gray-500 text-lg font-normal">
                · {REVIEW_TOTALS.tripadvisor.count} {tr({ es: 'opiniones en Tripadvisor', en: 'reviews on Tripadvisor', fr: 'avis sur Tripadvisor' })}
              </span>
            </h2>
            <button
              onClick={onClose}
              aria-label={tr({ es: 'Cerrar', en: 'Close', fr: 'Fermer' })}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 md:p-8 flex-1 space-y-10">
            <p className="text-sm text-gray-500">
              {tr({
                es: 'Opiniones reales de viajeros en Tripadvisor y Google. Se muestran en su idioma original.',
                en: 'Real reviews from travellers on Tripadvisor and Google, shown in their original language.',
                fr: 'Avis réels de voyageurs sur Tripadvisor et Google, affichés dans leur langue d’origine.'
              })}
            </p>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {REVIEWS.map((review, idx) => {
                const meta = localizeReviewMeta(review, currentLanguage);
                return (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary font-bold uppercase">
                        {review.author.charAt(0)}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.author}</h4>
                        <p className="text-sm text-gray-500">
                          {meta.date}{meta.trip ? ` · ${meta.trip}` : ''} · {review.source === 'tripadvisor' ? 'Tripadvisor' : 'Google'}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-black">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">“{review.text}”</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-100 text-sm font-bold">
              <a href={TRIPADVISOR_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent">
                {tr({ es: 'Ver todas en Tripadvisor', en: 'See all on Tripadvisor', fr: 'Tout voir sur Tripadvisor' })} <ArrowRight className="w-4 h-4" />
              </a>
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-accent">
                {tr({ es: 'Ver en Google', en: 'See on Google', fr: 'Voir sur Google' })} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

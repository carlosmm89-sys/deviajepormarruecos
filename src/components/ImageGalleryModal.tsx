import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageGalleryModal({ isOpen, images, initialIndex = 0, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
      >
        <div className="flex justify-between items-center p-4 md:p-6 text-white absolute top-0 w-full z-20">
          <div className="text-sm font-medium opacity-80 bg-black/40 px-4 py-2 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative w-full h-full p-2 md:p-12 overflow-hidden">
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 md:left-8 p-3 md:p-4 bg-black/40 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 z-20 backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={handleNext}
            />
          </AnimatePresence>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 md:right-8 p-3 md:p-4 bg-black/40 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 z-20 backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="p-4 bg-black/50 overflow-x-auto no-scrollbar flex items-center justify-center gap-3 z-20">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-16 w-24 md:h-20 md:w-32 rounded-lg overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                  idx === currentIndex 
                    ? 'ring-2 ring-white opacity-100 scale-105 shadow-xl' 
                    : 'opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

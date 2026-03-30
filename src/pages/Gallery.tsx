import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { GalleryImage } from '../types';
import SEO from '../components/SEO';
import { Maximize2, X } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await dbService.getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <SEO 
        title="Galería Visual - Marruecos Experiencia"
        description="Explora las maravillas de Marruecos a través de nuestra galería de fotografías exclusivas de viajes: desierto, medinas, montañas y cultura."
        url="/galeria"
      />

      {/* Header */}
      <section className="bg-brand-blue/5 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight">Marruecos en<br/>Imágenes</h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Descubre los rincones ocultos, los colores vibrantes y la majestuosidad de un país que cautiva el alma en cada instante.
          </p>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="max-w-[1600px] mx-auto px-4 mt-16">
        {images.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">La galería se está actualizando. Vuelve pronto para ver nuevas fotos.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx % 4 * 0.1 }}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-[2rem] bg-gray-100"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img.image_url} 
                  alt={img.title || 'Marruecos Paisaje'} 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.category && (
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-3">
                        {img.category}
                      </span>
                    )}
                    {img.title && <h3 className="text-white text-xl md:text-2xl font-bold font-serif">{img.title}</h3>}
                  </div>
                  <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8" onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src={selectedImage.image_url} 
            alt={selectedImage.title || 'Marruecos Expanded'}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} 
          />
          
          {(selectedImage.title || selectedImage.description) && (
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none text-center">
              {selectedImage.title && <h3 className="text-3xl font-bold font-serif text-white mb-2">{selectedImage.title}</h3>}
              {selectedImage.description && <p className="text-gray-300 max-w-2xl mx-auto">{selectedImage.description}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

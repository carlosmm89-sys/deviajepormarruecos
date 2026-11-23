import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Vídeo corto de la portada (camellos, quads y hoguera; clips gratuitos de Pexels, ~2 MB, sin sonido).
 * No se descarga nada hasta que el visitante se acerca a esta sección, para no frenar la carga de la portada.
 */
export default function DesertVideo() {
  const { tr } = useTranslation();
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !ref.current) return;
    ref.current.load();
    ref.current.play().catch(() => { /* el navegador no deja reproducir solo: se queda la imagen */ });
  }, [visible]);

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-brand-accent text-sm font-bold uppercase tracking-widest">{tr({ es: 'Vive el desierto', en: 'Live the desert', fr: 'Vivez le désert' })}</p>
        <h2 className="text-4xl font-serif font-bold">{tr({ es: 'Camellos, quads y noche junto al fuego', en: 'Camels, quad bikes and nights by the fire', fr: 'Dromadaires, quads et nuits au coin du feu' })}</h2>
      </div>
      <div className="relative rounded-[2rem] overflow-hidden shadow-sm bg-[#f3ede4] aspect-video">
        <video
          ref={ref}
          className="w-full h-full object-cover"
          poster={visible ? '/videos/desierto-poster.webp' : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={tr({ es: 'Caravana de camellos al atardecer, quads en las dunas y hoguera en el desierto', en: 'Camel caravan at sunset, quad bikes on the dunes and a campfire in the desert', fr: 'Caravane de dromadaires au coucher du soleil, quads dans les dunes et feu de camp dans le désert' })}
        >
          {visible && <source src="/videos/desierto.mp4" type="video/mp4" />}
        </video>
        <p className="absolute bottom-2 right-4 text-[11px] text-white/80 drop-shadow">{tr({ es: 'Imágenes ilustrativas', en: 'Illustrative footage', fr: 'Images d’illustration' })}</p>
      </div>
    </section>
  );
}

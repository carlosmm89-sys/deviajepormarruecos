import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Vídeo corto de la portada, grabado en los viajes de Vivir Marruecos (dunas, camellos y hoguera; ~1,6 MB).
 * Empieza sin sonido (los navegadores no dejan reproducir solo con sonido); el botón activa el sonido.
 * No se descarga nada hasta que el visitante se acerca a esta sección, para no frenar la carga de la portada.
 */
export default function DesertVideo() {
  const { tr } = useTranslation();
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);

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
    ref.current.muted = true;
    ref.current.load();
    ref.current.play().catch(() => { /* el navegador no deja reproducir solo: se queda la imagen */ });
  }, [visible]);

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-brand-accent text-sm font-bold uppercase tracking-widest">{tr({ es: 'Desierto de Merzouga', en: 'Merzouga desert', fr: 'Désert de Merzouga' })}</p>
        <h2 className="text-4xl font-serif font-bold">{tr({ es: 'Vive la magia del desierto', en: 'Experience the magic of the desert', fr: 'Vivez la magie du désert' })}</h2>
      </div>
      <div className="relative rounded-[2rem] overflow-hidden shadow-sm bg-[#f3ede4] aspect-video">
        <video
          ref={ref}
          className="w-full h-full object-cover"
          poster={visible ? '/videos/desierto-poster.webp' : undefined}
          muted={muted}
          loop
          playsInline
          preload="none"
          aria-label={tr({ es: 'Dunas de Erg Chebbi, paseo en camello y hoguera en el campamento', en: 'Erg Chebbi dunes, camel ride and campfire at the camp', fr: 'Dunes de l’Erg Chebbi, balade à dromadaire et feu de camp au campement' })}
        >
          {visible && <source src="/videos/desierto.mp4" type="video/mp4" />}
        </video>
        {visible && (
          <button
            type="button"
            onClick={() => { const v = ref.current; if (!v) return; v.muted = !muted; setMuted(!muted); if (v.paused) v.play().catch(() => {}); }}
            className="absolute bottom-4 right-4 rounded-full bg-black/60 text-white text-sm font-semibold px-4 py-2 hover:bg-black/75"
          >
            {muted ? tr({ es: '🔊 Activar sonido', en: '🔊 Sound on', fr: '🔊 Activer le son' }) : tr({ es: '🔇 Quitar sonido', en: '🔇 Mute', fr: '🔇 Couper le son' })}
          </button>
        )}
      </div>
    </section>
  );
}

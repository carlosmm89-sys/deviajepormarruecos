import React, { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../services/dbService';

// Número por defecto mientras llegan los ajustes (o si fallan), para que el botón salga siempre desde el primer momento.
const DEFAULT_NUMBER = '+34 604 48 82 23';
const DEFAULT_MESSAGE = '¡Hola! Me gustaría recibir información para planificar un viaje a Marruecos.';
const DISMISS_KEY = 'wa-invite-closed';
const INVITE_DELAY_MS = 12000; // tiempo navegando antes de mostrar el mensaje

function wasDismissed() {
  try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
}

export default function WhatsAppBubble() {
  const boot = typeof window !== 'undefined' ? (window as any).__BIZ__ : null;
  const [phoneNumber, setPhoneNumber] = useState<string>(boot?.whatsapp_number || DEFAULT_NUMBER);
  const [welcomeMessage, setWelcomeMessage] = useState<string>(boot?.whatsapp_welcome_message || DEFAULT_MESSAGE);
  const [showInvite, setShowInvite] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    dbService.getBusinessSettings().then(settings => {
      if (settings?.whatsapp_number) setPhoneNumber(settings.whatsapp_number);
      if (settings?.whatsapp_welcome_message) setWelcomeMessage(settings.whatsapp_welcome_message);
    }).catch(() => {});
  }, []);

  // El mensaje de bienvenida aparece cuando el cliente lleva un rato mirando la web (o ha bajado por la página).
  useEffect(() => {
    if (wasDismissed()) return;
    let shown = false;
    const show = () => {
      if (shown || wasDismissed()) return;
      shown = true;
      setShowInvite(true);
    };
    const timer = window.setTimeout(show, INVITE_DELAY_MS);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.45) show();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const closeInvite = () => {
    setShowInvite(false);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* sin almacenamiento: solo se cierra en esta vista */ }
  };

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(welcomeMessage)}`;
  // En la ficha de un tour (móvil) hay una barra fija de reserva abajo: el botón se coloca encima de ella.
  const aboveBookingBar = /^\/tours\/[^/]+/.test(pathname);

  return (
    <div
      className={`fixed ${aboveBookingBar ? 'bottom-28' : 'bottom-5'} right-4 md:bottom-8 md:right-8 z-[60] flex flex-col items-end gap-3`}
    >
      {showInvite && (
        <div
          role="dialog"
          aria-label="Mensaje de Vivir Marruecos"
          className="relative w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden animate-fade-in-up"
        >
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 font-serif font-bold text-sm">VM</span>
            <div className="leading-tight">
              <p className="font-semibold text-sm">Vivir Marruecos</p>
              <p className="text-[11px] text-white/80">Normalmente responde en pocos minutos</p>
            </div>
            <button
              type="button"
              onClick={closeInvite}
              aria-label="Cerrar mensaje"
              className="ml-auto rounded-full p-1 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-[#ECE5DD] px-4 py-4">
            <div className="relative max-w-[92%] rounded-xl rounded-tl-none bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm">
              <p className="font-semibold">¡Hola! 😊</p>
              <p className="mt-1">Cuéntanos más y te ayudamos a planificar tu viaje.</p>
            </div>
          </div>
          <div className="px-4 py-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeInvite}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe5a] transition-colors"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)] hover:bg-[#1ebe5a] hover:scale-105 transition-all duration-300"
      >
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.25} />
        {showInvite && (
          <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold ring-2 ring-white">1</span>
        )}
      </a>
    </div>
  );
}

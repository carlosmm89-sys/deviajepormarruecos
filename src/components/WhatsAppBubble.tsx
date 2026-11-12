import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../services/dbService';

// Número por defecto mientras llegan los ajustes (o si fallan), para que el botón salga siempre desde el primer momento.
const DEFAULT_NUMBER = '+34 604 48 82 23';
const DEFAULT_MESSAGE = '¡Hola! Me gustaría recibir información sobre un viaje a Marruecos.';

export default function WhatsAppBubble() {
  const boot = typeof window !== 'undefined' ? (window as any).__BIZ__ : null;
  const [phoneNumber, setPhoneNumber] = useState<string>(boot?.whatsapp_number || DEFAULT_NUMBER);
  const [welcomeMessage, setWelcomeMessage] = useState<string>(boot?.whatsapp_welcome_message || DEFAULT_MESSAGE);

  useEffect(() => {
    dbService.getBusinessSettings().then(settings => {
      if (settings?.whatsapp_number) setPhoneNumber(settings.whatsapp_number);
      if (settings?.whatsapp_welcome_message) setWelcomeMessage(settings.whatsapp_welcome_message);
    }).catch(() => {});
  }, []);

  const { pathname } = useLocation();
  // En la ficha de un tour (móvil) hay una barra fija de reserva abajo: el botón se coloca encima de ella.
  const aboveBookingBar = /^\/tours\/[^/]+/.test(pathname);
  if (pathname.startsWith('/admin')) return null;

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(welcomeMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed ${aboveBookingBar ? 'bottom-28' : 'bottom-5'} right-4 md:bottom-8 md:right-8 z-[60] group`}
    >
      {/* Anillo que late para llamar la atención */}
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping motion-reduce:hidden" />
      <span className="relative flex items-center gap-2.5 bg-[#25D366] text-white pl-4 pr-5 py-3.5 md:pl-5 md:pr-6 md:py-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.55)] ring-4 ring-white hover:bg-[#1ebe5a] hover:scale-105 transition-all duration-300">
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 shrink-0" strokeWidth={2.5} />
        <span className="flex flex-col leading-tight text-left">
          <span className="font-bold text-base md:text-lg">WhatsApp</span>
          <span className="text-[11px] md:text-xs font-medium text-white/90">Escríbenos, te respondemos</span>
        </span>
      </span>
    </a>
  );
}

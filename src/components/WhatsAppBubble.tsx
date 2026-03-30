import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function WhatsAppBubble() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');

  useEffect(() => {
    dbService.getBusinessSettings().then(settings => {
      if (settings?.whatsapp_number) {
        setPhoneNumber(settings.whatsapp_number);
        setWelcomeMessage(settings.whatsapp_welcome_message || '¡Hola! Me gustaría recibir información.');
      }
    });
  }, []);

  if (!phoneNumber) return null;

  // Clean the number format for the API link
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(welcomeMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 md:bottom-8 md:right-8 group flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8 md:w-10 md:h-10 fill-current" />
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-2xl shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap before:content-[''] before:absolute before:top-1/2 before:-right-2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-l-white">
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}

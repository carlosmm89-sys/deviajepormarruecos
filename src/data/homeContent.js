// Contenido fijo de la portada: «Cómo funciona», tipos de viaje y preguntas frecuentes.
// Se usa en src/pages/Home.tsx y en prerender-seo.mjs (HTML estático + datos FAQPage para Google).

export const HOW_IT_WORKS = [
  {
    title: 'Cuéntanos tu idea',
    text: 'Fechas, cuántos sois y qué os gustaría ver. Por WhatsApp, por email o con nuestro formulario.'
  },
  {
    title: 'Recibe tu propuesta',
    text: 'Te enviamos un itinerario y un presupuesto sin compromiso, pensado para tu grupo.'
  },
  {
    title: 'Lo ajustamos juntos',
    text: 'Cambiamos la ruta, el ritmo o los alojamientos hasta que el viaje sea como lo imaginas.'
  },
  {
    title: 'Disfruta de Marruecos',
    text: 'Tu conductor te espera en el aeropuerto o en tu hotel. Nosotros nos ocupamos del resto.'
  }
];

export const TRIP_TYPES = [
  { slug: 'luna-de-miel', icon: 'heart', title: 'Lunas de miel', text: 'Riads con encanto, cenas especiales y una noche en las dunas para dos.' },
  { slug: 'viajes-en-familia', icon: 'family', title: 'Viajes en familia', text: 'Ritmo tranquilo, etapas cortas y planes pensados para los niños.' },
  { slug: 'viajes-de-lujo', icon: 'gem', title: 'Viajes de lujo', text: 'Los mejores riads, campamentos de lujo y vehículos cómodos.' },
  { slug: 'aventura', icon: 'compass', title: 'Aventura', text: 'Quads, camellos, sandboard y rutas por el Atlas y el desierto.' },
  { slug: 'viajes-en-grupo', icon: 'users', title: 'Grupos y amigos', text: 'Viajes privados para grupos, con un precio por persona más bajo.' },
  { slug: 'entrega-de-anillo', icon: 'sparkles', title: 'Pedida de mano', text: 'Preparamos la sorpresa en las dunas de Erg Chebbi al atardecer.' }
];

export const HOME_FAQS = [
  {
    q: '¿Cuánto cuesta un viaje privado por Marruecos?',
    a: 'Nuestros tours privados empiezan en 180 € por persona para 3 días, 250 € para 4 días y 300 € para 5 días. Son precios orientativos para un grupo de 4: si viajáis 2 o 3 personas, el precio por persona cambia, así que pídenos presupuesto para tu grupo.'
  },
  {
    q: '¿Cuántos días necesito?',
    a: 'Con 3 o 4 días puedes ir de Marrakech al desierto de Merzouga y volver. Con 7 u 8 días haces la ruta clásica de ciudades, Atlas y desierto, y con 9 a 13 días recorres el país de norte a sur.'
  },
  {
    q: '¿Qué significa que el viaje es privado?',
    a: 'Que el vehículo y el conductor son solo para tu grupo. Eliges las fechas, el ritmo y las paradas, y no compartes el viaje con desconocidos.'
  },
  {
    q: '¿Desde qué ciudades salen los tours?',
    a: 'Salimos desde Marrakech, Fez, Tánger y Casablanca, con recogida en el aeropuerto o en tu hotel. Nuestra base está en Hassi Labied, junto a las dunas de Merzouga.'
  },
  {
    q: '¿Cuál es la mejor época para viajar?',
    a: 'La primavera (marzo a mayo) y el otoño (septiembre a noviembre). En invierno las noches del desierto son frías y en verano el calor en el sur es intenso.'
  },
  {
    q: '¿Necesito visado?',
    a: 'Con pasaporte español no necesitas visado para estancias turísticas de hasta 90 días. Necesitas pasaporte en vigor: el DNI no permite la entrada.'
  }
];

export const PRICE_NOTE = 'Precios orientativos por persona para un grupo de 4. Si viajáis 2 o 3 personas, el precio por persona cambia: pídenos presupuesto sin compromiso.';

// Reseñas reales de la ficha de Google «Vivir Marruecos» (copiadas tal cual, nov. 2026).
// Para añadir más: copia el texto, el nombre y el mes de la reseña de Google y súmala a esta lista.
export const GOOGLE_PLACE_ID = 'ChIJGfCCnI5rfQYRbR8TsTEnINM';
export const GOOGLE_REVIEWS_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
export const GOOGLE_RATING = '5,0';

export const REVIEWS = [
  {
    author: 'Rosario Isabel L.',
    date: 'noviembre 2026',
    rating: 5,
    text: 'Fuimos 4 amigas de viaje con la agencia vivirmarruecos, todo de 10 los alojamientos, guías y sobre todo el paseo en camello nos encantó el desierto, gracias a todos los guías. Recomendado 100/1000'
  },
  {
    author: 'Rosario Isabel L.',
    date: 'noviembre 2026',
    rating: 5,
    text: 'Una experiencia de 10 hemos disfrutado mucho de nuestra experiencia, muchas gracias por todo.'
  }
];

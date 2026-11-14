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

// Opiniones reales copiadas de las fichas de Tripadvisor y Google (nov. 2026).
// Los textos largos están recortados con «…», sin cambiar palabras.
// Para añadir una opinión nueva, súmala a REVIEWS (nombre, mes, fuente y texto tal cual).
// Actualiza también los totales de abajo cuando cambien en las fichas.
export const GOOGLE_PLACE_ID = 'ChIJGfCCnI5rfQYRbR8TsTEnINM';
export const GOOGLE_REVIEWS_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
export const TRIPADVISOR_URL = 'https://www.tripadvisor.es/Attraction_Review-g293737-d27433997-Reviews-De_Viaje_Por_Marruecos-Tangier_Tanger_Tetouan_Al_Hoceima.html';

export const REVIEW_TOTALS = {
  tripadvisor: { rating: '5,0', count: 105, award: "Travellers' Choice 2026" },
  google: { rating: '5,0', count: 2 }
};

export const REVIEWS = [
  {
    source: 'tripadvisor',
    author: 'Carmen N',
    date: 'noviembre 2026',
    trip: 'Con amigos',
    text: 'Acabamos de terminar nuestra escapada con Ali. Esta es nuestra 4 vez. Pero a sido la mejor con diferencia. Lo a consejo 100/1000. Mil gracias Ali'
  },
  {
    source: 'tripadvisor',
    author: 'BRB78',
    date: 'agosto 2026',
    trip: 'En familia',
    text: 'Hemos hecho un tour de 10 días de norte a sur y vuelta, y la experiencia ha sido EXCEPCIONAL. Viaje muy bien organizado por Ali, que ha tenido infinita paciencia con nuestros miedos y dudas… Resumiendo: 100% fiables y recomendables.'
  },
  {
    source: 'tripadvisor',
    author: 'juan jose m',
    date: 'agosto 2026',
    trip: 'En pareja',
    text: 'Estuvimos 5 dias y 4 noches y todo fue genial, desde el minuto uno que nos pusimos en contacto hasta el final del viaje… tuvieron un gran detalle en nuestro cumpleaños regalandonos una tarta y vino.'
  },
  {
    source: 'tripadvisor',
    author: 'Lorena S',
    date: 'junio 2026',
    trip: 'En familia',
    text: 'Nuestra experiencia fue simplemente genial. Desde el primer momento todo estuvo muy bien organizado y nos hicieron sentir cómodos y bien atendidos durante todo el viaje… Sin duda, una experiencia totalmente recomendable.'
  },
  {
    source: 'tripadvisor',
    author: 'Davide Nahmias',
    date: 'diciembre 2025',
    trip: 'En familia',
    text: 'Nuestro viaje de 9 días por Marruecos en familia ha sido una experiencia extraordinaria, auténtica y perfectamente organizada… Desde las ciudades imperiales hasta el desierto, cada etapa estuvo bien pensada, sin prisas y con alojamientos auténticos.'
  },
  {
    source: 'tripadvisor',
    author: 'Daniel J',
    date: 'octubre 2026',
    trip: 'En pareja',
    text: '¡Hamid y Abdul son guías super amables y cercanos, además de un gran sentido del humor! El viaje ha sido genial y nos ha encantado! Recomendaría este viaje siempre. Muy completo'
  },
  {
    source: 'google',
    author: 'Rosario Isabel L.',
    date: 'noviembre 2026',
    trip: 'Con amigas',
    text: 'Fuimos 4 amigas de viaje con la agencia vivirmarruecos, todo de 10 los alojamientos, guías y sobre todo el paseo en camello nos encantó el desierto, gracias a todos los guías. Recomendado 100/1000'
  },
  {
    source: 'google',
    author: 'Rosario Isabel L.',
    date: 'noviembre 2026',
    trip: '',
    text: 'Una experiencia de 10 hemos disfrutado mucho de nuestra experiencia, muchas gracias por todo.'
  }
];

// ---------------------------------------------------------------------------
// Traducciones de la portada (inglés y francés). El español es lo de arriba.
// ---------------------------------------------------------------------------
const HOME_I18N = {
  en: {
    howItWorks: [
      { title: 'Tell us your idea', text: 'Dates, how many of you and what you would like to see. By WhatsApp, email or our form.' },
      { title: 'Get your proposal', text: 'We send you a no-obligation itinerary and quote, designed for your group.' },
      { title: 'We fine-tune it together', text: 'We change the route, the pace or the accommodation until the trip is just as you imagine it.' },
      { title: 'Enjoy Morocco', text: 'Your driver meets you at the airport or your hotel. We take care of everything else.' }
    ],
    tripTypes: {
      'luna-de-miel': { title: 'Honeymoons', text: 'Charming riads, special dinners and a night in the dunes for two.' },
      'viajes-en-familia': { title: 'Family trips', text: 'Relaxed pace, short stages and plans designed for children.' },
      'viajes-de-lujo': { title: 'Luxury trips', text: 'The best riads, luxury camps and comfortable vehicles.' },
      'aventura': { title: 'Adventure', text: 'Quads, camels, sandboarding and routes through the Atlas and the desert.' },
      'viajes-en-grupo': { title: 'Groups and friends', text: 'Private trips for groups, with a lower price per person.' },
      'entrega-de-anillo': { title: 'Marriage proposal', text: 'We prepare the surprise in the Erg Chebbi dunes at sunset.' }
    },
    faqs: [
      { q: 'How much does a private trip to Morocco cost?', a: 'Our private tours start at €180 per person for 3 days, €250 for 4 days and €300 for 5 days. These are guide prices for a group of 4: if you are 2 or 3 people, the price per person changes, so ask us for a quote for your group.' },
      { q: 'How many days do I need?', a: 'With 3 or 4 days you can go from Marrakech to the Merzouga desert and back. With 7 or 8 days you do the classic route of cities, Atlas and desert, and with 9 to 13 days you travel the country from north to south.' },
      { q: 'What does a private trip mean?', a: 'The vehicle and driver are only for your group. You choose the dates, the pace and the stops, and you do not share the trip with strangers. Our drivers speak English, French and Spanish.' },
      { q: 'Which cities do the tours start from?', a: 'We depart from Marrakech, Fez, Tangier and Casablanca, with pick-up at the airport or your hotel. Our base is in Hassi Labied, next to the Merzouga dunes.' },
      { q: 'When is the best time to travel?', a: 'Spring (March to May) and autumn (September to November). In winter desert nights are cold and in summer the south is very hot.' },
      { q: 'Do I need a visa?', a: 'Citizens of the EU, the UK, the USA and Canada do not need a visa for tourist stays of up to 90 days. You need a valid passport. If you have another nationality, check with the Moroccan consulate.' }
    ],
    priceNote: 'Guide prices per person for a group of 4. If you are 2 or 3 people, the price per person changes: ask us for a no-obligation quote.'
  },
  fr: {
    howItWorks: [
      { title: 'Racontez-nous votre idée', text: 'Vos dates, combien vous êtes et ce que vous aimeriez voir. Par WhatsApp, par e-mail ou avec notre formulaire.' },
      { title: 'Recevez votre proposition', text: 'Nous vous envoyons un itinéraire et un devis sans engagement, pensés pour votre groupe.' },
      { title: 'Nous l’ajustons ensemble', text: 'Nous modifions l’itinéraire, le rythme ou les hébergements jusqu’à ce que le voyage soit comme vous l’imaginez.' },
      { title: 'Profitez du Maroc', text: 'Votre chauffeur vous attend à l’aéroport ou à votre hôtel. Nous nous occupons du reste.' }
    ],
    tripTypes: {
      'luna-de-miel': { title: 'Lunes de miel', text: 'Riads de charme, dîners spéciaux et une nuit dans les dunes à deux.' },
      'viajes-en-familia': { title: 'Voyages en famille', text: 'Rythme tranquille, étapes courtes et activités pensées pour les enfants.' },
      'viajes-de-lujo': { title: 'Voyages de luxe', text: 'Les meilleurs riads, des campements de luxe et des véhicules confortables.' },
      'aventura': { title: 'Aventure', text: 'Quads, dromadaires, sandboard et itinéraires dans l’Atlas et le désert.' },
      'viajes-en-grupo': { title: 'Groupes et amis', text: 'Voyages privés pour les groupes, avec un prix par personne plus bas.' },
      'entrega-de-anillo': { title: 'Demande en mariage', text: 'Nous préparons la surprise dans les dunes de l’Erg Chebbi au coucher du soleil.' }
    },
    faqs: [
      { q: 'Combien coûte un voyage privé au Maroc ?', a: 'Nos circuits privés commencent à 180 € par personne pour 3 jours, 250 € pour 4 jours et 300 € pour 5 jours. Ce sont des prix indicatifs pour un groupe de 4 : si vous êtes 2 ou 3, le prix par personne change, alors demandez-nous un devis pour votre groupe.' },
      { q: 'De combien de jours ai-je besoin ?', a: 'En 3 ou 4 jours, vous pouvez aller de Marrakech au désert de Merzouga et revenir. En 7 ou 8 jours, vous faites l’itinéraire classique villes, Atlas et désert, et en 9 à 13 jours vous parcourez le pays du nord au sud.' },
      { q: 'Que signifie un voyage privé ?', a: 'Le véhicule et le chauffeur sont uniquement pour votre groupe. Vous choisissez les dates, le rythme et les arrêts, et vous ne partagez pas le voyage avec des inconnus. Nos chauffeurs parlent français, anglais et espagnol.' },
      { q: 'De quelles villes partent les circuits ?', a: 'Nous partons de Marrakech, Fès, Tanger et Casablanca, avec prise en charge à l’aéroport ou à votre hôtel. Notre base est à Hassi Labied, au pied des dunes de Merzouga.' },
      { q: 'Quelle est la meilleure période pour voyager ?', a: 'Le printemps (mars à mai) et l’automne (septembre à novembre). En hiver, les nuits dans le désert sont froides et en été il fait très chaud dans le sud.' },
      { q: 'Ai-je besoin d’un visa ?', a: 'Les citoyens de l’UE, de la Suisse et du Canada n’ont pas besoin de visa pour un séjour touristique de 90 jours maximum. Il faut un passeport en cours de validité. Pour toute autre nationalité, renseignez-vous auprès du consulat du Maroc.' }
    ],
    priceNote: 'Prix indicatifs par personne pour un groupe de 4. Si vous êtes 2 ou 3, le prix par personne change : demandez-nous un devis sans engagement.'
  }
};

/** Contenido de la portada en el idioma pedido ('es', 'en' o 'fr'). */
export function getHomeContent(lang) {
  const tr = HOME_I18N[lang];
  if (!tr) return { howItWorks: HOW_IT_WORKS, tripTypes: TRIP_TYPES, faqs: HOME_FAQS, priceNote: PRICE_NOTE };
  return {
    howItWorks: tr.howItWorks,
    tripTypes: TRIP_TYPES.map(t => ({ ...t, ...(tr.tripTypes[t.slug] || {}) })),
    faqs: tr.faqs,
    priceNote: tr.priceNote
  };
}

/** Meses y tipos de viaje de las opiniones (los textos de las opiniones se quedan en su idioma original). */
const MONTHS = {
  es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  fr: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
};
const TRIP_LABELS = {
  'Con amigos': { en: 'With friends', fr: 'Entre amis' },
  'Con amigas': { en: 'With friends', fr: 'Entre amies' },
  'En familia': { en: 'Family', fr: 'En famille' },
  'En pareja': { en: 'Couple', fr: 'En couple' }
};
export function localizeReviewMeta(review, lang) {
  if (lang === 'es' || !MONTHS[lang]) return { date: review.date, trip: review.trip };
  const [month, year] = review.date.split(' ');
  const i = MONTHS.es.indexOf(month);
  return {
    date: i >= 0 ? `${MONTHS[lang][i]} ${year}` : review.date,
    trip: review.trip ? (TRIP_LABELS[review.trip]?.[lang] || review.trip) : ''
  };
}

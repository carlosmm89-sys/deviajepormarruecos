// Textos y reglas SEO compartidos entre la web (React) y el pre-renderizado (prerender-seo.mjs).
// Archivo .js (no .ts) para que Node pueda importarlo directamente durante el build.

export const SITE_DOMAIN = 'https://www.vivirmarruecos.com';

/**
 * Ajusta el <title> a lo que Google muestra (~60 caracteres).
 * Quita cualquier sufijo de marca que traiga y añade " | Vivir Marruecos" solo si cabe;
 * si no cabe, deja el título sin marca (Google ya muestra el nombre del sitio aparte).
 */
export function fitTitle(raw, brand = 'Vivir Marruecos', max = 60) {
  const base = String(raw || '').replace(/\s*[|\-–—]\s*(Blog\s+)?Vivir Marruecos\s*$/i, '').trim();
  if (!base) return brand;
  const full = `${base} | ${brand}`;
  return full.length <= max ? full : base;
}

export const HOME_TITLE = 'Tours privados por Marruecos y Merzouga | Vivir Marruecos';

export const HOME_META_DESCRIPTION =
  'Tours privados por Marruecos desde Marrakech, Fez, Tánger y Casablanca: desierto de Merzouga, noche en jaima en Erg Chebbi y viajes a medida.';

export const HOME_H1_FALLBACK = 'Tours privados por Marruecos y el desierto de Merzouga';

// Datos de empresa para Google (deben coincidir con la ficha de Google Business Profile)
export const BUSINESS_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Ksar Hassi Labied',
  addressLocality: 'Merzouga',
  addressRegion: 'Drâa-Tafilalet',
  addressCountry: 'MA'
};

export const BUSINESS_LEGAL_NAME = 'Vivirmarruecos SARL';

function clip(text, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
}

/** Ruta pública de un tour: siempre por slug si existe. */
export function tourPath(tour) {
  return `/tours/${tour?.slug || tour?.id}`;
}

/** Meta descripción de un tour: usa el resumen si es útil; si es demasiado corto, la compone con los datos del tour
 *  (sin repetir el título, que Google ya muestra encima). */
export function tourMetaDescription(tour, lang = 'es') {
  const strip = (s = '') => String(s).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const summary = strip(tour?.itinerary_summary);
  if (summary.length >= 90) return clip(summary);
  const text = `${strip(tour?.title)} ${strip(tour?.description)}`.toLowerCase();
  const days = String(tour?.duration || '').match(/\d+/)?.[0];
  const city = tour?.departure_city;
  const isDesert = /merzouga|desierto|desert|désert|sahara|erg chebbi/.test(text);
  const desc = strip(tour?.description);
  if (lang === 'en') {
    const from = city ? ` from ${city}` : '';
    const price = tour?.price ? ` From €${tour.price} per person.` : '';
    if (days === '1') return clip(`Private day trip${from}.${price} ${desc}`);
    return clip(`Private${days ? ` ${days}-day` : ''} tour${from}: English-speaking driver${isDesert ? ', a night in a tent in Erg Chebbi' : ''} and a local agency from Merzouga.${price}`);
  }
  if (lang === 'fr') {
    const from = city ? ` au départ de ${city}` : '';
    const price = tour?.price ? ` À partir de ${tour.price} € par personne.` : '';
    if (days === '1') return clip(`Excursion privée d’une journée${from}.${price} ${desc}`);
    return clip(`Circuit privé${days ? ` de ${days} jours` : ''}${from} : chauffeur francophone${isDesert ? ', nuit sous la tente dans l’Erg Chebbi' : ''} et agence locale de Merzouga.${price}`);
  }
  const from = city ? ` desde ${city}` : '';
  const price = tour?.price ? ` Desde ${tour.price} €/persona.` : '';
  // Excursiones de un día: cada una con su propia descripción (si no, todas saldrían iguales en Google)
  if (days === '1') return clip(`Excursión privada de un día${from}.${price} ${desc}`);
  return clip(`Tour privado${days ? ` de ${days} días` : ''}${from}: conductor en español${isDesert ? ', noche en jaima en Erg Chebbi' : ''} y agencia local de Merzouga.${price}`);
}

/** Título y H1 de un destino. Las páginas "rutas-desde-X" se presentan como "Tours desde X". */
export function destinationHeadings(dest, siteName = 'Vivir Marruecos', lang = 'es') {
  const name = String(dest?.name || '').trim();
  const slug = String(dest?.slug || '');
  let h1;
  if (slug.startsWith('rutas-desde-')) {
    const city = name.replace(/^(rutas\s+desde|routes\s+from|tours\s+from|itin[ée]raires\s+depuis|circuits\s+(depuis|au\s+départ\s+de))\s+/i, '').trim();
    h1 = lang === 'en' ? `Tours from ${city} to the Merzouga desert`
      : lang === 'fr' ? `Circuits de ${city} au désert de Merzouga`
      : `Tours desde ${city} al desierto de Merzouga`;
  } else if (slug === 'excursiones-cortas') {
    h1 = lang === 'en' ? 'Day trips in Morocco' : lang === 'fr' ? 'Excursions d’une journée au Maroc' : 'Excursiones de un día por Marruecos';
  } else {
    h1 = lang === 'en' ? `${name}: tours and excursions` : lang === 'fr' ? `${name} : circuits et excursions` : `${name}: tours y excursiones`;
  }
  return { h1, title: `${h1} | ${siteName}` };
}

/** Introducciones de las colecciones (/coleccion/:slug). */
export const COLLECTION_INTROS = {
  'excursiones-de-un-dia': {
    title: 'Excursiones de un día por Marruecos',
    intro: 'Excursiones privadas de un día desde Marrakech a las cascadas de Ouzoud, el valle de Ourika y Essaouira, con transporte privado y conductor solo para vuestro grupo. Perfectas si tienes pocos días o quieres completar tu estancia en Marrakech.'
  },
  'desierto': {
    title: 'Viajes al desierto de Merzouga',
    intro: 'Viajes privados al desierto del Sáhara con noche en jaima en las dunas de Erg Chebbi, paseo en dromedario al atardecer y amanecer entre dunas. Salidas desde Marrakech, Fez, Tánger o Casablanca, con conductor y vehículo solo para vuestro grupo.'
  },
  'norte-de-marruecos': {
    title: 'Viajes por el norte de Marruecos',
    intro: 'Viajes por Tánger, Tetuán, Chefchaouen y las montañas del Rif: rutas por el norte de Marruecos ideales si llegas en ferry desde España, que pueden continuar hacia Fez y el desierto de Merzouga.'
  },
  'ciudades-imperiales': {
    title: 'Rutas por las ciudades imperiales',
    intro: 'Marrakech, Fez, Meknes y Rabat: las cuatro capitales históricas de Marruecos en una misma ruta, con tiempo para sus medinas, zocos, palacios y madrasas.'
  },
  'aventura': {
    title: 'Viajes de aventura en Marruecos',
    intro: 'Viajes de aventura en Marruecos: quads y buggies en las dunas, sandboarding, travesías en dromedario y pistas del Atlas para quienes buscan algo más que visitar ciudades.'
  },
  'cultura': {
    title: 'Viajes culturales por Marruecos',
    intro: 'Viajes culturales por medinas declaradas Patrimonio de la Humanidad, kasbahs de adobe como Aït Ben Haddou, pueblos amazigh (bereberes) y la vida diaria de Marruecos contada por gente local.'
  },
  'montana': {
    title: 'Rutas por el Atlas y la montaña',
    intro: 'Rutas por los puertos de montaña del Alto Atlas, valles como el del Dades y gargantas como las del Todra: paisajes de montaña camino del desierto.'
  },
  'costa': {
    title: 'Viajes a la costa de Marruecos',
    intro: 'Viajes a Essaouira, la costa atlántica y el norte mediterráneo para combinar playa, pescado fresco y medinas tranquilas con el resto de tu ruta.'
  },
  'luna-de-miel': {
    title: 'Luna de miel en Marruecos',
    intro: 'Una luna de miel en Marruecos con riads con encanto, cena bajo las estrellas en el desierto y una ruta privada a vuestro ritmo, diseñada a medida.'
  },
  'viajes-en-familia': {
    title: 'Viajes en familia por Marruecos',
    intro: 'Viajes en familia con etapas cómodas, paradas frecuentes y actividades para niños como el paseo en dromedario o la noche en jaima en el desierto.'
  },
  'viajes-de-lujo': {
    title: 'Viajes de lujo por Marruecos',
    intro: 'Viajes de lujo con campamentos en las dunas, riads seleccionados y traslados privados: Marruecos con el máximo confort.'
  },
  'viajes-exclusivos': {
    title: 'Viajes exclusivos por Marruecos',
    intro: 'Viajes exclusivos: rutas privadas solo para tu grupo, con itinerario, alojamientos y ritmo adaptados a lo que buscas.'
  },
  'viajes-en-grupo': {
    title: 'Viajes en grupo por Marruecos',
    intro: 'Viajes en grupo para amigos, asociaciones o empresas, con vehículo privado y precio por persona que baja cuantos más sois.'
  },
  'paquetes': {
    title: 'Paquetes de viaje a Marruecos',
    intro: 'Paquetes de viaje completos con transporte, alojamiento y actividades incluidas, listas para reservar o adaptar a tus fechas.'
  },
  'actividades': {
    title: 'Experiencias y actividades para tu viaje',
    intro: 'Experiencias y actividades en Marruecos para completar tu viaje: paseos en globo, quads, dromedarios, sandboarding y otras experiencias.'
  },
  'entrega-de-anillo': {
    title: 'Pedida de mano en el desierto',
    intro: 'Organizamos una pedida de mano en las dunas de Merzouga: atardecer, decoración y cena privada para un momento inolvidable.'
  }
};


/** Texto ampliado de cada colección (evita páginas con poco contenido). */
export const COLLECTION_BODIES = {
  'desierto': [
    'El desierto de Merzouga es el gran protagonista de nuestros viajes: las dunas de Erg Chebbi alcanzan hasta 150 metros de altura y cambian de color con la luz del día. Nuestra base está en Hassi Labied, a pie de duna, por lo que conocemos cada rincón de la zona.',
    'Un viaje al desierto suele incluir la travesía en dromedario hasta el campamento, cena bereber, noche en jaima bajo las estrellas y amanecer en lo alto de las dunas. Desde Marrakech se cruzan el Alto Atlas, Ouarzazate y los valles del Dades y del Todra; desde Fez se atraviesan Ifrane, el bosque de cedros y el valle del Ziz.'
  ],
  'norte-de-marruecos': [
    'El norte de Marruecos es la puerta de entrada natural si viajas desde España en ferry: Tánger está a una hora de Tarifa. Desde allí la ruta sigue por Tetuán y su medina blanca hasta Chefchaouen, el pueblo azul en las montañas del Rif.',
    'Estas rutas se pueden combinar con Fez, Meknes y Volubilis, y continuar hacia el desierto de Merzouga para terminar en Marrakech. Te recogemos en el puerto o en el aeropuerto y viajas en vehículo privado con conductor.'
  ],
  'ciudades-imperiales': [
    'Las ciudades imperiales son las cuatro antiguas capitales de Marruecos. Fez conserva la medina medieval más grande del mundo, Meknes sus murallas y puertas monumentales, Rabat la Torre Hassan y la kasbah de los Udayas, y Marrakech la plaza Jemaa el Fna.',
    'Una ruta por las ciudades imperiales se adapta bien a viajes de una o dos semanas y puede incluir una escapada al desierto de Merzouga entre Fez y Marrakech.'
  ],
  'aventura': [
    'Para los viajeros más activos proponemos rutas con quads y buggies entre las dunas de Erg Chebbi, sandboarding al atardecer y travesías en dromedario hasta el campamento.',
    'También se pueden añadir caminatas por las gargantas del Todra o por los valles del Alto Atlas. Todas las actividades se reservan con guías locales y se adaptan al nivel de cada grupo.'
  ],
  'cultura': [
    'Marruecos es un país de culturas mezcladas: árabe, amazigh (bereber), andalusí y sahariana. En nuestras rutas culturales visitamos medinas Patrimonio de la Humanidad como Fez y Marrakech, la kasbah de Aït Ben Haddou y pueblos del valle del Draa.',
    'Cerca de Merzouga conocerás a familias nómadas y la música gnawa de Khamlia, siempre con guías y conductores de la zona que te explican su historia y sus costumbres.'
  ],
  'montana': [
    'El Alto Atlas separa Marrakech del desierto. El puerto de Tizi n\'Tichka, a más de 2.200 metros, ofrece algunas de las vistas más espectaculares del país, y al otro lado esperan Ouarzazate, el valle de las Rosas y el valle del Dades.',
    'Las gargantas del Todra, con paredes de roca de hasta 300 metros, son una parada clásica en la ruta hacia Merzouga. En el norte, el Rif y el Medio Atlas, con los bosques de cedros de Azrou e Ifrane, completan el Marruecos de montaña.'
  ],
  'costa': [
    'La costa marroquí combina el Atlántico y el Mediterráneo. Essaouira, con su puerto pesquero y su medina amurallada, es la escapada favorita desde Marrakech; Asilah y Tánger destacan en el norte.',
    'Añadir unos días de costa a tu ruta es una buena forma de descansar después del desierto o de las ciudades imperiales.'
  ],
  'luna-de-miel': [
    'Diseñamos lunas de miel privadas por Marruecos: riads con encanto en Marrakech y Fez, una noche especial en un campamento del desierto de Merzouga y el ritmo que la pareja prefiera.',
    'Podemos añadir detalles como cena privada en las dunas, paseo en globo al amanecer o un día de hammam. Cuéntanos qué os gustaría y preparamos la ruta a medida.'
  ],
  'viajes-en-familia': [
    'Viajar con niños por Marruecos es sencillo con un vehículo privado: paramos cuando haga falta y repartimos los kilómetros en etapas cómodas.',
    'A los más pequeños les encantan el paseo en dromedario, el sandboarding en las dunas y dormir en una jaima en el desierto de Merzouga. Adaptamos alojamientos y actividades a la edad de cada familia.'
  ],
  'viajes-de-lujo': [
    'Para quienes buscan el máximo confort, combinamos riads y hoteles seleccionados con campamentos de lujo en las dunas de Erg Chebbi.',
    'El viaje se hace en vehículo privado con conductor y puede incluir experiencias exclusivas como cenas privadas, paseos en globo o visitas guiadas personalizadas.'
  ],
  'viajes-exclusivos': [
    'Cada viaje exclusivo se diseña desde cero para tu grupo: tú eliges las fechas, el ritmo, los alojamientos y las paradas.',
    'Te acompaña un conductor de confianza durante toda la ruta y te ayudamos a combinar ciudades, montaña y el desierto de Merzouga en un mismo itinerario.'
  ],
  'viajes-en-grupo': [
    'Organizamos viajes por Marruecos para grupos de amigos, asociaciones, colegios y empresas, con vehículos adaptados al número de viajeros.',
    'Cuantas más personas viajan, más baja el precio por persona. Preparamos el itinerario, los alojamientos y las actividades para que el grupo solo tenga que disfrutar.'
  ],
  'paquetes': [
    'Nuestros paquetes incluyen transporte privado, alojamiento y las principales actividades del itinerario, como la noche en el desierto de Merzouga.',
    'Puedes reservarlos tal cual o pedirnos cambios en las fechas, los alojamientos o la duración para adaptarlos a tu viaje.'
  ],
  'actividades': [
    'Además de los tours, ofrecemos experiencias sueltas para completar tu viaje: quads y buggies en las dunas de Erg Chebbi, sandboarding, paseos en dromedario y noches en campamento.',
    'En Marrakech puedes sumar un paseo en globo al amanecer. Todas las experiencias se pueden reservar por separado o añadir a cualquier ruta.'
  ],
  'entrega-de-anillo': [
    'Pocas cosas hay más especiales que pedir matrimonio en lo alto de una duna al atardecer. Preparamos el lugar con decoración, música y una cena privada en el desierto de Merzouga.',
    'Nos encargamos de la logística y de que todo sea una sorpresa: tú solo tienes que llevar el anillo.'
  ]
};

export function collectionContent(slug, fallbackName = '') {
  const c = COLLECTION_INTROS[slug];
  if (c) return { ...c, body: COLLECTION_BODIES[slug] || [] };
  const readable = fallbackName || String(slug || '').replace(/-/g, ' ');
  return {
    title: `Viajes de ${readable} en Marruecos`,
    intro: `Nuestra selección de tours de ${readable} en Marruecos, con vehículo privado y ruta adaptada a tu grupo.`,
    body: []
  };
}

/** Párrafo extra de la página /actividades. */
export const ACTIVITIES_EXTRA = 'Todas las actividades se organizan con guías y empresas locales de confianza en Merzouga y Marrakech. Puedes reservarlas sueltas o añadirlas a cualquiera de nuestros tours privados: te ayudamos a encajarlas en tu itinerario para aprovechar al máximo cada día de viaje.';

export const ACTIVITIES_EXTRA_I18N = {
  es: ACTIVITIES_EXTRA,
  en: 'All activities are organised with trusted local guides and companies in Merzouga and Marrakech. You can book them on their own or add them to any of our private tours: we help you fit them into your itinerary to make the most of every day of your trip.',
  fr: 'Toutes les activités sont organisées avec des guides et des entreprises locales de confiance à Merzouga et à Marrakech. Vous pouvez les réserver seules ou les ajouter à n’importe lequel de nos circuits privés : nous vous aidons à les intégrer à votre itinéraire pour profiter de chaque jour de voyage.'
};

/** Título, descripción y H1 de la portada en inglés y francés (en español se usan HOME_TITLE, los Ajustes y HOME_H1_FALLBACK). */
export const HOME_I18N_SEO = {
  en: {
    title: 'Morocco Private Tours & Sahara Desert Trips | Vivir Marruecos',
    h1: 'Private tours of Morocco and the Merzouga desert',
    description: 'Tailor-made routes from Marrakech, Fez, Tangier and Casablanca, with a night in a tent in the Erg Chebbi dunes. Local agency based in Merzouga.'
  },
  fr: {
    title: 'Circuits privés au Maroc et désert de Merzouga | Vivir Marruecos',
    h1: 'Circuits privés au Maroc et dans le désert de Merzouga',
    description: 'Itinéraires sur mesure depuis Marrakech, Fès, Tanger et Casablanca, avec une nuit sous la tente dans les dunes de l’Erg Chebbi. Agence locale basée à Merzouga.'
  }
};

/** Título (pestaña y Google) de /tours en cada idioma; el H1 de la página no cambia. */
export const TOURS_TITLE = {
  es: 'Tours y circuitos por Marruecos | Vivir Marruecos',
  en: 'Morocco Tours from Marrakech, Fes & Tangier | Vivir Marruecos',
  fr: 'Circuits au Maroc depuis Marrakech, Fès et Tanger | Vivir Marruecos'
};

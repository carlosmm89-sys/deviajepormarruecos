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

/** Meta descripción de un tour: usa el resumen si es útil; si es demasiado corto, la compone con los datos del tour. */
export function tourMetaDescription(tour) {
  const strip = (s = '') => String(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const summary = strip(tour?.itinerary_summary);
  if (summary.length >= 90) return clip(summary);
  const from = tour?.departure_city ? ` con salida desde ${tour.departure_city}` : '';
  const price = tour?.price ? `, desde ${tour.price} € por persona (grupo de 4)` : '';
  return clip(`${strip(tour?.title)}. Tour privado${from}${price}. Presupuesto a medida.`);
}

/** Título y H1 de un destino. Las páginas "rutas-desde-X" se presentan como "Tours desde X". */
export function destinationHeadings(dest, siteName = 'Vivir Marruecos') {
  const name = String(dest?.name || '').trim();
  const slug = String(dest?.slug || '');
  if (slug.startsWith('rutas-desde-')) {
    const city = name.replace(/^rutas\s+desde\s+/i, '').trim();
    return {
      h1: `Tours desde ${city}`,
      title: `Tours desde ${city} al desierto de Merzouga | ${siteName}`
    };
  }
  if (slug === 'excursiones-cortas') {
    return {
      h1: 'Excursiones de un día por Marruecos',
      title: `Excursiones de un día por Marruecos | ${siteName}`
    };
  }
  return {
    h1: `${name}: tours y excursiones`,
    title: `${name}: tours y excursiones | ${siteName}`
  };
}

/** Introducciones de las colecciones (/coleccion/:slug). */
export const COLLECTION_INTROS = {
  'desierto': {
    title: 'Viajes al desierto de Merzouga',
    intro: 'Rutas privadas al desierto del Sáhara con noche en jaima en las dunas de Erg Chebbi, paseo en dromedario al atardecer y amanecer entre dunas. Salidas desde Marrakech, Fez, Tánger o Casablanca, con conductor y vehículo solo para vuestro grupo.'
  },
  'norte-de-marruecos': {
    title: 'Viajes por el norte de Marruecos',
    intro: 'Tánger, Tetuán, Chefchaouen y las montañas del Rif: rutas por el norte de Marruecos ideales si llegas en ferry desde España, que pueden continuar hacia Fez y el desierto de Merzouga.'
  },
  'ciudades-imperiales': {
    title: 'Rutas por las ciudades imperiales',
    intro: 'Marrakech, Fez, Meknes y Rabat: las cuatro capitales históricas de Marruecos en una misma ruta, con tiempo para sus medinas, zocos, palacios y madrasas.'
  },
  'aventura': {
    title: 'Viajes de aventura en Marruecos',
    intro: 'Quads y buggies en las dunas, sandboarding, travesías en dromedario y pistas del Atlas: rutas para quienes buscan algo más que visitar ciudades.'
  },
  'cultura': {
    title: 'Viajes culturales por Marruecos',
    intro: 'Medinas declaradas Patrimonio de la Humanidad, kasbahs de adobe como Aït Ben Haddou, pueblos amazigh (bereberes) y la vida diaria de Marruecos contada por gente local.'
  },
  'montana': {
    title: 'Rutas por el Atlas y la montaña',
    intro: 'Puertos de montaña del Alto Atlas, valles como el del Dades y gargantas como las del Todra: paisajes de montaña camino del desierto.'
  },
  'costa': {
    title: 'Viajes a la costa de Marruecos',
    intro: 'Essaouira, la costa atlántica y el norte mediterráneo para combinar playa, pescado fresco y medinas tranquilas con el resto de tu ruta.'
  },
  'luna-de-miel': {
    title: 'Luna de miel en Marruecos',
    intro: 'Riads con encanto, cena bajo las estrellas en el desierto y una ruta privada a vuestro ritmo: viajes de novios por Marruecos diseñados a medida.'
  },
  'viajes-en-familia': {
    title: 'Viajes en familia por Marruecos',
    intro: 'Rutas con etapas cómodas, paradas frecuentes y actividades para niños como el paseo en dromedario o la noche en jaima en el desierto.'
  },
  'viajes-de-lujo': {
    title: 'Viajes de lujo por Marruecos',
    intro: 'Campamentos de lujo en las dunas, riads seleccionados y traslados privados: Marruecos con el máximo confort.'
  },
  'viajes-exclusivos': {
    title: 'Viajes exclusivos por Marruecos',
    intro: 'Rutas privadas solo para tu grupo, con itinerario, alojamientos y ritmo adaptados a lo que buscas.'
  },
  'viajes-en-grupo': {
    title: 'Viajes en grupo por Marruecos',
    intro: 'Rutas para grupos de amigos, asociaciones o empresas, con vehículo privado y precio por persona que baja cuantos más sois.'
  },
  'paquetes': {
    title: 'Paquetes de viaje a Marruecos',
    intro: 'Rutas completas con transporte, alojamiento y actividades incluidas, listas para reservar o adaptar a tus fechas.'
  },
  'actividades': {
    title: 'Actividades en Marruecos',
    intro: 'Paseos en globo, quads, dromedarios, sandboarding y experiencias para completar tu viaje por Marruecos.'
  },
  'entrega-de-anillo': {
    title: 'Pedida de mano en el desierto',
    intro: 'Organizamos una pedida de mano en las dunas de Merzouga: atardecer, decoración y cena privada para un momento inolvidable.'
  }
};

export function collectionContent(slug, fallbackName = '') {
  const c = COLLECTION_INTROS[slug];
  if (c) return c;
  const readable = fallbackName || String(slug || '').replace(/-/g, ' ');
  return {
    title: `Viajes de ${readable} en Marruecos`,
    intro: `Nuestra selección de tours de ${readable} en Marruecos, con vehículo privado y ruta adaptada a tu grupo.`
  };
}

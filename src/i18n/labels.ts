// Etiquetas fijas traducidas (categorías de tours, duraciones…). El valor guardado sigue en español.
type L = { es: string; en: string; fr: string };

export const CATEGORY_LABELS: Record<string, L> = {
  'Todos': { es: 'Todos', en: 'All', fr: 'Tous' },
  'Aventura': { es: 'Aventura', en: 'Adventure', fr: 'Aventure' },
  'Cultura': { es: 'Cultura', en: 'Culture', fr: 'Culture' },
  'Desierto': { es: 'Desierto', en: 'Desert', fr: 'Désert' },
  'Montaña': { es: 'Montaña', en: 'Mountains', fr: 'Montagne' },
  'Costa': { es: 'Costa', en: 'Coast', fr: 'Côte' },
  'Viajes Exclusivos': { es: 'Viajes Exclusivos', en: 'Exclusive trips', fr: 'Voyages exclusifs' },
  'Viajes de Lujo': { es: 'Viajes de Lujo', en: 'Luxury trips', fr: 'Voyages de luxe' },
  'Viajes en Grupo': { es: 'Viajes en Grupo', en: 'Group trips', fr: 'Voyages en groupe' },
  'Luna de Miel': { es: 'Luna de Miel', en: 'Honeymoon', fr: 'Lune de miel' },
  'Entrega de Anillo': { es: 'Entrega de Anillo', en: 'Marriage proposal', fr: 'Demande en mariage' },
  'Viajes en Familia': { es: 'Viajes en Familia', en: 'Family trips', fr: 'Voyages en famille' },
  'Paquetes': { es: 'Paquetes', en: 'Packages', fr: 'Forfaits' },
  'Actividades': { es: 'Actividades', en: 'Activities', fr: 'Activités' },
  'Norte de Marruecos': { es: 'Norte de Marruecos', en: 'Northern Morocco', fr: 'Nord du Maroc' },
  'Ciudades Imperiales': { es: 'Ciudades Imperiales', en: 'Imperial cities', fr: 'Villes impériales' },
};

export function categoryLabel(cat: string, lang: string): string {
  const l = CATEGORY_LABELS[cat] || Object.values(CATEGORY_LABELS).find(x => x.es.toLowerCase() === String(cat).toLowerCase());
  return l ? (l as any)[lang] || l.es : cat;
}

/** "4-6 días" → "4-6 days" / "4-6 jours" */
export function durationLabel(d: string, lang: string): string {
  if (lang === 'en') return d.replace('días', 'days');
  if (lang === 'fr') return d.replace('días', 'jours');
  return d;
}

// Extrae las paradas de un tour a partir de los encabezados "Día N: A – B – C" del itinerario
// y les asigna coordenadas. Archivo .js para poder reutilizarlo también en Node si hace falta.

/** Lugares conocidos: [nombre que se muestra, lat, lng, alias (sin tildes, en minúsculas)] */
const PLACES = [
  ['Marrakech', 31.6295, -7.9811, ['marrakech', 'marrakesh', 'menara']],
  ['Alto Atlas (Tizi n\'Tichka)', 31.2867, -7.3803, ['alto atlas', 'tizi n']],
  ['Aït Ben Haddou', 31.0470, -7.1318, ['ait ben haddou', 'ait benhaddou']],
  ['Ouarzazate', 30.9189, -6.8934, ['ouarzazate']],
  ['Skoura', 31.0592, -6.5600, ['skoura']],
  ['Valle de las Rosas', 31.2400, -6.1280, ['valle de las rosas', 'kelaat']],
  ['Valle del Dades', 31.4500, -5.9500, ['dades']],
  ['Gargantas del Todra', 31.5880, -5.5910, ['todra', 'todgha', 'tinghir']],
  ['Alnif', 31.1150, -5.1700, ['alnif']],
  ['Valle del Draa', 30.6970, -6.4480, ['draa', 'agdz']],
  ['Erfoud', 31.4314, -4.2333, ['erfoud']],
  ['Rissani', 31.2780, -4.2650, ['rissani']],
  ['Merzouga (Erg Chebbi)', 31.0967, -4.0113, ['merzouga', 'erg chebbi', 'hassi labied', 'khamlia']],
  ['Errachidia', 31.9314, -4.4246, ['errachidia']],
  ['Valle del Ziz', 32.2500, -4.4000, ['ziz']],
  ['Midelt', 32.6852, -4.7451, ['midelt']],
  ['Bosque de cedros (Azrou)', 33.4300, -5.1800, ['cedros', 'azrou']],
  ['Ifrane', 33.5228, -5.1100, ['ifrane']],
  ['Fez', 34.0331, -5.0003, ['fez', 'fes']],
  ['Meknes', 33.8935, -5.5473, ['meknes']],
  ['Volubilis', 34.0739, -5.5547, ['volubilis']],
  ['Chefchaouen', 35.1714, -5.2697, ['chefchaouen', 'chaouen']],
  ['Tetuán', 35.5785, -5.3684, ['tetuan', 'tetouan']],
  ['Tánger', 35.7595, -5.8340, ['tanger', 'tangier']],
  ['Cabo Espartel', 35.7917, -5.9244, ['espartel', 'hercules']],
  ['Asilah', 35.4650, -6.0340, ['asilah', 'arcila']],
  ['Rabat', 34.0209, -6.8416, ['rabat']],
  ['Casablanca', 33.5731, -7.5898, ['casablanca']],
  ['Zagora', 30.3324, -5.8384, ['zagora']],
  ['Essaouira', 31.5085, -9.7595, ['essaouira']],
  ['Agadir', 30.4202, -9.5982, ['agadir']],
];

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ /g, ' ');

function findPlace(text) {
  const t = norm(text);
  for (const [name, lat, lng, aliases] of PLACES) {
    if (aliases.some((a) => t.includes(a))) return { name, lat, lng };
  }
  return null;
}

/** Lee los encabezados "Día N: ..." de un HTML de itinerario (sin depender del DOM). */
export function parseItineraryDays(html) {
  const text = String(html || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/<\/(h[1-6]|p|li|strong|b)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/ /g, ' ');
  const days = [];
  const seen = new Set();
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const m = line.match(/^d[ií]a\s*(\d+)\s*[:.\-–]\s*(.+)$/i);
    if (!m || seen.has(m[1])) continue;
    seen.add(m[1]);
    days.push({ day: Number(m[1]), title: m[2].trim() });
  }
  return days.sort((a, b) => a.day - b.day);
}

/**
 * Devuelve { days: [{day, title, stops:[{name,lat,lng}]}], stops: [{name,lat,lng,days:[n]}] }
 * con las paradas en orden y sin repetir paradas consecutivas.
 */
export function buildRoute(html, departureCity, returnCity) {
  const days = parseItineraryDays(html).map((d) => {
    const stops = [];
    for (const part of d.title.split(/\s*[–—→>]\s*|\s+-\s+/)) {
      const p = findPlace(part);
      if (p && (!stops.length || stops[stops.length - 1].name !== p.name)) stops.push(p);
    }
    return { ...d, stops };
  });

  const route = [];
  const pushStop = (p, day) => {
    if (!p) return;
    const last = route[route.length - 1];
    if (last && last.name === p.name) {
      if (day && !last.days.includes(day)) last.days.push(day);
      return;
    }
    route.push({ ...p, days: day ? [day] : [] });
  };

  if (!days.some((d) => d.stops.length)) {
    // Sin itinerario reconocible: al menos salida y regreso
    pushStop(findPlace(departureCity));
    pushStop(findPlace(returnCity));
  } else {
    for (const d of days) d.stops.forEach((p) => pushStop(p, d.day));
  }
  return { days, stops: route };
}

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { buildRoute } from '../lib/routeStops';
import { useTranslation } from '../hooks/useTranslation';

const ROUTE_COLOR = '#2563eb'; // azul

interface Props {
  itineraryHtml?: string | null;
  departureCity?: string;
  returnCity?: string;
}

interface Stop {
  name: string;
  lat: number;
  lng: number;
  days: number[];
}

function numberedIcon(n: number, isEnd: boolean) {
  const bg = isEnd ? '#1e3a8a' : ROUTE_COLOR;
  return L.divIcon({
    className: '',
    html: `<div style="background:${bg};color:#fff;width:28px;height:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font:700 13px/1 sans-serif;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

// Nombres de lugares del mapa en inglés y francés (los que cambian respecto al español)
const PLACE_NAMES: Record<string, { en: string; fr: string }> = {
  "Alto Atlas (Tizi n'Tichka)": { en: "High Atlas (Tizi n'Tichka)", fr: "Haut Atlas (Tizi n'Tichka)" },
  'Valle de las Rosas': { en: 'Valley of Roses', fr: 'Vallée des Roses' },
  'Valle del Dades': { en: 'Dades Valley', fr: 'Vallée du Dadès' },
  'Gargantas del Todra': { en: 'Todra Gorges', fr: 'Gorges du Todra' },
  'Valle del Draa': { en: 'Draa Valley', fr: 'Vallée du Drâa' },
  'Valle del Ziz': { en: 'Ziz Valley', fr: 'Vallée du Ziz' },
  'Bosque de cedros (Azrou)': { en: 'Cedar forest (Azrou)', fr: 'Forêt de cèdres (Azrou)' },
  'Fez': { en: 'Fez', fr: 'Fès' },
  'Meknes': { en: 'Meknes', fr: 'Meknès' },
  'Tetuán': { en: 'Tetouan', fr: 'Tétouan' },
  'Tánger': { en: 'Tangier', fr: 'Tanger' },
  'Cabo Espartel': { en: 'Cape Spartel', fr: 'Cap Spartel' },
};

export default function TourRouteMap({ itineraryHtml, departureCity, returnCity }: Props) {
  const { tr, currentLanguage } = useTranslation();
  const placeName = (n: string) => currentLanguage === 'es' ? n : ((PLACE_NAMES[n] as any)?.[currentLanguage] || n);
  const dayWord = tr({ es: 'Día', en: 'Day', fr: 'Jour' });
  const { days, stops } = useMemo(
    () => buildRoute(itineraryHtml || '', departureCity, returnCity) as { days: { day: number; title: string; stops: Stop[] }[]; stops: Stop[] },
    [itineraryHtml, departureCity, returnCity]
  );

  if (!stops.length) return null;

  // Un marcador por lugar (aunque se pase dos veces), numerado según la primera visita
  const markers: { stop: Stop; n: number; visits: number[] }[] = [];
  stops.forEach((s) => {
    const existing = markers.find((m) => m.stop.name === s.name);
    if (existing) existing.visits.push(...s.days);
    else markers.push({ stop: s, n: markers.length + 1, visits: [...s.days] });
  });

  const line = stops.map((s) => [s.lat, s.lng] as [number, number]);
  const bounds = L.latLngBounds(line).pad(0.15);
  const routeNames = stops.map((s) => placeName(s.name)).join(' → ');

  return (
    <div className="space-y-6">
      <div className="w-full h-[420px] rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
        <MapContainer bounds={bounds} scrollWheelZoom={false} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />
          {line.length > 1 && (
            <Polyline positions={line} pathOptions={{ color: ROUTE_COLOR, weight: 4, opacity: 0.9 }} />
          )}
          {markers.map((m, idx) => (
            <Marker key={m.stop.name} position={[m.stop.lat, m.stop.lng]} icon={numberedIcon(m.n, idx === 0 || idx === markers.length - 1)}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{placeName(m.stop.name)}</p>
                  {m.visits.length > 0 && (
                    <p className="text-xs text-gray-500">{dayWord} {[...new Set(m.visits)].join(', ')}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-gray-100 z-[1000] text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: ROUTE_COLOR }} />
          <span className="font-semibold text-gray-900">{markers.length} {tr({ es: 'paradas', en: 'stops', fr: 'étapes' })}</span>
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed">
        <span className="font-semibold text-gray-900">{tr({ es: 'Ruta', en: 'Route', fr: 'Itinéraire' })}: </span>
        {routeNames}
      </p>

      {days.some((d) => d.stops.length) && (
        <ol className="space-y-2">
          {days.filter((d) => d.stops.length).map((d) => (
            <li key={d.day} className="flex gap-3 text-gray-700">
              <span className="shrink-0 font-bold" style={{ color: ROUTE_COLOR }}>{dayWord} {d.day}</span>
              <span>{d.stops.map((s) => placeName(s.name)).join(' → ')}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

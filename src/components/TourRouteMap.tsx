import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Primary coordinates for Moroccan cities
const CITY_COORDINATES: Record<string, [number, number]> = {
  'marrakech': [31.6295, -7.9811],
  'fez': [34.0331, -5.0003],
  'fes': [34.0331, -5.0003],
  'casablanca': [33.5731, -7.5898],
  'tanger': [35.7595, -5.8340],
  'tangier': [35.7595, -5.8340],
  'tánger': [35.7595, -5.8340],
  'merzouga': [31.0967, -4.0113],
  'ouarzazate': [30.9189, -6.8934],
  'chefchaouen': [35.1714, -5.2697],
  'rabat': [34.0209, -6.8416],
  'agadir': [30.4202, -9.5982],
  'essaouira': [31.5085, -9.7595],
  'zagora': [30.3324, -5.8384]
};

interface Props {
  departureCity?: string;
  returnCity?: string;
}

export default function TourRouteMap({ departureCity, returnCity }: Props) {
  const normalize = (city: string) => city.trim().toLowerCase();
  
  const depCoords = departureCity && CITY_COORDINATES[normalize(departureCity)];
  const retCoords = returnCity && CITY_COORDINATES[normalize(returnCity)];

  // Default center: Morocco
  const center: [number, number] = depCoords || retCoords || [31.7917, -7.0926];
  const zoom = depCoords && retCoords && depCoords !== retCoords ? 5 : 6;

  const markers: { position: [number, number]; label: string; isStart: boolean }[] = [];
  if (depCoords) {
    markers.push({ position: depCoords, label: departureCity, isStart: true });
  }
  if (retCoords && (!depCoords || retCoords[0] !== depCoords[0] || retCoords[1] !== depCoords[1])) {
    markers.push({ position: retCoords, label: returnCity, isStart: false });
  }

  const polylinePositions = markers.map(m => m.position);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-gray-900">{marker.label}</p>
                <p className="text-xs text-gray-500">{marker.isStart ? 'Origen' : 'Destino'}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            pathOptions={{ color: '#d97706', weight: 3, dashArray: '10, 10' }} // Brand accent color, dashed
          />
        )}
      </MapContainer>
      
      {/* Overlay legend */}
      {markers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 z-[1000] text-sm">
          <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-brand-primary" />
            Ruta del Tour
          </h4>
          <div className="space-y-1">
            {depCoords && <p><span className="text-gray-500">Salida:</span> <span className="font-semibold">{departureCity}</span></p>}
            {retCoords && <p><span className="text-gray-500">Regreso:</span> <span className="font-semibold">{returnCity}</span></p>}
          </div>
        </div>
      )}
    </div>
  );
}

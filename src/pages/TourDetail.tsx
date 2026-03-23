import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tour, Destination } from '../types';
import { 
  Clock, MapPin, 
  ArrowLeft, Home, BookOpen, ShieldCheck, Map as MapIcon, Image as ImageIcon
} from 'lucide-react';
import { dbService } from '../services/dbService';

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('descripcion');

  const descripcionRef = useRef<HTMLDivElement>(null);
  const itinerarioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const t = await dbService.getTour(id);
          setTour(t);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, tab: string) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Tour no encontrado</h2>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-gray-50/30">
      {/* Hero Gallery */}
      <section className="h-[70vh] grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl">
          <img
            src={tour.featured_image || tour.gallery?.[0] || 'https://picsum.photos/seed/tour1/1200/800'}
            alt={tour.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 md:col-span-1">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={tour.gallery?.[1] || 'https://picsum.photos/seed/tour2/800/600'}
              alt={tour.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={tour.gallery?.[2] || 'https://picsum.photos/seed/tour3/800/600'}
              alt={tour.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="hidden md:block relative overflow-hidden rounded-3xl md:col-span-1">
          <img
            src={tour.gallery?.[3] || 'https://picsum.photos/seed/tour4/800/1200'}
            alt={tour.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Sticky Nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar py-4">
            {['Descripción', 'Itinerario'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  const tabLower = tab.toLowerCase();
                  if (tabLower === 'descripción') scrollToSection(descripcionRef, tabLower);
                  if (tabLower === 'itinerario') scrollToSection(itinerarioRef, tabLower);
                }}
                className={`text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.toLowerCase() ? 'text-brand-accent border-b-2 border-brand-accent pb-1' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-8">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-brand-accent flex items-center gap-1">
                <Home className="w-3 h-3" /> Inicio
              </Link>
              <span>/</span>
              <span className="text-gray-600 font-medium">{tour.title}</span>
            </nav>

            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight text-gray-900">{tour.title}</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-accent" />
                <span className="text-sm font-medium text-gray-600">{tour.itinerary_summary}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-accent" />
                <span className="text-sm font-medium text-gray-600">{tour.departure_city}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapIcon className="w-5 h-5 text-brand-accent" />
                <span className="text-sm font-medium text-gray-600">{(tour as any).destinations?.name}</span>
              </div>
            </div>
          </div>

          <div ref={descripcionRef} className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-brand-accent rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">Incluye / Excluye</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                <h3 className="font-bold text-green-900 mb-4">Incluido</h3>
                <p className="whitespace-pre-wrap text-green-800 text-sm">
                  {tour.description_includes}
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                <h3 className="font-bold text-red-900 mb-4">No incluido</h3>
                <p className="whitespace-pre-wrap text-red-800 text-sm">
                  {tour.description_excludes}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-brand-accent rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">Recomendaciones</h2>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{tour.recommendations || 'No hay recomendaciones especiales.'}</p>
          </div>

          <div ref={itinerarioRef} className="space-y-12">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-brand-accent rounded-full" />
              <h2 className="text-3xl font-bold text-gray-900">Itinerario: {tour.title}</h2>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 whitespace-pre-wrap leading-relaxed text-gray-700">
              {tour.itinerary_details}
            </div>
          </div>
        </div>

        {/* Sidebar Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">Solicitar Presupuesto</h3>
              
              <form className="space-y-6">
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre completo*" className="input-field" />
                  <input type="email" placeholder="Email*" className="input-field" />
                  <input type="tel" placeholder="Teléfono" className="input-field" />
                  <textarea placeholder="Su consulta*" className="input-field min-h-[100px] resize-none" />
                </div>

                <div className="flex gap-3">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 text-brand-accent focus:ring-brand-accent" />
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Doy mi consentimiento para que este sitio web almacene mi información enviada para que puedan responder a mi consulta
                  </p>
                </div>

                <button type="button" className="btn-primary w-full py-5 text-lg shadow-lg shadow-brand-primary/20">
                  ENVIAR CONSULTA
                </button>
              </form>
            </div>

            <div className="bg-brand-primary/5 p-8 rounded-[2.5rem] border border-brand-primary/10 flex items-center justify-center gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-accent" />
              <div className="text-left">
                <p className="font-bold text-gray-900">Reserva Segura</p>
                <p className="text-xs text-gray-500">Sin cargos ocultos ni sorpresas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

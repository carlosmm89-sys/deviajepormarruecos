import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Destination } from '../types';
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';

export default function HeroSearch() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    dbService.getDestinations().then(data => setDestinations(data)).catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDest) params.append('destination', selectedDest);
    if (selectedDate) params.append('date', selectedDate);
    if (selectedDuration) params.append('duration', selectedDuration);
    
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl max-w-4xl mx-auto w-full mt-12 relative z-20">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
        
        {/* DESTINO */}
        <div className="flex-1 w-full p-4 relative group">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Destino
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedDest}
              onChange={(e) => setSelectedDest(e.target.value)}
              className="w-full bg-transparent text-gray-700 font-semibold text-lg focus:outline-none appearance-none cursor-pointer placeholder-gray-300"
            >
              <option value="" disabled hidden>¿A dónde vamos?</option>
              <option value="all">Cualquier destino</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
          </div>
        </div>

        {/* FECHA */}
        <div className="flex-1 w-full p-4 relative group">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Fecha
          </label>
          <div className="flex items-center gap-2">
             <input
              type="month"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-transparent text-gray-700 font-semibold text-lg focus:outline-none cursor-pointer placeholder-gray-300"
              placeholder="Seleccionar"
            />
          </div>
        </div>

        {/* DURACIÓN */}
        <div className="flex-1 w-full p-4 relative group">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Duración
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full bg-transparent text-gray-700 font-semibold text-lg focus:outline-none appearance-none cursor-pointer placeholder-gray-300"
            >
               <option value="" disabled hidden>Seleccionar</option>
               <option value="all">Cualquier duración</option>
               <option value="1-3">1-3 Días</option>
               <option value="4-6">4-6 Días</option>
               <option value="7-10">7-10 Días</option>
               <option value="11-14">11-14 Días</option>
               <option value="15+">+15 Días</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
          </div>
        </div>

        {/* BOTÓN EXPLORAR */}
        <div className="p-4 w-full md:w-auto flex justify-center">
          <button
            type="submit"
            className="w-full md:w-auto bg-[#8C4A2D] hover:bg-[#703B24] text-white font-bold tracking-widest uppercase text-sm px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <MapPin className="w-4 h-4" />
            Explorar
          </button>
        </div>

      </form>
    </div>
  );
}

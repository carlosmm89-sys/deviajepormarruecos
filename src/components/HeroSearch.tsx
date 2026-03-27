import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { Destination } from '../types';
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSearch() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [activeDropdown, setActiveDropdown] = useState<'dest' | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dbService.getDestinations().then(data => setDestinations(data)).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Almacenar en local storage
    localStorage.setItem('search_dates', JSON.stringify({
      startDate,
      endDate
    }));

    const params = new URLSearchParams();
    if (selectedDest && selectedDest !== 'all') params.append('destination', selectedDest);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    navigate(`/tours?${params.toString()}`);
  };

  const getDestLabel = () => {
    if (!selectedDest) return '¿A dónde vamos?';
    if (selectedDest === 'all') return 'Cualquier destino';
    return destinations.find(d => d.id === selectedDest)?.name || '¿A dónde vamos?';
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl max-w-4xl mx-auto w-full mt-12 relative z-20" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100 relative">
        
        {/* DESTINO */}
        <div className="flex-1 w-full p-4 relative group cursor-pointer" onClick={() => setActiveDropdown(activeDropdown === 'dest' ? null : 'dest')}>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 cursor-pointer">
            Destino
          </label>
          <div className="flex items-center gap-2">
            <div className={`w-full bg-transparent font-semibold text-lg truncate ${selectedDest ? 'text-gray-900' : 'text-gray-400'}`}>
              {getDestLabel()}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeDropdown === 'dest' ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {activeDropdown === 'dest' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2"
              >
                <div
                  className="px-6 py-3 hover:bg-brand-primary/5 cursor-pointer text-gray-700 hover:text-brand-primary font-medium transition-colors"
                  onClick={() => setSelectedDest('all')}
                >
                  Cualquier destino
                </div>
                {destinations.map(d => (
                  <div
                    key={d.id}
                    className="px-6 py-3 hover:bg-brand-primary/5 cursor-pointer text-gray-700 hover:text-brand-primary font-medium transition-colors"
                    onClick={() => setSelectedDest(d.id)}
                  >
                    {d.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FECHAS */}
        <div className="flex-[1.5] w-full p-4 relative group flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Ida
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent font-semibold text-base focus:outline-none cursor-pointer text-gray-800"
              style={{ colorScheme: 'light' }}
            />
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Vuelta
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent font-semibold text-base focus:outline-none cursor-pointer text-gray-800"
              style={{ colorScheme: 'light' }}
            />
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

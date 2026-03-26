import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { Eye, Map, Compass, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    homeViews: 0,
    totalDestViews: 0,
    totalTourViews: 0,
    totalLeads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const settings = await dbService.getBusinessSettings();
        const dests = await dbService.getDestinations();
        const tours = await dbService.getTours();
        const leads = await dbService.getLeads();

        setStats({
          homeViews: settings?.home_views || 0,
          totalDestViews: dests.reduce((acc, d) => acc + (d.views || 0), 0),
          totalTourViews: tours.reduce((acc, t) => acc + (t.views || 0), 0),
          totalLeads: leads.length
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Visitas Web (Inicio)', value: stats.homeViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Visitas a Destinos', value: stats.totalDestViews, icon: Map, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Visitas a Tours', value: stats.totalTourViews, icon: Compass, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Total Leads (Contactos)', value: stats.totalLeads, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">Panel de Estadísticas</h1>
        <p className="text-gray-500 mt-1">Visión general del rendimiento y visitas de tu plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

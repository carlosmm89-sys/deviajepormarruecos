import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lead } from '../types';
import { AlertCircle, Trash2, Mail, Phone, Calendar, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';

export default function AdminLeads() {
  const location = useLocation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await dbService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este lead?')) {
      try {
        await dbService.deleteLead(id);
        fetchLeads();
      } catch (err: any) {
        console.error('Error deleting lead:', err);
        setError('Error al eliminar el lead.');
      }
    }
  };

  const updateLeadStatus = async (id: string, newStatus: Lead['status']) => {
    try {
      await dbService.updateLeadStatus(id, newStatus);
      fetchLeads();
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError('Error al actualizar el estado.');
    }
  };

  const statusColors: Record<Lead['status'], string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    interested: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<Lead['status'], string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    interested: 'Interesado',
    converted: 'Convertido',
    cancelled: 'Cancelado',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">Gestión de contactos y clientes potenciales.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Cliente</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Contacto</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Viaje</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Tour Solicitado</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Estado</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{lead.first_name} {lead.last_name}</span>
                    </div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-accent cursor-pointer">
                      <Mail className="w-3 h-3" /> <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" /> <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                      </div>
                    )}
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" /> {new Date(lead.approximate_date || '').toLocaleDateString() || 'No def.'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Pax: <span className="font-semibold">{lead.passengers_count}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="font-medium text-brand-primary line-clamp-2">
                        {(lead as any).tours?.title || 'Tour General'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`text-xs font-bold px-2 py-1 rounded-full outline-none border-none cursor-pointer ${statusColors[lead.status]}`}
                    >
                      {Object.entries(statusLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    {lead.phone && (
                      <>
                        <a
                          href={`tel:${lead.phone}`}
                          title="Llamar"
                          className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Contactar por WhatsApp"
                          className="p-2 text-[#25D366] hover:text-[#1ebe5d] bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </>
                    )}
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                      title="Eliminar Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No hay leads registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

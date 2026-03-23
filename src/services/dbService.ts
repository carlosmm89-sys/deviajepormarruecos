import { supabase } from '../lib/supabase';
import { Destination, Tour, Lead, BusinessSettings } from '../types';

export const dbService = {
  // Destinations
  getDestinations: async (): Promise<Destination[]> => {
    const { data, error } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  getDestination: async (id: string): Promise<Destination | null> => {
    const { data, error } = await supabase.from('destinations').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  },
  saveDestination: async (destination: Partial<Destination>): Promise<Destination> => {
    const { data, error } = await supabase.from('destinations').upsert([destination]).select().single();
    if (error) throw error;
    return data;
  },
  deleteDestination: async (id: string): Promise<void> => {
    const { error } = await supabase.from('destinations').delete().eq('id', id);
    if (error) throw error;
  },

  // Tours
  getTours: async (): Promise<Tour[]> => {
    const { data, error } = await supabase.from('tours').select('*, destinations(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  getTour: async (id: string): Promise<Tour | null> => {
    const { data, error } = await supabase.from('tours').select('*, destinations(*)').eq('id', id).single();
    if (error) return null;
    return data;
  },
  getToursByDestination: async (destinationId: string): Promise<Tour[]> => {
    const { data, error } = await supabase.from('tours').select('*').eq('destination_id', destinationId);
    if (error) throw error;
    return data;
  },
  saveTour: async (tour: Partial<Tour>): Promise<Tour> => {
    const { data, error } = await supabase.from('tours').upsert([tour]).select().single();
    if (error) throw error;
    return data;
  },
  deleteTour: async (id: string): Promise<void> => {
    const { error } = await supabase.from('tours').delete().eq('id', id);
    if (error) throw error;
  },

  // Leads
  createLead: async (lead: Partial<Lead>): Promise<Lead> => {
    const { data, error } = await supabase.from('leads').insert([lead]).select().single();
    if (error) throw error;
    return data;
  },
  getLeads: async (): Promise<Lead[]> => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  deleteLead: async (id: string): Promise<void> => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
  },
  updateLeadStatus: async (id: string, status: string): Promise<Lead> => {
    const { data, error } = await supabase.from('leads').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // Business Settings
  getBusinessSettings: async (): Promise<BusinessSettings | null> => {
    const { data, error } = await supabase.from('business_settings').select('*').limit(1).single();
    if (error) return null;
    return data;
  },
  saveBusinessSettings: async (settings: Partial<BusinessSettings>): Promise<BusinessSettings> => {
    const { data, error } = await supabase.from('business_settings').upsert([settings]).select().single();
    if (error) throw error;
    return data;
  }
};

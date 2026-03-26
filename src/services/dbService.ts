import { supabase } from '../lib/supabase';
import { Destination, Tour, Lead, BusinessSettings, BlogPost } from '../types';

export const dbService = {
  // Storage
  uploadImage: async (file: File | Blob): Promise<string> => {
    let ext = 'jpg';
    if (file.type === 'image/png') ext = 'png';
    else if (file.type === 'image/webp') ext = 'webp';
    else if (file.type === 'image/jpeg') ext = 'jpg';
    else if ('name' in file && typeof file.name === 'string') {
        const fileExt = file.name.split('.').pop();
        if (fileExt) ext = fileExt;
    }
    
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  },

  // Destinations
  getDestinations: async (): Promise<Destination[]> => {
    const { data, error } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  getDestination: async (id: string): Promise<Destination | null> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('destinations').select('*');
    
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }
    
    const { data, error } = await query.single();
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
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('tours').select('*, destinations(*)');
    
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data, error } = await query.single();
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
  },

  // Analytics
  incrementTourViews: async (id: string) => {
    await supabase.rpc('increment_tour_views', { row_id: id });
  },
  incrementDestViews: async (id: string) => {
    await supabase.rpc('increment_dest_views', { row_id: id });
  },
  incrementHomeViews: async () => {
    await supabase.rpc('increment_home_views');
  },
  
  // Blog
  getBlogPosts: async (adminView = false): Promise<BlogPost[]> => {
    let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
    if (!adminView) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  getBlogPost: async (slugOrId: string, adminView = false): Promise<BlogPost | null> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    let query = supabase.from('blog_posts').select('*');
    
    if (!adminView) query = query.eq('is_published', true);
    if (isUuid) query = query.eq('id', slugOrId);
    else query = query.eq('slug', slugOrId);
    
    const { data, error } = await query.single();
    if (error) return null;
    return data;
  },
  saveBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    const { data, error } = await supabase.from('blog_posts').upsert([post]).select().single();
    if (error) throw error;
    return data;
  },
  deleteBlogPost: async (id: string): Promise<void> => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  },
  incrementBlogViews: async (id: string) => {
    await supabase.rpc('increment_blog_views', { row_id: id });
  }
};

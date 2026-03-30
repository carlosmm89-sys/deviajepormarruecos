export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured: boolean;
  views?: number;
  translations?: Record<string, any>;
  meta_data: any;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: string;
  destination_id: string;
  destination_ids?: string[];
  title: string;
  slug: string;
  category: string;
  featured_image: string;
  gallery: string[];
  description: string;
  duration: string;
  max_people: string;
  date_text: string;
  departure_city: string;
  departure_time: string;
  return_city?: string;
  return_time?: string;
  meeting_point: string;
  meeting_time: string;
  description_includes: string;
  description_excludes: string;
  recommendations: string;
  itinerary_summary: string;
  itinerary_details: string;
  map_iframe: string;
  itinerary_image: string;
  price: number;
  is_active: boolean;
  views?: number;
  translations?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  category?: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author: string;
  published_at: string;
  is_published: boolean;
  views: number;
  translations?: Record<string, any>;
}

export interface Lead {
  id: string;
  tour_id?: string;
  form_type: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  travel_motive?: string;
  passengers_count: number;
  approximate_date?: string;
  message?: string;
  source?: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  site_name: string;
  admin_email: string;
  whatsapp_number: string;
  whatsapp_welcome_message: string;
  instagram_url: string;
  facebook_url: string;
  tripadvisor_url: string;
  footer_address: string;
  logo_url?: string;
  favicon_url?: string;
  google_reviews_widget?: string;
  instagram_widget?: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
  hero_image_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  home_views?: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar_url?: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title?: string;
  description?: string;
  image_url: string;
  category?: string;
  created_at: string;
}

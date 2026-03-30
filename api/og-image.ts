import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using public config
const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';

const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export default async function handler(req: any, res: any) {
  try {
    const { data } = await supabase
      .from('business_settings')
      .select('logo_url')
      .limit(1)
      .single();

    if (data && data.logo_url) {
      // Redirect to the dynamic logo URL from the database
      res.redirect(data.logo_url);
    } else {
      // Fallback
      res.redirect('https://vivirmarruecos.com/pwa-512x512.png');
    }
  } catch (error) {
    console.error('Error fetching dynamic OG image:', error);
    res.redirect('https://vivirmarruecos.com/pwa-512x512.png');
  }
}

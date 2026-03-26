import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: dests } = await supabase.from('destinations').select('id, name, image_url');
  console.log("Destinations:", dests);
  const { data: tours } = await supabase.from('tours').select('id, title, featured_image, gallery');
  console.log("Tours:", tours);
}
check();

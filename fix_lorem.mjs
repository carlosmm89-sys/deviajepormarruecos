import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';
const supabase = createClient(supabaseUrl, supabaseKey);

const destMap = {
  'rutas-desde-marrakech': 'https://loremflickr.com/800/600/marrakech,medina?lock=1',
  'rutas-desde-tanger': 'https://loremflickr.com/800/600/chefchaouen,morocco?lock=2',
  'rutas-desde-fez': 'https://loremflickr.com/800/600/fez,morocco,tannery?lock=3',
  'rutas-desde-casablanca': 'https://loremflickr.com/800/600/casablanca,mosque?lock=4',
  'excursiones-cortas': 'https://loremflickr.com/800/600/morocco,architecture?lock=5',
  'marruecos': 'https://loremflickr.com/800/600/morocco,desert,camels?lock=6'
};

async function updateImages() {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'soporte@tonwy.com',
    password: 'Carlos2026*'
  });
  
  if (authError) {
    console.error("Auth failed:", authError.message);
    process.exit(1);
  }
  console.log("Logged in successfully as Admin.");

  // Update destinations
  const { data: dests } = await supabase.from('destinations').select('*');
  if (dests && dests.length > 0) {
    for (const d of dests) {
      const match = destMap[d.slug] || `https://loremflickr.com/800/600/morocco?lock=99`;
      await supabase.from('destinations').update({ image_url: match }).eq('id', d.id);
      console.log(`Updated dest ${d.slug}`);
    }
  }

  // Update tours
  const { data: tours } = await supabase.from('tours').select('*');
  if (tours && tours.length > 0) {
    for (let i = 0; i < tours.length; i++) {
        // use lock=10+i to ensure unique photos for each tour
      const img = `https://loremflickr.com/800/600/morocco,travel,desert,medina?lock=${i + 10}`;
      await supabase.from('tours').update({ featured_image: img, gallery: [img] }).eq('id', tours[i].id);
      console.log(`Updated tour ${tours[i].title}`);
    }
  }
}

updateImages().then(() => console.log('Done!'));

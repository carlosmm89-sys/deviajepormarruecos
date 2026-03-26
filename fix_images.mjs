import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Hand-picked guaranteed working Unsplash URLs with specific queries
const destMap = {
  'rutas-desde-marrakech': 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&q=80&w=800', // Souk / Lamps
  'rutas-desde-tanger': 'https://images.unsplash.com/photo-1473110290518-eccc5aee178c?auto=format&fit=crop&q=80&w=800',  // Chefchaouen blue city
  'rutas-desde-fez': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',     // Fez
  'rutas-desde-casablanca': 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800', // Mosque
  'excursiones-cortas': 'https://images.unsplash.com/photo-1554188204-71239aaeb1ae?auto=format&fit=crop&q=80&w=800', // Generic Arch
  'marruecos': 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800'        // Desert
};

const tourImages = [
  'https://images.unsplash.com/photo-1552554790-256cf7b7ce74?auto=format&fit=crop&q=80&w=800', // Desert Dunes
  'https://images.unsplash.com/photo-1574343136277-2da3624fbb86?auto=format&fit=crop&q=80&w=800', // Kasbah Ait Benhaddou
  'https://images.unsplash.com/photo-1502484433129-8730acbc18d8?auto=format&fit=crop&q=80&w=800', // Blue tiles / interior
  'https://images.unsplash.com/photo-1554188204-71239aaeb1ae?auto=format&fit=crop&q=80&w=800', // Archway
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800', // Casablanca Mosque
  'https://images.unsplash.com/photo-1473110290518-eccc5aee178c?auto=format&fit=crop&q=80&w=800', // Chefchaouen
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800', // Fez Tanning
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800', // Camels
  'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&q=80&w=800', // Lamps
  'https://images.unsplash.com/photo-1521124430489-08226d40026e?auto=format&fit=crop&q=80&w=800', // Morocco streets with carpet
  'https://images.unsplash.com/photo-1541364505085-78e83b45167b?auto=format&fit=crop&q=80&w=800', // Spices
];

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
  for (const d of dests) {
    const defaultImg = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800';
    const match = destMap[d.slug] || defaultImg;
    
    await supabase.from('destinations').update({ image_url: match }).eq('id', d.id);
    console.log(`Updated dest ${d.slug}`);
  }

  // Update tours
  const { data: tours } = await supabase.from('tours').select('*');
  for (let i = 0; i < tours.length; i++) {
    const img = tourImages[i % tourImages.length];
    await supabase.from('tours').update({ featured_image: img, gallery: [img] }).eq('id', tours[i].id);
    console.log(`Updated tour ${tours[i].title}`);
  }
}

updateImages().then(() => console.log('Done!'));

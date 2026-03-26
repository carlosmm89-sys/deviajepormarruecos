import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';
const supabase = createClient(supabaseUrl, supabaseKey);

const destinationImages = {
  'marrakech': 'https://images.unsplash.com/photo-1597212618440-8062638f2cb4?q=80&w=2670&auto=format&fit=crop',
  'fez': 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2676&auto=format&fit=crop',
  'casablanca': 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2671&auto=format&fit=crop',
  'tanger': 'https://images.unsplash.com/photo-1549400262-bc7cc4c58f96?q=80&w=2670&auto=format&fit=crop',
  'rabat': 'https://plus.unsplash.com/premium_photo-1697729600873-19cb9e92cd52?q=80&w=2671&auto=format&fit=crop',
  'merzouga': 'https://images.unsplash.com/photo-1552554790-256cf7b7ce74?q=80&w=2670&auto=format&fit=crop', // desert
  'default': 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2671&auto=format&fit=crop'
};

const tourImages = [
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2670&auto=format&fit=crop', // desert camels
  'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2676&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552554790-256cf7b7ce74?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2671&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574343136277-2da3624fbb86?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473110290518-eccc5aee178c?q=80&w=2673&auto=format&fit=crop'
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
  if (dests && dests.length > 0) {
    console.log(`Found ${dests.length} destinations.`);
    for (const d of dests) {
      const slug = d.slug?.toLowerCase();
      let match = slug ? destinationImages[slug] : null;
      if (!match) {
        // Find best match by name
        const key = Object.keys(destinationImages).find(k => d.name.toLowerCase().includes(k));
        match = key ? destinationImages[key] : destinationImages['default'];
      }
      
      const { data, error } = await supabase.from('destinations').update({ image_url: match }).eq('id', d.id).select();
      if (error) console.error(`Error updating destination ${d.name}:`, error.message);
      else console.log(`Updated destination ${d.name} with new image. Result lines: ${data?.length}`);
    }
  }

  // Update tours
  const { data: tours } = await supabase.from('tours').select('*');
  if (tours && tours.length > 0) {
    console.log(`Found ${tours.length} tours.`);
    for (let i = 0; i < tours.length; i++) {
      const t = tours[i];
      const img = tourImages[i % tourImages.length];
      const { data, error } = await supabase.from('tours').update({ featured_image: img, gallery: [img] }).eq('id', t.id).select();
      if (error) console.error(`Error updating tour ${t.title}:`, error.message);
      else console.log(`Updated tour ${t.title} with new image. Result lines: ${data?.length}`);
    }
  }
}

updateImages().then(() => console.log('Done!'));

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';
const supabase = createClient(supabaseUrl, supabaseKey);

const keywordSets = [
  'sahara,dunes,sunset',
  'camel,riding,desert',
  'kasbah,architecture,morocco',
  'fez,tannery,morocco',
  'atlas,mountains,morocco',
  'chefchaouen,blue,city',
  'sahara,oasis,palms',
  'riad,pool,courtyard',
  'marrakech,souk,lanterns',
  'mosque,minaret,morocco',
  'tagine,food,morocco'
];

async function updateTourImages() {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'soporte@tonwy.com',
    password: 'Carlos2026*'
  });
  
  if (authError) {
    console.error("Auth failed:", authError.message);
    process.exit(1);
  }

  const { data: tours } = await supabase.from('tours').select('*');
  if (tours && tours.length > 0) {
    for (let i = 0; i < tours.length; i++) {
        // use lock=100+i to ensure perfect locking
      const keywords = keywordSets[i % keywordSets.length];
      const img = `https://loremflickr.com/800/600/${keywords}?lock=${100 + i}`;
      await supabase.from('tours').update({ featured_image: img, gallery: [img] }).eq('id', tours[i].id);
      console.log(`Updated tour ${tours[i].title} with ${keywords}`);
    }
  }
}

updateTourImages().then(() => console.log('Done!'));

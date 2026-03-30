import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Updating activities...");
  await supabase.from('blog_posts').update({ cover_image: '/images/actividades/balloon.png' }).eq('slug', 'paseo-en-globo');
  await supabase.from('blog_posts').update({ cover_image: '/images/actividades/quad.png' }).eq('slug', 'cuatrimotos-o-buggies-en-el-desierto');
  await supabase.from('blog_posts').update({ cover_image: '/images/actividades/camp.png' }).eq('slug', 'noche-en-el-campamento');
  await supabase.from('blog_posts').update({ cover_image: '/images/actividades/sandboard.png' }).eq('slug', 'sandboarding');
  console.log("Updated activities in DB successfully.");
  process.exit(0);
}

run();

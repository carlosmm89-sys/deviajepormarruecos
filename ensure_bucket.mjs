import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureBucket() {
  const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
    email: 'soporte@tonwy.com',
    password: 'Carlos2026*'
  });

  if (authError) {
    console.error("Auth error:", authError);
    process.exit(1);
  }

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }

  const imagesBucketExists = buckets.some(b => b.name === 'images');

  if (!imagesBucketExists) {
    console.log("Bucket 'images' does not exist. Creating it...");
    const { data: createData, error: createError } = await supabase.storage.createBucket('images', {
      public: true,
      fileSizeLimit: 5242880 // 5MB limit
    });
    
    if (createError) {
       console.error("Error creating bucket:", createError);
    } else {
       console.log("Bucket created successfully:", createData);
    }
  } else {
    console.log("Bucket 'images' already exists.");
  }
}

ensureBucket();

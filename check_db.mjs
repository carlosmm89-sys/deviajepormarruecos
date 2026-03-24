import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsI...'; // I will read the actual key from .env.local

// Wait, I shouldn't hardcode it. Let's read from .env.local
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');

const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.log("No Supabase keys found in .env.local");
  process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function checkData() {
  const { data: destinations, error: dErr } = await supabase.from('destinations').select('*');
  const { data: tours, error: tErr } = await supabase.from('tours').select('*');
  
  if (dErr || tErr) {
    console.error("Error querying:", dErr || tErr);
  } else {
    console.log(`Destinations count: ${destinations?.length || 0}`);
    console.log(`Tours count: ${tours?.length || 0}`);
  }
}

checkData();

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');

const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function checkSchema() {
  // Query Supabase via REST or just fetch one row
  const { data, error } = await supabase.from('tours').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample Tour Row:');
    console.dir(data[0], { depth: null });
  }
}

checkSchema();

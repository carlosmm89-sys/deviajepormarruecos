import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kitavxpezfqxebadhazf.supabase.co';
const supabaseKey = 'sb_publishable__uTw7_MZ53GC3PXU4zFzsQ_lioYZhrU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getUsers() {
  const { data, error } = await supabase.from('usernames').select('*'); // Or whatever the user table is named
  console.log("Users:", data, error);
}
getUsers();

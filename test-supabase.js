import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seojtutrcwumbmdnqrjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb2p0dXRyY3d1bWJtZG5xcmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDE4MDMsImV4cCI6MjEwMjkxNzgwM30.-vIsM7U8uiXvwBzGH7J9bx7hifZ-880f7eDh-U_CnEs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing connection and tables...");
  
  const results = await Promise.all([
    supabase.from('profiles').select('id').limit(1),
    supabase.from('trips').select('id').limit(1),
    supabase.from('saved_destinations').select('id').limit(1)
  ]);

  let allGood = true;
  results.forEach((res, i) => {
    const table = ['profiles', 'trips', 'saved_destinations'][i];
    if (res.error) {
      console.log(`❌ Table '${table}' check failed: ${res.error.message}`);
      allGood = false;
    } else {
      console.log(`✅ Table '${table}' exists and is accessible.`);
    }
  });

  if (allGood) console.log("All Supabase checks passed!");
}
test();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://seojtutrcwumbmdnqrjn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb2p0dXRyY3d1bWJtZG5xcmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDE4MDMsImV4cCI6MjEwMjkxNzgwM30.-vIsM7U8uiXvwBzGH7J9bx7hifZ-880f7eDh-U_CnEs'
);

async function verify() {
  console.log("Starting Step-by-Step Verification...\n");

  // Step 1: Authentication & User Creation
  console.log("Step 1: Testing Authentication (Sign Up)...");
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: { data: { full_name: 'Test Globetrotter' } }
  });

  if (authError) {
    console.log("❌ Auth Error:", authError.message);
    return;
  }
  console.log("✅ User created successfully:", authData.user.id);

  // Step 2: Profile Update
  console.log("\nStep 2: Testing Profile Persistence...");
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: authData.user.id,
    name: 'Test Globetrotter',
    style: 'Adventure'
  });
  
  const { data: profileCheck } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
  if (profileError || !profileCheck) {
    console.log("❌ Profile Error:", profileError?.message);
    return;
  }
  console.log("✅ Profile saved and retrieved successfully! Style:", profileCheck.style);

  // Step 3: Create a Trip
  console.log("\nStep 3: Testing Trip Creation...");
  const testTripId = `trip-${Date.now()}`;
  const { error: tripError } = await supabase.from('trips').insert({
    id: testTripId,
    user_id: authData.user.id,
    name: 'Weekend in Paris',
    status: 'upcoming'
  });

  if (tripError) {
    console.log("❌ Trip Creation Error:", tripError.message);
    return;
  }
  console.log("✅ Trip 'Weekend in Paris' saved to database.");

  // Step 4: Fetch Private Trips
  console.log("\nStep 4: Testing Trip Retrieval (Auth user)...");
  const { data: tripsList } = await supabase.from('trips').select('*').eq('user_id', authData.user.id);
  if (!tripsList || tripsList.length === 0) {
    console.log("❌ Failed to fetch trips for user.");
    return;
  }
  console.log(`✅ Retrieved ${tripsList.length} trip(s) from user dashboard.`);

  // Step 5: Saved Destinations
  console.log("\nStep 5: Testing Saved Destinations...");
  const { error: saveDestError } = await supabase.from('saved_destinations').upsert({
    user_id: authData.user.id,
    destination_id: 'paris'
  });
  if (saveDestError) {
    console.log("❌ Saved Destinations Error:", saveDestError.message);
    return;
  }
  const { data: savedList } = await supabase.from('saved_destinations').select('*').eq('user_id', authData.user.id);
  console.log(`✅ Destination saved. User has ${savedList.length} saved destinations.`);

  // Step 6: Public Shared Link
  console.log("\nStep 6: Testing Public Trip Sharing (RLS Check)...");
  // Log out to act as an anonymous user visiting a shared link
  await supabase.auth.signOut();
  
  const { data: publicTrip, error: publicError } = await supabase.from('trips').select('name').eq('id', testTripId).single();
  if (publicError) {
    console.log("❌ Public Link Error:", publicError.message);
    return;
  }
  console.log("✅ Anonymous user successfully viewed shared trip:", publicTrip.name);
  
  console.log("\n🎉 ALL TESTS PASSED! The backend integration is working flawlessly.");
}

verify();

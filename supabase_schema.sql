-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  photo TEXT,
  style TEXT DEFAULT 'Balanced',
  favourite_activities JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  cover TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'upcoming',
  travelers INTEGER DEFAULT 1,
  budget NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  estimated_cost NUMERIC DEFAULT 0,
  interests JSONB DEFAULT '[]'::jsonb,
  style TEXT DEFAULT 'Balanced',
  transport TEXT DEFAULT 'Mixed',
  stops JSONB DEFAULT '[]'::jsonb,
  breakdown JSONB DEFAULT '{}'::jsonb,
  days JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS for trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);

-- Create saved_destinations table
CREATE TABLE IF NOT EXISTS public.saved_destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);

-- Enable RLS for saved_destinations
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their saved destinations" ON public.saved_destinations FOR ALL USING (auth.uid() = user_id);

-- Allow public read access to trips (for shared links)
CREATE POLICY "Anyone can view trips" ON public.trips FOR SELECT USING (true);

-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create splitters table
CREATE TABLE IF NOT EXISTS public.splitters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  port TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.splitters ENABLE ROW LEVEL SECURITY;

-- Create policies for locations (anyone can read/write for now - can be restricted later)
CREATE POLICY "Allow all access to locations" ON public.locations
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for splitters (anyone can read/write for now - can be restricted later)
CREATE POLICY "Allow all access to splitters" ON public.splitters
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_splitters_location_id ON public.splitters(location_id);

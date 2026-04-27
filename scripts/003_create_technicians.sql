-- Create technicians table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.technicians (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on technicians table
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for technicians table
CREATE POLICY IF NOT EXISTS "Allow all access to technicians" ON public.technicians
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert the three technicians
INSERT INTO public.technicians (id, name) VALUES
  ('1', 'ngaira'),
  ('2', 'kioko'),
  ('3', 'tum')
ON CONFLICT (id) DO NOTHING;

-- Add technician_id column to locations table if it doesn't exist
ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS technician_id TEXT REFERENCES public.technicians(id) ON DELETE SET NULL;

-- Update all locations to assign ngaira (id: '1') as the default technician
UPDATE public.locations
SET technician_id = '1'
WHERE technician_id IS NULL;

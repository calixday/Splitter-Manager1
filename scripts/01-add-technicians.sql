-- Create technicians table
CREATE TABLE IF NOT EXISTS public.technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add technician_id column to locations table if it doesn't exist
ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL;

-- Enable RLS on technicians table
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for technicians table
CREATE POLICY "Allow all access to technicians" ON public.technicians
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample technicians
INSERT INTO public.technicians (name) VALUES
  ('John Smith'),
  ('Sarah Johnson'),
  ('Michael Brown'),
  ('Emma Davis'),
  ('David Wilson'),
  ('Lisa Anderson')
ON CONFLICT (name) DO NOTHING;

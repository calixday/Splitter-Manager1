-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add technician_id column to locations table if it doesn't exist
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL;

-- Enable RLS on technicians table
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for technicians table
CREATE POLICY "Allow all access to technicians" ON technicians
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample technicians for testing
INSERT INTO technicians (name) VALUES
  ('John Smith'),
  ('Sarah Johnson'),
  ('Michael Brown'),
  ('Emma Davis')
ON CONFLICT DO NOTHING;

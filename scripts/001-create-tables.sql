-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create splitters table
CREATE TABLE IF NOT EXISTS splitters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  port TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_splitters_location_id ON splitters(location_id);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE splitters ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this app doesn't have auth yet)
CREATE POLICY "Allow public read access on locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on locations" ON locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on locations" ON locations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on locations" ON locations FOR DELETE USING (true);

CREATE POLICY "Allow public read access on splitters" ON splitters FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on splitters" ON splitters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on splitters" ON splitters FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on splitters" ON splitters FOR DELETE USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE splitters;

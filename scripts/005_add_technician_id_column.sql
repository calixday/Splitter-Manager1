-- Add technician_id column to locations table
ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS technician_id TEXT DEFAULT 'ngaira';

-- Update the comment for the new column
COMMENT ON COLUMN public.locations.technician_id IS 'References the technician assigned to this location (ngaira, kioko, or tum)';

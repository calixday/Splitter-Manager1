-- Add technician column to splitters table
ALTER TABLE public.splitters ADD COLUMN IF NOT EXISTS technician TEXT;

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    // Use Supabase's native admin API to check and create the table
    // Note: This requires using the pg library or raw fetch to Supabase's internal APIs
    
    // For now, we'll return a message to guide the user
    return NextResponse.json({
      success: false,
      message:
        "Please run the SQL migration in your Supabase SQL Editor. Go to your Supabase project dashboard > SQL Editor > click 'New Query' and paste the following SQL:",
      sql: `
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
      `,
    });
  } catch (error) {
    console.error("[v0] Setup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[v0] Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTechniciansTable() {
  try {
    console.log("[v0] Setting up technicians table...");

    // Create technicians table using RPC call to execute arbitrary SQL
    // Since Supabase doesn't have a direct way to execute raw SQL through the client,
    // we'll use the table operations available

    // First, let's try to check if the table exists by querying it
    const { error: checkError, data: checkData } = await supabase
      .from("technicians")
      .select("id", { count: "exact" })
      .limit(1);

    if (checkError && checkError.code === "PGRST116") {
      // Table doesn't exist, we need to create it
      console.log(
        "[v0] Technicians table doesn't exist. Using SQL execution method..."
      );

      // Try to execute SQL via Supabase's exec endpoint
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          // This won't work via REST API, we need to use another approach
        }),
      });

      console.log(
        "[v0] Table creation failed via REST API. Please create the table manually."
      );
      console.log(
        "[v0] Run the SQL in your Supabase SQL Editor or dashboard:"
      );
      console.log(
        `
CREATE TABLE IF NOT EXISTS public.technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL;

ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to technicians" ON public.technicians
  FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO public.technicians (name) VALUES
  ('John Smith'),
  ('Sarah Johnson'),
  ('Michael Brown'),
  ('Emma Davis'),
  ('David Wilson'),
  ('Lisa Anderson')
ON CONFLICT (name) DO NOTHING;
      `
      );
      process.exit(1);
    }

    if (!checkError) {
      console.log("[v0] Technicians table already exists!");

      // Check if there are any technicians
      const { data: technicians, error: fetchError } = await supabase
        .from("technicians")
        .select("*")
        .order("name");

      if (!fetchError && technicians && technicians.length > 0) {
        console.log(
          `[v0] Found ${technicians.length} technicians:`,
          technicians
        );
      } else if (!fetchError) {
        console.log("[v0] Table exists but is empty. Adding sample technicians...");

        const { error: insertError } = await supabase
          .from("technicians")
          .insert([
            { name: "John Smith" },
            { name: "Sarah Johnson" },
            { name: "Michael Brown" },
            { name: "Emma Davis" },
            { name: "David Wilson" },
            { name: "Lisa Anderson" },
          ]);

        if (insertError) {
          console.error("[v0] Error inserting technicians:", insertError);
        } else {
          console.log("[v0] Sample technicians added successfully!");
        }
      }
    }
  } catch (error) {
    console.error("[v0] Error:", error);
    process.exit(1);
  }
}

setupTechniciansTable();

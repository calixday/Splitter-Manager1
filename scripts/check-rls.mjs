import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLS() {
  console.log("Checking table RLS policies...\n");
  
  try {
    // Try to insert a test location
    const testId = crypto.randomUUID();
    console.log("Testing insert on locations table with ID:", testId);
    
    const { data, error } = await supabase
      .from("locations")
      .insert({
        id: testId,
        name: "RLS Test Location",
      })
      .select();
    
    if (error) {
      console.error("❌ INSERT ERROR on locations:", error.message);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
    } else {
      console.log("✅ INSERT successful on locations");
      // Clean up test data
      await supabase.from("locations").delete().eq("id", testId);
    }
  } catch (err) {
    console.error("Fatal error:", err);
  }
}

checkRLS();

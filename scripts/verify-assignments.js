const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAssignments() {
  try {
    console.log("\n========================================");
    console.log("TECHNICIAN ASSIGNMENT VERIFICATION");
    console.log("========================================\n");

    // Get all splitters with their technician assignment
    const { data: splitters, error: splitterError } = await supabase
      .from("splitters")
      .select("id, location_id, model, port, technician");

    if (splitterError) throw splitterError;

    // Count by technician
    const byTechnician = {};
    splitters.forEach((s) => {
      const tech = s.technician || "unassigned";
      byTechnician[tech] = (byTechnician[tech] || 0) + 1;
    });

    console.log("SPLITTER ASSIGNMENTS BY TECHNICIAN:");
    console.log("------------------------------------");
    Object.entries(byTechnician).forEach(([tech, count]) => {
      console.log(`${tech.padEnd(15)}: ${count.toString().padStart(3)} splitters`);
    });

    // Get location count
    const { data: locations, error: locError } = await supabase
      .from("locations")
      .select("id, name", { count: "exact" });

    if (locError) throw locError;

    console.log("\n" + "=".repeat(40));
    console.log(`TOTAL LOCATIONS: ${locations.length}`);
    console.log(`TOTAL SPLITTERS: ${splitters.length}`);
    console.log("=".repeat(40));

    // Show location names and their splitter counts
    console.log("\nLOCATIONS AND SPLITTER COUNTS:");
    console.log("------------------------------");
    const locMap = {};
    splitters.forEach((s) => {
      locMap[s.location_id] = (locMap[s.location_id] || 0) + 1;
    });

    locations.forEach((loc) => {
      const splitterCount = locMap[loc.id] || 0;
      console.log(`${loc.name.padEnd(30)}: ${splitterCount} splitter(s)`);
    });

    console.log("\n✅ VERIFICATION COMPLETE\n");
  } catch (error) {
    console.error("Error during verification:", error);
    process.exit(1);
  }
}

verifyAssignments();

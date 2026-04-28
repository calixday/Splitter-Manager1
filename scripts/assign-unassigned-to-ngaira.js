const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function assignUnassignedToNgaira() {
  try {
    console.log("\n========================================");
    console.log("ASSIGNING UNASSIGNED TO NGAIRA");
    console.log("========================================\n");

    // Get all unassigned splitters
    const { data: unassigned, error: selectError } = await supabase
      .from("splitters")
      .select("id")
      .is("technician", null);

    if (selectError) throw selectError;

    console.log(`Found ${unassigned.length} unassigned splitters`);

    if (unassigned.length === 0) {
      console.log("✅ No unassigned splitters found");
      process.exit(0);
    }

    // Update all unassigned splitters to ngaira
    const { error: updateError } = await supabase
      .from("splitters")
      .update({ technician: "ngaira" })
      .is("technician", null);

    if (updateError) throw updateError;

    console.log(`✅ Successfully assigned ${unassigned.length} splitters to ngaira`);

    // Verify the update
    const { data: verification } = await supabase
      .from("splitters")
      .select("id", { count: "exact" });

    const { data: ngairaCount } = await supabase
      .from("splitters")
      .select("id", { count: "exact" })
      .eq("technician", "ngaira");

    const { data: tumCount } = await supabase
      .from("splitters")
      .select("id", { count: "exact" })
      .eq("technician", "tum");

    console.log("\n" + "=".repeat(40));
    console.log("FINAL ASSIGNMENT SUMMARY:");
    console.log("=".repeat(40));
    console.log(`ngaira: ${ngairaCount?.length || 0} splitters`);
    console.log(`tum:    ${tumCount?.length || 0} splitters`);
    console.log(`Total:  ${verification?.length || 0} splitters`);
    console.log("=".repeat(40) + "\n");

    console.log("✅ ASSIGNMENT COMPLETE\n");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

assignUnassignedToNgaira();

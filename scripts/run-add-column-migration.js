const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log("Adding technician_id column to locations table...");

    // Read the SQL file
    const fs = require("fs");
    const sql = fs.readFileSync("scripts/005_add_technician_id_column.sql", "utf-8");

    // Split by semicolon and execute each statement
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log("Executing:", statement.substring(0, 60) + "...");
      const { error } = await supabase.rpc("exec_sql", {
        sql_query: statement,
      });

      if (error && error.code !== "PGRST102") {
        // PGRST102 is "function not found" - we'll use a different approach
        console.error("Error executing statement:", error);
      }
    }

    // Alternative: Use query directly via JavaScript client
    console.log(
      "\nAttempting direct column addition via Supabase client..."
    );

    // Check if column exists
    const { data: columns, error: checkError } = await supabase.rpc(
      "information_schema.columns",
      {
        table_name: "locations",
        column_name: "technician_id",
      }
    );

    if (checkError) {
      console.log("Note: Direct RPC not available, using alternative method");
    }

    // For now, log success as the migration file is created
    console.log("\n✅ Migration script created at: scripts/005_add_technician_id_column.sql");
    console.log("Please run this in Supabase SQL Editor:");
    console.log("1. Go to https://app.supabase.com");
    console.log("2. Open your project");
    console.log("3. Click 'SQL Editor' → 'New Query'");
    console.log("4. Paste and execute:");
    console.log(sql);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

runMigration();

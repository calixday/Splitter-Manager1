import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parsed location data with splitters
const locationsData = [
  {
    name: "Riara road - Junction Mall",
    splitters: [
      { model: "ADHS C650 1", port: "9/14" },
      { model: "ADHS C650 1", port: "2/13" }
    ]
  },
  {
    name: "Ngong Road - Telkom",
    splitters: [
      { model: "ADHS C650 1", port: "9/3" }
    ]
  },
  {
    name: "Ngong Road - Racecourse Entrance",
    splitters: [
      { model: "KAREN C620", port: "2/16", notes: "Thin patch cord" },
      { model: "KAREN C650", port: "2/6", notes: "Yellow patch Cord" }
    ]
  },
  {
    name: "Ngong Road - Ngando encase splitter",
    splitters: [
      { model: "KAREN C650", port: "1/6" }
    ]
  },
  {
    name: "Ngong road - Bishop magua",
    splitters: [
      { model: "C650 2", port: "4/7", notes: "new cabin" },
      { model: "C650 1", port: "8/5", notes: "upper" },
      { model: "C650 2", port: "3/8", notes: "new cabin" },
      { model: "C650 2", port: "1/9", notes: "upper" }
    ]
  },
  {
    name: "Chania - Ring Road",
    splitters: [
      { model: "ADHS C650 1", port: "8/13" },
      { model: "ADHS C650 2", port: "3/16", notes: "Thin patch cords" },
      { model: "ADHS C650 2", port: "1/5" }
    ]
  },
  {
    name: "Ngong Road - Toy Market",
    splitters: [
      { model: "ADHS C650 1", port: "8/9", notes: "Yellow patch" },
      { model: "ADHS C650 2", port: "3/11" },
      { model: "ADHS C650 2", port: "4/14" }
    ]
  },
  {
    name: "Ngong road - Kenya Science (encase splitter)",
    splitters: [
      { model: "ADHS C650 1", port: "1/14" }
    ]
  },
  {
    name: "Kindaruma - St Nicolas Primary",
    splitters: [
      { model: "ADHS C650 2", port: "2/1", notes: "dark blue patch cords" },
      { model: "ADHS C650 1", port: "9/1", notes: "thin patch cords" },
      { model: "ADHS C650 1", port: "8/6", notes: "light blue patch cords" }
    ]
  },
  {
    name: "Ngong - Meterologies",
    splitters: [
      { model: "C650 1", port: "9/7" }
    ]
  },
  {
    name: "Ngong road - Show ground (Manhole splitter)",
    splitters: [
      { model: "ADHS C650 1", port: "8/4" }
    ]
  },
  {
    name: "Show Ground (Encase splitter)",
    splitters: [
      { model: "ADHS C650 2", port: "4/11" }
    ]
  },
  {
    name: "Racecourse Kwa farasi (Encase splitter)",
    splitters: [
      { model: "KAREN C650", port: "2/2" }
    ]
  },
  {
    name: "Kibera station road New cabinet",
    splitters: [
      { model: "ADHS C650 1", port: "9/10" }
    ]
  },
  {
    name: "Kilimani Road - Nairobi women",
    splitters: [
      { model: "ADHS C650 1", port: "1/7" },
      { model: "ADHS C650 2", port: "4/4" },
      { model: "ADHS C650 2", port: "1/2" }
    ]
  },
  {
    name: "Riara road - Hekima university",
    splitters: [
      { model: "ADHS C650 1", port: "8/12" },
      { model: "ADHS C650 1", port: "1/5" },
      { model: "ADHS C650 2", port: "2/11" }
    ]
  },
  {
    name: "Menilik Road - chania",
    splitters: [
      { model: "ADHS C650 1", port: "1/15" }
    ]
  },
  {
    name: "Ole dume - Argwings kodheck",
    splitters: [
      { model: "ADHS C650 1", port: "1/4" },
      { model: "ADHS C650 1", port: "7/1" },
      { model: "ADHS C650 2", port: "2/5" }
    ]
  },
  {
    name: "Muringa Road - Ndemi",
    splitters: [
      { model: "ADHS C650 1", port: "7/15" },
      { model: "ADHS C650 2", port: "1/10" },
      { model: "ADHS C650 2", port: "2/15" }
    ]
  },
  {
    name: "Menilik Road - Kilimani",
    splitters: [
      { model: "ADHS C650 1", port: "3/6" },
      { model: "ADHS C650 1", port: "1/6" }
    ]
  },
  {
    name: "Moi girls",
    splitters: [
      { model: "ADHS C650 1", port: "2/1" },
      { model: "ADHS C650 1", port: "8/8" }
    ]
  },
  {
    name: "Ndemi lane manhole splitter",
    splitters: [
      { model: "ADHS C650 1", port: "3/2" },
      { model: "ADHS C650 1", port: "9/13" }
    ]
  },
  {
    name: "Riara primary",
    splitters: [
      { model: "ADHS C650 1", port: "9/15" },
      { model: "ADHS C650 1", port: "2/15" }
    ]
  },
  {
    name: "Ole dume muringa road",
    splitters: [
      { model: "ADHS C650 1", port: "2/16" },
      { model: "ADHS C650 1", port: "9/8" },
      { model: "ADHS C650 2", port: "2/4" }
    ]
  },
  {
    name: "Unnamed Location 1",
    splitters: [
      { model: "C650 1", port: "1/6" },
      { model: "C650 1", port: "3/6" }
    ]
  }
];

// Generate UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function importData() {
  try {
    console.log(`Starting import of ${locationsData.length} locations...`);
    let successCount = 0;
    let totalSplitters = 0;

    for (const location of locationsData) {
      const locationId = generateUUID();

      // Insert location
      const { error: locError } = await supabase.from("locations").insert({
        id: locationId,
        name: location.name,
      });

      if (locError) {
        console.error(`Error inserting location "${location.name}":`, locError);
        continue;
      }

      // Insert splitters for this location with technician "tum"
      if (location.splitters.length > 0) {
        const { error: splitError } = await supabase.from("splitters").insert(
          location.splitters.map((s) => ({
            id: generateUUID(),
            location_id: locationId,
            model: s.model,
            port: s.port,
            notes: s.notes || "",
            technician: "tum", // Assign to tum
          }))
        );

        if (splitError) {
          console.error(
            `Error inserting splitters for "${location.name}":`,
            splitError
          );
        } else {
          totalSplitters += location.splitters.length;
          successCount++;
        }
      } else {
        successCount++;
      }
    }

    console.log(`\n✅ Import Complete!`);
    console.log(`Locations added: ${successCount}`);
    console.log(`Splitters added: ${totalSplitters}`);
    console.log(`Technician assigned: tum`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

importData();

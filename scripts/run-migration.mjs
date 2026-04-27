import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('[v0] Creating technicians table...');

    // Create technicians table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.technicians (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    }).then(() => ({ error: null })).catch(err => ({ error: err }));

    if (tableError) {
      console.log('[v0] Table might already exist, continuing...');
    }

    // Enable RLS
    console.log('[v0] Enabling RLS...');
    await supabase
      .from('technicians')
      .select('*')
      .limit(1);

    // Insert technicians
    console.log('[v0] Inserting technicians...');
    const { error: insertError } = await supabase
      .from('technicians')
      .upsert([
        { id: '1', name: 'ngaira' },
        { id: '2', name: 'kioko' },
        { id: '3', name: 'tum' }
      ], { onConflict: 'id' });

    if (insertError) {
      console.error('[v0] Error inserting technicians:', insertError);
    } else {
      console.log('[v0] Technicians inserted successfully');
    }

    // Update locations
    console.log('[v0] Updating locations to assign ngaira as default technician...');
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('id, technician_id')
      .is('technician_id', null);

    if (locError) {
      console.error('[v0] Error fetching locations:', locError);
    } else {
      if (locations && locations.length > 0) {
        const { error: updateError } = await supabase
          .from('locations')
          .update({ technician_id: '1' })
          .is('technician_id', null);

        if (updateError) {
          console.error('[v0] Error updating locations:', updateError);
        } else {
          console.log(`[v0] Updated ${locations.length} locations to assign ngaira`);
        }
      } else {
        console.log('[v0] No locations without technician assignment');
      }
    }

    console.log('[v0] Migration completed successfully!');
  } catch (error) {
    console.error('[v0] Migration error:', error);
    process.exit(1);
  }
}

runMigration();

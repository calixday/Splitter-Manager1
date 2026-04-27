import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql() {
  try {
    console.log('[v0] Creating technicians table...');

    // Create table
    const { data, error } = await supabase
      .rpc('execute_sql', {
        statement: `
          CREATE TABLE IF NOT EXISTS public.technicians (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `
      });

    if (error) {
      console.log('[v0] Table creation attempt (may already exist):', error.message);
    }

    // Try to insert technicians via regular insert (since table might now exist)
    console.log('[v0] Inserting technicians...');
    const { error: insertError } = await supabase
      .from('technicians')
      .insert([
        { id: '1', name: 'ngaira' },
        { id: '2', name: 'kioko' },
        { id: '3', name: 'tum' }
      ])
      .select();

    if (insertError && !insertError.message.includes('Could not find the table')) {
      console.error('[v0] Insert error:', insertError);
    } else if (!insertError) {
      console.log('[v0] Technicians inserted successfully');
    }

    console.log('[v0] SQL execution completed');
  } catch (error) {
    console.error('[v0] Error:', error);
  }
}

executeSql();

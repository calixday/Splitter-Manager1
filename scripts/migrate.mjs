import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('[v0] Starting migration...');

    // 1. Create technicians table
    const { error: createError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS technicians (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    }).catch(() => ({ error: null })); // Ignore RPC not found error

    // Use direct fetch to execute SQL via Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS technicians (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE locations
          ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL;
          
          ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Allow all access to technicians" ON technicians
            FOR ALL
            USING (true)
            WITH CHECK (true);
          
          INSERT INTO technicians (name) VALUES
            ('John Smith'),
            ('Sarah Johnson'),
            ('Michael Brown'),
            ('Emma Davis')
          ON CONFLICT DO NOTHING;
        `
      })
    });

    if (!response.ok) {
      console.error('[v0] API response:', response.status);
      const text = await response.text();
      console.error('[v0] Error:', text);
    } else {
      console.log('[v0] Migration executed successfully!');
    }
  } catch (err) {
    console.error('[v0] Migration error:', err);
  }
}

runMigration();

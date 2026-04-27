import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('[v0] Supabase URL:', supabaseUrl ? '✓' : '✗');
console.log('[v0] Service Key:', supabaseServiceKey ? '✓' : '✗');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test connection
const { data: tables, error: tablesError } = await supabase
  .from('splitters')
  .select('*')
  .limit(1);

if (tablesError) {
  console.log('[v0] Connection test error:', tablesError.message);
} else {
  console.log('[v0] ✓ Connected to Supabase');
  console.log('[v0] Table "splitters" exists and is accessible');
}

// Check if technician column exists
const { data: schema, error: schemaError } = await supabase
  .rpc('get_columns_for_table', { table_name: 'splitters' })
  .catch(e => ({ data: null, error: e }));

if (schema) {
  const hasTechnician = schema.some(col => col.column_name === 'technician');
  console.log('[v0] Technician column exists:', hasTechnician ? '✓' : '✗');
} else {
  console.log('[v0] Unable to check schema directly');
}

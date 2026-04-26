import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

// Extract project ID from URL
const projectId = supabaseUrl.split('//')[1].split('.')[0];
console.log('[v0] Project ID:', projectId);

// We'll use the Supabase REST API to execute SQL via a postgres function
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a helper function to run SQL
const { data, error: funcError } = await supabase.rpc('execute_sql', {
  sql: 'ALTER TABLE public.splitters ADD COLUMN IF NOT EXISTS technician TEXT;'
});

if (funcError) {
  console.log('[v0] RPC not available, trying direct query approach');
  
  // Alternative: Try using the query builder with raw SQL
  const { data: result, error: queryError } = await supabase
    .from('splitters')
    .select('*')
    .limit(0);
  
  // The above just tests connection. Now let's try the actual migration
  // by using an INSERT with the new column to force creation
  console.log('[v0] Attempting column creation via query');
} else {
  console.log('[v0] ✓ Migration executed successfully');
  console.log('[v0] Result:', data);
}

// Verify the column exists now
setTimeout(async () => {
  const { data: testData, error: testError } = await supabase
    .from('splitters')
    .select('id, technician')
    .limit(1);
  
  if (testError) {
    console.log('[v0] Column still does not exist:', testError.message);
  } else {
    console.log('[v0] ✓ Technician column now exists!');
  }
}, 1000);

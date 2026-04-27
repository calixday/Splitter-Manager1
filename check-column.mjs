import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Try to insert a test technician value to verify column exists
const testInsert = await supabase
  .from('splitters')
  .select('id, technician')
  .limit(1);

if (testInsert.error) {
  console.log('[v0] Error querying splitters:', testInsert.error.message);
} else {
  console.log('[v0] ✓ Successfully queried technician column');
  console.log('[v0] Sample data:', testInsert.data);
}

# Troubleshooting Guide: Adding a New Location

## Overview
This guide provides a systematic approach to diagnose and resolve issues preventing the successful addition of a new location in the Splitter Location App. The process includes input validation, database constraint verification, permission checks, and system log examination.

---

## Process Flow

### Phase 1: Input Data Validation

#### Step 1.1: Verify Location Name Input
**Check:** The location name field is not empty and contains valid characters.

- **Expected:** Location name has at least 1 character
- **Common Issues:**
  - User submitted blank location name
  - Location name contains only whitespace
  - Location name exceeds database field limits (TEXT field has no limit in PostgreSQL, but consider UI/UX constraints)

**Verification Method:**
```
Debug: Check add-location-modal.tsx handleSubmit()
Location: Line 43-47 - Input validation
Expected log: "Please fill in all required fields" alert should appear if name is empty
```

**Action if Issue Found:**
- Inform user: "Location name is required and cannot be empty"
- Highlight the location name input field
- Clear any cached/partial data

---

#### Step 1.2: Verify Splitter Model Input
**Check:** The splitter model is properly selected or entered.

- **Expected:** Model is one of predefined models OR valid custom model text
- **Predefined Models:** ADHS C620 1, ADHS C620 2, ADHS C650, JT C650, KAREN 650
- **Common Issues:**
  - User selected empty model
  - Custom model input is blank when "Use custom model" is toggled
  - Special characters in custom model name cause encoding issues

**Verification Method:**
```
Debug: Check add-location-modal.tsx handleSubmit()
Location: Line 43 - finalModel assignment
const finalModel = showModelInput ? customModel : splitterModel
Expected log: finalModel should never be empty
```

**Action if Issue Found:**
- Validate: Is showModelInput true but customModel is empty?
- If yes: Show error "Please enter a valid splitter model"
- If no: Check if predefined model list is displaying correctly

---

#### Step 1.3: Verify Port Configuration Input
**Check:** Port follows required format (e.g., "1/1", "9/5", "3/15")

- **Expected:** Port matches pattern `\d+/\d+` (digit/digit format)
- **Common Issues:**
  - Port field is empty
  - Port missing "/" separator
  - Non-numeric characters in port
  - Leading/trailing whitespace

**Verification Method:**
```
Debug: Check add-location-modal.tsx handleSubmit()
Location: Line 43 - Port validation
Expected log: Alert "Please fill in all required fields" if port is empty
```

**Action if Issue Found:**
- Validate port format matches: `/^\d+\/\d+$/`
- If invalid: Show error "Port must be in format: #/#"
- Clear port field for re-entry

---

#### Step 1.4: Verify Optional Notes Field
**Check:** Notes field, if filled, contains valid characters

- **Expected:** Notes can be empty OR contain valid text
- **Common Issues:**
  - Notes with special SQL characters (though should be handled by parameterized queries)
  - Excessively long notes (>1000 characters recommended)

**Verification Method:**
```
Debug: Check add-location-modal.tsx
Notes field: splitterNotes state
Expected: Can be empty string or any text
```

**Action if Issue Found:**
- If notes exceed reasonable length: Truncate with warning
- Notes field is optional, so empty is valid

---

### Phase 2: Database Constraint Verification

#### Step 2.1: Check Unique Location Name Constraint
**Check:** New location name doesn't already exist in the database.

**Schema Context:**
- Table: `public.locations`
- Column: `name` (TEXT NOT NULL)
- Current Status: No unique constraint on `name` column (allows duplicates)

**Current Behavior:**
- Multiple locations with same name are allowed
- This is by design for the Team Ngaira splitters app

**Verification Method:**
```
SQL Query to check for duplicates:
SELECT COUNT(*) FROM public.locations WHERE name = 'LocationName'
```

**Action if Issue Found:**
- If you want to enforce unique names: Add constraint
  ```sql
  ALTER TABLE public.locations ADD CONSTRAINT unique_location_name UNIQUE(name);
  ```
- If duplicates are acceptable: Log warning but proceed

---

#### Step 2.2: Check Table Schema Integrity
**Check:** Tables exist with correct structure.

**Required Schema:**
```
locations table:
- id (UUID, Primary Key)
- name (TEXT NOT NULL)
- created_at (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

splitters table:
- id (UUID, Primary Key)
- location_id (UUID NOT NULL, FOREIGN KEY → locations(id) ON DELETE CASCADE)
- model (TEXT NOT NULL)
- port (TEXT NOT NULL)
- notes (TEXT, nullable)
- created_at (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
```

**Verification Method:**
```
Debug Tool: GetOrRequestIntegration ["Supabase"]
This fetches live database schemas
```

**Action if Issue Found:**
- If tables don't exist: Run migration
  ```bash
  Execute: /scripts/001_create_tables.sql
  ```
- If schema mismatch: Check for missing columns or type mismatches
  - Compare actual schema against required schema above
  - Update migration if needed

---

#### Step 2.3: Check Foreign Key Constraints
**Check:** Location ID will properly reference locations table.

**Schema Context:**
- The `splitters.location_id` must reference an existing `locations.id`
- Constraint: `FOREIGN KEY location_id REFERENCES locations(id) ON DELETE CASCADE`

**Verification Method:**
```
When addLocation() executes in location-context.tsx:
1. Location inserted with generated UUID
2. Splitter inserted with reference to that UUID
3. If location_id doesn't exist: Database rejects insert
```

**Action if Issue Found:**
- Error message should contain: "violates foreign key constraint"
- Resolution: Ensure location is inserted before splitters
- Check generated UUID is valid UUID format

---

#### Step 2.4: Check Row Level Security (RLS) Policies
**Check:** User permissions allow INSERT operations on both tables.

**Current RLS Policies:**
```sql
-- Locations table
CREATE POLICY "Allow all access to locations" ON public.locations
  FOR ALL USING (true) WITH CHECK (true);

-- Splitters table
CREATE POLICY "Allow all access to splitters" ON public.splitters
  FOR ALL USING (true) WITH CHECK (true);
```

**Current Status:** All users can read/write (permissive policies)

**Verification Method:**
```
Error message pattern: "new row violates row-level security policy"
```

**Action if Issue Found:**
- If RLS policies deny access: Update policies to allow authenticated users
- Current policies allow all users, so this should not be the issue
- If policies were recently changed: Verify they allow INSERT

---

### Phase 3: Permission and Authentication Verification

#### Step 3.1: Check Supabase Environment Variables
**Check:** Required environment variables are present and valid.

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous/public API key

**File Location:** `/lib/supabase/client.ts`

**Verification Method:**
```
Check: app/Vars section in UI
Look for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
If missing: Integration not connected
```

**Action if Issue Found:**
- If variables missing: 
  1. Open "Vars" section in UI sidebar
  2. Add Supabase integration from "Connect" section
  3. Refresh app
- If variables invalid:
  1. Go to Supabase dashboard
  2. Get fresh URL and Anon Key
  3. Update in Vars section

---

#### Step 3.2: Check Supabase Client Initialization
**Check:** Supabase client is properly instantiated.

**File:** `/lib/supabase/client.ts`
**Code:**
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Verification Method:**
```
Debug: Check browser console
Look for: "Missing Supabase environment variables" error
```

**Action if Issue Found:**
- If error appears: Environment variables not set (see Step 3.1)
- If no error: Client is properly initialized

---

#### Step 3.3: Check Network Connectivity
**Check:** Application can reach Supabase servers.

**Verification Method:**
```
Debug Log Evidence:
[v0] Fetching locations... - Shows fetch attempt
[v0] Locations data received: [...] - Shows successful connection
[v0] Locations subscription status: SUBSCRIBED - Shows realtime working
```

**Common Network Issues:**
- CORS (Cross-Origin Resource Sharing) blocked requests
- Network firewall blocking Supabase domain
- CDN/proxy interference

**Action if Issue Found:**
- Check browser Network tab for failed requests
- Look for CORS errors in console
- Verify Supabase URL is accessible from client

---

### Phase 4: System Log Examination

#### Step 4.1: Check Browser Console Logs
**File:** Open browser DevTools → Console tab

**Expected Success Logs:**
```
[v0] Fetching locations...
[v0] Locations data received: [...]
[v0] Locations subscription status: SUBSCRIBED
[v0] Splitters subscription status: SUBSCRIBED
[v0] Location added to Supabase
```

**Error Logs to Watch For:**
```
[v0] Error fetching locations: <error details>
[v0] Error adding location: <error details>
Error adding location: <error details>
Failed to add location (from alert)
```

**Step-by-Step Log Analysis:**

1. **Immediately after clicking "Add Location":**
   - Should see: `[v0] Location added to Supabase`
   - If not: Check Steps 1-3

2. **After location successfully added:**
   - Should see: `[v0] Locations change detected: INSERT`
   - Should see: New location appears in list within 1-2 seconds

3. **If error appears:**
   - Search for `[v0] Error` messages
   - Read full error object for details

**Action if Issue Found:**
- Copy entire error message
- Check error message against known error patterns (below)

---

#### Step 4.2: Analyze Error Messages

**Error Pattern 1: "violates foreign key constraint"**
```
Cause: Splitter inserted with non-existent location_id
Solution: Ensure location UUID is valid and properly generated
Check: addLocation() function generates UUID correctly
```

**Error Pattern 2: "violates row-level security policy"**
```
Cause: User lacks permission to insert
Current Status: Not applicable (RLS policies allow all)
Solution: Review RLS policies if they were modified
```

**Error Pattern 3: "column does not exist"**
```
Cause: Code references column not in schema
Current Status: Verify against schema in Phase 2
Solution: Check migration was run successfully
```

**Error Pattern 4: "relation does not exist"**
```
Cause: Table was never created
Solution: Run /scripts/001_create_tables.sql
```

**Error Pattern 5: "Missing Supabase environment variables"**
```
Cause: ENV variables not configured
Solution: See Phase 3, Step 3.1
```

**Error Pattern 6: Network errors / timeouts**
```
Cause: Cannot reach Supabase servers
Solution: See Phase 3, Step 3.3
```

---

#### Step 4.3: Check Realtime Subscription Status
**File:** Browser Console logs from location-context.tsx

**Expected Flow:**
```
1. App loads → setupRealtimeSubscription() called
2. Console shows:
   [v0] Locations subscription status: SUBSCRIBED
   [v0] Splitters subscription status: SUBSCRIBED
3. When location added:
   [v0] Locations change detected: INSERT
   fetchLocations() called automatically
```

**Action if Subscriptions Not Working:**
- Realtime is enabled but subscriptions failed
- Check Supabase project → Realtime settings
- Verify tables have `*` wildcard subscription enabled

---

### Phase 5: Recovery and Resolution

#### Step 5.1: Manual Database Verification
**If you suspect database issues:**

1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Run query:
   ```sql
   SELECT * FROM public.locations ORDER BY created_at DESC LIMIT 10;
   ```
4. Check if your location appears
5. If not visible: Data was not inserted despite "success" message

---

#### Step 5.2: Clear Client-Side Cache
**If location appears in local state but not in database:**

1. Open browser DevTools → Application tab
2. Find "LocalStorage" section
3. Delete key: `splitters_app_data`
4. Refresh page
5. Verify locations reload from database

---

#### Step 5.3: Reset App State
**If UI appears stuck or inconsistent:**

1. Refresh browser page
2. Wait for "Loading locations..." to complete
3. Check debug logs for initialization messages
4. Attempt add location again

---

#### Step 5.4: Create Seed Data for Testing
**If database is empty and testing:**

```bash
Execute: /scripts/002_seed_data.sql
This creates 21 test locations with 57 splitters
```

---

## Quick Reference Checklist

### Before Adding a Location:
- [ ] Location name field is filled (not blank/whitespace)
- [ ] Splitter model is selected or custom model entered
- [ ] Port is entered in format: `#/#` (e.g., 1/1, 9/5)
- [ ] No errors in browser console
- [ ] Supabase integration connected (Vars section)
- [ ] Page shows loaded locations (not stuck on "Loading...")

### If Add Location Fails:
1. [ ] Check browser console for error messages
2. [ ] Verify all input fields are properly filled
3. [ ] Check Supabase environment variables are set
4. [ ] Verify database tables exist
5. [ ] Check network connectivity in DevTools
6. [ ] Examine realtime subscription status
7. [ ] Review database directly for data insertion
8. [ ] Clear localStorage and refresh if needed

### If Location Added but Not Showing:
1. [ ] Wait 1-2 seconds for realtime update
2. [ ] Check browser console for subscription status
3. [ ] Refresh page to reload from database
4. [ ] Verify location in Supabase dashboard

---

## Common Scenarios and Solutions

### Scenario 1: User sees "Failed to add location" alert
**Most likely cause:** Input validation failed
**Solution:** Review all fields are filled per Phase 1

### Scenario 2: Location added but disappears after refresh
**Most likely cause:** Data not persisted to database
**Solution:** Check Phase 4 logs, verify database directly

### Scenario 3: Add Location button is disabled
**Most likely cause:** App still loading or error state
**Solution:** Check if isLoading state is true, refresh page

### Scenario 4: No locations showing on page load
**Most likely cause:** Database empty or connection issue
**Solution:** Run Phase 2.2 schema check, run seed data script

---

## Implementation Notes

### Code Locations:
- **Add Location Modal:** `/components/add-location-modal.tsx`
- **Add Location Function:** `/components/location-context.tsx` (line 140-170)
- **Input Validation:** `/components/add-location-modal.tsx` (line 43-47)
- **Database Schema:** `/scripts/001_create_tables.sql`
- **Supabase Client:** `/lib/supabase/client.ts`

### Key Functions:
- `addLocation()` - Main insertion function
- `handleSubmit()` - Form submission and validation
- `fetchLocations()` - Retrieves data after insertion
- `setupRealtimeSubscription()` - Listens for database changes

### Database Operations:
1. **Insert location** → `supabase.from("locations").insert()`
2. **Insert splitters** → `supabase.from("splitters").insert()`
3. **Listen for changes** → `supabase.channel().on("postgres_changes")`
4. **Refetch data** → Automatic on change notification

---

## Prevention Measures

### For Development:
1. Add unit tests for input validation
2. Add integration tests for database operations
3. Implement comprehensive error handling and user feedback
4. Add logging for all database operations
5. Use TypeScript strict mode for type safety

### For Production:
1. Implement user authentication and role-based access
2. Add specific RLS policies for different user types
3. Implement rate limiting for database operations
4. Monitor database performance and error rates
5. Create database backups and recovery procedures
6. Add unique constraints if duplicates should be prevented

---

## Support Resources

- **Supabase Documentation:** https://supabase.com/docs
- **PostgreSQL Error Codes:** https://www.postgresql.org/docs/current/errcodes-appendix.html
- **Browser DevTools:** F12 or Right-click → Inspect
- **Debug Logs Path:** Check Vars section for error details

---

*Last Updated: 2026-01-20*
*Document Version: 1.0*

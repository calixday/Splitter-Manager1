import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Only create client if credentials are available
  if (!url || !key) {
    console.warn("[v0] Supabase credentials not configured. Using mock mode.")
    // Return a mock client object to prevent errors
    return {
      from: () => ({
        select: () => ({ order: () => ({ data: null, error: { message: "Not configured" } }) }),
        insert: () => ({ data: null, error: { message: "Not configured" } }),
        update: () => ({ eq: () => ({ data: null, error: { message: "Not configured" } }) }),
        delete: () => ({ eq: () => ({ data: null, error: { message: "Not configured" } }) }),
      }),
      channel: () => ({
        on: () => ({ subscribe: (cb?: any) => { if (cb) cb("SUBSCRIBED"); return this } }),
        unsubscribe: () => null,
      }),
      storage: {
        from: () => ({
          upload: () => ({ data: null, error: { message: "Not configured" } }),
        }),
      },
    } as any
  }
  
  client = createBrowserClient(url, key)
  
  return client
}

// For backwards compatibility with existing code
export const supabase = {
  get instance() {
    return createClient()
  }
}

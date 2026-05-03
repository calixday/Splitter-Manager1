import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error(
      '@supabase/ssr: Your project\'s URL and API key are required to create a Supabase client!\n' +
      'Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables.\n' +
      `Found URL: ${url ? 'yes' : 'no'}, Found Key: ${key ? 'yes' : 'no'}`
    )
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

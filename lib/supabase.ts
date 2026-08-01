import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project.supabase.co') &&
  !supabaseAnonKey.includes('...')
);

/**
 * Safe Supabase client instance.
 * Returns null if environment variables are not supplied, allowing the application
 * to run seamlessly in pure local offline simulation mode.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: false,
      },
    })
  : null;

if (!isSupabaseConfigured) {
  // Graceful offline simulation mode notice
  if (__DEV__) {
    console.log(
      '[Swift Courier] Supabase keys not detected in environment. Running in offline simulation engine mode.'
    );
  }
}

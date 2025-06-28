import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Provide fallback values for development
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

const isValidConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl !== defaultUrl &&
  supabaseAnonKey !== defaultKey;

if (!isValidConfig) {
  console.warn('⚠️ Supabase not configured. Using mock authentication for development.');
}

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key: string, value: string) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
          }
        },
        removeItem: (key: string) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
        },
      },
    },
  }
);

export const isSupabaseConfigured = isValidConfig;
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_GEMINI_API_KEY: string;
      EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS: string;
      EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID: string;
      EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB: string;
      EXPO_PUBLIC_APPLE_CLIENT_ID: string;
    }
  }
}

export {};
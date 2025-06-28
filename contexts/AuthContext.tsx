import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development when Supabase is not configured
const createMockUser = (email: string): User => ({
  id: 'mock-user-id',
  email,
  user_metadata: { name: email.split('@')[0] },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: null,
  confirmation_sent_at: null,
  recovery_sent_at: null,
  email_change_sent_at: null,
  new_email: null,
  invited_at: null,
  action_link: null,
  phone: null,
  role: 'authenticated',
} as User);

const createMockSession = (user: User): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user,
} as Session);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = !!session && !!user;

  // Storage helpers
  const getStorageItem = async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(key);
      } else {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('Error getting storage item:', error);
      return null;
    }
  };

  const setStorageItem = async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Error setting storage item:', error);
    }
  };

  const removeStorageItem = async (key: string): Promise<void> => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Error removing storage item:', error);
    }
  };

  // Clear all stored tokens
  const clearStoredTokens = async () => {
    try {
      await removeStorageItem('supabase.auth.token');
      await removeStorageItem('mock.auth.session');
      await removeStorageItem('mock.auth.user');
      if (Platform.OS === 'web') {
        // Clear all Supabase related localStorage items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.warn('Error clearing stored tokens:', error);
    }
  };

  // Mock authentication functions for development
  const mockSignIn = async (email: string, password: string) => {
    try {
      const mockUser = createMockUser(email);
      const mockSession = createMockSession(mockUser);
      
      // Store mock session and user
      await setStorageItem('mock.auth.session', JSON.stringify(mockSession));
      await setStorageItem('mock.auth.user', JSON.stringify(mockUser));
      
      setSession(mockSession);
      setUser(mockUser);
      return { error: null };
    } catch (error) {
      return { error: { message: 'Mock sign in failed' } };
    }
  };

  const mockSignUp = async (email: string, password: string, metadata?: any) => {
    // For mock, just sign in the user
    return mockSignIn(email, password);
  };

  const mockSignOut = async () => {
    console.log('Mock sign out - clearing state and storage');
    setSession(null);
    setUser(null);
    await clearStoredTokens();
  };

  // Check for stored mock session
  const checkMockSession = async () => {
    try {
      const sessionData = await getStorageItem('mock.auth.session');
      const userData = await getStorageItem('mock.auth.user');
      
      if (sessionData && userData) {
        const storedSession = JSON.parse(sessionData);
        const storedUser = JSON.parse(userData);
        
        // Check if session is still valid (not expired)
        const now = Math.floor(Date.now() / 1000);
        if (storedSession.expires_at && storedSession.expires_at > now) {
          setSession(storedSession);
          setUser(storedUser);
          return true;
        } else {
          // Session expired, clear it
          await clearStoredTokens();
        }
      }
      return false;
    } catch (error) {
      console.warn('Error checking mock session:', error);
      await clearStoredTokens();
      return false;
    }
  };

  useEffect(() => {
    setMounted(true);

    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Use mock authentication
          console.log('🔧 Using mock authentication for development');
          const hasMockSession = await checkMockSession();
          if (!hasMockSession) {
            console.log('No valid mock session found, user needs to sign in');
          } else {
            console.log('Valid mock session found, user is authenticated');
          }
          setLoading(false);
          return;
        }

        // Use real Supabase authentication
        console.log('🔐 Using Supabase authentication');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.warn('Error getting session:', error.message);
            await clearStoredTokens();
            setSession(null);
            setUser(null);
          } else if (session) {
            console.log('Valid Supabase session found:', session.user?.email);
            setSession(session);
            setUser(session.user);
          } else {
            console.log('No Supabase session found');
            setSession(null);
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.warn('Error in initializeAuth:', error);
        if (mounted) {
          await clearStoredTokens();
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Only set up Supabase listener if configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (mounted) {
            if (event === 'SIGNED_OUT' || !session) {
              console.log('User signed out or session invalid');
              setSession(null);
              setUser(null);
              await clearStoredTokens();
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              console.log('User signed in or token refreshed');
              setSession(session);
              setUser(session?.user ?? null);
            }
            setLoading(false);
          }
        }
      );

      return () => {
        setMounted(false);
        subscription.unsubscribe();
      };
    }

    return () => {
      setMounted(false);
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      console.log('Mock sign in for:', email);
      return mockSignIn(email, password);
    }

    try {
      console.log('Attempting Supabase sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.warn('Supabase sign in error:', error.message);
        return { error };
      }
      
      if (data.session && data.user) {
        console.log('Supabase sign in successful:', data.user.email);
        setSession(data.session);
        setUser(data.user);
        return { error: null };
      } else {
        console.warn('Supabase sign in returned no session/user');
        return { error: { message: 'No session returned from sign in' } };
      }
    } catch (error) {
      console.warn('Unexpected error during sign in:', error);
      return { error: { message: 'Unexpected error during sign in' } };
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    if (!isSupabaseConfigured) {
      console.log('Mock sign up for:', email);
      return mockSignUp(email, password, metadata);
    }

    try {
      console.log('Attempting Supabase sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        console.warn('Supabase sign up error:', error.message);
        return { error };
      }

      console.log('Supabase sign up successful:', data.user?.email);
      
      // If user is immediately confirmed, set session
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
      }
      
      return { error: null };
    } catch (error) {
      console.warn('Unexpected error during sign up:', error);
      return { error: { message: 'Unexpected error during sign up' } };
    }
  };

  const signInWithApple = async () => {
    return { error: { message: 'Apple Sign-In not implemented yet' } };
  };

  const signInWithGoogle = async () => {
    return { error: { message: 'Google Sign-In not implemented yet' } };
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Password reset not available in demo mode' } };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      return { error };
    } catch (error) {
      return { error: { message: 'Unexpected error during password reset' } };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Starting sign out process...');
      
      if (!isSupabaseConfigured) {
        console.log('Mock sign out');
        await mockSignOut();
        console.log('✅ Mock sign out completed');
        return;
      }

      // Clear local state first
      console.log('Clearing local auth state...');
      setSession(null);
      setUser(null);
      
      // Clear stored tokens
      console.log('Clearing stored tokens...');
      await clearStoredTokens();
      
      // Sign out from Supabase
      console.log('Signing out from Supabase...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('⚠️ Error signing out from Supabase:', error);
        // Don't throw error, local state is already cleared
      } else {
        console.log('✅ Supabase sign out completed');
      }
      
      console.log('✅ Sign out process completed successfully');
    } catch (error) {
      console.error('❌ Error in signOut:', error);
      // Even if there's an error, ensure local state is cleared
      setSession(null);
      setUser(null);
      await clearStoredTokens();
      console.log('🧹 Local state cleared despite error');
    }
  };

  const value = {
    session,
    user,
    loading,
    isAuthenticated,
    signInWithEmail,
    signUpWithEmail,
    signInWithApple,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
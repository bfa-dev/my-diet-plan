import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { authApi } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshUserProfile: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<any | null>(null);
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
  const clearStoredTokens = useCallback(async () => {
    try {
      console.log('🧹 Clearing all stored tokens...');
      await removeStorageItem('supabase.auth.token');
      await removeStorageItem('mock.auth.session');
      await removeStorageItem('mock.auth.user');
      if (Platform.OS === 'web') {
        // Clear all Supabase related localStorage items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
            console.log(`🗑️ Removed localStorage key: ${key}`);
          }
        });
      }
      console.log('✅ All tokens cleared successfully');
    } catch (error) {
      console.warn('⚠️ Error clearing stored tokens:', error);
    }
  }, []);

  // Clear auth state immediately
  const clearAuthState = useCallback(() => {
    console.log('🧹 Clearing auth state immediately...');
    setSession(null);
    setUser(null);
    setUserProfile(null);
    console.log('✅ Auth state cleared');
  }, []);

  // Refresh user profile
  const refreshUserProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: profile } = await authApi.ensureUserProfile(user);
      setUserProfile(profile);
    } catch (error) {
      console.warn('Error refreshing user profile:', error);
    }
  }, [user]);

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
      
      // Get or create user profile
      const { data: profile } = await authApi.ensureUserProfile(mockUser);
      setUserProfile(profile);
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Mock sign in failed' } };
    }
  };

  const mockSignUp = async (email: string, password: string, metadata?: any) => {
    try {
      const mockUser = createMockUser(email);
      const mockSession = createMockSession(mockUser);
      
      // Store mock session and user
      await setStorageItem('mock.auth.session', JSON.stringify(mockSession));
      await setStorageItem('mock.auth.user', JSON.stringify(mockUser));
      
      setSession(mockSession);
      setUser(mockUser);
      
      // Create user profile with metadata
      const { data: profile } = await authApi.handleUserSignUp(mockUser, metadata);
      setUserProfile(profile);
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Mock sign up failed' } };
    }
  };

  const mockSignOut = useCallback(async () => {
    console.log('🔧 Mock sign out - clearing state and storage');
    
    // Clear state immediately for instant UI update
    clearAuthState();
    
    // Clear storage
    await clearStoredTokens();
    
    console.log('✅ Mock sign out completed');
  }, [clearAuthState, clearStoredTokens]);

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
          
          // Get user profile
          const { data: profile } = await authApi.ensureUserProfile(storedUser);
          setUserProfile(profile);
          
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
        console.log('🔄 Initializing auth...');
        
        if (!isSupabaseConfigured) {
          // Use mock authentication
          console.log('🔧 Using mock authentication for development');
          const hasMockSession = await checkMockSession();
          if (!hasMockSession) {
            console.log('❌ No valid mock session found, user needs to sign in');
          } else {
            console.log('✅ Valid mock session found, user is authenticated');
          }
          setLoading(false);
          return;
        }

        // Use real Supabase authentication
        console.log('🔐 Using Supabase authentication');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.warn('⚠️ Error getting session:', error.message);
            await clearStoredTokens();
            setSession(null);
            setUser(null);
            setUserProfile(null);
          } else if (session) {
            console.log('✅ Valid Supabase session found:', session.user?.email);
            setSession(session);
            setUser(session.user);
            
            // Get user profile
            const { data: profile } = await authApi.ensureUserProfile(session.user);
            setUserProfile(profile);
          } else {
            console.log('❌ No Supabase session found');
            setSession(null);
            setUser(null);
            setUserProfile(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.warn('⚠️ Error in initializeAuth:', error);
        if (mounted) {
          await clearStoredTokens();
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Only set up Supabase listener if configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event, session?.user?.email);
          
          if (mounted) {
            if (event === 'SIGNED_OUT' || !session) {
              console.log('🚪 User signed out or session invalid');
              clearAuthState();
              await clearStoredTokens();
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              console.log('🔑 User signed in or token refreshed');
              setSession(session);
              setUser(session?.user ?? null);
              
              // Get user profile
              if (session?.user) {
                const { data: profile } = await authApi.ensureUserProfile(session.user);
                setUserProfile(profile);
              }
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
  }, [clearStoredTokens, clearAuthState, mounted]);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      console.log('🔧 Mock sign in for:', email);
      return mockSignIn(email, password);
    }

    try {
      console.log('🔑 Attempting Supabase sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.warn('⚠️ Supabase sign in error:', error.message);
        return { error };
      }
      
      if (data.session && data.user) {
        console.log('✅ Supabase sign in successful:', data.user.email);
        setSession(data.session);
        setUser(data.user);
        
        // Get user profile
        const { data: profile } = await authApi.ensureUserProfile(data.user);
        setUserProfile(profile);
        
        return { error: null };
      } else {
        console.warn('⚠️ Supabase sign in returned no session/user');
        return { error: { message: 'No session returned from sign in' } };
      }
    } catch (error) {
      console.warn('⚠️ Unexpected error during sign in:', error);
      return { error: { message: 'Unexpected error during sign in' } };
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    if (!isSupabaseConfigured) {
      console.log('🔧 Mock sign up for:', email);
      return mockSignUp(email, password, metadata);
    }

    try {
      console.log('📝 Attempting Supabase sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        console.warn('⚠️ Supabase sign up error:', error.message);
        return { error };
      }

      console.log('✅ Supabase sign up successful:', data.user?.email);
      
      // If user is immediately confirmed, set session and create profile
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        
        // Create user profile
        const { data: profile } = await authApi.handleUserSignUp(data.user, metadata);
        setUserProfile(profile);
      }
      
      return { error: null };
    } catch (error) {
      console.warn('⚠️ Unexpected error during sign up:', error);
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

  const signOut = useCallback(async () => {
    try {
      console.log('🚪 AuthContext: Starting sign out process...');
      
      if (!isSupabaseConfigured) {
        console.log('🔧 AuthContext: Using mock sign out');
        await mockSignOut();
        console.log('✅ AuthContext: Mock sign out completed');
        return;
      }

      // For Supabase, clear local state first to ensure immediate UI update
      console.log('🧹 AuthContext: Clearing local auth state immediately...');
      clearAuthState();
      
      // Clear stored tokens
      console.log('🗑️ AuthContext: Clearing stored tokens...');
      await clearStoredTokens();
      
      // Sign out from Supabase (this will trigger the auth state change listener)
      console.log('🔐 AuthContext: Signing out from Supabase...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('⚠️ AuthContext: Error signing out from Supabase:', error);
        // Don't throw error, local state is already cleared
      } else {
        console.log('✅ AuthContext: Supabase sign out completed');
      }
      
      console.log('✅ AuthContext: Sign out process completed successfully');
    } catch (error) {
      console.error('❌ AuthContext: Error in signOut:', error);
      // Even if there's an error, ensure local state is cleared
      clearAuthState();
      await clearStoredTokens();
      console.log('🧹 AuthContext: Local state cleared despite error');
    }
  }, [mockSignOut, clearAuthState, clearStoredTokens]);

  const value = {
    session,
    user,
    userProfile,
    loading,
    isAuthenticated,
    signInWithEmail,
    signUpWithEmail,
    signInWithApple,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshUserProfile,
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
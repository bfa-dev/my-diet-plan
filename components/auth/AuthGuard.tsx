import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { View, StyleSheet, Text } from 'react-native';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, needsOnboarding, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      console.log('🛡️ AuthGuard: Still loading, waiting...');
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inProtectedRoute = inTabsGroup || inOnboardingGroup || 
      segments.includes('premium') || 
      segments.includes('plan-generator') || 
      segments.includes('settings') ||
      segments.includes('recipe');

    console.log('🛡️ AuthGuard Check:', {
      isAuthenticated,
      needsOnboarding,
      segments: segments.join('/'),
      inAuthGroup,
      inOnboardingGroup,
      inProtectedRoute,
      loading
    });

    if (!isAuthenticated) {
      // User is not authenticated
      if (inProtectedRoute) {
        // Redirect to auth if trying to access protected routes
        console.log('🔄 AuthGuard: Redirecting to auth - user not authenticated');
        router.replace('/(auth)/welcome');
      }
    } else {
      // User is authenticated
      if (needsOnboarding) {
        // User needs to complete onboarding
        if (!inOnboardingGroup) {
          console.log('🔄 AuthGuard: Redirecting to onboarding - profile incomplete');
          router.replace('/onboarding');
        }
      } else {
        // User is fully set up
        if (inAuthGroup || inOnboardingGroup) {
          // Redirect to main app if trying to access auth/onboarding routes
          console.log('🔄 AuthGuard: Redirecting to tabs - user fully authenticated');
          router.replace('/(tabs)');
        }
      }
    }
  }, [isAuthenticated, needsOnboarding, loading, segments, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={32} color="#8FBC8F" />
        <Text style={styles.loadingText}>
          {!isSupabaseConfigured ? 'Initializing Demo Mode...' : 'Loading...'}
        </Text>
        {!isSupabaseConfigured && (
          <Text style={styles.demoText}>
            🔧 Running in demo mode. Configure Supabase for full functionality.
          </Text>
        )}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  demoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
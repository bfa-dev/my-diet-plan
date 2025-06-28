import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Apple, Chrome } from 'lucide-react-native';

interface SocialSignInButtonProps {
  provider: 'apple' | 'google';
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export function SocialSignInButton({ provider, onPress, loading = false, style }: SocialSignInButtonProps) {
  const isApple = provider === 'apple';
  const isGoogle = provider === 'google';

  // Hide Apple Sign-In on non-iOS platforms
  if (isApple && Platform.OS !== 'ios') {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isApple && styles.appleButton,
        isGoogle && styles.googleButton,
        loading && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {isApple && <Apple size={20} color="#FFFFFF" />}
      {isGoogle && <Chrome size={20} color="#4285F4" />}
      
      <Text style={[
        styles.buttonText,
        isApple && styles.appleButtonText,
        isGoogle && styles.googleButtonText,
      ]}>
        {loading ? 'Giriş yapılıyor...' : 
         isApple ? 'Apple ile Devam Et' : 
         'Google ile Devam Et'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  appleButtonText: {
    color: '#FFFFFF',
  },
  googleButtonText: {
    color: '#1F2937',
  },
});
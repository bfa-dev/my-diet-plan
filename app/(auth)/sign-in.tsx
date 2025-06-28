import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { SocialSignInButton } from '@/components/auth/SocialSignInButton';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithEmail, signInWithApple, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'apple' | 'google' | null>(null);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen email ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        console.warn('Sign in error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Giriş yapılırken bir hata oluştu.';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email veya şifre hatalı. Lütfen tekrar deneyin.';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Email adresinizi doğrulamanız gerekiyor. Gelen kutunuzu kontrol edin.';
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = 'Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        Alert.alert('Giriş Hatası', errorMessage);
      } else {
        console.log('Sign in successful, AuthGuard will handle navigation');
        // Don't manually navigate - let AuthGuard handle it
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      Alert.alert('Hata', 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading('apple');
    const { error } = await signInWithApple();
    setSocialLoading(null);

    if (error) {
      Alert.alert('Apple Giriş Hatası', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    const { error } = await signInWithGoogle();
    setSocialLoading(null);

    if (error) {
      Alert.alert('Google Giriş Hatası', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tekrar Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>
          {!isSupabaseConfigured && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoText}>
                🔧 Demo Mode: Herhangi bir email/şifre ile giriş yapabilirsiniz
              </Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={isSupabaseConfigured ? "ornek@email.com" : "demo@example.com"}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder={isSupabaseConfigured ? "Şifrenizi girin" : "demo123"}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {isSupabaseConfigured && (
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/forgot-password')}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
          )}

          <Button
            title={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            onPress={handleEmailSignIn}
            disabled={loading || !email || !password}
            style={styles.signInButton}
          />
        </View>

        {isSupabaseConfigured && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              {Platform.OS === 'ios' && (
                <SocialSignInButton
                  provider="apple"
                  onPress={handleAppleSignIn}
                  loading={socialLoading === 'apple'}
                  style={styles.socialButton}
                />
              )}
              
              <SocialSignInButton
                provider="google"
                onPress={handleGoogleSignIn}
                loading={socialLoading === 'google'}
                style={styles.socialButton}
              />
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Hesabınız yok mu?{' '}
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/sign-up')}
              disabled={loading}
            >
              <Text style={styles.linkText}>Hesap Oluşturun</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  demoNotice: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  demoText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  signInButton: {
    shadowColor: '#8FBC8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginHorizontal: 16,
  },
  socialButtons: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  linkText: {
    color: '#8FBC8F',
    fontFamily: 'Inter-Medium',
  },
});
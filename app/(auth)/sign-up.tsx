import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { SocialSignInButton } from '@/components/auth/SocialSignInButton';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUpWithEmail, signInWithApple, signInWithGoogle } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'apple' | 'google' | null>(null);

  const handleEmailSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    const { error } = await signUpWithEmail(email, password, { name });
    setLoading(false);

    if (error) {
      Alert.alert('Kayıt Hatası', error.message);
    } else {
      Alert.alert(
        'Başarılı!', 
        'Hesabınız oluşturuldu. Email adresinizi doğrulamak için gelen kutunuzu kontrol edin.',
        [{ text: 'Tamam', onPress: () => router.push('/onboarding') }]
      );
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading('apple');
    const { error } = await signInWithApple();
    setSocialLoading(null);

    if (error) {
      Alert.alert('Apple Giriş Hatası', error.message);
    } else {
      router.push('/onboarding');
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    const { error } = await signInWithGoogle();
    setSocialLoading(null);

    if (error) {
      Alert.alert('Google Giriş Hatası', error.message);
    } else {
      router.push('/onboarding');
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
          <Text style={styles.title}>Hesap Oluşturun</Text>
          <Text style={styles.subtitle}>Sağlıklı yaşam yolculuğunuza başlayın</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Adınızı ve soyadınızı girin"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="En az 6 karakter"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre Tekrar</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Şifrenizi tekrar girin"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title={loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
            onPress={handleEmailSignUp}
            disabled={loading}
            style={styles.signUpButton}
          />
        </View>

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

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Zaten hesabınız var mı?{' '}
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <Text style={styles.linkText}>Giriş Yapın</Text>
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
  signUpButton: {
    marginTop: 8,
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
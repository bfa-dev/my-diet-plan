import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen email adresinizi girin.');
      return;
    }

    if (!isSupabaseConfigured) {
      Alert.alert('Demo Mode', 'Şifre sıfırlama demo modunda kullanılamaz.');
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={styles.iconContainer}>
              <Mail size={48} color="#8FBC8F" />
            </View>
            
            <Text style={styles.successTitle}>Email Gönderildi!</Text>
            <Text style={styles.successSubtitle}>
              {email} adresine şifre sıfırlama bağlantısı gönderdik. 
              Email'inizi kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
            </Text>

            <Button
              title="Giriş Sayfasına Dön"
              onPress={() => router.push('/(auth)/sign-in')}
              style={styles.backButton}
            />

            <TouchableOpacity onPress={() => setSent(false)}>
              <Text style={styles.resendText}>Tekrar gönder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>
            Email adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </Text>
          {!isSupabaseConfigured && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoText}>
                🔧 Demo Mode: Şifre sıfırlama özelliği demo modunda kullanılamaz
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
              placeholder="ornek@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <Button
            title={loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            onPress={handleResetPassword}
            disabled={loading || !email || !isSupabaseConfigured}
            style={styles.resetButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Şifrenizi hatırladınız mı?{' '}
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
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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
    marginBottom: 24,
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
  resetButton: {
    shadowColor: '#8FBC8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  successContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
    width: '100%',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
});
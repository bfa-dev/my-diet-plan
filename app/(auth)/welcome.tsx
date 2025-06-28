import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🥗</Text>
          </View>
          <Text style={styles.appName}>Beslenme Planım</Text>
          <Text style={styles.tagline}>AI ile Kişisel Beslenme Planları</Text>
        </View>

        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600' }}
          style={styles.heroImage}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Sağlıklı Yaşama Başlayın</Text>
          <Text style={styles.subtitle}>
            Size özel beslenme planları ile hedeflerinize ulaşın. Türk ve Akdeniz mutfağından lezzetli tarifler.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Giriş Yap"
            onPress={() => router.push('/(auth)/sign-in')}
            style={styles.primaryButton}
          />
          <Button
            title="Hesap Oluştur"
            onPress={() => router.push('/(auth)/sign-up')}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Devam ederek{' '}
            <Text style={styles.linkText}>Kullanım Şartları</Text>
            {' '}ve{' '}
            <Text style={styles.linkText}>Gizlilik Politikası</Text>
            'nı kabul etmiş olursunuz.
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#8FBC8F',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginVertical: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    shadowColor: '#8FBC8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    borderColor: '#8FBC8F',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#8FBC8F',
    fontFamily: 'Inter-Medium',
  },
});
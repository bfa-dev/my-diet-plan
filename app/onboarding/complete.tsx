import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle, Sparkles } from 'lucide-react-native';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';

export default function OnboardingComplete() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCompleteOnboarding = async () => {
    setLoading(true);

    try {
      // Parse dietary preferences from JSON string
      let dietaryPreferences: string[] = [];
      try {
        dietaryPreferences = JSON.parse(params.dietaryPreferences as string || '[]');
      } catch (e) {
        dietaryPreferences = [];
      }

      // Prepare profile data
      const profileData = {
        name: params.name as string,
        age: parseInt(params.age as string),
        gender: params.gender as string,
        weight_kg: parseFloat(params.weight as string),
        height_cm: parseFloat(params.height as string),
        activityLevel: params.activityLevel as string,
        primaryGoal: params.primaryGoal as string,
        dietaryPreferences,
      };

      console.log('Completing onboarding with data:', profileData);

      // Complete onboarding
      const { error } = await completeOnboarding(profileData);

      if (error) {
        console.error('Error completing onboarding:', error);
        Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        setLoading(false);
        return;
      }

      // Generate initial meal plan
      console.log('Generating initial meal plan...');
      // This will be handled automatically by the AuthGuard navigation

      setLoading(false);
      
      // Navigate to main app - AuthGuard will handle this automatically
      // but we can trigger it explicitly
      router.replace('/(tabs)');

    } catch (error) {
      console.error('Unexpected error during onboarding completion:', error);
      Alert.alert('Hata', 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={48} color="#8FBC8F" />
          <Text style={styles.loadingTitle}>Profiliniz Oluşturuluyor...</Text>
          <Text style={styles.loadingSubtitle}>
            Kişiselleştirilmiş beslenme planınız hazırlanıyor
          </Text>
          <View style={styles.loadingSteps}>
            <Text style={styles.loadingStep}>✓ Profil bilgileri kaydediliyor</Text>
            <Text style={styles.loadingStep}>✓ Kalori hedefi hesaplanıyor</Text>
            <Text style={styles.loadingStep}>⏳ İlk beslenme planı oluşturuluyor</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={48} color="#8FBC8F" />
          </View>
          <Sparkles size={24} color="#F59E0B" style={styles.sparkle1} />
          <Sparkles size={16} color="#F59E0B" style={styles.sparkle2} />
        </View>

        <Text style={styles.title}>Harika! Profiliniz Hazır</Text>
        <Text style={styles.subtitle}>
          Kişiselleştirilmiş beslenme planınızı oluşturmaya hazırız. Sağlıklı yaşam yolculuğunuza başlamaya hazır mısınız?
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureText}>Size özel kalori hedefi</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🍽️</Text>
            <Text style={styles.featureText}>Hedefinize uygun tarifler</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>📅</Text>
            <Text style={styles.featureText}>7 günlük beslenme planı</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🛒</Text>
            <Text style={styles.featureText}>Otomatik alışveriş listesi</Text>
          </View>
        </View>

        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            "Başarı, küçük adımların toplamıdır. Bugün ilk adımınızı atın!"
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={handleCompleteOnboarding}
        disabled={loading}
      >
        <Text style={styles.startButtonText}>Planımı Oluştur</Text>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -4,
    left: -8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  motivationContainer: {
    backgroundColor: '#F0F9F0',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  motivationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 40,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  loadingSteps: {
    alignSelf: 'stretch',
  },
  loadingStep: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
});
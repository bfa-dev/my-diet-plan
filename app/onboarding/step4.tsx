import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

export default function OnboardingStep4() {
  const router = useRouter();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const dietaryPreferences = [
    { value: 'Vegetarian', label: 'Vejetaryen', emoji: '🥬' },
    { value: 'Vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'Gluten-Free', label: 'Glutensiz', emoji: '🌾' },
    { value: 'Lactose-Intolerant', label: 'Laktozsuz', emoji: '🥛' },
    { value: 'Nut-Allergy', label: 'Fındık Alerjisi', emoji: '🥜' },
    { value: 'Low-Carb', label: 'Düşük Karbonhidrat', emoji: '🥩' },
    { value: 'Low-Sodium', label: 'Düşük Sodyum', emoji: '🧂' },
    { value: 'Diabetic', label: 'Diyabetik', emoji: '🍎' },
  ];

  const togglePreference = (value: string) => {
    setSelectedPreferences(prev => 
      prev.includes(value) 
        ? prev.filter(p => p !== value)
        : [...prev, value]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Beslenme Tercihleri</Text>
        <Text style={styles.subtitle}>
          Varsa özel beslenme ihtiyaçlarınızı seçin (isteğe bağlı)
        </Text>

        <ScrollView style={styles.preferencesContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.preferencesGrid}>
            {dietaryPreferences.map((preference) => (
              <TouchableOpacity
                key={preference.value}
                style={[
                  styles.preferenceOption,
                  selectedPreferences.includes(preference.value) && styles.preferenceOptionSelected
                ]}
                onPress={() => togglePreference(preference.value)}
              >
                <Text style={styles.preferenceEmoji}>{preference.emoji}</Text>
                <Text style={[
                  styles.preferenceLabel,
                  selectedPreferences.includes(preference.value) && styles.preferenceLabelSelected
                ]}>
                  {preference.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/onboarding/complete')}
        >
          <Text style={styles.skipButtonText}>Atla</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => router.push('/onboarding/complete')}
      >
        <Text style={styles.continueButtonText}>Planımı Oluştur</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#8FBC8F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  preferencesContainer: {
    flex: 1,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  preferenceOption: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  preferenceOptionSelected: {
    borderColor: '#8FBC8F',
    backgroundColor: '#F0F9F0',
  },
  preferenceEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  preferenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    textAlign: 'center',
  },
  preferenceLabelSelected: {
    color: '#8FBC8F',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  continueButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 40,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
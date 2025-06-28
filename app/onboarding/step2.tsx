import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

export default function OnboardingStep2() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState('');

  const activityLevels = [
    { 
      value: 'Sedentary', 
      label: 'Hareketsiz', 
      description: 'Çoğunlukla masa başında çalışıyorum' 
    },
    { 
      value: 'Light', 
      label: 'Az Aktif', 
      description: 'Haftada 1-3 gün hafif egzersiz' 
    },
    { 
      value: 'Moderate', 
      label: 'Orta Aktif', 
      description: 'Haftada 3-5 gün orta seviye egzersiz' 
    },
    { 
      value: 'Active', 
      label: 'Çok Aktif', 
      description: 'Haftada 6-7 gün yoğun egzersiz' 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Aktivite Seviyeniz Nedir?</Text>
        <Text style={styles.subtitle}>
          Günlük aktivite seviyenizi seçin, size uygun kalori hedefini belirleyelim
        </Text>

        <View style={styles.optionsContainer}>
          {activityLevels.map((activity) => (
            <TouchableOpacity
              key={activity.value}
              style={[
                styles.activityOption,
                selectedActivity === activity.value && styles.activityOptionSelected
              ]}
              onPress={() => setSelectedActivity(activity.value)}
            >
              <View style={styles.activityContent}>
                <Text style={[
                  styles.activityLabel,
                  selectedActivity === activity.value && styles.activityLabelSelected
                ]}>
                  {activity.label}
                </Text>
                <Text style={[
                  styles.activityDescription,
                  selectedActivity === activity.value && styles.activityDescriptionSelected
                ]}>
                  {activity.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedActivity === activity.value && styles.radioButtonSelected
              ]}>
                {selectedActivity === activity.value && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.continueButton, !selectedActivity && styles.continueButtonDisabled]}
        onPress={() => selectedActivity && router.push('/onboarding/step3')}
        disabled={!selectedActivity}
      >
        <Text style={[styles.continueButtonText, !selectedActivity && styles.continueButtonTextDisabled]}>
          Devam Et
        </Text>
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
  optionsContainer: {
    gap: 16,
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  activityOptionSelected: {
    borderColor: '#8FBC8F',
    backgroundColor: '#F0F9F0',
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityLabelSelected: {
    color: '#8FBC8F',
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activityDescriptionSelected: {
    color: '#6B7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#8FBC8F',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8FBC8F',
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
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
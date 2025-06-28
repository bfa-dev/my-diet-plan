import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Target, TrendingDown, TrendingUp } from 'lucide-react-native';

export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedGoal, setSelectedGoal] = useState('');

  const goals = [
    { 
      value: 'Lose Weight', 
      label: 'Kilo Vermek', 
      description: 'Sağlıklı bir şekilde hedef kiloma ulaşmak istiyorum',
      icon: TrendingDown,
      color: '#EF4444'
    },
    { 
      value: 'Maintain Weight', 
      label: 'Kilomu Korumak', 
      description: 'Mevcut kilomu koruyarak sağlıklı beslenmeye odaklanmak istiyorum',
      icon: Target,
      color: '#8FBC8F'
    },
    { 
      value: 'Gain Muscle', 
      label: 'Kas Yapmak', 
      description: 'Kas kütlemi artırarak daha güçlü olmak istiyorum',
      icon: TrendingUp,
      color: '#3B82F6'
    },
  ];

  const handleContinue = () => {
    if (selectedGoal) {
      router.push({
        pathname: '/onboarding/step4',
        params: { ...params, primaryGoal: selectedGoal },
      });
    }
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
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Ana Hedefiniz Nedir?</Text>
        <Text style={styles.subtitle}>
          Hedefinize uygun beslenme planı ve kalori hedefi belirleyelim
        </Text>

        <View style={styles.optionsContainer}>
          {goals.map((goal) => {
            const IconComponent = goal.icon;
            return (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.goalOption,
                  selectedGoal === goal.value && styles.goalOptionSelected
                ]}
                onPress={() => setSelectedGoal(goal.value)}
              >
                <View style={[styles.iconContainer, { backgroundColor: goal.color + '20' }]}>
                  <IconComponent size={24} color={goal.color} />
                </View>
                <View style={styles.goalContent}>
                  <Text style={[
                    styles.goalLabel,
                    selectedGoal === goal.value && styles.goalLabelSelected
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={[
                    styles.goalDescription,
                    selectedGoal === goal.value && styles.goalDescriptionSelected
                  ]}>
                    {goal.description}
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedGoal === goal.value && styles.radioButtonSelected
                ]}>
                  {selectedGoal === goal.value && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.continueButton, !selectedGoal && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!selectedGoal}
      >
        <Text style={[styles.continueButtonText, !selectedGoal && styles.continueButtonTextDisabled]}>
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
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  goalOptionSelected: {
    borderColor: '#8FBC8F',
    backgroundColor: '#F0F9F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalLabelSelected: {
    color: '#8FBC8F',
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  goalDescriptionSelected: {
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
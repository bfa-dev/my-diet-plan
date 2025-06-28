import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

export default function OnboardingStep1() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
  });

  const genderOptions = [
    { value: 'Male', label: 'Erkek' },
    { value: 'Female', label: 'Kadın' },
    { value: 'Other', label: 'Diğer' },
  ];

  const isFormValid = formData.name && formData.age && formData.gender && formData.weight && formData.height;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Kendinizi Tanıtalım</Text>
        <Text style={styles.subtitle}>Size özel plan hazırlayabilmemiz için birkaç bilgiye ihtiyacımız var</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adınız</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Adınızı girin"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Yaş</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="25"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Cinsiyet</Text>
              <View style={styles.genderContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      formData.gender === option.value && styles.genderOptionSelected
                    ]}
                    onPress={() => setFormData({ ...formData, gender: option.value })}
                  >
                    <Text style={[
                      styles.genderText,
                      formData.gender === option.value && styles.genderTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Kilo (kg)</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                placeholder="65"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Boy (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.height}
                onChangeText={(text) => setFormData({ ...formData, height: text })}
                placeholder="165"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.continueButton, !isFormValid && styles.continueButtonDisabled]}
        onPress={() => isFormValid && router.push('/onboarding/step2')}
        disabled={!isFormValid}
      >
        <Text style={[styles.continueButtonText, !isFormValid && styles.continueButtonTextDisabled]}>
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
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  row: {
    flexDirection: 'row',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#8FBC8F',
    borderColor: '#8FBC8F',
  },
  genderText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  genderTextSelected: {
    color: '#FFFFFF',
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
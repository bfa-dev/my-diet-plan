import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, Target, Calendar, Users } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function PlanGenerator() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('7');
  const [selectedPeople, setSelectedPeople] = useState('2');
  const [isGenerating, setIsGenerating] = useState(false);

  const goals = [
    { id: 'weight_loss', title: 'Kilo Vermek', subtitle: 'Sağlıklı kilo kaybı', icon: '🎯' },
    { id: 'muscle_gain', title: 'Kas Yapmak', subtitle: 'Protein odaklı beslenme', icon: '💪' },
    { id: 'healthy_eating', title: 'Sağlıklı Beslenme', subtitle: 'Dengeli ve besleyici', icon: '🥗' },
    { id: 'energy_boost', title: 'Enerji Artışı', subtitle: 'Aktif yaşam için', icon: '⚡' },
  ];

  const durations = [
    { id: '7', title: '1 Hafta', subtitle: 'Hızlı başlangıç' },
    { id: '14', title: '2 Hafta', subtitle: 'Alışkanlık oluşturma' },
    { id: '30', title: '1 Ay', subtitle: 'Uzun vadeli plan' },
  ];

  const peopleOptions = [
    { id: '1', title: '1 Kişi', subtitle: 'Sadece ben' },
    { id: '2', title: '2 Kişi', subtitle: 'Çift için' },
    { id: '4', title: '4 Kişi', subtitle: 'Aile için' },
  ];

  const generatePlan = async () => {
    setIsGenerating(true);
    
    // Simulate AI plan generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    router.replace('/(tabs)');
  };

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Sparkles size={48} color="#8FBC8F" />
            <LoadingSpinner size={32} color="#8FBC8F" />
            <Text style={styles.loadingTitle}>Planınız Hazırlanıyor...</Text>
            <Text style={styles.loadingSubtitle}>
              AI teknolojisi ile size özel beslenme planı oluşturuluyor
            </Text>
            <View style={styles.loadingSteps}>
              <Text style={styles.loadingStep}>✓ Hedefleriniz analiz ediliyor</Text>
              <Text style={styles.loadingStep}>✓ Tarifler seçiliyor</Text>
              <Text style={styles.loadingStep}>⏳ Alışveriş listesi hazırlanıyor</Text>
            </View>
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
        <Text style={styles.headerTitle}>Yeni Plan Oluştur</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Sparkles size={32} color="#8FBC8F" />
          <Text style={styles.heroTitle}>AI ile Kişisel Plan</Text>
          <Text style={styles.heroSubtitle}>
            Hedeflerinize uygun, size özel beslenme planı oluşturalım
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color="#8FBC8F" />
            <Text style={styles.sectionTitle}>Hedefinizi Seçin</Text>
          </View>
          
          <View style={styles.optionsGrid}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.optionCard,
                  selectedGoal === goal.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedGoal(goal.id)}
              >
                <Text style={styles.optionIcon}>{goal.icon}</Text>
                <Text style={styles.optionTitle}>{goal.title}</Text>
                <Text style={styles.optionSubtitle}>{goal.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#8FBC8F" />
            <Text style={styles.sectionTitle}>Plan Süresi</Text>
          </View>
          
          <View style={styles.optionsRow}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration.id}
                style={[
                  styles.optionCardSmall,
                  selectedDuration === duration.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedDuration(duration.id)}
              >
                <Text style={styles.optionTitle}>{duration.title}</Text>
                <Text style={styles.optionSubtitle}>{duration.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#8FBC8F" />
            <Text style={styles.sectionTitle}>Kaç Kişi İçin?</Text>
          </View>
          
          <View style={styles.optionsRow}>
            {peopleOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCardSmall,
                  selectedPeople === option.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedPeople(option.id)}
              >
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Plan Özeti</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Hedef:</Text>
            <Text style={styles.summaryValue}>
              {goals.find(g => g.id === selectedGoal)?.title || 'Seçilmedi'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Süre:</Text>
            <Text style={styles.summaryValue}>
              {durations.find(d => d.id === selectedDuration)?.title || '1 Hafta'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Kişi Sayısı:</Text>
            <Text style={styles.summaryValue}>
              {peopleOptions.find(p => p.id === selectedPeople)?.title || '2 Kişi'}
            </Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Planımı Oluştur"
          onPress={generatePlan}
          disabled={!selectedGoal}
          style={styles.generateButton}
        />
        <Text style={styles.footerNote}>
          Plan oluşturma işlemi yaklaşık 30 saniye sürer
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    width: '47%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  optionCardSmall: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: '#8FBC8F',
    backgroundColor: '#F0F9F0',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryCard: {
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  generateButton: {
    marginBottom: 8,
  },
  footerNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingContent: {
    alignItems: 'center',
    maxWidth: 300,
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
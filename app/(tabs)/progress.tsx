import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingDown, TrendingUp, Target, Calendar, Camera, Scale, Ruler } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WeightChart } from '@/components/WeightChart';
import { ProgressPhotoModal } from '@/components/ProgressPhotoModal';
import { useAuth } from '@/contexts/AuthContext';

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  waistSize?: number;
  notes?: string;
}

interface ProgressGoal {
  currentWeight: number;
  targetWeight: number;
  startWeight: number;
  startDate: string;
  targetDate: string;
}

export default function ProgressTab() {
  const { userProfile } = useAuth();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWaistSize, setNewWaistSize] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock progress goal based on user profile
  const progressGoal: ProgressGoal = {
    currentWeight: userProfile?.weight_kg || 70,
    targetWeight: userProfile?.primaryGoal === 'Lose Weight' ? (userProfile?.weight_kg || 70) - 5 : 
                  userProfile?.primaryGoal === 'Gain Muscle' ? (userProfile?.weight_kg || 70) + 3 : 
                  userProfile?.weight_kg || 70,
    startWeight: userProfile?.weight_kg || 70,
    startDate: '2024-01-01',
    targetDate: '2024-06-01',
  };

  useEffect(() => {
    loadWeightEntries();
  }, []);

  const loadWeightEntries = () => {
    // In a real app, this would load from API
    const savedEntries = localStorage.getItem('weight_entries');
    if (savedEntries) {
      setWeightEntries(JSON.parse(savedEntries));
    } else {
      // Generate some mock data
      const mockEntries: WeightEntry[] = [
        { id: '1', date: '2024-01-01', weight: userProfile?.weight_kg || 70, waistSize: 85 },
        { id: '2', date: '2024-01-15', weight: (userProfile?.weight_kg || 70) - 0.5, waistSize: 84 },
        { id: '3', date: '2024-02-01', weight: (userProfile?.weight_kg || 70) - 1.2, waistSize: 83 },
        { id: '4', date: '2024-02-15', weight: (userProfile?.weight_kg || 70) - 1.8, waistSize: 82 },
        { id: '5', date: '2024-03-01', weight: (userProfile?.weight_kg || 70) - 2.4, waistSize: 81 },
      ];
      setWeightEntries(mockEntries);
      localStorage.setItem('weight_entries', JSON.stringify(mockEntries));
    }
  };

  const saveWeightEntries = (entries: WeightEntry[]) => {
    localStorage.setItem('weight_entries', JSON.stringify(entries));
  };

  const addWeightEntry = () => {
    if (!newWeight) {
      Alert.alert('Hata', 'Lütfen kilo değeri girin.');
      return;
    }

    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0 || weight > 300) {
      Alert.alert('Hata', 'Geçerli bir kilo değeri girin (0-300 kg).');
      return;
    }

    const waistSize = newWaistSize ? parseFloat(newWaistSize) : undefined;
    if (waistSize && (isNaN(waistSize) || waistSize <= 0 || waistSize > 200)) {
      Alert.alert('Hata', 'Geçerli bir bel ölçüsü girin (0-200 cm).');
      return;
    }

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight,
      waistSize,
      notes: newNotes.trim() || undefined,
    };

    const updatedEntries = [...weightEntries, newEntry].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setWeightEntries(updatedEntries);
    saveWeightEntries(updatedEntries);

    // Reset form
    setNewWeight('');
    setNewWaistSize('');
    setNewNotes('');
    setShowAddEntry(false);

    Alert.alert('Başarılı!', 'Ölçüm kaydedildi.');
  };

  const getLatestEntry = () => {
    return weightEntries.length > 0 ? weightEntries[0] : null;
  };

  const getWeightChange = () => {
    if (weightEntries.length < 2) return 0;
    const latest = weightEntries[0];
    const previous = weightEntries[1];
    return latest.weight - previous.weight;
  };

  const getProgressToGoal = () => {
    const latest = getLatestEntry();
    if (!latest) return 0;

    const totalChange = progressGoal.targetWeight - progressGoal.startWeight;
    const currentChange = latest.weight - progressGoal.startWeight;
    
    if (totalChange === 0) return 100;
    return Math.min(Math.max((currentChange / totalChange) * 100, 0), 100);
  };

  const getRemainingToGoal = () => {
    const latest = getLatestEntry();
    if (!latest) return Math.abs(progressGoal.targetWeight - progressGoal.currentWeight);
    
    return Math.abs(progressGoal.targetWeight - latest.weight);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const latestEntry = getLatestEntry();
  const weightChange = getWeightChange();
  const progressPercentage = getProgressToGoal();
  const remainingToGoal = getRemainingToGoal();

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color, 
    trend 
  }: {
    icon: any;
    title: string;
    value: string;
    subtitle?: string;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Icon size={20} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            {trend === 'up' && <TrendingUp size={16} color="#10B981" />}
            {trend === 'down' && <TrendingDown size={16} color="#EF4444" />}
            {trend === 'neutral' && <Target size={16} color="#6B7280" />}
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İlerleme Takibi</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddEntry(!showAddEntry)}
        >
          <Plus size={20} color="#8FBC8F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Goal Progress */}
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Hedef İlerlemeniz</Text>
            <Text style={styles.goalSubtitle}>
              {userProfile?.primaryGoal === 'Lose Weight' ? 'Kilo Verme' :
               userProfile?.primaryGoal === 'Gain Muscle' ? 'Kas Yapma' : 'Kilo Koruma'} Hedefi
            </Text>
          </View>
          
          <View style={styles.goalProgress}>
            <View style={styles.goalProgressBar}>
              <View 
                style={[
                  styles.goalProgressFill, 
                  { width: `${Math.min(progressPercentage, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.goalProgressText}>
              %{Math.round(progressPercentage)} tamamlandı
            </Text>
          </View>

          <View style={styles.goalStats}>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatValue}>{progressGoal.startWeight} kg</Text>
              <Text style={styles.goalStatLabel}>Başlangıç</Text>
            </View>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatValue}>{latestEntry?.weight || progressGoal.currentWeight} kg</Text>
              <Text style={styles.goalStatLabel}>Şu an</Text>
            </View>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatValue}>{progressGoal.targetWeight} kg</Text>
              <Text style={styles.goalStatLabel}>Hedef</Text>
            </View>
          </View>

          <View style={styles.remainingContainer}>
            <Target size={16} color="#8FBC8F" />
            <Text style={styles.remainingText}>
              Hedefe {remainingToGoal.toFixed(1)} kg kaldı!
            </Text>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={Scale}
            title="Güncel Kilo"
            value={`${latestEntry?.weight || progressGoal.currentWeight} kg`}
            subtitle={latestEntry ? formatDate(latestEntry.date) : 'Kayıt yok'}
            color="#3B82F6"
            trend={weightChange > 0 ? 'up' : weightChange < 0 ? 'down' : 'neutral'}
          />
          
          <StatCard
            icon={Ruler}
            title="Bel Ölçüsü"
            value={latestEntry?.waistSize ? `${latestEntry.waistSize} cm` : '-'}
            subtitle="Son ölçüm"
            color="#8B5CF6"
          />
        </View>

        {/* Weight Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Kilo Değişimi</Text>
          <WeightChart entries={weightEntries} />
        </Card>

        {/* Add Entry Form */}
        {showAddEntry && (
          <Card style={styles.addEntryCard}>
            <Text style={styles.addEntryTitle}>Yeni Ölçüm Ekle</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kilo (kg) *</Text>
              <TextInput
                style={styles.input}
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="65.5"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bel Ölçüsü (cm)</Text>
              <TextInput
                style={styles.input}
                value={newWaistSize}
                onChangeText={setNewWaistSize}
                placeholder="80"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notlar</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newNotes}
                onChangeText={setNewNotes}
                placeholder="Bugün nasıl hissediyorsunuz?"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.addEntryActions}>
              <Button
                title="İptal"
                onPress={() => {
                  setShowAddEntry(false);
                  setNewWeight('');
                  setNewWaistSize('');
                  setNewNotes('');
                }}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Kaydet"
                onPress={addWeightEntry}
                style={styles.saveButton}
                disabled={!newWeight}
              />
            </View>
          </Card>
        )}

        {/* Progress Photos */}
        <Card style={styles.photosCard}>
          <View style={styles.photosHeader}>
            <Text style={styles.photosTitle}>İlerleme Fotoğrafları</Text>
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={() => setShowPhotoModal(true)}
            >
              <Camera size={16} color="#8FBC8F" />
              <Text style={styles.photoButtonText}>Fotoğraf Ekle</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.photosSubtitle}>
            Görsel ilerlemenizi takip etmek için düzenli fotoğraf çekin
          </Text>
          
          <View style={styles.photoPlaceholder}>
            <Camera size={32} color="#D1D5DB" />
            <Text style={styles.photoPlaceholderText}>
              Henüz fotoğraf eklenmedi
            </Text>
          </View>
        </Card>

        {/* Recent Entries */}
        <Card style={styles.entriesCard}>
          <Text style={styles.entriesTitle}>Son Ölçümler</Text>
          
          {weightEntries.length === 0 ? (
            <View style={styles.noEntriesContainer}>
              <Text style={styles.noEntriesText}>Henüz ölçüm kaydı yok</Text>
              <Text style={styles.noEntriesSubtext}>
                İlk ölçümünüzü ekleyerek başlayın
              </Text>
            </View>
          ) : (
            <View style={styles.entriesList}>
              {weightEntries.slice(0, 5).map((entry) => (
                <View key={entry.id} style={styles.entryItem}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                    {entry.notes && (
                      <Text style={styles.entryNotes}>{entry.notes}</Text>
                    )}
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={styles.entryWeight}>{entry.weight} kg</Text>
                    {entry.waistSize && (
                      <Text style={styles.entryWaist}>{entry.waistSize} cm</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 İpuçları</Text>
          <Text style={styles.tipsText}>
            • Kilonuzu haftada 1-2 kez, aynı saatte ölçün{'\n'}
            • Sabah, tuvalete gittikten sonra ölçüm yapın{'\n'}
            • Bel ölçüsü kilo kaybından daha iyi gösterge olabilir{'\n'}
            • Fotoğraflar görsel ilerlemenizi takip etmenize yardımcı olur
          </Text>
        </Card>
      </ScrollView>

      {/* Progress Photo Modal */}
      <ProgressPhotoModal
        visible={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
      />
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  goalCard: {
    padding: 20,
    marginVertical: 24,
  },
  goalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  goalProgress: {
    marginBottom: 20,
  },
  goalProgressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#8FBC8F',
    borderRadius: 6,
  },
  goalProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  goalStat: {
    alignItems: 'center',
  },
  goalStatValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  remainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
  },
  remainingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8FBC8F',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    padding: 4,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  chartCard: {
    padding: 20,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  addEntryCard: {
    padding: 20,
    marginBottom: 24,
  },
  addEntryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addEntryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  photosCard: {
    padding: 20,
    marginBottom: 24,
  },
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  photosTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
  },
  photoButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  photosSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
  },
  entriesCard: {
    padding: 20,
    marginBottom: 24,
  },
  entriesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  noEntriesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noEntriesText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  noEntriesSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  entriesList: {
    gap: 12,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  entryLeft: {
    flex: 1,
  },
  entryDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  entryNotes: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryWeight: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8FBC8F',
    marginBottom: 2,
  },
  entryWaist: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tipsCard: {
    padding: 20,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
});
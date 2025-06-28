import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, RotateCcw, Star, Trash2 } from 'lucide-react-native';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { mealPlanApi } from '@/lib/api';
import { MealPlan } from '@/types';

export default function MealHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [favoritePlans, setFavoritePlans] = useState<string[]>([]);

  // Fetch user's meal plans
  const {
    data: mealPlans,
    loading: mealPlansLoading,
    error: mealPlansError,
    refetch: refetchMealPlans
  } = useApi(
    () => mealPlanApi.getUserMealPlans(user?.id || ''),
    [user?.id]
  );

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('tr-TR', { 
        day: '2-digit', 
        month: 'long' 
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getDaysAgo = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return `${Math.floor(diffDays / 30)} ay önce`;
  };

  const isCurrentPlan = (plan: MealPlan) => {
    const now = new Date();
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    return now >= start && now <= end;
  };

  const toggleFavorite = (planId: string) => {
    setFavoritePlans(prev =>
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const reusePlan = async (plan: MealPlan) => {
    try {
      // Create a new plan with the same daily meals but new dates
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { error } = await mealPlanApi.createMealPlan(user?.id || '', {
        startDate,
        endDate,
        dailyMeals: plan.dailyMeals,
      });

      if (error) {
        Alert.alert('Hata', 'Plan yeniden kullanılırken bir hata oluştu.');
        return;
      }

      Alert.alert(
        'Başarılı!',
        'Plan aktif haftanıza kopyalandı.',
        [
          { text: 'Tamam', onPress: () => router.replace('/(tabs)') }
        ]
      );
    } catch (error) {
      console.error('Error reusing plan:', error);
      Alert.alert('Hata', 'Beklenmeyen bir hata oluştu.');
    }
  };

  const deletePlan = async (planId: string) => {
    Alert.alert(
      'Planı Sil',
      'Bu planı kalıcı olarak silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await mealPlanApi.deleteMealPlan(planId);
              
              if (error) {
                Alert.alert('Hata', 'Plan silinirken bir hata oluştu.');
                return;
              }

              await refetchMealPlans();
              Alert.alert('Başarılı!', 'Plan silindi.');
            } catch (error) {
              console.error('Error deleting plan:', error);
              Alert.alert('Hata', 'Beklenmeyen bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const PlanCard = ({ plan }: { plan: MealPlan }) => {
    const isCurrent = isCurrentPlan(plan);
    const isFavorite = favoritePlans.includes(plan.mealPlanID);
    const daysAgo = getDaysAgo(plan.startDate);
    const dateRange = formatDateRange(plan.startDate, plan.endDate);

    return (
      <Card variant="elevated" style={[styles.planCard, isCurrent && styles.currentPlanCard]}>
        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <View style={styles.planTitleRow}>
              <Text style={styles.planTitle}>
                {isCurrent ? 'Aktif Plan' : 'Geçmiş Plan'}
              </Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Aktif</Text>
                </View>
              )}
            </View>
            <Text style={styles.planDate}>{dateRange}</Text>
            <Text style={styles.planDaysAgo}>{daysAgo}</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={() => toggleFavorite(plan.mealPlanID)}
          >
            <Star 
              size={16} 
              color={isFavorite ? "#FFFFFF" : "#6B7280"} 
              fill={isFavorite ? "#FFFFFF" : "none"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.planStats}>
          <View style={styles.planStat}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.planStatText}>{plan.dailyMeals.length} gün</Text>
          </View>
          <View style={styles.planStat}>
            <Text style={styles.planStatText}>
              {plan.dailyMeals.reduce((total, day) => {
                let meals = 0;
                if (day.breakfast) meals++;
                if (day.lunch) meals++;
                if (day.dinner) meals++;
                if (day.snack) meals++;
                return total + meals;
              }, 0)} öğün
            </Text>
          </View>
        </View>

        <View style={styles.planActions}>
          {!isCurrent && (
            <Button
              title="Yeniden Kullan"
              onPress={() => reusePlan(plan)}
              variant="outline"
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
            />
          )}
          
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push(`/plan-details/${plan.mealPlanID}`)}
          >
            <Text style={styles.viewButtonText}>Görüntüle</Text>
          </TouchableOpacity>
          
          {!isCurrent && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePlan(plan.mealPlanID)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  if (mealPlansLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#8FBC8F" />
          <Text style={styles.loadingText}>Planlar yükleniyor...</Text>
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
        <Text style={styles.headerTitle}>Geçmiş Planlarım</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mealPlansError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Planlar yüklenirken hata oluştu</Text>
            <Button
              title="Tekrar Dene"
              onPress={() => refetchMealPlans()}
              style={styles.retryButton}
            />
          </View>
        ) : !mealPlans || mealPlans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Henüz plan geçmişiniz yok</Text>
            <Text style={styles.emptyText}>
              İlk beslenme planınızı oluşturduktan sonra burada görüntüleyebileceksiniz.
            </Text>
            <Button
              title="Yeni Plan Oluştur"
              onPress={() => router.push('/plan-generator')}
              style={styles.createPlanButton}
            />
          </View>
        ) : (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>📊 Plan Özeti</Text>
              <Text style={styles.summaryText}>
                Toplam {mealPlans.length} plan • {favoritePlans.length} favori
              </Text>
            </View>

            <View style={styles.plansList}>
              {mealPlans.map(plan => (
                <PlanCard key={plan.mealPlanID} plan={plan} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  createPlanButton: {
    paddingHorizontal: 32,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  plansList: {
    gap: 16,
    paddingBottom: 32,
  },
  planCard: {
    padding: 20,
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: '#8FBC8F',
    backgroundColor: '#F0F9F0',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 8,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#8FBC8F',
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  planDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    marginBottom: 2,
  },
  planDaysAgo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#F59E0B',
  },
  planStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  planStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  planActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8FBC8F',
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
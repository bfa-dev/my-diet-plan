import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react-native';
import { MealCard } from '@/components/MealCard';
import { WeeklyProgress } from '@/components/WeeklyProgress';
import { NutritionSummary } from '@/components/NutritionSummary';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { recipeApi, mealPlanApi } from '@/lib/api';
import { Recipe, MealPlan } from '@/types';

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

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

  // Fetch all recipes
  const {
    data: recipes,
    loading: recipesLoading,
    error: recipesError
  } = useApi(
    () => recipeApi.getAllRecipes(),
    []
  );

  // Get current meal plan (most recent one)
  const currentMealPlan = mealPlans?.[0];
  const currentDay = currentMealPlan?.dailyMeals[currentDayIndex];

  // Find recipes for current day
  const breakfastRecipe = recipes?.find(r => r.recipeID === currentDay?.breakfast);
  const lunchRecipe = recipes?.find(r => r.recipeID === currentDay?.lunch);
  const dinnerRecipe = recipes?.find(r => r.recipeID === currentDay?.dinner);

  const navigateDay = (direction: 'prev' | 'next') => {
    if (!currentMealPlan) return;
    
    if (direction === 'prev' && currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    } else if (direction === 'next' && currentDayIndex < currentMealPlan.dailyMeals.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const formatDate = () => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + currentDayIndex);
    
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'long', 
      weekday: 'long' 
    };
    return targetDate.toLocaleDateString('tr-TR', options);
  };

  // Calculate daily nutrition totals
  const dailyNutrition = {
    calories: (breakfastRecipe?.calories || 0) + (lunchRecipe?.calories || 0) + (dinnerRecipe?.calories || 0),
    protein: (breakfastRecipe?.protein_grams || 0) + (lunchRecipe?.protein_grams || 0) + (dinnerRecipe?.protein_grams || 0),
    carbs: (breakfastRecipe?.carbs_grams || 0) + (lunchRecipe?.carbs_grams || 0) + (dinnerRecipe?.carbs_grams || 0),
    fat: (breakfastRecipe?.fat_grams || 0) + (lunchRecipe?.fat_grams || 0) + (dinnerRecipe?.fat_grams || 0),
    targetCalories: 1800,
    targetProtein: 120,
    targetCarbs: 200,
    targetFat: 60,
  };

  // Loading state
  if (mealPlansLoading || recipesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#8FBC8F" />
          <Text style={styles.loadingText}>Planınız yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (mealPlansError || recipesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Bir hata oluştu</Text>
          <Text style={styles.errorText}>
            {mealPlansError || recipesError}
          </Text>
          <Button
            title="Tekrar Dene"
            onPress={() => {
              refetchMealPlans();
            }}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // No meal plan state
  if (!currentMealPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Merhaba! 👋</Text>
            <Text style={styles.headerTitle}>Beslenme Planınız</Text>
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Henüz bir planınız yok</Text>
          <Text style={styles.emptyText}>
            Size özel beslenme planı oluşturmak için başlayalım!
          </Text>
          <Button
            title="Yeni Plan Oluştur"
            onPress={() => router.push('/plan-generator')}
            style={styles.createPlanButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Merhaba! 👋</Text>
          <Text style={styles.headerTitle}>Bugünkü Planınız</Text>
        </View>
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={() => {/* Navigate to calendar view */}}
        >
          <Calendar size={20} color="#8FBC8F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <WeeklyProgress 
          completedDays={currentDayIndex + 1} 
          totalDays={currentMealPlan.dailyMeals.length} 
          currentStreak={3} 
        />

        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={[styles.navButton, currentDayIndex === 0 && styles.navButtonDisabled]}
            onPress={() => navigateDay('prev')}
            disabled={currentDayIndex === 0}
          >
            <ChevronLeft size={20} color={currentDayIndex === 0 ? "#D1D5DB" : "#6B7280"} />
          </TouchableOpacity>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.navButton, currentDayIndex === currentMealPlan.dailyMeals.length - 1 && styles.navButtonDisabled]}
            onPress={() => navigateDay('next')}
            disabled={currentDayIndex === currentMealPlan.dailyMeals.length - 1}
          >
            <ChevronRight size={20} color={currentDayIndex === currentMealPlan.dailyMeals.length - 1 ? "#D1D5DB" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        <NutritionSummary data={dailyNutrition} />

        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Günün Öğünleri</Text>
            <TouchableOpacity style={styles.addMealButton}>
              <Plus size={16} color="#8FBC8F" />
              <Text style={styles.addMealText}>Öğün Ekle</Text>
            </TouchableOpacity>
          </View>

          {breakfastRecipe && (
            <MealCard 
              recipe={breakfastRecipe} 
              mealTime="Kahvaltı" 
              onPress={() => router.push(`/recipe/${breakfastRecipe.recipeID}`)}
            />
          )}
          
          {lunchRecipe && (
            <MealCard 
              recipe={lunchRecipe} 
              mealTime="Öğle Yemeği" 
              onPress={() => router.push(`/recipe/${lunchRecipe.recipeID}`)}
            />
          )}
          
          {dinnerRecipe && (
            <MealCard 
              recipe={dinnerRecipe} 
              mealTime="Akşam Yemeği" 
              onPress={() => router.push(`/recipe/${dinnerRecipe.recipeID}`)}
            />
          )}
        </View>

        <View style={styles.quickActions}>
          <Button
            title="Yeni Plan Oluştur"
            onPress={() => router.push('/plan-generator')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Alışveriş Listesi"
            onPress={() => router.push('/(tabs)/grocery')}
            style={styles.actionButton}
          />
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  calendarButton: {
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
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
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
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  mealsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
  },
  addMealText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
});
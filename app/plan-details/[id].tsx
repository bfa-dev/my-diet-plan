import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, Flame, Users } from 'lucide-react-native';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { mealPlanApi, recipeApi } from '@/lib/api';
import { Recipe } from '@/types';

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Fetch user's meal plans
  const {
    data: mealPlans,
    loading: mealPlansLoading,
    error: mealPlansError,
  } = useApi(
    () => mealPlanApi.getUserMealPlans(user?.id || ''),
    [user?.id]
  );

  // Fetch all recipes
  const {
    data: recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useApi(
    () => recipeApi.getAllRecipes(),
    []
  );

  // Find the specific meal plan
  const mealPlan = mealPlans?.find(plan => plan.mealPlanID === id);
  const currentDay = mealPlan?.dailyMeals[selectedDayIndex];

  // Find recipes for current day
  const breakfastRecipe = recipes?.find(r => r.recipeID === currentDay?.breakfast);
  const lunchRecipe = recipes?.find(r => r.recipeID === currentDay?.lunch);
  const dinnerRecipe = recipes?.find(r => r.recipeID === currentDay?.dinner);
  const snackRecipe = currentDay?.snack ? recipes?.find(r => r.recipeID === currentDay.snack) : null;

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

  const MealCard = ({ recipe, mealTime }: { recipe: Recipe; mealTime: string }) => {
    const totalTime = recipe.prepTime_minutes + recipe.cookTime_minutes;

    return (
      <TouchableOpacity
        style={styles.mealCard}
        onPress={() => router.push(`/recipe/${recipe.recipeID}`)}
        activeOpacity={0.9}
      >
        <Card variant="elevated" style={styles.mealCardContainer}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTime}>{mealTime}</Text>
            <View style={styles.cuisineBadge}>
              <Text style={styles.cuisineBadgeText}>{recipe.cuisineType}</Text>
            </View>
          </View>
          
          <Text style={styles.mealTitle} numberOfLines={2}>{recipe.title}</Text>
          <Text style={styles.mealDescription} numberOfLines={2}>{recipe.description}</Text>
          
          <View style={styles.mealStats}>
            <View style={styles.mealStat}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.mealStatText}>{totalTime} dk</Text>
            </View>
            <View style={styles.mealStat}>
              <Flame size={12} color="#EF4444" />
              <Text style={styles.mealStatText}>{recipe.calories} kcal</Text>
            </View>
            <View style={styles.mealStat}>
              <Users size={12} color="#3B82F6" />
              <Text style={styles.mealStatText}>2 kişi</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (mealPlansLoading || recipesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#8FBC8F" />
          <Text style={styles.loadingText}>Plan detayları yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error or not found state
  if (mealPlansError || recipesError || !mealPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plan Detayları</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Plan bulunamadı</Text>
          <Text style={styles.errorText}>
            {mealPlansError || recipesError || 'Aradığınız plan mevcut değil.'}
          </Text>
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
        <Text style={styles.headerTitle}>Plan Detayları</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.planInfoCard}>
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>Beslenme Planı</Text>
            <Text style={styles.planDate}>
              {formatDateRange(mealPlan.startDate, mealPlan.endDate)}
            </Text>
            <View style={styles.planStats}>
              <View style={styles.planStat}>
                <Calendar size={16} color="#8FBC8F" />
                <Text style={styles.planStatText}>{mealPlan.dailyMeals.length} gün</Text>
              </View>
              <View style={styles.planStat}>
                <Text style={styles.planStatText}>
                  {mealPlan.dailyMeals.reduce((total, day) => {
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
          </View>
        </Card>

        {/* Day Navigation */}
        <View style={styles.dayNavigation}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.daysList}>
              {mealPlan.dailyMeals.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    selectedDayIndex === index && styles.dayButtonActive
                  ]}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    selectedDayIndex === index && styles.dayButtonTextActive
                  ]}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Current Day Meals */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>
            {currentDay?.day} Öğünleri
          </Text>

          {breakfastRecipe && (
            <MealCard recipe={breakfastRecipe} mealTime="Kahvaltı" />
          )}
          
          {lunchRecipe && (
            <MealCard recipe={lunchRecipe} mealTime="Öğle Yemeği" />
          )}
          
          {dinnerRecipe && (
            <MealCard recipe={dinnerRecipe} mealTime="Akşam Yemeği" />
          )}

          {snackRecipe && (
            <MealCard recipe={snackRecipe} mealTime="Ara Öğün" />
          )}
        </View>

        {/* Daily Nutrition Summary */}
        <Card style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Günlük Besin Değerleri</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {(breakfastRecipe?.calories || 0) + 
                 (lunchRecipe?.calories || 0) + 
                 (dinnerRecipe?.calories || 0) + 
                 (snackRecipe?.calories || 0)}
              </Text>
              <Text style={styles.nutritionLabel}>Kalori</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {Math.round((breakfastRecipe?.protein_grams || 0) + 
                           (lunchRecipe?.protein_grams || 0) + 
                           (dinnerRecipe?.protein_grams || 0) + 
                           (snackRecipe?.protein_grams || 0))}g
              </Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {Math.round((breakfastRecipe?.carbs_grams || 0) + 
                           (lunchRecipe?.carbs_grams || 0) + 
                           (dinnerRecipe?.carbs_grams || 0) + 
                           (snackRecipe?.carbs_grams || 0))}g
              </Text>
              <Text style={styles.nutritionLabel}>Karbonhidrat</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {Math.round((breakfastRecipe?.fat_grams || 0) + 
                           (lunchRecipe?.fat_grams || 0) + 
                           (dinnerRecipe?.fat_grams || 0) + 
                           (snackRecipe?.fat_grams || 0))}g
              </Text>
              <Text style={styles.nutritionLabel}>Yağ</Text>
            </View>
          </View>
        </Card>
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
    lineHeight: 24,
  },
  planInfoCard: {
    padding: 20,
    marginVertical: 24,
  },
  planInfo: {
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  planDate: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    marginBottom: 16,
  },
  planStats: {
    flexDirection: 'row',
    gap: 24,
  },
  planStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  dayNavigation: {
    marginBottom: 24,
  },
  daysList: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayButtonActive: {
    backgroundColor: '#8FBC8F',
    borderColor: '#8FBC8F',
  },
  dayButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  mealsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  mealCard: {
    marginBottom: 16,
  },
  mealCardContainer: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cuisineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
  },
  cuisineBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  mealTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 22,
  },
  mealDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  mealStats: {
    flexDirection: 'row',
    gap: 16,
  },
  mealStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  nutritionCard: {
    padding: 20,
    marginBottom: 32,
  },
  nutritionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#8FBC8F',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});
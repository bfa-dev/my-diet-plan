import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Heart, Sparkles, Clock, Flame, Users } from 'lucide-react-native';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { recipeApi } from '@/lib/api';
import { Recipe } from '@/types';

export default function RecipesTab() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);

  // Fetch all recipes
  const {
    data: recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useApi(() => recipeApi.getAllRecipes(), []);

  // Filter recipes based on search and filters
  const getFilteredRecipes = () => {
    if (!recipes) return [];

    let filtered = [...recipes];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => 
          ing.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Dietary filters
    if (selectedFilters.includes('vegetarian')) {
      filtered = filtered.filter(recipe => 
        !recipe.ingredients.some(ing => {
          const name = ing.ingredientName.toLowerCase();
          return name.includes('tavuk') || name.includes('et') || 
                 name.includes('balık') || name.includes('hindi');
        })
      );
    }

    if (selectedFilters.includes('vegan')) {
      filtered = filtered.filter(recipe => 
        !recipe.ingredients.some(ing => {
          const name = ing.ingredientName.toLowerCase();
          return name.includes('tavuk') || name.includes('et') || 
                 name.includes('balık') || name.includes('süt') ||
                 name.includes('peynir') || name.includes('yumurta') ||
                 name.includes('yoğurt') || name.includes('bal');
        })
      );
    }

    if (selectedFilters.includes('gluten-free')) {
      filtered = filtered.filter(recipe => 
        !recipe.ingredients.some(ing => {
          const name = ing.ingredientName.toLowerCase();
          return name.includes('bulgur') || name.includes('un') ||
                 name.includes('makarna') || name.includes('ekmek');
        })
      );
    }

    // Calorie filters
    if (selectedFilters.includes('low-calorie')) {
      filtered = filtered.filter(recipe => recipe.calories <= 300);
    }

    if (selectedFilters.includes('high-protein')) {
      filtered = filtered.filter(recipe => recipe.protein_grams >= 20);
    }

    if (selectedFilters.includes('quick')) {
      filtered = filtered.filter(recipe => 
        (recipe.prepTime_minutes + recipe.cookTime_minutes) <= 30
      );
    }

    // Cuisine filters
    if (selectedFilters.includes('turkish')) {
      filtered = filtered.filter(recipe => recipe.cuisineType === 'Turkish');
    }

    if (selectedFilters.includes('mediterranean')) {
      filtered = filtered.filter(recipe => recipe.cuisineType === 'Mediterranean');
    }

    // Sort by AI recommendation for user profile
    if (selectedFilters.includes('ai-recommended') && userProfile) {
      filtered = filtered.sort((a, b) => {
        const aScore = calculateRecommendationScore(a, userProfile);
        const bScore = calculateRecommendationScore(b, userProfile);
        return bScore - aScore;
      });
    }

    return filtered;
  };

  // Calculate recommendation score based on user profile
  const calculateRecommendationScore = (recipe: Recipe, profile: any): number => {
    let score = 0;

    // Goal-based scoring
    if (profile.primaryGoal === 'Lose Weight' && recipe.calories <= 400) score += 3;
    if (profile.primaryGoal === 'Gain Muscle' && recipe.protein_grams >= 25) score += 3;
    if (profile.primaryGoal === 'Maintain Weight' && recipe.calories >= 300 && recipe.calories <= 500) score += 2;

    // Dietary preferences
    profile.dietaryPreferences?.forEach((pref: string) => {
      if (pref === 'Vegetarian' && !recipe.ingredients.some(ing => 
        ing.ingredientName.toLowerCase().includes('et'))) score += 2;
      if (pref === 'Low-Carb' && recipe.carbs_grams <= 30) score += 2;
    });

    // Activity level
    if (profile.activityLevel === 'Active' && recipe.protein_grams >= 20) score += 1;
    if (profile.activityLevel === 'Sedentary' && recipe.calories <= 350) score += 1;

    return score;
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const toggleFavorite = (recipeId: string) => {
    setFavoriteRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const filteredRecipes = getFilteredRecipes();

  const filterOptions = [
    { id: 'ai-recommended', label: 'AI Önerisi', icon: '🤖', color: '#F59E0B' },
    { id: 'vegetarian', label: 'Vejetaryen', icon: '🥬', color: '#10B981' },
    { id: 'vegan', label: 'Vegan', icon: '🌱', color: '#10B981' },
    { id: 'gluten-free', label: 'Glutensiz', icon: '🌾', color: '#8B5CF6' },
    { id: 'low-calorie', label: 'Düşük Kalori', icon: '🔥', color: '#EF4444' },
    { id: 'high-protein', label: 'Yüksek Protein', icon: '💪', color: '#3B82F6' },
    { id: 'quick', label: 'Hızlı (≤30dk)', icon: '⚡', color: '#F59E0B' },
    { id: 'turkish', label: 'Türk Mutfağı', icon: '🇹🇷', color: '#DC2626' },
    { id: 'mediterranean', label: 'Akdeniz', icon: '🫒', color: '#059669' },
  ];

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const totalTime = recipe.prepTime_minutes + recipe.cookTime_minutes;
    const isFavorite = favoriteRecipes.includes(recipe.recipeID);
    const isAiRecommended = userProfile && calculateRecommendationScore(recipe, userProfile) >= 3;

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => router.push(`/recipe/${recipe.recipeID}`)}
        activeOpacity={0.9}
      >
        <Card variant="elevated" style={styles.cardContainer}>
          <View style={styles.recipeImageContainer}>
            <View style={styles.recipeImage}>
              <Text style={styles.recipeImagePlaceholder}>🍽️</Text>
            </View>
            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(recipe.recipeID);
              }}
            >
              <Heart 
                size={16} 
                color={isFavorite ? "#FFFFFF" : "#6B7280"} 
                fill={isFavorite ? "#FFFFFF" : "none"}
              />
            </TouchableOpacity>
            {isAiRecommended && (
              <View style={styles.aiRecommendedBadge}>
                <Sparkles size={12} color="#F59E0B" />
                <Text style={styles.aiRecommendedText}>AI</Text>
              </View>
            )}
          </View>
          
          <View style={styles.recipeContent}>
            <View style={styles.recipeHeader}>
              <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
              <View style={styles.cuisineBadge}>
                <Text style={styles.cuisineBadgeText}>{recipe.cuisineType}</Text>
              </View>
            </View>
            
            <Text style={styles.recipeDescription} numberOfLines={2}>
              {recipe.description}
            </Text>
            
            <View style={styles.recipeStats}>
              <View style={styles.recipeStat}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.recipeStatText}>{totalTime}dk</Text>
              </View>
              <View style={styles.recipeStat}>
                <Flame size={12} color="#EF4444" />
                <Text style={styles.recipeStatText}>{recipe.calories} kcal</Text>
              </View>
              <View style={styles.recipeStat}>
                <Users size={12} color="#3B82F6" />
                <Text style={styles.recipeStatText}>2 kişi</Text>
              </View>
            </View>
            
            <View style={styles.macroInfo}>
              <Text style={styles.macroText}>P: {recipe.protein_grams}g</Text>
              <Text style={styles.macroText}>K: {recipe.carbs_grams}g</Text>
              <Text style={styles.macroText}>Y: {recipe.fat_grams}g</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (recipesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={32} color="#8FBC8F" />
          <Text style={styles.loadingText}>Tarifler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tarifler</Text>
        <TouchableOpacity
          style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? "#8FBC8F" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tarif veya malzeme ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersList}>
              {filterOptions.map(filter => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    selectedFilters.includes(filter.id) && styles.filterChipActive
                  ]}
                  onPress={() => toggleFilter(filter.id)}
                >
                  <Text style={styles.filterEmoji}>{filter.icon}</Text>
                  <Text style={[
                    styles.filterText,
                    selectedFilters.includes(filter.id) && styles.filterTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredRecipes.length} tarif bulundu
        </Text>
        {selectedFilters.includes('ai-recommended') && (
          <View style={styles.aiIndicator}>
            <Sparkles size={14} color="#F59E0B" />
            <Text style={styles.aiIndicatorText}>Size özel sıralama</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.recipesList} showsVerticalScrollIndicator={false}>
        {recipesError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Tarifler yüklenirken hata oluştu</Text>
          </View>
        ) : filteredRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Tarif bulunamadı</Text>
            <Text style={styles.emptyText}>
              Arama kriterlerinizi değiştirmeyi deneyin
            </Text>
          </View>
        ) : (
          <View style={styles.recipesGrid}>
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.recipeID} recipe={recipe} />
            ))}
          </View>
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleActive: {
    backgroundColor: '#F0F9F0',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersList: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#F0F9F0',
    borderColor: '#8FBC8F',
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#8FBC8F',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  aiIndicatorText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
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
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  recipesList: {
    flex: 1,
  },
  recipesGrid: {
    padding: 24,
    gap: 16,
  },
  recipeCard: {
    marginBottom: 16,
  },
  cardContainer: {
    overflow: 'hidden',
  },
  recipeImageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeImagePlaceholder: {
    fontSize: 32,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#EF4444',
  },
  aiRecommendedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  aiRecommendedText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    lineHeight: 22,
    marginRight: 8,
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
  recipeDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  recipeStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  recipeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeStatText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  macroInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
});
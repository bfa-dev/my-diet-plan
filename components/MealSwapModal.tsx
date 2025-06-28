import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, Sparkles, Filter } from 'lucide-react-native';
import { Recipe } from '@/types';
import { MealCard } from './MealCard';
import { Button } from './ui/Button';
import { useApi } from '@/hooks/useApi';
import { recipeApi } from '@/lib/api';
import { isGeminiConfigured } from '@/lib/geminiApi';

interface MealSwapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  currentRecipe: Recipe;
  mealType: string;
  targetCalories?: number;
  userDietaryPreferences?: string[];
}

export function MealSwapModal({
  visible,
  onClose,
  onSelectRecipe,
  currentRecipe,
  mealType,
  targetCalories = 0,
  userDietaryPreferences = [],
}: MealSwapModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch all recipes
  const {
    data: allRecipes,
    loading: recipesLoading,
    error: recipesError,
  } = useApi(() => recipeApi.getAllRecipes(), []);

  // Filter recipes based on criteria
  const getFilteredRecipes = () => {
    if (!allRecipes) return [];

    let filtered = allRecipes.filter(recipe => recipe.recipeID !== currentRecipe.recipeID);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Calorie range filter (+/- 100 kcal)
    if (targetCalories > 0) {
      filtered = filtered.filter(recipe => {
        const calorieDiff = Math.abs(recipe.calories - targetCalories);
        return calorieDiff <= 100;
      });
    }

    // Dietary preferences filter
    if (userDietaryPreferences.length > 0) {
      filtered = filtered.filter(recipe => {
        return userDietaryPreferences.every(preference => {
          switch (preference) {
            case 'Vegetarian':
              return !recipe.ingredients.some(ing => {
                const name = ing.ingredientName.toLowerCase();
                return name.includes('tavuk') || name.includes('et') || 
                       name.includes('balık') || name.includes('hindi');
              });
            case 'Vegan':
              return !recipe.ingredients.some(ing => {
                const name = ing.ingredientName.toLowerCase();
                return name.includes('tavuk') || name.includes('et') || 
                       name.includes('balık') || name.includes('süt') ||
                       name.includes('peynir') || name.includes('yumurta') ||
                       name.includes('yoğurt') || name.includes('bal');
              });
            case 'Gluten-Free':
              return !recipe.ingredients.some(ing => {
                const name = ing.ingredientName.toLowerCase();
                return name.includes('bulgur') || name.includes('un') ||
                       name.includes('makarna') || name.includes('ekmek');
              });
            case 'Low-Carb':
              return recipe.carbs_grams <= 30;
            default:
              return true;
          }
        });
      });
    }

    // Additional filters
    if (selectedFilters.includes('high-protein')) {
      filtered = filtered.filter(recipe => recipe.protein_grams >= 20);
    }
    if (selectedFilters.includes('low-calorie')) {
      filtered = filtered.filter(recipe => recipe.calories <= 300);
    }
    if (selectedFilters.includes('quick')) {
      filtered = filtered.filter(recipe => 
        (recipe.prepTime_minutes + recipe.cookTime_minutes) <= 30
      );
    }

    return filtered;
  };

  const handleAiRecommendation = async () => {
    if (!isGeminiConfigured) {
      alert('AI önerisi için Gemini API anahtarı gereklidir.');
      return;
    }

    setAiLoading(true);
    // TODO: Implement AI recommendation logic
    // This would call Gemini API to get a smart recommendation
    setTimeout(() => {
      setAiLoading(false);
      alert('AI önerisi özelliği yakında eklenecek!');
    }, 2000);
  };

  const filteredRecipes = getFilteredRecipes();

  const filterOptions = [
    { id: 'high-protein', label: 'Yüksek Protein', icon: '💪' },
    { id: 'low-calorie', label: 'Düşük Kalori', icon: '🔥' },
    { id: 'quick', label: 'Hızlı (≤30dk)', icon: '⚡' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>{mealType} Değiştir</Text>
              <Text style={styles.headerSubtitle}>
                {targetCalories > 0 && `~${targetCalories} kcal • `}
                {filteredRecipes.length} seçenek
              </Text>
            </View>
          </View>
          
          {isGeminiConfigured && (
            <TouchableOpacity
              style={styles.aiButton}
              onPress={handleAiRecommendation}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <ActivityIndicator size="small" color="#F59E0B" />
              ) : (
                <Sparkles size={16} color="#F59E0B" />
              )}
              <Text style={styles.aiButtonText}>
                {aiLoading ? 'Düşünüyor...' : 'AI Önerisi'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tarif ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? "#8FBC8F" : "#6B7280"} />
          </TouchableOpacity>
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

        <ScrollView style={styles.recipesList} showsVerticalScrollIndicator={false}>
          {recipesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8FBC8F" />
              <Text style={styles.loadingText}>Tarifler yükleniyor...</Text>
            </View>
          ) : recipesError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Tarifler yüklenirken hata oluştu</Text>
            </View>
          ) : filteredRecipes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Uygun tarif bulunamadı</Text>
              <Text style={styles.emptyText}>
                Arama kriterlerinizi değiştirmeyi deneyin
              </Text>
            </View>
          ) : (
            <View style={styles.recipesGrid}>
              {filteredRecipes.map(recipe => (
                <View key={recipe.recipeID} style={styles.recipeItem}>
                  <MealCard
                    recipe={recipe}
                    mealTime=""
                    onPress={() => onSelectRecipe(recipe)}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  aiButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  searchBar: {
    flex: 1,
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#F0F9F0',
    borderColor: '#8FBC8F',
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
  recipesList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 16,
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
  recipesGrid: {
    padding: 24,
  },
  recipeItem: {
    marginBottom: 16,
  },
});
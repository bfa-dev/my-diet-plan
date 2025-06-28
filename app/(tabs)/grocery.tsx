import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, RefreshCw } from 'lucide-react-native';
import { mockMealPlan, mockRecipes } from '@/data/mockData';
import { GroceryItem } from '@/types';

export default function GroceryTab() {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    generateGroceryList();
  }, []);

  const generateGroceryList = () => {
    const allIngredients: { [key: string]: { quantity: number; unit: string; category: string } } = {};

    // Collect all ingredients from the weekly meal plan
    mockMealPlan.dailyMeals.forEach(day => {
      [day.breakfast, day.lunch, day.dinner, day.snack].filter(Boolean).forEach(recipeId => {
        const recipe = mockRecipes.find(r => r.recipeID === recipeId);
        if (recipe) {
          recipe.ingredients.forEach(ingredient => {
            const key = ingredient.ingredientName.toLowerCase();
            if (allIngredients[key]) {
              // If same unit, add quantities
              if (allIngredients[key].unit === ingredient.unit) {
                allIngredients[key].quantity += ingredient.quantity;
              } else {
                // If different units, create separate entries
                const newKey = `${key}_${ingredient.unit}`;
                allIngredients[newKey] = {
                  quantity: ingredient.quantity,
                  unit: ingredient.unit,
                  category: getCategoryForIngredient(ingredient.ingredientName),
                };
              }
            } else {
              allIngredients[key] = {
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                category: getCategoryForIngredient(ingredient.ingredientName),
              };
            }
          });
        }
      });
    });

    // Convert to grocery list format
    const groceryList: GroceryItem[] = Object.entries(allIngredients).map(([name, data]) => ({
      ingredientName: name.includes('_') ? name.split('_')[0] : name,
      quantity: data.quantity,
      unit: data.unit,
      category: data.category,
      checked: false,
    }));

    setGroceryItems(groceryList);
  };

  const getCategoryForIngredient = (ingredientName: string): string => {
    const categories = {
      'Sebze & Meyve': ['domates', 'salatalık', 'soğan', 'havuç', 'patates', 'limon', 'yeşil biber', 'kırmızı soğan', 'dereotu', 'enginar'],
      'Et & Tavuk': ['tavuk', 'et', 'balık'],
      'Süt Ürünleri': ['süt', 'yoğurt', 'peynir', 'beyaz peynir', 'yumurta'],
      'Bakliyat & Tahıllar': ['mercimek', 'nohut', 'fasulye', 'bulgur', 'pirinç', 'kırmızı mercimek'],
      'Yağlar & Soslar': ['zeytinyağı', 'tereyağı', 'sirke'],
      'Baharatlar': ['tuz', 'karabiber', 'kimyon', 'pul biber'],
      'Diğer': []
    };

    for (const [category, ingredients] of Object.entries(categories)) {
      if (ingredients.some(ing => ingredientName.toLowerCase().includes(ing))) {
        return category;
      }
    }
    return 'Diğer';
  };

  const toggleItem = (index: number) => {
    const newItems = [...groceryItems];
    newItems[index].checked = !newItems[index].checked;
    setGroceryItems(newItems);
  };

  const groupedItems = groceryItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as { [key: string]: GroceryItem[] });

  const categoryEmojis: { [key: string]: string } = {
    'Sebze & Meyve': '🥬',
    'Et & Tavuk': '🥩',
    'Süt Ürünleri': '🥛',
    'Bakliyat & Tahıllar': '🌾',
    'Yağlar & Soslar': '🫒',
    'Baharatlar': '🌶️',
    'Diğer': '🛒'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alışveriş Listesi</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={generateGroceryList}
        >
          <RefreshCw size={20} color="#8FBC8F" />
          <Text style={styles.refreshText}>Yenile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Bu hafta için hazır!</Text>
        <Text style={styles.summaryText}>
          {groceryItems.length} malzeme • {Object.keys(groupedItems).length} kategori
        </Text>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryEmoji}>{categoryEmojis[category]}</Text>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.categoryCount}>({items.length})</Text>
            </View>
            
            {items.map((item, index) => {
              const globalIndex = groceryItems.findIndex(gi => 
                gi.ingredientName === item.ingredientName && 
                gi.unit === item.unit && 
                gi.quantity === item.quantity
              );
              
              return (
                <TouchableOpacity
                  key={`${item.ingredientName}-${item.unit}-${index}`}
                  style={[styles.listItem, item.checked && styles.listItemChecked]}
                  onPress={() => toggleItem(globalIndex)}
                >
                  <View style={styles.itemContent}>
                    <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                      {item.checked && <Check size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                      {item.ingredientName.charAt(0).toUpperCase() + item.ingredientName.slice(1)}
                    </Text>
                  </View>
                  <Text style={[styles.itemQuantity, item.checked && styles.itemQuantityChecked]}>
                    {item.quantity} {item.unit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomCard}>
        <Text style={styles.tipTitle}>💡 İpucu</Text>
        <Text style={styles.tipText}>
          Alışverişten önce tüm malzemeleri kontrol edin. Eksik olan malzemeleri işaretleyerek daha verimli alışveriş yapabilirsiniz.
        </Text>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0F9F0',
  },
  refreshText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  summaryCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8FBC8F',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listItemChecked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#8FBC8F',
    borderColor: '#8FBC8F',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  itemQuantityChecked: {
    color: '#9CA3AF',
  },
  bottomCard: {
    marginHorizontal: 24,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
  },
});
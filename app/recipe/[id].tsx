import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, ChefHat, Flame, Users } from 'lucide-react-native';
import { mockRecipes } from '@/data/mockData';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const recipe = mockRecipes.find(r => r.recipeID === id);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Tarif bulunamadı</Text>
      </SafeAreaView>
    );
  }

  const totalTime = recipe.prepTime_minutes + recipe.cookTime_minutes;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.photoURL }} style={styles.recipeImage} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.description}>{recipe.description}</Text>
            
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{recipe.cuisineType}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Clock size={20} color="#8FBC8F" />
              <Text style={styles.statLabel}>Toplam Süre</Text>
              <Text style={styles.statValue}>{totalTime} dk</Text>
            </View>
            <View style={styles.statCard}>
              <Flame size={20} color="#EF4444" />
              <Text style={styles.statLabel}>Kalori</Text>
              <Text style={styles.statValue}>{recipe.calories} kcal</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={20} color="#3B82F6" />
              <Text style={styles.statLabel}>Porsiyon</Text>
              <Text style={styles.statValue}>2 kişi</Text>
            </View>
          </View>

          <View style={styles.nutritionContainer}>
            <Text style={styles.sectionTitle}>Besin Değerleri</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.protein_grams}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.carbs_grams}g</Text>
                <Text style={styles.nutritionLabel}>Karbonhidrat</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.fat_grams}g</Text>
                <Text style={styles.nutritionLabel}>Yağ</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Malzemeler</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hazırlanışı</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipCard}>
            <ChefHat size={20} color="#8FBC8F" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Şef İpucu</Text>
              <Text style={styles.tipText}>
                En iyi sonuç için malzemelerin taze olmasına dikkat edin ve pişirme sürelerine uyun.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  nutritionContainer: {
    marginBottom: 24,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    paddingVertical: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8FBC8F',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8FBC8F',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8FBC8F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 24,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    marginTop: 8,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8FBC8F',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});
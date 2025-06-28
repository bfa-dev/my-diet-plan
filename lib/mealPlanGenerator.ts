import { Recipe, User, DailyMeal } from '@/types';
import { 
  generateMealPlanWithRetry, 
  convertGeminiMealPlanToAppFormat, 
  isGeminiConfigured 
} from './geminiApi';

// Calorie calculation using Mifflin-St Jeor equation
export const calculateDailyCalories = (user: User): number => {
  // Base Metabolic Rate calculation
  let bmr: number;
  
  if (user.gender === 'Male') {
    bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age - 161;
  }

  // Activity level multipliers
  const activityMultipliers = {
    'Sedentary': 1.2,    // Little to no exercise
    'Light': 1.375,      // Light exercise 1-3 days/week
    'Moderate': 1.55,    // Moderate exercise 3-5 days/week
    'Active': 1.725,     // Heavy exercise 6-7 days/week
  };

  const tdee = bmr * activityMultipliers[user.activityLevel];

  // Goal-based calorie adjustments
  switch (user.primaryGoal) {
    case 'Lose Weight':
      return Math.round(tdee - 500); // 500 calorie deficit for ~1lb/week loss
    case 'Gain Muscle':
      return Math.round(tdee + 300); // 300 calorie surplus for muscle gain
    default:
      return Math.round(tdee); // Maintain current weight
  }
};

// Calculate macro targets based on goal
export const calculateMacroTargets = (user: User, totalCalories: number) => {
  let proteinRatio: number;
  let carbRatio: number;
  let fatRatio: number;

  switch (user.primaryGoal) {
    case 'Lose Weight':
      proteinRatio = 0.35; // Higher protein for satiety and muscle preservation
      carbRatio = 0.35;
      fatRatio = 0.30;
      break;
    case 'Gain Muscle':
      proteinRatio = 0.30; // High protein for muscle building
      carbRatio = 0.45;    // Higher carbs for energy
      fatRatio = 0.25;
      break;
    default: // Maintain Weight
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.30;
      break;
  }

  return {
    protein: Math.round((totalCalories * proteinRatio) / 4), // 4 calories per gram
    carbs: Math.round((totalCalories * carbRatio) / 4),     // 4 calories per gram
    fat: Math.round((totalCalories * fatRatio) / 9),        // 9 calories per gram
  };
};

// Filter recipes based on dietary preferences
export const filterRecipesByDiet = (recipes: Recipe[], dietaryPreferences: string[]): Recipe[] => {
  if (!dietaryPreferences.length) return recipes;

  return recipes.filter(recipe => {
    // Check each dietary preference
    for (const preference of dietaryPreferences) {
      switch (preference) {
        case 'Vegetarian':
          // Exclude recipes with meat, poultry, fish
          const hasMeat = recipe.ingredients.some(ing => {
            const name = ing.ingredientName.toLowerCase();
            return name.includes('tavuk') || name.includes('et') || 
                   name.includes('balık') || name.includes('hindi') ||
                   name.includes('kuzu') || name.includes('dana');
          });
          if (hasMeat) return false;
          break;

        case 'Vegan':
          // Exclude all animal products
          const hasAnimalProduct = recipe.ingredients.some(ing => {
            const name = ing.ingredientName.toLowerCase();
            return name.includes('tavuk') || name.includes('et') || 
                   name.includes('balık') || name.includes('süt') ||
                   name.includes('peynir') || name.includes('yumurta') ||
                   name.includes('yoğurt') || name.includes('tereyağı') ||
                   name.includes('bal');
          });
          if (hasAnimalProduct) return false;
          break;

        case 'Gluten-Free':
          // Exclude recipes with gluten-containing ingredients
          const hasGluten = recipe.ingredients.some(ing => {
            const name = ing.ingredientName.toLowerCase();
            return name.includes('bulgur') || name.includes('un') ||
                   name.includes('makarna') || name.includes('ekmek') ||
                   name.includes('buğday');
          });
          if (hasGluten) return false;
          break;

        case 'Lactose-Intolerant':
          // Exclude dairy products
          const hasDairy = recipe.ingredients.some(ing => {
            const name = ing.ingredientName.toLowerCase();
            return name.includes('süt') || name.includes('peynir') ||
                   name.includes('yoğurt') || name.includes('tereyağı') ||
                   name.includes('krema');
          });
          if (hasDairy) return false;
          break;

        case 'Nut-Allergy':
          // Exclude nuts and nut products
          const hasNuts = recipe.ingredients.some(ing => {
            const name = ing.ingredientName.toLowerCase();
            return name.includes('ceviz') || name.includes('badem') ||
                   name.includes('fındık') || name.includes('fıstık') ||
                   name.includes('chia') || name.includes('susam');
          });
          if (hasNuts) return false;
          break;

        case 'Low-Carb':
          // Exclude high-carb recipes (>30g carbs)
          if (recipe.carbs_grams > 30) return false;
          break;

        case 'Low-Sodium':
          // This would require sodium content data, skip for now
          break;

        case 'Diabetic':
          // Exclude high-sugar, high-carb recipes
          if (recipe.carbs_grams > 25) return false;
          break;
      }
    }
    return true;
  });
};

// Categorize recipes by meal type based on calories and ingredients
export const categorizeRecipesByMeal = (recipes: Recipe[]) => {
  const breakfast: Recipe[] = [];
  const lunch: Recipe[] = [];
  const dinner: Recipe[] = [];
  const snacks: Recipe[] = [];

  recipes.forEach(recipe => {
    const calories = recipe.calories;
    const title = recipe.title.toLowerCase();
    const hasEggs = recipe.ingredients.some(ing => 
      ing.ingredientName.toLowerCase().includes('yumurta')
    );
    const isSmootie = title.includes('smoothie') || title.includes('bowl');
    const isSoup = title.includes('çorba') || title.includes('soup');
    const isSalad = title.includes('salata') || title.includes('salad');

    // Breakfast criteria: <400 calories OR contains eggs OR is smoothie/bowl
    if (calories < 400 || hasEggs || isSmootie) {
      breakfast.push(recipe);
    }

    // Lunch criteria: 300-600 calories OR is salad OR is soup
    if ((calories >= 300 && calories <= 600) || isSalad || isSoup) {
      lunch.push(recipe);
    }

    // Dinner criteria: 400-700 calories AND not breakfast items
    if (calories >= 400 && calories <= 700 && !hasEggs && !isSmootie) {
      dinner.push(recipe);
    }

    // Snacks: <250 calories
    if (calories < 250) {
      snacks.push(recipe);
    }
  });

  return { breakfast, lunch, dinner, snacks };
};

// Generate balanced meal plan using AI or fallback to rule-based
export const generatePersonalizedMealPlan = async (
  user: User, 
  existingRecipes: Recipe[],
  mealCount: number = 3 // 3 or 4 meals per day
): Promise<{ recipes: Recipe[]; dailyMeals: DailyMeal[] }> => {
  const targetCalories = calculateDailyCalories(user);
  
  console.log('🤖 Attempting to generate meal plan with Gemini AI...');
  
  // Try to generate with Gemini AI first
  if (isGeminiConfigured) {
    try {
      const { data: geminiPlan, error } = await generateMealPlanWithRetry(
        user, 
        targetCalories, 
        mealCount,
        2 // Max 2 retries
      );

      if (geminiPlan && !error) {
        console.log('✅ Successfully generated meal plan with Gemini AI');
        const { recipes, dailyMeals } = await convertGeminiMealPlanToAppFormat(geminiPlan, user.userID);
        return { recipes, dailyMeals };
      } else {
        console.warn('⚠️ Gemini AI failed, falling back to rule-based generation:', error);
      }
    } catch (error) {
      console.warn('⚠️ Gemini AI error, falling back to rule-based generation:', error);
    }
  } else {
    console.log('🔧 Gemini not configured, using rule-based generation');
  }

  // Fallback to rule-based generation
  console.log('🔄 Generating meal plan with rule-based algorithm...');
  return generateRuleBasedMealPlan(user, existingRecipes, mealCount);
};

// Fallback rule-based meal plan generation
const generateRuleBasedMealPlan = async (
  user: User, 
  recipes: Recipe[],
  mealCount: number = 3
): Promise<{ recipes: Recipe[]; dailyMeals: DailyMeal[] }> => {
  const targetCalories = calculateDailyCalories(user);
  const macroTargets = calculateMacroTargets(user, targetCalories);
  
  // Filter recipes based on dietary preferences
  const filteredRecipes = filterRecipesByDiet(recipes, user.dietaryPreferences);
  
  if (filteredRecipes.length === 0) {
    throw new Error('No recipes available for your dietary preferences');
  }

  // Categorize recipes by meal type
  const { breakfast, lunch, dinner, snacks } = categorizeRecipesByMeal(filteredRecipes);

  // Calorie distribution based on meal count
  let calorieDistribution: { [key: string]: number };
  
  if (mealCount === 4) {
    calorieDistribution = {
      breakfast: 0.25,  // 25%
      lunch: 0.30,      // 30%
      dinner: 0.30,     // 30%
      snack: 0.15,      // 15%
    };
  } else {
    calorieDistribution = {
      breakfast: 0.25,  // 25%
      lunch: 0.35,      // 35%
      dinner: 0.40,     // 40%
    };
  }

  const dailyMeals: DailyMeal[] = [];
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  for (const day of days) {
    const targetBreakfastCalories = targetCalories * calorieDistribution.breakfast;
    const targetLunchCalories = targetCalories * calorieDistribution.lunch;
    const targetDinnerCalories = targetCalories * calorieDistribution.dinner;

    // Select best matching recipes for each meal
    const selectedBreakfast = selectBestRecipe(breakfast, targetBreakfastCalories);
    const selectedLunch = selectBestRecipe(lunch, targetLunchCalories);
    const selectedDinner = selectBestRecipe(dinner, targetDinnerCalories);

    let selectedSnack: Recipe | undefined;
    if (mealCount === 4) {
      const targetSnackCalories = targetCalories * calorieDistribution.snack!;
      selectedSnack = selectBestRecipe(snacks.length > 0 ? snacks : breakfast, targetSnackCalories);
    }

    dailyMeals.push({
      day,
      breakfast: selectedBreakfast?.recipeID || filteredRecipes[0]?.recipeID || '',
      lunch: selectedLunch?.recipeID || filteredRecipes[1]?.recipeID || '',
      dinner: selectedDinner?.recipeID || filteredRecipes[2]?.recipeID || '',
      snack: selectedSnack?.recipeID,
    });
  }

  return { recipes: filteredRecipes, dailyMeals };
};

// Select the best recipe based on target calories
const selectBestRecipe = (recipes: Recipe[], targetCalories: number): Recipe | undefined => {
  if (recipes.length === 0) return undefined;

  // Find recipe with calories closest to target
  return recipes.reduce((best, current) => {
    const bestDiff = Math.abs(best.calories - targetCalories);
    const currentDiff = Math.abs(current.calories - targetCalories);
    return currentDiff < bestDiff ? current : best;
  });
};

// Calculate nutrition summary for a day
export const calculateDayNutrition = (
  dailyMeal: DailyMeal, 
  recipes: Recipe[]
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} => {
  const breakfastRecipe = recipes.find(r => r.recipeID === dailyMeal.breakfast);
  const lunchRecipe = recipes.find(r => r.recipeID === dailyMeal.lunch);
  const dinnerRecipe = recipes.find(r => r.recipeID === dailyMeal.dinner);
  const snackRecipe = dailyMeal.snack ? recipes.find(r => r.recipeID === dailyMeal.snack) : null;

  return {
    calories: (breakfastRecipe?.calories || 0) + 
              (lunchRecipe?.calories || 0) + 
              (dinnerRecipe?.calories || 0) + 
              (snackRecipe?.calories || 0),
    protein: (breakfastRecipe?.protein_grams || 0) + 
             (lunchRecipe?.protein_grams || 0) + 
             (dinnerRecipe?.protein_grams || 0) + 
             (snackRecipe?.protein_grams || 0),
    carbs: (breakfastRecipe?.carbs_grams || 0) + 
           (lunchRecipe?.carbs_grams || 0) + 
           (dinnerRecipe?.carbs_grams || 0) + 
           (snackRecipe?.carbs_grams || 0),
    fat: (breakfastRecipe?.fat_grams || 0) + 
         (lunchRecipe?.fat_grams || 0) + 
         (dinnerRecipe?.fat_grams || 0) + 
         (snackRecipe?.fat_grams || 0),
  };
};

// Validate meal plan meets nutritional goals
export const validateMealPlan = (
  user: User,
  dailyMeals: DailyMeal[],
  recipes: Recipe[]
): {
  isValid: boolean;
  issues: string[];
  averageNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
} => {
  const targetCalories = calculateDailyCalories(user);
  const macroTargets = calculateMacroTargets(user, targetCalories);
  
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  const issues: string[] = [];

  // Calculate average nutrition across all days
  dailyMeals.forEach(day => {
    const dayNutrition = calculateDayNutrition(day, recipes);
    totalCalories += dayNutrition.calories;
    totalProtein += dayNutrition.protein;
    totalCarbs += dayNutrition.carbs;
    totalFat += dayNutrition.fat;
  });

  const avgCalories = totalCalories / dailyMeals.length;
  const avgProtein = totalProtein / dailyMeals.length;
  const avgCarbs = totalCarbs / dailyMeals.length;
  const avgFat = totalFat / dailyMeals.length;

  // Check if averages are within acceptable ranges (±15%)
  const calorieVariance = Math.abs(avgCalories - targetCalories) / targetCalories;
  const proteinVariance = Math.abs(avgProtein - macroTargets.protein) / macroTargets.protein;

  if (calorieVariance > 0.15) {
    issues.push(`Kalori hedefi ${targetCalories} kcal, ortalama ${Math.round(avgCalories)} kcal`);
  }

  if (proteinVariance > 0.20) {
    issues.push(`Protein hedefi ${macroTargets.protein}g, ortalama ${Math.round(avgProtein)}g`);
  }

  if (avgCalories < 1200) {
    issues.push('Günlük kalori çok düşük (minimum 1200 kcal önerilir)');
  }

  return {
    isValid: issues.length === 0,
    issues,
    averageNutrition: {
      calories: Math.round(avgCalories),
      protein: Math.round(avgProtein),
      carbs: Math.round(avgCarbs),
      fat: Math.round(avgFat),
    },
  };
};
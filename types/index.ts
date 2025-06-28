export interface User {
  userID: string;
  email: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight_kg: number;
  height_cm: number;
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active';
  primaryGoal: 'Lose Weight' | 'Maintain Weight' | 'Gain Muscle';
  dietaryPreferences: string[];
  isPremiumUser: boolean;
}

export interface Recipe {
  recipeID: string;
  title: string;
  description: string;
  cuisineType: 'Turkish' | 'Mediterranean';
  photoURL: string;
  prepTime_minutes: number;
  cookTime_minutes: number;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  ingredients: {
    ingredientName: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string[];
}

export interface DailyMeal {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack?: string;
}

export interface MealPlan {
  mealPlanID: string;
  userID: string;
  startDate: string;
  endDate: string;
  dailyMeals: DailyMeal[];
}

export interface GroceryItem {
  ingredientName: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
}
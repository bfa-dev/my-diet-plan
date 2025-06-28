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
  cuisineType: 'Turkish' | 'Mediterranean' | 'International';
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

// Database types for Supabase
export interface DatabaseProfile {
  id: string;
  email: string;
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  weight_kg?: number;
  height_cm?: number;
  activity_level?: 'Sedentary' | 'Light' | 'Moderate' | 'Active';
  primary_goal?: 'Lose Weight' | 'Maintain Weight' | 'Gain Muscle';
  dietary_preferences?: string[];
  is_premium_user?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseRecipe {
  id: string;
  title: string;
  description?: string;
  cuisine_type?: 'Turkish' | 'Mediterranean' | 'International';
  photo_url?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  calories?: number;
  protein_grams?: number;
  carbs_grams?: number;
  fat_grams?: number;
  ingredients?: any; // JSONB
  instructions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseMealPlan {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  daily_meals?: any; // JSONB
  created_at?: string;
  updated_at?: string;
}
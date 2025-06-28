import { supabase, isSupabaseConfigured } from './supabase';
import { Recipe, User, MealPlan, DailyMeal } from '@/types';
import { 
  generatePersonalizedMealPlan, 
  calculateDailyCalories, 
  calculateMacroTargets,
  validateMealPlan 
} from './mealPlanGenerator';

// API Response types
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading?: boolean;
}

// Profile API
export const profileApi = {
  async getProfile(userId: string): Promise<ApiResponse<User>> {
    if (!isSupabaseConfigured) {
      // Return mock data for development
      const mockUser: User = {
        userID: userId,
        email: 'demo@example.com',
        name: 'Demo User',
        age: 30,
        gender: 'Female',
        weight_kg: 65,
        height_cm: 165,
        activityLevel: 'Moderate',
        primaryGoal: 'Lose Weight',
        dietaryPreferences: [],
        isPremiumUser: false,
      };
      return { data: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: 'Profile not found' };
      }

      // Transform database response to User type
      const user: User = {
        userID: data.id,
        email: data.email,
        name: data.name || '',
        age: data.age || 0,
        gender: data.gender || 'Other',
        weight_kg: data.weight_kg || 0,
        height_cm: data.height_cm || 0,
        activityLevel: data.activity_level || 'Moderate',
        primaryGoal: data.primary_goal || 'Maintain Weight',
        dietaryPreferences: data.dietary_preferences || [],
        isPremiumUser: data.is_premium_user || false,
      };

      return { data: user, error: null };
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return { data: null, error: 'Failed to fetch profile' };
    }
  },

  async createProfile(userId: string, profileData: Partial<User>): Promise<ApiResponse<User>> {
    if (!isSupabaseConfigured) {
      // Return mock success for development
      const mockUser: User = {
        userID: userId,
        email: profileData.email || 'demo@example.com',
        name: profileData.name || 'Demo User',
        age: profileData.age || 30,
        gender: profileData.gender || 'Other',
        weight_kg: profileData.weight_kg || 65,
        height_cm: profileData.height_cm || 165,
        activityLevel: profileData.activityLevel || 'Moderate',
        primaryGoal: profileData.primaryGoal || 'Maintain Weight',
        dietaryPreferences: profileData.dietaryPreferences || [],
        isPremiumUser: false,
      };
      return { data: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: profileData.email,
          name: profileData.name,
          age: profileData.age,
          gender: profileData.gender,
          weight_kg: profileData.weight_kg,
          height_cm: profileData.height_cm,
          activity_level: profileData.activityLevel,
          primary_goal: profileData.primaryGoal,
          dietary_preferences: profileData.dietaryPreferences,
          is_premium_user: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return { data: null, error: error.message };
      }

      // Transform response to User type
      const user: User = {
        userID: data.id,
        email: data.email,
        name: data.name || '',
        age: data.age || 0,
        gender: data.gender || 'Other',
        weight_kg: data.weight_kg || 0,
        height_cm: data.height_cm || 0,
        activityLevel: data.activity_level || 'Moderate',
        primaryGoal: data.primary_goal || 'Maintain Weight',
        dietaryPreferences: data.dietary_preferences || [],
        isPremiumUser: data.is_premium_user || false,
      };

      return { data: user, error: null };
    } catch (error) {
      console.error('Unexpected error creating profile:', error);
      return { data: null, error: 'Failed to create profile' };
    }
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    if (!isSupabaseConfigured) {
      // Return mock success for development
      const mockUser: User = {
        userID: userId,
        email: updates.email || 'demo@example.com',
        name: updates.name || 'Demo User',
        age: updates.age || 30,
        gender: updates.gender || 'Other',
        weight_kg: updates.weight_kg || 65,
        height_cm: updates.height_cm || 165,
        activityLevel: updates.activityLevel || 'Moderate',
        primaryGoal: updates.primaryGoal || 'Maintain Weight',
        dietaryPreferences: updates.dietaryPreferences || [],
        isPremiumUser: updates.isPremiumUser || false,
      };
      return { data: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          age: updates.age,
          gender: updates.gender,
          weight_kg: updates.weight_kg,
          height_cm: updates.height_cm,
          activity_level: updates.activityLevel,
          primary_goal: updates.primaryGoal,
          dietary_preferences: updates.dietaryPreferences,
          is_premium_user: updates.isPremiumUser,
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { data: null, error: error.message };
      }

      // Transform response to User type
      const user: User = {
        userID: data.id,
        email: data.email,
        name: data.name || '',
        age: data.age || 0,
        gender: data.gender || 'Other',
        weight_kg: data.weight_kg || 0,
        height_cm: data.height_cm || 0,
        activityLevel: data.activity_level || 'Moderate',
        primaryGoal: data.primary_goal || 'Maintain Weight',
        dietaryPreferences: data.dietary_preferences || [],
        isPremiumUser: data.is_premium_user || false,
      };

      return { data: user, error: null };
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      return { data: null, error: 'Failed to update profile' };
    }
  },
};

// Recipe API
export const recipeApi = {
  async getAllRecipes(): Promise<ApiResponse<Recipe[]>> {
    if (!isSupabaseConfigured) {
      // Return mock recipes for development
      const { mockRecipes } = await import('@/data/mockData');
      return { data: mockRecipes, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        return { data: null, error: error.message };
      }

      // Transform database response to Recipe type
      const recipes: Recipe[] = data.map(recipe => ({
        recipeID: recipe.id,
        title: recipe.title,
        description: recipe.description || '',
        cuisineType: recipe.cuisine_type || 'International',
        photoURL: recipe.photo_url || '',
        prepTime_minutes: recipe.prep_time_minutes || 0,
        cookTime_minutes: recipe.cook_time_minutes || 0,
        calories: recipe.calories || 0,
        protein_grams: recipe.protein_grams || 0,
        carbs_grams: recipe.carbs_grams || 0,
        fat_grams: recipe.fat_grams || 0,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
      }));

      return { data: recipes, error: null };
    } catch (error) {
      console.error('Unexpected error fetching recipes:', error);
      return { data: null, error: 'Failed to fetch recipes' };
    }
  },

  async getRecipeById(recipeId: string): Promise<ApiResponse<Recipe>> {
    if (!isSupabaseConfigured) {
      // Return mock recipe for development
      const { mockRecipes } = await import('@/data/mockData');
      const recipe = mockRecipes.find(r => r.recipeID === recipeId);
      return { data: recipe || null, error: recipe ? null : 'Recipe not found' };
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: 'Recipe not found' };
      }

      // Transform database response to Recipe type
      const recipe: Recipe = {
        recipeID: data.id,
        title: data.title,
        description: data.description || '',
        cuisineType: data.cuisine_type || 'International',
        photoURL: data.photo_url || '',
        prepTime_minutes: data.prep_time_minutes || 0,
        cookTime_minutes: data.cook_time_minutes || 0,
        calories: data.calories || 0,
        protein_grams: data.protein_grams || 0,
        carbs_grams: data.carbs_grams || 0,
        fat_grams: data.fat_grams || 0,
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
      };

      return { data: recipe, error: null };
    } catch (error) {
      console.error('Unexpected error fetching recipe:', error);
      return { data: null, error: 'Failed to fetch recipe' };
    }
  },

  async getRecipesByCategory(category: string): Promise<ApiResponse<Recipe[]>> {
    if (!isSupabaseConfigured) {
      // Return filtered mock recipes for development
      const { mockRecipes } = await import('@/data/mockData');
      const filtered = mockRecipes.filter(r => r.cuisineType === category);
      return { data: filtered, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('cuisine_type', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes by category:', error);
        return { data: null, error: error.message };
      }

      // Transform database response to Recipe type
      const recipes: Recipe[] = data.map(recipe => ({
        recipeID: recipe.id,
        title: recipe.title,
        description: recipe.description || '',
        cuisineType: recipe.cuisine_type || 'International',
        photoURL: recipe.photo_url || '',
        prepTime_minutes: recipe.prep_time_minutes || 0,
        cookTime_minutes: recipe.cook_time_minutes || 0,
        calories: recipe.calories || 0,
        protein_grams: recipe.protein_grams || 0,
        carbs_grams: recipe.carbs_grams || 0,
        fat_grams: recipe.fat_grams || 0,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
      }));

      return { data: recipes, error: null };
    } catch (error) {
      console.error('Unexpected error fetching recipes by category:', error);
      return { data: null, error: 'Failed to fetch recipes' };
    }
  },
};

// Meal Plan API
export const mealPlanApi = {
  async getUserMealPlans(userId: string): Promise<ApiResponse<MealPlan[]>> {
    if (!isSupabaseConfigured) {
      // Return mock meal plan for development
      const { mockMealPlan } = await import('@/data/mockData');
      return { data: [mockMealPlan], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching meal plans:', error);
        return { data: null, error: error.message };
      }

      // Transform database response to MealPlan type
      const mealPlans: MealPlan[] = data.map(plan => ({
        mealPlanID: plan.id,
        userID: plan.user_id,
        startDate: plan.start_date,
        endDate: plan.end_date,
        dailyMeals: plan.daily_meals || [],
      }));

      return { data: mealPlans, error: null };
    } catch (error) {
      console.error('Unexpected error fetching meal plans:', error);
      return { data: null, error: 'Failed to fetch meal plans' };
    }
  },

  async createMealPlan(userId: string, mealPlan: Omit<MealPlan, 'mealPlanID' | 'userID'>): Promise<ApiResponse<MealPlan>> {
    if (!isSupabaseConfigured) {
      // Return mock success for development
      const mockMealPlan: MealPlan = {
        mealPlanID: 'mock-plan-id',
        userID: userId,
        startDate: mealPlan.startDate,
        endDate: mealPlan.endDate,
        dailyMeals: mealPlan.dailyMeals,
      };
      return { data: mockMealPlan, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: userId,
          start_date: mealPlan.startDate,
          end_date: mealPlan.endDate,
          daily_meals: mealPlan.dailyMeals,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating meal plan:', error);
        return { data: null, error: error.message };
      }

      // Transform response to MealPlan type
      const createdMealPlan: MealPlan = {
        mealPlanID: data.id,
        userID: data.user_id,
        startDate: data.start_date,
        endDate: data.end_date,
        dailyMeals: data.daily_meals || [],
      };

      return { data: createdMealPlan, error: null };
    } catch (error) {
      console.error('Unexpected error creating meal plan:', error);
      return { data: null, error: 'Failed to create meal plan' };
    }
  },

  async updateMealPlan(mealPlanId: string, updates: Partial<MealPlan>): Promise<ApiResponse<MealPlan>> {
    if (!isSupabaseConfigured) {
      // Return mock success for development
      const mockMealPlan: MealPlan = {
        mealPlanID: mealPlanId,
        userID: updates.userID || 'mock-user-id',
        startDate: updates.startDate || '2024-12-30',
        endDate: updates.endDate || '2025-01-05',
        dailyMeals: updates.dailyMeals || [],
      };
      return { data: mockMealPlan, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .update({
          start_date: updates.startDate,
          end_date: updates.endDate,
          daily_meals: updates.dailyMeals,
        })
        .eq('id', mealPlanId)
        .select()
        .single();

      if (error) {
        console.error('Error updating meal plan:', error);
        return { data: null, error: error.message };
      }

      // Transform response to MealPlan type
      const updatedMealPlan: MealPlan = {
        mealPlanID: data.id,
        userID: data.user_id,
        startDate: data.start_date,
        endDate: data.end_date,
        dailyMeals: data.daily_meals || [],
      };

      return { data: updatedMealPlan, error: null };
    } catch (error) {
      console.error('Unexpected error updating meal plan:', error);
      return { data: null, error: 'Failed to update meal plan' };
    }
  },

  async deleteMealPlan(mealPlanId: string): Promise<ApiResponse<boolean>> {
    if (!isSupabaseConfigured) {
      // Return mock success for development
      return { data: true, error: null };
    }

    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', mealPlanId);

      if (error) {
        console.error('Error deleting meal plan:', error);
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Unexpected error deleting meal plan:', error);
      return { data: false, error: 'Failed to delete meal plan' };
    }
  },

  async generatePersonalizedPlan(
    userId: string, 
    mealCount: number = 3,
    forceRefresh: boolean = false
  ): Promise<ApiResponse<MealPlan>> {
    try {
      // Check if user is premium for refresh capability
      const { data: user, error: userError } = await profileApi.getProfile(userId);
      if (userError || !user) {
        return { data: null, error: userError || 'User profile not found' };
      }

      // Check if user can refresh (premium or no existing plan)
      if (forceRefresh && !user.isPremiumUser) {
        const { data: existingPlans } = await this.getUserMealPlans(userId);
        if (existingPlans && existingPlans.length > 0) {
          return { data: null, error: 'Plan yenileme premium özelliğidir' };
        }
      }

      // Get all recipes
      const { data: recipes, error: recipesError } = await recipeApi.getAllRecipes();
      if (recipesError || !recipes) {
        return { data: null, error: recipesError || 'Failed to fetch recipes' };
      }

      // Generate personalized meal plan
      const dailyMeals = await generatePersonalizedMealPlan(user, recipes, mealCount);

      // Validate the meal plan
      const validation = validateMealPlan(user, dailyMeals, recipes);
      if (!validation.isValid) {
        console.warn('Generated meal plan has issues:', validation.issues);
        // Continue anyway, but log the issues
      }

      // Create date range (7 days starting from today)
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Create meal plan
      const mealPlanData = {
        startDate,
        endDate,
        dailyMeals,
      };

      return await this.createMealPlan(userId, mealPlanData);
    } catch (error) {
      console.error('Error generating personalized meal plan:', error);
      return { data: null, error: 'Failed to generate meal plan' };
    }
  },
};

// Auth integration helper
export const authApi = {
  async handleUserSignUp(user: any, metadata?: any): Promise<ApiResponse<User>> {
    if (!user?.id) {
      return { data: null, error: 'Invalid user data' };
    }

    // Create profile for new user
    const profileData: Partial<User> = {
      email: user.email,
      name: metadata?.name || user.user_metadata?.name || '',
      age: metadata?.age || 0,
      gender: metadata?.gender || 'Other',
      weight_kg: metadata?.weight_kg || 0,
      height_cm: metadata?.height_cm || 0,
      activityLevel: metadata?.activityLevel || 'Moderate',
      primaryGoal: metadata?.primaryGoal || 'Maintain Weight',
      dietaryPreferences: metadata?.dietaryPreferences || [],
    };

    return await profileApi.createProfile(user.id, profileData);
  },

  async createMinimalProfile(user: any): Promise<ApiResponse<User>> {
    if (!user?.id) {
      return { data: null, error: 'Invalid user data' };
    }

    // Create minimal profile that requires onboarding
    const profileData: Partial<User> = {
      email: user.email,
      name: '', // Empty to trigger onboarding
      age: 0,
      gender: 'Other',
      weight_kg: 0,
      height_cm: 0,
      activityLevel: 'Moderate',
      primaryGoal: 'Maintain Weight',
      dietaryPreferences: [],
    };

    return await profileApi.createProfile(user.id, profileData);
  },

  async updateUserProfile(userId: string, profileData: any): Promise<ApiResponse<User>> {
    const result = await profileApi.updateProfile(userId, profileData);
    
    // If profile update is successful and user has complete profile, generate meal plan
    if (result.data && result.data.name && result.data.age && result.data.weight_kg) {
      console.log('Profile complete, generating initial meal plan...');
      
      // Generate initial meal plan in the background
      mealPlanApi.generatePersonalizedPlan(userId, 3, false)
        .then(({ data, error }) => {
          if (error) {
            console.warn('Failed to generate initial meal plan:', error);
          } else {
            console.log('Initial meal plan generated successfully');
          }
        })
        .catch(error => {
          console.warn('Error generating initial meal plan:', error);
        });
    }
    
    return result;
  },

  async ensureUserProfile(user: any): Promise<ApiResponse<User>> {
    if (!user?.id) {
      return { data: null, error: 'Invalid user data' };
    }

    // Try to get existing profile
    const { data: existingProfile, error } = await profileApi.getProfile(user.id);
    
    if (existingProfile) {
      return { data: existingProfile, error: null };
    }

    // If no profile exists, create a minimal one
    if (error === 'Profile not found') {
      return await this.createMinimalProfile(user);
    }

    return { data: null, error };
  },

  async generateMealPlanForUser(userId: string): Promise<ApiResponse<MealPlan>> {
    return await mealPlanApi.generatePersonalizedPlan(userId, 3, false);
  },
};

// Nutrition calculation helpers
export const nutritionApi = {
  calculateDailyCalories,
  calculateMacroTargets,
  
  async getUserNutritionTargets(userId: string): Promise<ApiResponse<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>> {
    const { data: user, error } = await profileApi.getProfile(userId);
    
    if (error || !user) {
      return { data: null, error: error || 'User not found' };
    }

    const calories = calculateDailyCalories(user);
    const macros = calculateMacroTargets(user, calories);

    return {
      data: {
        calories,
        ...macros,
      },
      error: null,
    };
  },
};
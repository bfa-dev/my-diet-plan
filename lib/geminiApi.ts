import { User, Recipe, DailyMeal } from '@/types';

// Gemini API configuration
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface GeminiMealPlan {
  days: Array<{
    day: string;
    meals: {
      kahvalti?: GeminiRecipe;
      ogle_yemegi?: GeminiRecipe;
      aksam_yemegi?: GeminiRecipe;
      ara_ogun?: GeminiRecipe;
    };
  }>;
  total_weekly_calories: number;
  daily_average_calories: number;
}

interface GeminiRecipe {
  name: string;
  description: string;
  cuisine_type: 'Turkish' | 'Mediterranean' | 'International';
  prep_time_minutes: number;
  cook_time_minutes: number;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}

// Check if Gemini is configured
export const isGeminiConfigured = !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key';

// Generate meal plan prompt for Gemini
const generateMealPlanPrompt = (user: User, targetCalories: number, mealCount: number): string => {
  const dietaryRestrictions = user.dietaryPreferences.length > 0 
    ? user.dietaryPreferences.join(', ') 
    : 'Kısıtlama yok';

  const goalDescription = {
    'Lose Weight': 'kilo vermek',
    'Maintain Weight': 'kilosunu korumak',
    'Gain Muscle': 'kas yapmak'
  }[user.primaryGoal] || 'sağlıklı beslenme';

  const activityDescription = {
    'Sedentary': 'hareketsiz (masa başı işi)',
    'Light': 'az aktif (haftada 1-3 gün hafif egzersiz)',
    'Moderate': 'orta aktif (haftada 3-5 gün egzersiz)',
    'Active': 'çok aktif (haftada 6-7 gün yoğun egzersiz)'
  }[user.activityLevel] || 'orta aktif';

  const mealStructure = mealCount === 4 
    ? 'Kahvaltı, Öğle Yemeği, Akşam Yemeği ve Ara Öğün'
    : 'Kahvaltı, Öğle Yemeği ve Akşam Yemeği';

  return `Sen Türk ve Akdeniz mutfağı konusunda uzman bir diyetisyensin. Aşağıdaki kullanıcı profili için 7 günlük kişiselleştirilmiş beslenme planı oluştur:

KULLANICI PROFİLİ:
- İsim: ${user.name}
- Yaş: ${user.age}
- Cinsiyet: ${user.gender === 'Male' ? 'Erkek' : user.gender === 'Female' ? 'Kadın' : 'Diğer'}
- Kilo: ${user.weight_kg} kg
- Boy: ${user.height_cm} cm
- Aktivite Seviyesi: ${activityDescription}
- Hedef: ${goalDescription}
- Beslenme Kısıtlamaları: ${dietaryRestrictions}

HEDEF KALORI: ${targetCalories} kcal/gün
ÖĞÜN YAPISI: ${mealStructure}

GEREKSINIMLER:
1. Her gün için ${mealStructure} planla
2. Türk ve Akdeniz mutfağından tarifler kullan
3. Her tarif için detaylı malzeme listesi ve kısa pişirme talimatları ver
4. Kalori ve makro besin değerlerini hesapla
5. Beslenme kısıtlamalarına uygun tarifler seç
6. Günlük kalori hedefine yakın planlar oluştur

ÇIKTI FORMATI (JSON):
{
  "days": [
    {
      "day": "Pazartesi",
      "meals": {
        "kahvalti": {
          "name": "Tarif Adı",
          "description": "Kısa açıklama",
          "cuisine_type": "Turkish",
          "prep_time_minutes": 15,
          "cook_time_minutes": 10,
          "calories": 350,
          "protein_grams": 18,
          "carbs_grams": 45,
          "fat_grams": 12,
          "ingredients": [
            {"name": "Malzeme adı", "quantity": 2, "unit": "adet"}
          ],
          "instructions": ["Adım 1", "Adım 2"]
        },
        "ogle_yemegi": { /* aynı format */ },
        "aksam_yemegi": { /* aynı format */ }${mealCount === 4 ? ',\n        "ara_ogun": { /* aynı format */ }' : ''}
      }
    }
    // ... 7 gün için tekrar
  ],
  "total_weekly_calories": ${targetCalories * 7},
  "daily_average_calories": ${targetCalories}
}

Sadece JSON formatında yanıt ver, başka açıklama ekleme.`;
};

// Call Gemini API to generate meal plan
export const generateMealPlanWithGemini = async (
  user: User,
  targetCalories: number,
  mealCount: number = 3
): Promise<{ data: GeminiMealPlan | null; error: string | null }> => {
  if (!isGeminiConfigured) {
    return { 
      data: null, 
      error: 'Gemini API anahtarı yapılandırılmamış. Lütfen EXPO_PUBLIC_GEMINI_API_KEY ortam değişkenini ayarlayın.' 
    };
  }

  try {
    console.log('🤖 Generating meal plan with Gemini AI...');
    
    const prompt = generateMealPlanPrompt(user, targetCalories, mealCount);
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini API yanıt vermedi');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('🤖 Gemini response received, parsing JSON...');

    // Clean and parse JSON response
    let cleanedText = generatedText.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const mealPlan: GeminiMealPlan = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!mealPlan.days || !Array.isArray(mealPlan.days) || mealPlan.days.length !== 7) {
        throw new Error('Geçersiz meal plan yapısı: 7 gün bulunamadı');
      }

      console.log('✅ Meal plan generated successfully with Gemini AI');
      return { data: mealPlan, error: null };
      
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.error('Raw response:', cleanedText);
      throw new Error('Gemini yanıtı JSON formatında değil');
    }

  } catch (error) {
    console.error('❌ Error generating meal plan with Gemini:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Gemini ile plan oluşturulurken hata oluştu' 
    };
  }
};

// Convert Gemini meal plan to our app format
export const convertGeminiMealPlanToAppFormat = async (
  geminiPlan: GeminiMealPlan,
  userId: string
): Promise<{ recipes: Recipe[]; dailyMeals: DailyMeal[] }> => {
  const recipes: Recipe[] = [];
  const dailyMeals: DailyMeal[] = [];
  
  // Generate unique IDs for recipes
  let recipeIdCounter = 1;
  const recipeIdMap: { [key: string]: string } = {};

  geminiPlan.days.forEach((day, dayIndex) => {
    const dailyMeal: DailyMeal = {
      day: day.day,
      breakfast: '',
      lunch: '',
      dinner: '',
    };

    // Process each meal
    Object.entries(day.meals).forEach(([mealType, geminiRecipe]) => {
      if (!geminiRecipe) return;

      // Create unique recipe ID
      const recipeKey = `${geminiRecipe.name}-${dayIndex}-${mealType}`;
      let recipeId = recipeIdMap[recipeKey];
      
      if (!recipeId) {
        recipeId = `gemini-recipe-${Date.now()}-${recipeIdCounter++}`;
        recipeIdMap[recipeKey] = recipeId;

        // Convert Gemini recipe to our Recipe format
        const recipe: Recipe = {
          recipeID: recipeId,
          title: geminiRecipe.name,
          description: geminiRecipe.description,
          cuisineType: geminiRecipe.cuisine_type,
          photoURL: getDefaultPhotoForRecipe(geminiRecipe.name, geminiRecipe.cuisine_type),
          prepTime_minutes: geminiRecipe.prep_time_minutes,
          cookTime_minutes: geminiRecipe.cook_time_minutes,
          calories: geminiRecipe.calories,
          protein_grams: geminiRecipe.protein_grams,
          carbs_grams: geminiRecipe.carbs_grams,
          fat_grams: geminiRecipe.fat_grams,
          ingredients: geminiRecipe.ingredients.map(ing => ({
            ingredientName: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
          instructions: geminiRecipe.instructions,
        };

        recipes.push(recipe);
      }

      // Map meal types to our format
      switch (mealType) {
        case 'kahvalti':
          dailyMeal.breakfast = recipeId;
          break;
        case 'ogle_yemegi':
          dailyMeal.lunch = recipeId;
          break;
        case 'aksam_yemegi':
          dailyMeal.dinner = recipeId;
          break;
        case 'ara_ogun':
          dailyMeal.snack = recipeId;
          break;
      }
    });

    dailyMeals.push(dailyMeal);
  });

  return { recipes, dailyMeals };
};

// Get default photo URL based on recipe name and cuisine
const getDefaultPhotoForRecipe = (recipeName: string, cuisineType: string): string => {
  const name = recipeName.toLowerCase();
  
  // Map common Turkish/Mediterranean dishes to appropriate Pexels images
  if (name.includes('menemen') || name.includes('yumurta')) {
    return 'https://images.pexels.com/photos/7218637/pexels-photo-7218637.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (name.includes('çorba') || name.includes('soup')) {
    return 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (name.includes('salata') || name.includes('salad')) {
    return 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (name.includes('tavuk') || name.includes('chicken')) {
    return 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (name.includes('smoothie') || name.includes('bowl')) {
    return 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (name.includes('enginar') || name.includes('zeytinyağlı')) {
    return 'https://images.pexels.com/photos/8478108/pexels-photo-8478108.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (name.includes('pilav') || name.includes('rice')) {
    return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (name.includes('balık') || name.includes('fish')) {
    return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  
  // Default images based on cuisine type
  switch (cuisineType) {
    case 'Turkish':
      return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';
    case 'Mediterranean':
      return 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800';
    default:
      return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
};

// Retry mechanism for Gemini API calls
export const generateMealPlanWithRetry = async (
  user: User,
  targetCalories: number,
  mealCount: number = 3,
  maxRetries: number = 3
): Promise<{ data: GeminiMealPlan | null; error: string | null }> => {
  let lastError: string | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Gemini API attempt ${attempt}/${maxRetries}`);
    
    const result = await generateMealPlanWithGemini(user, targetCalories, mealCount);
    
    if (result.data) {
      return result;
    }
    
    lastError = result.error;
    
    if (attempt < maxRetries) {
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { data: null, error: lastError || 'Gemini API çağrısı başarısız oldu' };
};
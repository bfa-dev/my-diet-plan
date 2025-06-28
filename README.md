# AI-Powered Diet Plan App - Gemini Integration

A comprehensive nutrition planning app built with React Native, Expo Router, Supabase PostgreSQL backend, and Google Gemini AI for intelligent meal plan generation.

## 🤖 AI Features

### Google Gemini Integration
- **Real AI-Powered Meal Plans**: Uses Google Gemini Pro to generate personalized meal plans
- **Turkish & Mediterranean Cuisine**: AI specializes in Turkish and Mediterranean recipes
- **Intelligent Recipe Creation**: Generates new recipes based on user preferences and dietary restrictions
- **Fallback System**: Automatically falls back to rule-based generation if AI is unavailable
- **Retry Logic**: Implements exponential backoff for reliable AI API calls

### AI Capabilities
- **Personalized Prompts**: Generates detailed prompts based on user profile, goals, and restrictions
- **Nutritional Accuracy**: AI calculates calories and macros for each generated recipe
- **Dietary Compliance**: Respects all dietary preferences (vegetarian, gluten-free, etc.)
- **Cultural Authenticity**: Focuses on authentic Turkish and Mediterranean dishes
- **Recipe Validation**: Validates AI-generated content before saving to database

## 🚀 Features

### Backend & Database
- **PostgreSQL Database** with Supabase
- **Row Level Security (RLS)** for data protection
- **Real-time data synchronization**
- **Secure authentication** with token validation
- **API endpoints** for all CRUD operations

### Core Functionality
- **AI Meal Planning** with Google Gemini Pro
- **User Profiles** with health metrics and goals
- **Recipe Management** with nutrition information
- **Meal Planning** with weekly schedules
- **Grocery Lists** auto-generated from meal plans
- **Authentication** with email/password and social login

### Data Models
- **Users/Profiles**: Personal information, health metrics, goals
- **Recipes**: Detailed recipes with ingredients and nutrition (AI-generated + curated)
- **Meal Plans**: Weekly meal schedules linked to recipes

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo SDK 52
- **Expo Router** for navigation
- **TypeScript** for type safety
- **Custom hooks** for API integration

### Backend
- **Supabase** as Backend-as-a-Service
- **PostgreSQL** database
- **Row Level Security** for data protection
- **Real-time subscriptions**

### AI Integration
- **Google Gemini Pro** for meal plan generation
- **Custom prompt engineering** for Turkish/Mediterranean cuisine
- **Intelligent fallback** to rule-based generation
- **Recipe validation** and nutritional analysis

### API Layer
- **Custom API wrapper** with error handling
- **Loading states** and optimistic updates
- **Automatic fallback** to mock data in development
- **Type-safe** API calls with TypeScript

## 📁 Project Structure

```
├── supabase/
│   └── migrations/           # Database schema and seed data
├── lib/
│   ├── api.ts               # API layer with all endpoints
│   ├── supabase.ts          # Supabase client configuration
│   ├── geminiApi.ts         # Google Gemini AI integration
│   └── mealPlanGenerator.ts # AI + rule-based meal planning
├── hooks/
│   └── useApi.ts            # Custom hooks for API calls
├── contexts/
│   └── AuthContext.tsx      # Authentication state management
├── types/
│   └── index.ts             # TypeScript type definitions
└── app/                     # Expo Router pages
```

## 🤖 AI Configuration

### Google Gemini Setup

1. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key for Gemini Pro
   - Copy your API key

2. **Configure Environment Variables**
```bash
# Add to your .env file
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

3. **AI Features**
   - ✅ Personalized meal plan generation
   - ✅ Turkish & Mediterranean recipe creation
   - ✅ Dietary restriction compliance
   - ✅ Nutritional calculation
   - ✅ Automatic fallback to rule-based generation

### AI Prompt Engineering

The app uses sophisticated prompt engineering to generate culturally authentic and nutritionally accurate meal plans:

```typescript
// Example prompt structure
`Sen Türk ve Akdeniz mutfağı konusunda uzman bir diyetisyensin. 
Aşağıdaki kullanıcı profili için 7 günlük kişiselleştirilmiş beslenme planı oluştur:

KULLANICI PROFİLİ:
- İsim: ${user.name}
- Yaş: ${user.age}
- Hedef: ${goalDescription}
- Beslenme Kısıtlamaları: ${dietaryRestrictions}

HEDEF KALORI: ${targetCalories} kcal/gün
...`
```

## 🗄️ Database Schema

### Profiles Table
```sql
- id (uuid, primary key, references auth.users)
- email (text, unique)
- name (text)
- age (integer)
- gender (text)
- weight_kg (numeric)
- height_cm (numeric)
- activity_level (text)
- primary_goal (text)
- dietary_preferences (text[])
- is_premium_user (boolean)
```

### Recipes Table
```sql
- id (uuid, primary key)
- title (text)
- description (text)
- cuisine_type (text)
- photo_url (text)
- prep_time_minutes (integer)
- cook_time_minutes (integer)
- calories (integer)
- protein_grams (numeric)
- carbs_grams (numeric)
- fat_grams (numeric)
- ingredients (jsonb)
- instructions (text[])
```

### Meal Plans Table
```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- start_date (date)
- end_date (date)
- daily_meals (jsonb)
```

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User-specific data access** policies
- **Secure authentication** with Supabase Auth
- **Token-based API authentication**
- **Input validation** and sanitization
- **AI response validation** and sanitization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account
- Google Gemini API key (optional, for AI features)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd diet-plan-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Copy your project URL and anon key

4. **Configure environment variables**
```bash
cp .env.example .env
```
Fill in your credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

5. **Start the development server**
```bash
npm run dev
```

## 🤖 AI Usage

### Meal Plan Generation
```typescript
import { mealPlanApi } from '@/lib/api';

// Generate AI-powered meal plan
const { data, error } = await mealPlanApi.generatePersonalizedPlan(
  userId,
  mealCount, // 3 or 4 meals per day
  forceRefresh // true for premium users
);
```

### AI Features
- **Automatic Recipe Creation**: AI generates new recipes based on user preferences
- **Nutritional Accuracy**: Each recipe includes calculated calories and macros
- **Cultural Authenticity**: Focuses on Turkish and Mediterranean cuisine
- **Dietary Compliance**: Respects all dietary restrictions and preferences
- **Intelligent Fallback**: Uses rule-based generation if AI is unavailable

## 📱 API Usage

### Profile Management
```typescript
import { profileApi } from '@/lib/api';

// Get user profile
const { data, error } = await profileApi.getProfile(userId);

// Update profile
const { data, error } = await profileApi.updateProfile(userId, updates);
```

### Recipe Management
```typescript
import { recipeApi } from '@/lib/api';

// Get all recipes (includes AI-generated)
const { data, error } = await recipeApi.getAllRecipes();

// Get recipe by ID
const { data, error } = await recipeApi.getRecipeById(recipeId);
```

### Meal Planning
```typescript
import { mealPlanApi } from '@/lib/api';

// Get user meal plans
const { data, error } = await mealPlanApi.getUserMealPlans(userId);

// Generate AI meal plan
const { data, error } = await mealPlanApi.generatePersonalizedPlan(userId, 3);
```

## 🔄 Development Mode

The app automatically falls back to rule-based meal planning when:
- Gemini API key is not configured
- AI API calls fail or timeout
- Network connectivity issues

This ensures the app remains functional even without AI integration.

## 🚀 Deployment

### Database Deployment
1. Deploy migrations to Supabase
2. Configure RLS policies
3. Set up authentication providers

### Frontend Deployment
1. Build the app: `npm run build:web`
2. Deploy to your preferred hosting platform
3. Configure environment variables including Gemini API key

### AI Configuration
1. Ensure Gemini API key is properly configured
2. Test AI meal plan generation
3. Monitor API usage and costs
4. Set up error monitoring for AI failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Test AI integration if modifying AI features
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router Documentation](https://expo.github.io/router/)
- [React Native Documentation](https://reactnative.dev/)
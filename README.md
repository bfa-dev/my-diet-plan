# Diet Plan App - PostgreSQL Backend Integration

A comprehensive nutrition planning app built with React Native, Expo Router, and Supabase PostgreSQL backend.

## 🚀 Features

### Backend & Database
- **PostgreSQL Database** with Supabase
- **Row Level Security (RLS)** for data protection
- **Real-time data synchronization**
- **Secure authentication** with token validation
- **API endpoints** for all CRUD operations

### Core Functionality
- **User Profiles** with health metrics and goals
- **Recipe Management** with nutrition information
- **Meal Planning** with weekly schedules
- **Grocery Lists** auto-generated from meal plans
- **Authentication** with email/password and social login

### Data Models
- **Users/Profiles**: Personal information, health metrics, goals
- **Recipes**: Detailed recipes with ingredients and nutrition
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
│   └── supabase.ts          # Supabase client configuration
├── hooks/
│   └── useApi.ts            # Custom hooks for API calls
├── contexts/
│   └── AuthContext.tsx      # Authentication state management
├── types/
│   └── index.ts             # TypeScript type definitions
└── app/                     # Expo Router pages
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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account

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
Fill in your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Start the development server**
```bash
npm run dev
```

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

// Get all recipes
const { data, error } = await recipeApi.getAllRecipes();

// Get recipe by ID
const { data, error } = await recipeApi.getRecipeById(recipeId);
```

### Meal Planning
```typescript
import { mealPlanApi } from '@/lib/api';

// Get user meal plans
const { data, error } = await mealPlanApi.getUserMealPlans(userId);

// Create new meal plan
const { data, error } = await mealPlanApi.createMealPlan(userId, mealPlan);
```

## 🔄 Development Mode

The app automatically falls back to mock data when Supabase is not configured, allowing for seamless development without a backend connection.

## 🚀 Deployment

### Database Deployment
1. Deploy migrations to Supabase
2. Configure RLS policies
3. Set up authentication providers

### Frontend Deployment
1. Build the app: `npm run build:web`
2. Deploy to your preferred hosting platform
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
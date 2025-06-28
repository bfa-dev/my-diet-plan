/*
  # Initial Database Schema for Diet Plan App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `age` (integer)
      - `gender` (text)
      - `weight_kg` (numeric)
      - `height_cm` (numeric)
      - `activity_level` (text)
      - `primary_goal` (text)
      - `dietary_preferences` (text array)
      - `is_premium_user` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `recipes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `cuisine_type` (text)
      - `photo_url` (text)
      - `prep_time_minutes` (integer)
      - `cook_time_minutes` (integer)
      - `calories` (integer)
      - `protein_grams` (numeric)
      - `carbs_grams` (numeric)
      - `fat_grams` (numeric)
      - `ingredients` (jsonb)
      - `instructions` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `meal_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `start_date` (date)
      - `end_date` (date)
      - `daily_meals` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  age integer,
  gender text CHECK (gender IN ('Male', 'Female', 'Other')),
  weight_kg numeric,
  height_cm numeric,
  activity_level text CHECK (activity_level IN ('Sedentary', 'Light', 'Moderate', 'Active')),
  primary_goal text CHECK (primary_goal IN ('Lose Weight', 'Maintain Weight', 'Gain Muscle')),
  dietary_preferences text[] DEFAULT '{}',
  is_premium_user boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cuisine_type text CHECK (cuisine_type IN ('Turkish', 'Mediterranean', 'International')),
  photo_url text,
  prep_time_minutes integer DEFAULT 0,
  cook_time_minutes integer DEFAULT 0,
  calories integer DEFAULT 0,
  protein_grams numeric DEFAULT 0,
  carbs_grams numeric DEFAULT 0,
  fat_grams numeric DEFAULT 0,
  ingredients jsonb DEFAULT '[]',
  instructions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  daily_meals jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Recipes policies (public read, admin write)
CREATE POLICY "Anyone can read recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (true);

-- Meal plans policies
CREATE POLICY "Users can read own meal plans"
  ON meal_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON meal_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON meal_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
  ON meal_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
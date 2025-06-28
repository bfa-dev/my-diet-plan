import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Flame, Users, RefreshCw } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Recipe } from '@/types';

interface MealCardProps {
  recipe: Recipe;
  mealTime: string;
  onPress: () => void;
  onSwap?: () => void;
  showSwapButton?: boolean;
}

export function MealCard({ recipe, mealTime, onPress, onSwap, showSwapButton = false }: MealCardProps) {
  const totalTime = recipe.prepTime_minutes + recipe.cookTime_minutes;

  return (
    <Card variant="elevated" style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.touchable}>
        <Image source={{ uri: recipe.photoURL }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.mealTime}>{mealTime}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{recipe.cuisineType}</Text>
              </View>
              {showSwapButton && onSwap && (
                <TouchableOpacity 
                  style={styles.swapButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onSwap();
                  }}
                  activeOpacity={0.7}
                >
                  <RefreshCw size={14} color="#8FBC8F" />
                  <Text style={styles.swapButtonText}>Değiştir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.statText}>{totalTime} dk</Text>
            </View>
            <View style={styles.stat}>
              <Flame size={14} color="#EF4444" />
              <Text style={styles.statText}>{recipe.calories} kcal</Text>
            </View>
            <View style={styles.stat}>
              <Users size={14} color="#3B82F6" />
              <Text style={styles.statText}>2 kişi</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8FBC8F',
  },
  swapButtonText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});
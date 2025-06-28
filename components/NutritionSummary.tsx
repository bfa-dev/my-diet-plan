import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

interface NutritionSummaryProps {
  data: NutritionData;
}

export function NutritionSummary({ data }: NutritionSummaryProps) {
  const NutritionBar = ({ 
    label, 
    current, 
    target, 
    color, 
    unit = 'g' 
  }: { 
    label: string; 
    current: number; 
    target: number; 
    color: string; 
    unit?: string; 
  }) => {
    const percentage = Math.min((current / target) * 100, 100);
    
    return (
      <View style={styles.nutritionItem}>
        <View style={styles.nutritionHeader}>
          <Text style={styles.nutritionLabel}>{label}</Text>
          <Text style={styles.nutritionValue}>
            {current}{unit} / {target}{unit}
          </Text>
        </View>
        <View style={styles.nutritionBar}>
          <View 
            style={[
              styles.nutritionFill, 
              { width: `${percentage}%`, backgroundColor: color }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <Card variant="elevated" style={styles.container}>
      <Text style={styles.title}>Günlük Besin Hedefleri</Text>
      
      <NutritionBar
        label="Kalori"
        current={data.calories}
        target={data.targetCalories}
        color="#EF4444"
        unit=" kcal"
      />
      
      <NutritionBar
        label="Protein"
        current={data.protein}
        target={data.targetProtein}
        color="#3B82F6"
      />
      
      <NutritionBar
        label="Karbonhidrat"
        current={data.carbs}
        target={data.targetCarbs}
        color="#F59E0B"
      />
      
      <NutritionBar
        label="Yağ"
        current={data.fat}
        target={data.targetFat}
        color="#8B5CF6"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  nutritionItem: {
    marginBottom: 16,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  nutritionValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  nutritionBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  nutritionFill: {
    height: '100%',
    borderRadius: 3,
  },
});
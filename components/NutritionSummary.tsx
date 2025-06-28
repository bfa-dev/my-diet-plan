import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { MacroChart } from './MacroChart';

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
  showMacroChart?: boolean;
}

export function NutritionSummary({ data, showMacroChart = false }: NutritionSummaryProps) {
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
    const isOverTarget = current > target;
    
    return (
      <View style={styles.nutritionItem}>
        <View style={styles.nutritionHeader}>
          <Text style={styles.nutritionLabel}>{label}</Text>
          <Text style={[
            styles.nutritionValue,
            isOverTarget && styles.nutritionValueOver
          ]}>
            {current}{unit} / {target}{unit}
          </Text>
        </View>
        <View style={styles.nutritionBar}>
          <View 
            style={[
              styles.nutritionFill, 
              { 
                width: `${Math.min(percentage, 100)}%`, 
                backgroundColor: isOverTarget ? '#EF4444' : color 
              }
            ]} 
          />
          {isOverTarget && (
            <View 
              style={[
                styles.nutritionOverflow,
                { 
                  width: `${Math.min(percentage - 100, 50)}%`,
                  backgroundColor: '#EF4444'
                }
              ]} 
            />
          )}
        </View>
        <View style={styles.nutritionProgress}>
          <Text style={[
            styles.nutritionPercentage,
            isOverTarget && styles.nutritionPercentageOver
          ]}>
            %{Math.round(percentage)}
          </Text>
          {isOverTarget && (
            <Text style={styles.overTargetText}>Hedef aşıldı</Text>
          )}
        </View>
      </View>
    );
  };

  const caloriePercentage = (data.calories / data.targetCalories) * 100;
  const isCalorieDeficit = data.calories < data.targetCalories;
  const isCalorieSurplus = data.calories > data.targetCalories;

  return (
    <>
      <Card variant="elevated" style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Günlük Besin Hedefleri</Text>
          <View style={[
            styles.calorieStatus,
            isCalorieDeficit && styles.calorieDeficit,
            isCalorieSurplus && styles.calorieSurplus
          ]}>
            <Text style={[
              styles.calorieStatusText,
              isCalorieDeficit && styles.calorieDeficitText,
              isCalorieSurplus && styles.calorieSurplusText
            ]}>
              {isCalorieDeficit ? 'Açık' : isCalorieSurplus ? 'Fazla' : 'Hedefte'}
            </Text>
          </View>
        </View>
        
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

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {isCalorieDeficit 
              ? `${data.targetCalories - data.calories} kalori eksik` 
              : isCalorieSurplus 
              ? `${data.calories - data.targetCalories} kalori fazla`
              : 'Kalori hedefine ulaştınız! 🎯'}
          </Text>
        </View>
      </Card>

      {showMacroChart && (
        <MacroChart
          protein={data.protein}
          carbs={data.carbs}
          fat={data.fat}
          targetProtein={data.targetProtein}
          targetCarbs={data.targetCarbs}
          targetFat={data.targetFat}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  calorieStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  calorieDeficit: {
    backgroundColor: '#FEF3C7',
  },
  calorieSurplus: {
    backgroundColor: '#FEE2E2',
  },
  calorieStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  calorieDeficitText: {
    color: '#F59E0B',
  },
  calorieSurplusText: {
    color: '#EF4444',
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
  nutritionValueOver: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
  },
  nutritionBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 4,
  },
  nutritionFill: {
    height: '100%',
    borderRadius: 3,
  },
  nutritionOverflow: {
    position: 'absolute',
    top: 0,
    left: '100%',
    height: '100%',
    opacity: 0.7,
  },
  nutritionProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionPercentage: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  nutritionPercentageOver: {
    color: '#EF4444',
  },
  overTargetText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
  },
  summary: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
});
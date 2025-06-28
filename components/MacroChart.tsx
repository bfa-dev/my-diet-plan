import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

export function MacroChart({ 
  protein, 
  carbs, 
  fat, 
  targetProtein, 
  targetCarbs, 
  targetFat 
}: MacroChartProps) {
  const total = protein + carbs + fat;
  const targetTotal = targetProtein + targetCarbs + targetFat;

  // Calculate percentages for pie chart
  const proteinPercentage = total > 0 ? (protein / total) * 100 : 0;
  const carbsPercentage = total > 0 ? (carbs / total) * 100 : 0;
  const fatPercentage = total > 0 ? (fat / total) * 100 : 0;

  // Calculate target percentages
  const targetProteinPercentage = targetTotal > 0 ? (targetProtein / targetTotal) * 100 : 0;
  const targetCarbsPercentage = targetTotal > 0 ? (targetCarbs / targetTotal) * 100 : 0;
  const targetFatPercentage = targetTotal > 0 ? (targetFat / targetTotal) * 100 : 0;

  const MacroBar = ({ 
    label, 
    current, 
    target, 
    color, 
    currentPercentage, 
    targetPercentage 
  }: { 
    label: string; 
    current: number; 
    target: number; 
    color: string; 
    currentPercentage: number;
    targetPercentage: number;
  }) => {
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    
    return (
      <View style={styles.macroItem}>
        <View style={styles.macroHeader}>
          <View style={styles.macroLabelContainer}>
            <View style={[styles.macroColorDot, { backgroundColor: color }]} />
            <Text style={styles.macroLabel}>{label}</Text>
          </View>
          <Text style={styles.macroValue}>
            {current}g / {target}g
          </Text>
        </View>
        
        <View style={styles.macroBar}>
          <View 
            style={[
              styles.macroFill, 
              { width: `${progress}%`, backgroundColor: color }
            ]} 
          />
        </View>
        
        <View style={styles.macroPercentages}>
          <Text style={styles.macroPercentage}>
            Mevcut: %{currentPercentage.toFixed(0)}
          </Text>
          <Text style={styles.macroPercentage}>
            Hedef: %{targetPercentage.toFixed(0)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Card variant="elevated" style={styles.container}>
      <Text style={styles.title}>Makro Besin Dağılımı</Text>
      
      {/* Pie Chart Representation */}
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          <View style={styles.pieSegments}>
            {/* Protein segment */}
            <View 
              style={[
                styles.pieSegment, 
                { 
                  backgroundColor: '#3B82F6',
                  height: `${proteinPercentage}%`,
                }
              ]} 
            />
            {/* Carbs segment */}
            <View 
              style={[
                styles.pieSegment, 
                { 
                  backgroundColor: '#F59E0B',
                  height: `${carbsPercentage}%`,
                }
              ]} 
            />
            {/* Fat segment */}
            <View 
              style={[
                styles.pieSegment, 
                { 
                  backgroundColor: '#8B5CF6',
                  height: `${fatPercentage}%`,
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.pieChartCenter}>
          <Text style={styles.totalGrams}>{total}g</Text>
          <Text style={styles.totalLabel}>Toplam</Text>
        </View>
      </View>

      {/* Macro Bars */}
      <View style={styles.macroList}>
        <MacroBar
          label="Protein"
          current={protein}
          target={targetProtein}
          color="#3B82F6"
          currentPercentage={proteinPercentage}
          targetPercentage={targetProteinPercentage}
        />
        
        <MacroBar
          label="Karbonhidrat"
          current={carbs}
          target={targetCarbs}
          color="#F59E0B"
          currentPercentage={carbsPercentage}
          targetPercentage={targetCarbsPercentage}
        />
        
        <MacroBar
          label="Yağ"
          current={fat}
          target={targetFat}
          color="#8B5CF6"
          currentPercentage={fatPercentage}
          targetPercentage={targetFatPercentage}
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Dengeli beslenme için makro besinlerin doğru oranında alınması önemlidir.
        </Text>
      </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  pieSegments: {
    flex: 1,
    flexDirection: 'column',
  },
  pieSegment: {
    width: '100%',
  },
  pieChartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -20 }],
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  totalGrams: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  macroList: {
    gap: 16,
  },
  macroItem: {
    marginBottom: 4,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macroLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  macroValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  macroBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  macroFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroPercentages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroPercentage: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
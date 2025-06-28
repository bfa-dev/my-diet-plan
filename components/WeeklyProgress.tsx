import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { CircleCheck as CheckCircle, Circle } from 'lucide-react-native';

interface WeeklyProgressProps {
  completedDays: number;
  totalDays: number;
  currentStreak: number;
}

export function WeeklyProgress({ completedDays, totalDays, currentStreak }: WeeklyProgressProps) {
  const progressPercentage = (completedDays / totalDays) * 100;

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bu Haftaki İlerlemeniz</Text>
        <Text style={styles.streak}>🔥 {currentStreak} gün</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedDays}/{totalDays} gün tamamlandı</Text>
      </View>

      <View style={styles.daysContainer}>
        {Array.from({ length: 7 }, (_, index) => (
          <View key={index} style={styles.dayItem}>
            {index < completedDays ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <Circle size={20} color="#E5E7EB" />
            )}
            <Text style={styles.dayText}>
              {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'][index]}
            </Text>
          </View>
        ))}
      </View>
    </Card>
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
  streak: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    gap: 4,
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});
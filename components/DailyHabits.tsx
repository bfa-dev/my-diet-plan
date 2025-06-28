import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CheckCircle, Circle, Flame, Award } from 'lucide-react-native';
import { Card } from './ui/Card';

interface HabitItem {
  id: string;
  title: string;
  emoji: string;
  completed: boolean;
}

interface DailyHabitsProps {
  onStreakUpdate?: (streak: number) => void;
}

export function DailyHabits({ onStreakUpdate }: DailyHabitsProps) {
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: 'breakfast', title: 'Kahvaltımı yaptım', emoji: '🍳', completed: false },
    { id: 'lunch', title: 'Öğle yemeğimi uyguladım', emoji: '🥗', completed: false },
    { id: 'water', title: 'Yeterince su içtim', emoji: '💧', completed: false },
    { id: 'exercise', title: 'Hareket ettim', emoji: '🏃‍♀️', completed: false },
  ]);

  const [currentStreak, setCurrentStreak] = useState(7);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load habits from storage on component mount
  useEffect(() => {
    loadTodaysHabits();
    loadCurrentStreak();
  }, []);

  const loadTodaysHabits = () => {
    // In a real app, this would load from AsyncStorage or API
    const today = new Date().toDateString();
    const savedHabits = localStorage.getItem(`habits_${today}`);
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  };

  const loadCurrentStreak = () => {
    // In a real app, this would load from AsyncStorage or API
    const savedStreak = localStorage.getItem('current_streak');
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak));
    }
  };

  const saveHabits = (updatedHabits: HabitItem[]) => {
    const today = new Date().toDateString();
    localStorage.setItem(`habits_${today}`, JSON.stringify(updatedHabits));
  };

  const saveStreak = (streak: number) => {
    localStorage.setItem('current_streak', streak.toString());
    onStreakUpdate?.(streak);
  };

  const toggleHabit = (habitId: string) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    );

    setHabits(updatedHabits);
    saveHabits(updatedHabits);

    // Check if all habits are completed
    const allCompleted = updatedHabits.every(habit => habit.completed);
    const wasAllCompleted = habits.every(habit => habit.completed);

    if (allCompleted && !wasAllCompleted) {
      // User just completed all habits for the day
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      saveStreak(newStreak);
      
      // Show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      // Show achievement alert
      if (newStreak % 7 === 0) {
        Alert.alert(
          '🎉 Harika!',
          `${newStreak} günlük seri tamamladınız! Devam edin!`,
          [{ text: 'Teşekkürler!', style: 'default' }]
        );
      }
    } else if (!allCompleted && wasAllCompleted) {
      // User unchecked a habit, potentially breaking streak
      // In a real app, you might want to handle this differently
    }
  };

  const completedCount = habits.filter(habit => habit.completed).length;
  const completionPercentage = (completedCount / habits.length) * 100;
  const allCompleted = completedCount === habits.length;

  const getStreakBadge = () => {
    if (currentStreak >= 30) return { emoji: '🏆', title: 'Şampiyon', color: '#F59E0B' };
    if (currentStreak >= 14) return { emoji: '🔥', title: 'Ateşli', color: '#EF4444' };
    if (currentStreak >= 7) return { emoji: '⭐', title: 'Yıldız', color: '#8B5CF6' };
    if (currentStreak >= 3) return { emoji: '💪', title: 'Güçlü', color: '#10B981' };
    return { emoji: '🌱', title: 'Başlangıç', color: '#6B7280' };
  };

  const streakBadge = getStreakBadge();

  return (
    <Card variant="elevated" style={[styles.container, showCelebration && styles.celebrationContainer]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bugünlük Kontrol</Text>
          <Text style={styles.subtitle}>
            {completedCount}/{habits.length} tamamlandı
          </Text>
        </View>
        
        <View style={styles.streakContainer}>
          <View style={[styles.streakBadge, { backgroundColor: streakBadge.color + '20' }]}>
            <Text style={styles.streakEmoji}>{streakBadge.emoji}</Text>
            <Text style={[styles.streakNumber, { color: streakBadge.color }]}>
              {currentStreak}
            </Text>
          </View>
          <Text style={styles.streakLabel}>{streakBadge.title}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${completionPercentage}%`,
                backgroundColor: allCompleted ? '#10B981' : '#8FBC8F'
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {allCompleted ? '🎉 Tüm alışkanlıklar tamamlandı!' : `%${Math.round(completionPercentage)} tamamlandı`}
        </Text>
      </View>

      <View style={styles.habitsList}>
        {habits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            style={[styles.habitItem, habit.completed && styles.habitItemCompleted]}
            onPress={() => toggleHabit(habit.id)}
            activeOpacity={0.7}
          >
            <View style={styles.habitLeft}>
              <Text style={styles.habitEmoji}>{habit.emoji}</Text>
              <Text style={[
                styles.habitTitle,
                habit.completed && styles.habitTitleCompleted
              ]}>
                {habit.title}
              </Text>
            </View>
            
            <View style={styles.habitRight}>
              {habit.completed ? (
                <CheckCircle size={24} color="#10B981" />
              ) : (
                <Circle size={24} color="#D1D5DB" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {allCompleted && (
        <View style={styles.completionReward}>
          <Award size={20} color="#F59E0B" />
          <Text style={styles.rewardText}>
            Harika! Bugünkü hedeflerinizi tamamladınız! 🎯
          </Text>
        </View>
      )}

      <View style={styles.streakInfo}>
        <Flame size={16} color="#EF4444" />
        <Text style={styles.streakInfoText}>
          {currentStreak} günlük seri • Devam edin!
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
  celebrationContainer: {
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 4,
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  streakNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  streakLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  progressContainer: {
    marginBottom: 20,
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
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  habitsList: {
    gap: 12,
    marginBottom: 16,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  habitItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  habitTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
  habitTitleCompleted: {
    color: '#059669',
  },
  habitRight: {
    marginLeft: 12,
  },
  completionReward: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    textAlign: 'center',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  streakInfoText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});
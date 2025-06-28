import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check, X, CircleAlert as AlertCircle, Info } from 'lucide-react-native';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, duration, fadeAnim, onHide]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={20} color="#10B981" />;
      case 'error':
        return <X size={20} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={20} color="#F59E0B" />;
      default:
        return <Info size={20} color="#3B82F6" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#F0FDF4';
      case 'error':
        return '#FEF2F2';
      case 'warning':
        return '#FFFBEB';
      default:
        return '#EFF6FF';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      {getIcon()}
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
});
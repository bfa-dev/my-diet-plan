import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle, Sparkles } from 'lucide-react-native';

export default function OnboardingComplete() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={48} color="#8FBC8F" />
          </View>
          <Sparkles size={24} color="#F59E0B" style={styles.sparkle1} />
          <Sparkles size={16} color="#F59E0B" style={styles.sparkle2} />
        </View>

        <Text style={styles.title}>Harika! Planınız Hazır</Text>
        <Text style={styles.subtitle}>
          Kişiselleştirilmiş beslenme planınızı oluşturduk. Sağlıklı yaşam yolculuğunuza başlamaya hazır mısınız?
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>📅</Text>
            <Text style={styles.featureText}>7 günlük özel beslenme planı</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🛒</Text>
            <Text style={styles.featureText}>Otomatik alışveriş listesi</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🍽️</Text>
            <Text style={styles.featureText}>Türk ve Akdeniz mutfağından tarifler</Text>
          </View>
        </View>

        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            "Başarı, küçük adımların toplamıdır. Bugün ilk adımınızı atın!"
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.startButtonText}>Planıma Başla</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -4,
    left: -8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  motivationContainer: {
    backgroundColor: '#F0F9F0',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  motivationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 40,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});
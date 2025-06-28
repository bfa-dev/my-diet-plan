import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, Check, RefreshCw, BookOpen, Calendar, Users } from 'lucide-react-native';

export default function PremiumScreen() {
  const router = useRouter();

  const PremiumFeature = ({ icon: Icon, title, description }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Icon size={20} color="#F59E0B" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <Check size={20} color="#10B981" />
    </View>
  );

  const PlanOption = ({ 
    title, 
    price, 
    period, 
    savings, 
    isPopular = false 
  }: {
    title: string;
    price: string;
    period: string;
    savings?: string;
    isPopular?: boolean;
  }) => (
    <TouchableOpacity style={[styles.planCard, isPopular && styles.planCardPopular]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>En Popüler</Text>
        </View>
      )}
      <Text style={styles.planTitle}>{title}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{period}</Text>
      </View>
      {savings && (
        <Text style={styles.savings}>{savings} tasarruf</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium'a Geç</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Crown size={48} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Sınırsız Beslenme Planları</Text>
          <Text style={styles.heroSubtitle}>
            Premium ile beslenme hedeflerinize daha hızlı ulaşın
          </Text>
        </View>

        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Premium vs Ücretsiz</Text>
          
          <View style={styles.comparisonTable}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonHeaderText}>Özellik</Text>
              <Text style={styles.comparisonHeaderText}>Ücretsiz</Text>
              <Text style={styles.comparisonHeaderText}>Premium</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Haftalık Plan</Text>
              <Text style={styles.comparisonValue}>1 adet</Text>
              <Text style={[styles.comparisonValue, styles.premiumValue]}>Sınırsız</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Tarif Erişimi</Text>
              <Text style={styles.comparisonValue}>Sınırlı</Text>
              <Text style={[styles.comparisonValue, styles.premiumValue]}>Tüm Tarifler</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Özel Diyetler</Text>
              <Text style={styles.comparisonValue}>-</Text>
              <Text style={[styles.comparisonValue, styles.premiumValue]}>✓</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Özellikler</Text>
          
          <PremiumFeature
            icon={RefreshCw}
            title="Sınırsız Plan Yenileme"
            description="İstediğiniz kadar yeni haftalık plan oluşturun"
          />
          
          <PremiumFeature
            icon={BookOpen}
            title="Tam Tarif Kütüphanesi"
            description="500+ Türk ve Akdeniz mutfağı tarifine erişin"
          />
          
          <PremiumFeature
            icon={Calendar}
            title="Özel Beslenme Planları"
            description="Keto, Düşük Karbonhidrat, Yüksek Protein planları"
          />
          
          <PremiumFeature
            icon={Users}
            title="Aile Planları"
            description="4 kişiye kadar özel planlar oluşturun"
          />
        </View>

        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Plan Seçin</Text>
          
          <PlanOption
            title="Aylık Plan"
            price="₺29"
            period="ay"
          />
          
          <PlanOption
            title="Yıllık Plan"
            price="₺199"
            period="yıl"
            savings="₺149"
            isPopular={true}
          />
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeButtonText}>Premium'a Başla</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • İstediğiniz zaman iptal edebilirsiniz{'\n'}
            • 7 gün ücretsiz deneme{'\n'}
            • Güvenli ödeme
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  comparisonSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  comparisonTable: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  comparisonHeaderText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  comparisonFeature: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  comparisonValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  premiumValue: {
    color: '#8FBC8F',
    fontFamily: 'Inter-SemiBold',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  pricingSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  planCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    position: 'relative',
  },
  planCardPopular: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  planTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  period: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  savings: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  subscribeButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
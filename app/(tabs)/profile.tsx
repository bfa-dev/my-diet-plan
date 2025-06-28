import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, CreditCard as Edit3, Crown, MessageCircle, Settings, LogOut, ArrowRight, Award, TrendingUp, Calendar } from 'lucide-react-native';
import { mockUser } from '@/data/mockData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileTab() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting logout process...');
              await signOut();
              console.log('Logout completed, navigating to welcome...');
              // Navigation will be handled by AuthGuard
            } catch (error) {
              console.error('Error during sign out:', error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          }
        },
      ]
    );
  };

  const ProfileOption = ({ icon: Icon, title, subtitle, onPress, showArrow = true, color = "#6B7280" }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.profileOption} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, { backgroundColor: color + '20' }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <ArrowRight size={20} color="#D1D5DB" />}
    </TouchableOpacity>
  );

  const StatCard = ({ icon: Icon, title, value, color }: {
    icon: any;
    title: string;
    value: string;
    color: string;
  }) => (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Card style={styles.userCard}>
          <View style={styles.userAvatar}>
            <User size={32} color="#8FBC8F" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.user_metadata?.name || user?.email || mockUser.name}
            </Text>
            <Text style={styles.userGoal}>Hedef: {mockUser.primaryGoal === 'Lose Weight' ? 'Kilo Vermek' : mockUser.primaryGoal}</Text>
            <View style={styles.userStats}>
              <Text style={styles.userStat}>{mockUser.age} yaş • {mockUser.weight_kg} kg • {mockUser.height_cm} cm</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={16} color="#8FBC8F" />
          </TouchableOpacity>
        </Card>

        <View style={styles.statsContainer}>
          <StatCard
            icon={Award}
            title="Tamamlanan Planlar"
            value="3"
            color="#10B981"
          />
          <StatCard
            icon={TrendingUp}
            title="Günlük Seri"
            value="7"
            color="#F59E0B"
          />
          <StatCard
            icon={Calendar}
            title="Aktif Gün"
            value="21"
            color="#3B82F6"
          />
        </View>

        {!mockUser.isPremiumUser && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={() => router.push('/premium')}
          >
            <View style={styles.premiumContent}>
              <View style={styles.premiumIcon}>
                <Crown size={24} color="#F59E0B" />
              </View>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Premium'a Geç!</Text>
                <Text style={styles.premiumSubtitle}>Sınırsız plan yenileme ve özel tarifler</Text>
              </View>
            </View>
            <ArrowRight size={20} color="#F59E0B" />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap Yönetimi</Text>
          
          <ProfileOption
            icon={Edit3}
            title="Profili Düzenle"
            subtitle="Kişisel bilgilerinizi güncelleyin"
            onPress={() => router.push('/edit-profile')}
            color="#8FBC8F"
          />
          
          <ProfileOption
            icon={TrendingUp}
            title="İlerleme Raporu"
            subtitle="Detaylı analiz ve istatistikler"
            onPress={() => router.push('/progress-report')}
            color="#3B82F6"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destek & Geri Bildirim</Text>
          
          <ProfileOption
            icon={MessageCircle}
            title="İletişim"
            subtitle="Sorularınız için bize ulaşın"
            onPress={() => {}}
            color="#3B82F6"
          />
          
          <ProfileOption
            icon={Award}
            title="Uygulamayı Değerlendir"
            subtitle="Deneyiminizi paylaşın"
            onPress={() => {}}
            color="#F59E0B"
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutOption}
            onPress={handleSignOut}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#EF444420' }]}>
                <LogOut size={20} color="#EF4444" />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Çıkış Yap</Text>
                <Text style={styles.optionSubtitle}>Hesabınızdan güvenli çıkış yapın</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Beslenme Planım v1.0.0</Text>
          <Text style={styles.footerSubtext}>Sağlıklı yaşam yolculuğunuzda yanınızdayız</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userGoal: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
  },
  userStat: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
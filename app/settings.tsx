import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Globe, Shield, CircleHelp as HelpCircle, Star, Download, Trash2, ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true,
    rightElement 
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon size={20} color="#6B7280" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (showArrow && <ChevronRight size={20} color="#D1D5DB" />)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          
          <SettingItem
            icon={Bell}
            title="Bildirimler"
            subtitle="Uygulama bildirimleri"
            showArrow={false}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E7EB', true: '#8FBC8F' }}
                thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
          
          <SettingItem
            icon={Bell}
            title="Öğün Hatırlatıcıları"
            subtitle="Yemek saatlerinde bildirim al"
            showArrow={false}
            rightElement={
              <Switch
                value={mealReminders}
                onValueChange={setMealReminders}
                trackColor={{ false: '#E5E7EB', true: '#8FBC8F' }}
                thumbColor={mealReminders ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
          
          <SettingItem
            icon={Bell}
            title="Haftalık Raporlar"
            subtitle="İlerleme raporları"
            showArrow={false}
            rightElement={
              <Switch
                value={weeklyReports}
                onValueChange={setWeeklyReports}
                trackColor={{ false: '#E5E7EB', true: '#8FBC8F' }}
                thumbColor={weeklyReports ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          
          <SettingItem
            icon={Globe}
            title="Dil"
            subtitle="Türkçe"
            onPress={() => {}}
          />
          
          <SettingItem
            icon={Download}
            title="Çevrimdışı Tarifler"
            subtitle="Tarifleri cihazınıza indirin"
            onPress={() => {}}
          />
          
          <SettingItem
            icon={Shield}
            title="Gizlilik"
            subtitle="Veri kullanımı ve gizlilik ayarları"
            onPress={() => {}}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Destek</Text>
          
          <SettingItem
            icon={HelpCircle}
            title="Yardım Merkezi"
            subtitle="SSS ve destek makaleleri"
            onPress={() => {}}
          />
          
          <SettingItem
            icon={Star}
            title="Uygulamayı Değerlendir"
            subtitle="App Store'da değerlendirin"
            onPress={() => {}}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          
          <SettingItem
            icon={Trash2}
            title="Hesabı Sil"
            subtitle="Tüm verilerinizi kalıcı olarak silin"
            onPress={() => {}}
            showArrow={false}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Beslenme Planım v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            © 2024 Beslenme Planım. Tüm hakları saklıdır.
          </Text>
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
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
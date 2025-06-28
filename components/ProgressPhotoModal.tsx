import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Camera, Image as ImageIcon, Info } from 'lucide-react-native';
import { Button } from './ui/Button';

interface ProgressPhotoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProgressPhotoModal({ visible, onClose }: ProgressPhotoModalProps) {
  const [uploading, setUploading] = useState(false);

  const handleTakePhoto = () => {
    // In a real app, this would use expo-camera or expo-image-picker
    Alert.alert(
      'Fotoğraf Çek',
      'Kamera özelliği demo sürümünde mevcut değildir. Gerçek uygulamada expo-camera kullanılacaktır.',
      [{ text: 'Tamam' }]
    );
  };

  const handleSelectFromGallery = () => {
    // In a real app, this would use expo-image-picker
    Alert.alert(
      'Galeriden Seç',
      'Galeri özelliği demo sürümünde mevcut değildir. Gerçek uygulamada expo-image-picker kullanılacaktır.',
      [{ text: 'Tamam' }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>İlerleme Fotoğrafı</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Info size={20} color="#3B82F6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Fotoğraf İpuçları</Text>
              <Text style={styles.infoText}>
                • Aynı pozda ve aynı ışıkta çekin{'\n'}
                • Haftada bir kez çekmek yeterlidir{'\n'}
                • Önden, yandan ve arkadan çekin{'\n'}
                • Aynı kıyafetleri tercih edin
              </Text>
            </View>
          </View>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleTakePhoto}
              disabled={uploading}
            >
              <View style={styles.optionIcon}>
                <Camera size={32} color="#8FBC8F" />
              </View>
              <Text style={styles.optionTitle}>Fotoğraf Çek</Text>
              <Text style={styles.optionDescription}>
                Kamerayı kullanarak yeni fotoğraf çek
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleSelectFromGallery}
              disabled={uploading}
            >
              <View style={styles.optionIcon}>
                <ImageIcon size={32} color="#3B82F6" />
              </View>
              <Text style={styles.optionTitle}>Galeriden Seç</Text>
              <Text style={styles.optionDescription}>
                Mevcut fotoğraflardan birini seç
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>📸 Fotoğraf Rehberi</Text>
            <Text style={styles.guidelinesText}>
              İlerleme fotoğrafları, kilo değişiminden daha net bir görsel takip sağlar. 
              Özellikle kas yapma hedefi olanlar için çok değerlidir.
            </Text>
          </View>

          <View style={styles.privacy}>
            <Text style={styles.privacyTitle}>🔒 Gizlilik</Text>
            <Text style={styles.privacyText}>
              Fotoğraflarınız sadece sizin cihazınızda saklanır ve kimseyle paylaşılmaz.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
    lineHeight: 18,
  },
  options: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  guidelines: {
    backgroundColor: '#F0F9F0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#8FBC8F',
  },
  guidelinesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8FBC8F',
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    lineHeight: 18,
  },
  privacy: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  privacyTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    lineHeight: 18,
  },
});
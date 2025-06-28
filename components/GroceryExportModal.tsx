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
import { X, FileText, Share2, Download, MessageCircle } from 'lucide-react-native';
import { Button } from './ui/Button';
import { GroceryItem } from '@/types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface GroceryExportModalProps {
  visible: boolean;
  onClose: () => void;
  groceryItems: GroceryItem[];
  weekRange?: string;
}

export function GroceryExportModal({
  visible,
  onClose,
  groceryItems,
  weekRange,
}: GroceryExportModalProps) {
  const [exporting, setExporting] = useState(false);

  const generatePDFContent = () => {
    const groupedItems = groceryItems.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as { [key: string]: GroceryItem[] });

    const categoryEmojis: { [key: string]: string } = {
      'Sebze & Meyve': '🥬',
      'Et & Tavuk': '🥩',
      'Süt Ürünleri': '🥛',
      'Bakliyat & Tahıllar': '🌾',
      'Yağlar & Soslar': '🫒',
      'Baharatlar': '🌶️',
      'Diğer': '🛒'
    };

    const currentDate = new Date().toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Alışveriş Listesi</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #ffffff;
              color: #1f2937;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #8fbc8f;
              padding-bottom: 20px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #8fbc8f;
              margin: 0 0 10px 0;
            }
            .subtitle {
              font-size: 16px;
              color: #6b7280;
              margin: 0;
            }
            .week-range {
              font-size: 14px;
              color: #8fbc8f;
              font-weight: 600;
              margin-top: 5px;
            }
            .category {
              margin-bottom: 25px;
              break-inside: avoid;
            }
            .category-header {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
              padding: 8px 12px;
              background-color: #f0f9f0;
              border-radius: 8px;
              border-left: 4px solid #8fbc8f;
            }
            .category-emoji {
              font-size: 18px;
              margin-right: 8px;
            }
            .category-title {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
              flex: 1;
            }
            .category-count {
              font-size: 14px;
              color: #6b7280;
              background-color: #ffffff;
              padding: 2px 8px;
              border-radius: 12px;
            }
            .items-list {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 8px;
              margin-left: 20px;
            }
            .item {
              display: flex;
              align-items: center;
              padding: 8px 12px;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              transition: background-color 0.2s;
            }
            .item:hover {
              background-color: #f9fafb;
            }
            .checkbox {
              width: 16px;
              height: 16px;
              border: 2px solid #d1d5db;
              border-radius: 3px;
              margin-right: 10px;
              flex-shrink: 0;
            }
            .item-content {
              flex: 1;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .item-name {
              font-size: 14px;
              color: #1f2937;
              font-weight: 500;
            }
            .item-quantity {
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
            }
            .summary {
              margin-top: 30px;
              padding: 20px;
              background-color: #f0f9f0;
              border-radius: 12px;
              border: 1px solid #8fbc8f;
            }
            .summary-title {
              font-size: 16px;
              font-weight: 600;
              color: #8fbc8f;
              margin: 0 0 10px 0;
            }
            .summary-text {
              font-size: 14px;
              color: #6b7280;
              margin: 0;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            @media print {
              body { margin: 0; }
              .category { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">🛒 Alışveriş Listesi</h1>
            <p class="subtitle">Beslenme Planım - Haftalık Alışveriş</p>
            ${weekRange ? `<p class="week-range">${weekRange}</p>` : ''}
            <p class="subtitle">Oluşturulma: ${currentDate}</p>
          </div>

          ${Object.entries(groupedItems).map(([category, items]) => `
            <div class="category">
              <div class="category-header">
                <span class="category-emoji">${categoryEmojis[category] || '🛒'}</span>
                <span class="category-title">${category}</span>
                <span class="category-count">${items.length} ürün</span>
              </div>
              <div class="items-list">
                ${items.map(item => `
                  <div class="item">
                    <div class="checkbox"></div>
                    <div class="item-content">
                      <span class="item-name">${item.ingredientName.charAt(0).toUpperCase() + item.ingredientName.slice(1)}</span>
                      <span class="item-quantity">${item.quantity} ${item.unit}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <div class="summary">
            <h3 class="summary-title">📊 Özet</h3>
            <p class="summary-text">
              Toplam ${groceryItems.length} ürün • ${Object.keys(groupedItems).length} kategori<br>
              Bu liste, haftalık beslenme planınıza göre otomatik olarak oluşturulmuştur.
            </p>
          </div>

          <div class="footer">
            <p>Beslenme Planım © 2024 • Sağlıklı yaşam yolculuğunuzda yanınızdayız</p>
          </div>
        </body>
      </html>
    `;

    return htmlContent;
  };

  const generateTextContent = () => {
    const groupedItems = groceryItems.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as { [key: string]: GroceryItem[] });

    const categoryEmojis: { [key: string]: string } = {
      'Sebze & Meyve': '🥬',
      'Et & Tavuk': '🥩',
      'Süt Ürünleri': '🥛',
      'Bakliyat & Tahıllar': '🌾',
      'Yağlar & Soslar': '🫒',
      'Baharatlar': '🌶️',
      'Diğer': '🛒'
    };

    let content = `🛒 ALIŞVERİŞ LİSTESİ\n`;
    content += `Beslenme Planım\n`;
    if (weekRange) {
      content += `${weekRange}\n`;
    }
    content += `Oluşturulma: ${new Date().toLocaleDateString('tr-TR')}\n`;
    content += `\n${'='.repeat(30)}\n\n`;

    Object.entries(groupedItems).forEach(([category, items]) => {
      content += `${categoryEmojis[category] || '🛒'} ${category.toUpperCase()} (${items.length} ürün)\n`;
      content += `${'-'.repeat(20)}\n`;
      
      items.forEach(item => {
        const name = item.ingredientName.charAt(0).toUpperCase() + item.ingredientName.slice(1);
        content += `☐ ${name} - ${item.quantity} ${item.unit}\n`;
      });
      content += `\n`;
    });

    content += `📊 ÖZET\n`;
    content += `Toplam ${groceryItems.length} ürün • ${Object.keys(groupedItems).length} kategori\n`;
    content += `\nBu liste haftalık beslenme planınıza göre oluşturulmuştur.\n`;
    content += `\nBeslenme Planım © 2024`;

    return content;
  };

  const exportToPDF = async () => {
    try {
      setExporting(true);
      
      const htmlContent = generatePDFContent();
      
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (Platform.OS === 'web') {
        // On web, trigger download
        const link = document.createElement('a');
        link.href = uri;
        link.download = `alisveris-listesi-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
      } else {
        // On mobile, share the PDF
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Alışveriş Listesi PDF',
        });
      }

      Alert.alert('Başarılı!', 'Alışveriş listesi PDF olarak dışa aktarıldı.');
    } catch (error) {
      console.error('PDF export error:', error);
      Alert.alert('Hata', 'PDF oluşturulurken bir hata oluştu.');
    } finally {
      setExporting(false);
    }
  };

  const shareAsText = async () => {
    try {
      const textContent = generateTextContent();
      
      if (Platform.OS === 'web') {
        // On web, copy to clipboard
        await navigator.clipboard.writeText(textContent);
        Alert.alert('Başarılı!', 'Alışveriş listesi panoya kopyalandı.');
      } else {
        // On mobile, use system share
        await Sharing.shareAsync('data:text/plain;base64,' + btoa(textContent), {
          mimeType: 'text/plain',
          dialogTitle: 'Alışveriş Listesi',
        });
      }
    } catch (error) {
      console.error('Text share error:', error);
      Alert.alert('Hata', 'Liste paylaşılırken bir hata oluştu.');
    }
  };

  const shareToWhatsApp = () => {
    const textContent = generateTextContent();
    const encodedText = encodeURIComponent(textContent);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    
    if (Platform.OS === 'web') {
      window.open(whatsappUrl, '_blank');
    } else {
      // On mobile, this would need expo-linking
      Alert.alert('WhatsApp', 'WhatsApp paylaşımı web sürümünde desteklenmektedir.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listemi Dışa Aktar</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>📋 Liste Özeti</Text>
            <Text style={styles.summaryText}>
              {groceryItems.length} ürün • {new Set(groceryItems.map(item => item.category)).size} kategori
            </Text>
            {weekRange && (
              <Text style={styles.weekText}>{weekRange}</Text>
            )}
          </View>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={exportToPDF}
              disabled={exporting}
            >
              <View style={styles.optionIcon}>
                <FileText size={24} color="#EF4444" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>PDF Olarak İndir</Text>
                <Text style={styles.optionDescription}>
                  Düzenli formatta PDF dosyası oluştur
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={shareAsText}
            >
              <View style={styles.optionIcon}>
                <Share2 size={24} color="#3B82F6" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Metin Olarak Paylaş</Text>
                <Text style={styles.optionDescription}>
                  Sistem paylaşım menüsünü kullan
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={shareToWhatsApp}
            >
              <View style={styles.optionIcon}>
                <MessageCircle size={24} color="#25D366" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>WhatsApp'ta Paylaş</Text>
                <Text style={styles.optionDescription}>
                  Doğrudan WhatsApp'ta gönder
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>💡 İpuçları</Text>
            <Text style={styles.tipsText}>
              • PDF formatı yazdırmak için idealdir{'\n'}
              • Metin formatı hızlı paylaşım için uygundur{'\n'}
              • Liste kategorilere göre düzenlenmiştir{'\n'}
              • Miktarlar kişi sayısına göre hesaplanmıştır
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
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  weekText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8FBC8F',
    marginTop: 4,
  },
  options: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  tips: {
    backgroundColor: '#FFFBEB',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
});
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Modal,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Moon, 
  Bell, 
  Mail, 
  MessageSquare, 
  Globe, 
  DollarSign,
  ChevronRight,
  Check
} from 'lucide-react-native';
import colors from '@/constants/colors';
import currencies from '@/constants/currency';
import { useAppStore } from '@/store/app-store';

export default function SettingsScreen() {
  const { settings, updateSettings, toggleTheme, togglePushNotifications } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  
  const router = useRouter();

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
    setShowLanguageModal(false);
  };

  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency });
    setShowCurrencyModal(false);
  };

  const toggleEmailNotifications = () => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        email: !settings.notifications.email
      }
    });
  };

  const toggleSmsNotifications = () => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        sms: !settings.notifications.sms
      }
    });
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' }
  ];

  const currencyOptions = Object.values(currencies);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Appearance
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={toggleTheme}
          >
            <View style={styles.settingItemLeft}>
              <Moon size={20} color={themeColors.primary} />
              <Text style={[styles.settingItemText, { color: themeColors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: themeColors.inactive, true: `${themeColors.primary}80` }}
              thumbColor={theme === 'dark' ? themeColors.primary : '#f4f3f4'}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Notifications
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={togglePushNotifications}
          >
            <View style={styles.settingItemLeft}>
              <Bell size={20} color={themeColors.primary} />
              <Text style={[styles.settingItemText, { color: themeColors.text }]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={settings.notifications.push}
              onValueChange={togglePushNotifications}
              trackColor={{ false: themeColors.inactive, true: `${themeColors.primary}80` }}
              thumbColor={settings.notifications.push ? themeColors.primary : '#f4f3f4'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={toggleEmailNotifications}
          >
            <View style={styles.settingItemLeft}>
              <Mail size={20} color={themeColors.primary} />
              <Text style={[styles.settingItemText, { color: themeColors.text }]}>
                Email Notifications
              </Text>
            </View>
            <Switch
              value={settings.notifications.email}
              onValueChange={toggleEmailNotifications}
              trackColor={{ false: themeColors.inactive, true: `${themeColors.primary}80` }}
              thumbColor={settings.notifications.email ? themeColors.primary : '#f4f3f4'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={toggleSmsNotifications}
          >
            <View style={styles.settingItemLeft}>
              <MessageSquare size={20} color={themeColors.primary} />
              <Text style={[styles.settingItemText, { color: themeColors.text }]}>
                SMS Notifications
              </Text>
            </View>
            <Switch
              value={settings.notifications.sms}
              onValueChange={toggleSmsNotifications}
              trackColor={{ false: themeColors.inactive, true: `${themeColors.primary}80` }}
              thumbColor={settings.notifications.sms ? themeColors.primary : '#f4f3f4'}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Regional
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingItemLeft}>
              <Globe size={20} color={themeColors.primary} />
              <Text style={[styles.settingItemText, { color: themeColors.text }]}>
                Language
              </Text>
            </View>
            <View style={styles.settingItemRight}>
              <Text style={[styles.settingItemValue, { color: themeColors.subtext }]}>
                {languages.find(l => l.code === settings.language)?.name || 'English'}
              </Text>
              <ChevronRight size={20} color={themeColors.subtext} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={() => setShowCurrencyModal(true)}
          >
            <View style={styles.settingItemLeft}>
              <DollarSign size={20} color={themeColors.primary} />
              <Text style={[styles.settingItemText, { color: themeColors.text }]}>
                Currency
              </Text>
            </View>
            <View style={styles.settingItemRight}>
              <Text style={[styles.settingItemValue, { color: themeColors.subtext }]}>
                {currencies[settings.currency]?.name || 'Ghana Cedi'}
              </Text>
              <ChevronRight size={20} color={themeColors.subtext} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            About
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
          >
            <Text style={[styles.settingItemText, { color: themeColors.text }]}>
              Version
            </Text>
            <Text style={[styles.settingItemValue, { color: themeColors.subtext }]}>
              1.0.0
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
          >
            <Text style={[styles.settingItemText, { color: themeColors.text }]}>
              Terms of Service
            </Text>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
          >
            <Text style={[styles.settingItemText, { color: themeColors.text }]}>
              Privacy Policy
            </Text>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              Select Language
            </Text>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    settings.language === item.code && styles.selectedModalItem,
                    { borderBottomColor: themeColors.border }
                  ]}
                  onPress={() => handleLanguageChange(item.code)}
                >
                  <Text style={[
                    styles.modalItemText,
                    { color: themeColors.text }
                  ]}>
                    {item.name}
                  </Text>
                  
                  {settings.language === item.code && (
                    <Check size={20} color={themeColors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={[styles.modalCancelButton, { borderTopColor: themeColors.border }]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={[styles.modalCancelText, { color: themeColors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              Select Currency
            </Text>
            
            <FlatList
              data={currencyOptions}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    settings.currency === item.code && styles.selectedModalItem,
                    { borderBottomColor: themeColors.border }
                  ]}
                  onPress={() => handleCurrencyChange(item.code)}
                >
                  <View style={styles.currencyItemContent}>
                    <Text style={[styles.currencySymbol, { color: themeColors.primary }]}>
                      {item.symbol}
                    </Text>
                    <Text style={[styles.modalItemText, { color: themeColors.text }]}>
                      {item.name} ({item.code})
                    </Text>
                  </View>
                  
                  {settings.currency === item.code && (
                    <Check size={20} color={themeColors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={[styles.modalCancelButton, { borderTopColor: themeColors.border }]}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={[styles.modalCancelText, { color: themeColors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemValue: {
    fontSize: 14,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  selectedModalItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalItemText: {
    fontSize: 16,
  },
  currencyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  modalCancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
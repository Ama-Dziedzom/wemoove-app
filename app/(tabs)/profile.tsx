import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  CreditCard, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  Edit2,
  Shield,
  HelpCircle,
  Star
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import PaymentMethodCard from '@/components/PaymentMethodCard';

export default function ProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  const { settings, paymentMethods, refreshPaymentMethods } = useAppStore();
  const { user, logout, refreshUserProfile } = useAuthStore();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Refresh user profile
    if (refreshUserProfile) {
      await refreshUserProfile();
    }
    
    // Refresh payment methods
    if (refreshPaymentMethods) {
      await refreshPaymentMethods();
    }
    
    setRefreshing(false);
  }, [refreshUserProfile, refreshPaymentMethods]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    router.push('/add-payment-method');
  };

  const handleEditProfile = () => {
    // In a real app, navigate to profile edit screen
    Alert.alert('Edit Profile', 'This feature is coming soon!');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleOpenNotifications = () => {
    router.push('/notifications');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { borderColor: themeColors.border }]}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: themeColors.primary }]}>
                <User size={36} color="#FFFFFF" />
              </View>
              
              <TouchableOpacity 
                style={[styles.editAvatarButton, { backgroundColor: themeColors.primary }]}
                onPress={handleEditProfile}
              >
                <Edit2 size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: themeColors.text }]}>
                {user?.name || 'Ama Dziedzom'}
              </Text>
              <Text style={[styles.userPhone, { color: themeColors.subtext }]}>
                {user?.phone || '0548902177'}
              </Text>
            </View>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: themeColors.card }]}
              onPress={handleOpenSettings}
            >
              <Settings size={20} color={themeColors.primary} />
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>
                Settings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: themeColors.card }]}
              onPress={handleOpenNotifications}
            >
              <Bell size={20} color={themeColors.primary} />
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>
                Notifications
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: themeColors.card }]}
              onPress={handleLogout}
            >
              <LogOut size={20} color={themeColors.primary} />
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.section, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Payment Methods
            </Text>
            <TouchableOpacity onPress={handleAddPaymentMethod}>
              <Text style={[styles.addText, { color: themeColors.primary }]}>
                Add New
              </Text>
            </TouchableOpacity>
          </View>
          
          {paymentMethods.length > 0 ? (
            <View style={styles.paymentMethodsContainer}>
              {paymentMethods.map(method => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onPress={() => {
                    // In a real app, navigate to payment method details
                    Alert.alert('Payment Method', 'View or edit payment method');
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyPaymentMethods}>
              <CreditCard size={40} color={themeColors.subtext} />
              <Text style={[styles.emptyText, { color: themeColors.text }]}>
                No payment methods added yet
              </Text>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: themeColors.primary }]}
                onPress={handleAddPaymentMethod}
              >
                <Text style={styles.addButtonText}>
                  Add Payment Method
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={[styles.menuItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={() => {
              // In a real app, navigate to account settings
              Alert.alert('Account Settings', 'This feature is coming soon!');
            }}
          >
            <View style={styles.menuItemLeft}>
              <User size={20} color={themeColors.primary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Account Settings
              </Text>
            </View>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={() => {
              // In a real app, navigate to security settings
              Alert.alert('Security', 'This feature is coming soon!');
            }}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={20} color={themeColors.primary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Security
              </Text>
            </View>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={() => {
              // In a real app, navigate to help center
              Alert.alert('Help Center', 'This feature is coming soon!');
            }}
          >
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color={themeColors.primary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Help Center
              </Text>
            </View>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
            onPress={() => {
              // In a real app, navigate to rate app
              Alert.alert('Rate Us', 'This feature is coming soon!');
            }}
          >
            <View style={styles.menuItemLeft}>
              <Star size={20} color={themeColors.primary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Rate Our App
              </Text>
            </View>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentMethodsContainer: {
    gap: 12,
  },
  emptyPaymentMethods: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    marginVertical: 12,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  menuSection: {
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});
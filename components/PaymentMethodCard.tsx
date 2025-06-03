import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard, Smartphone, Building, Check } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { PaymentMethod } from '@/types';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onPress: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, onPress }) => {
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];

  const getIcon = () => {
    switch (method.type) {
      case 'card':
        return <CreditCard size={24} color={themeColors.primary} />;
      case 'mobile_money':
        return <Smartphone size={24} color={themeColors.secondary} />;
      case 'bank':
        return <Building size={24} color={themeColors.info} />;
      default:
        return <CreditCard size={24} color={themeColors.primary} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        borderColor: method.isDefault ? themeColors.primary : themeColors.border,
        borderWidth: method.isDefault ? 2 : 1,
      }]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={[styles.methodName, { color: themeColors.text }]}>
          {method.name}
        </Text>
        {method.expiryDate && (
          <Text style={[styles.expiryDate, { color: themeColors.subtext }]}>
            Expires {method.expiryDate}
          </Text>
        )}
      </View>
      
      {method.isDefault && (
        <View style={[styles.defaultBadge, { backgroundColor: themeColors.primary }]}>
          <Check size={12} color="#FFFFFF" />
          <Text style={styles.defaultText}>Default</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 12,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
});

export default PaymentMethodCard;
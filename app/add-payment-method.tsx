import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  CreditCard, 
  Smartphone, 
  Building,
  Check
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { PaymentMethod } from '@/app/types';

export default function AddPaymentMethodScreen() {
  const [selectedType, setSelectedType] = useState<'card' | 'mobile_money' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { settings, addPaymentMethod } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateCardDetails = () => {
    if (selectedType === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        Alert.alert('Error', 'Please fill in all card details');
        return false;
      }
      
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return false;
      }
      
      if (expiryDate.length !== 5) {
        Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
        return false;
      }
      
      if (cvv.length < 3) {
        Alert.alert('Error', 'Please enter a valid CVV');
        return false;
      }
    }
    
    return true;
  };

  const handleAddPaymentMethod = async () => {
    if (!validateCardDetails()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let methodName = '';
      
      switch (selectedType) {
        case 'card':
          const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
          methodName = `${cardName.split(' ')[0]}'s Card ending in ${lastFour}`;
          break;
        case 'mobile_money':
          methodName = 'Mobile Money';
          break;
        case 'bank':
          methodName = 'Bank Account';
          break;
      }
      
      const newMethod: PaymentMethod = {
        id: `pm${Date.now()}`,
        type: selectedType,
        name: methodName,
        isDefault,
        expiryDate: selectedType === 'card' ? expiryDate : undefined
      };
      
      addPaymentMethod(newMethod);
      
      Alert.alert(
        'Success',
        'Payment method added successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Add Payment Method
        </Text>
        
        <View style={styles.paymentTypeContainer}>
          <TouchableOpacity
            style={[
              styles.paymentTypeButton,
              selectedType === 'card' && [styles.selectedType, { borderColor: themeColors.primary }],
              { backgroundColor: themeColors.card }
            ]}
            onPress={() => setSelectedType('card')}
          >
            <CreditCard 
              size={24} 
              color={selectedType === 'card' ? themeColors.primary : themeColors.text} 
            />
            <Text style={[
              styles.paymentTypeText,
              { color: selectedType === 'card' ? themeColors.primary : themeColors.text }
            ]}>
              Card
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentTypeButton,
              selectedType === 'mobile_money' && [styles.selectedType, { borderColor: themeColors.primary }],
              { backgroundColor: themeColors.card }
            ]}
            onPress={() => setSelectedType('mobile_money')}
          >
            <Smartphone 
              size={24} 
              color={selectedType === 'mobile_money' ? themeColors.primary : themeColors.text} 
            />
            <Text style={[
              styles.paymentTypeText,
              { color: selectedType === 'mobile_money' ? themeColors.primary : themeColors.text }
            ]}>
              Mobile Money
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentTypeButton,
              selectedType === 'bank' && [styles.selectedType, { borderColor: themeColors.primary }],
              { backgroundColor: themeColors.card }
            ]}
            onPress={() => setSelectedType('bank')}
          >
            <Building 
              size={24} 
              color={selectedType === 'bank' ? themeColors.primary : themeColors.text} 
            />
            <Text style={[
              styles.paymentTypeText,
              { color: selectedType === 'bank' ? themeColors.primary : themeColors.text }
            ]}>
              Bank
            </Text>
          </TouchableOpacity>
        </View>
        
        {selectedType === 'card' && (
          <View style={[styles.formContainer, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border
          }]}>
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="number-pad"
              maxLength={19} // 16 digits + 3 spaces
            />
            
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardName}
              onChangeText={setCardName}
              autoCapitalize="words"
            />
            
            <View style={styles.rowContainer}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="number-pad"
                style={styles.expiryInput}
                maxLength={5} // MM/YY
              />
              
              <Input
                label="CVV"
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                style={styles.cvvInput}
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        )}
        
        {selectedType === 'mobile_money' && (
          <View style={[styles.formContainer, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border
          }]}>
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              Mobile Money integration is coming soon. You will be able to link your mobile money account for seamless payments.
            </Text>
          </View>
        )}
        
        {selectedType === 'bank' && (
          <View style={[styles.formContainer, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border
          }]}>
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              Bank account integration is coming soon. You will be able to link your bank account for direct payments.
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.defaultOption, { borderColor: themeColors.border }]}
          onPress={() => setIsDefault(!isDefault)}
        >
          <View style={[
            styles.checkbox,
            isDefault && { backgroundColor: themeColors.primary, borderColor: themeColors.primary }
          ]}>
            {isDefault && <Check size={16} color="#FFFFFF" />}
          </View>
          <Text style={[styles.defaultText, { color: themeColors.text }]}>
            Set as default payment method
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <View style={[styles.footer, { 
        backgroundColor: themeColors.card,
        borderTopColor: themeColors.border
      }]}>
        <Button
          title="Add Payment Method"
          onPress={handleAddPaymentMethod}
          loading={isLoading}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  paymentTypeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedType: {
    borderWidth: 2,
  },
  paymentTypeText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  expiryInput: {
    flex: 1,
  },
  cvvInput: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    padding: 16,
  },
  defaultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
});
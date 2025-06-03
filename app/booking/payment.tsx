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
import { useBookingStore } from '@/store/booking-store';
import { useCurrency } from '@/hooks/useCurrency';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { settings, paymentMethods } = useAppStore();
  const { 
    currentBooking, 
    setPaymentMethod,
    confirmBooking
  } = useBookingStore();
  const { formatCurrency } = useCurrency();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  // Set default payment method if available
  React.useEffect(() => {
    const defaultMethod = paymentMethods.find(method => method.isDefault);
    if (defaultMethod) {
      setSelectedPaymentMethod(defaultMethod.id);
    }
  }, [paymentMethods]);

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

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

  const validatePayment = () => {
    if (selectedPaymentMethod) {
      return true;
    }
    
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
    
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get payment method name
      let paymentMethodName = 'New Card';
      if (selectedPaymentMethod) {
        const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
        if (method) {
          paymentMethodName = method.name;
        }
      }
      
      // Set payment method in store
      setPaymentMethod(paymentMethodName);
      
      // Confirm booking
      const booking = await confirmBooking();
      
      // Navigate to confirmation screen
      router.replace('/booking/confirmation');
    } catch (error) {
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentBooking.selectedBus) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.text }]}>
            No booking information found. Please go back and start a new booking.
          </Text>
          <Button
            title="Go to Home"
            onPress={() => router.replace('/')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const { selectedBus, passengers } = currentBooking;
  const totalAmount = (selectedBus.price * passengers) + 2;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.summaryCard, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <Text style={[styles.summaryTitle, { color: themeColors.text }]}>
            Booking Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.subtext }]}>
              Bus
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>
              {selectedBus.name}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.subtext }]}>
              Plate Number
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>
              {selectedBus.plate_number}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.subtext }]}>
              Route
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>
              {currentBooking.from} to {currentBooking.to}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.subtext }]}>
              Date & Time
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>
              {new Date(currentBooking.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} • {selectedBus.departureTime}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.subtext }]}>
              Passengers
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>
              {passengers} {passengers === 1 ? 'person' : 'people'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.subtext }]}>
              Seats
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>
              {currentBooking.selectedSeats.join(', ')}
            </Text>
          </View>
          <View style={[styles.totalRow, { borderTopColor: themeColors.border }]}>
            <Text style={[styles.totalLabel, { color: themeColors.text }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: themeColors.primary }]}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.paymentCard, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <Text style={[styles.paymentTitle, { color: themeColors.text }]}>
            Payment Method
          </Text>
          
          {paymentMethods.length > 0 && (
            <View style={styles.savedMethods}>
              <Text style={[styles.savedMethodsTitle, { color: themeColors.text }]}>
                Saved Payment Methods
              </Text>
              
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodItem,
                    selectedPaymentMethod === method.id && [
                      styles.selectedPaymentMethod,
                      { borderColor: themeColors.primary }
                    ],
                    { borderColor: themeColors.border }
                  ]}
                  onPress={() => handlePaymentMethodSelect(method.id)}
                >
                  <View style={styles.paymentMethodIcon}>
                    {method.type === 'card' && <CreditCard size={24} color={themeColors.primary} />}
                    {method.type === 'mobile_money' && <Smartphone size={24} color={themeColors.secondary} />}
                    {method.type === 'bank' && <Building size={24} color={themeColors.info} />}
                  </View>
                  
                  <View style={styles.paymentMethodInfo}>
                    <Text style={[styles.paymentMethodName, { color: themeColors.text }]}>
                      {method.name}
                    </Text>
                    {method.expiryDate && (
                      <Text style={[styles.paymentMethodExpiry, { color: themeColors.subtext }]}>
                        Expires {method.expiryDate}
                      </Text>
                    )}
                  </View>
                  
                  {selectedPaymentMethod === method.id && (
                    <View style={[styles.checkmark, { backgroundColor: themeColors.primary }]}>
                      <Check size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <View style={styles.newCardSection}>
            <Text style={[styles.newCardTitle, { color: themeColors.text }]}>
              Pay with a new card
            </Text>
            
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
            
            <View style={styles.cardDetailsRow}>
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
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { 
        backgroundColor: themeColors.card,
        borderTopColor: themeColors.border
      }]}>
        <Button
          title={`Pay ${formatCurrency(totalAmount)}`}
          onPress={handlePayment}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    minWidth: 120,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  savedMethods: {
    marginBottom: 24,
  },
  savedMethodsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderWidth: 2,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  paymentMethodExpiry: {
    fontSize: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCardSection: {
    marginTop: 8,
  },
  newCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  expiryInput: {
    flex: 1,
  },
  cvvInput: {
    flex: 1,
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
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, ArrowRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { settings } = useAppStore();
  const { resetPassword, isLoading } = useAuthStore();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    try {
      await resetPassword(phone);
      setStep(2);
      Alert.alert('Success', 'OTP sent to your phone number');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }
    
    // In a real app, verify OTP with API
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both passwords');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // In a real app, reset password with API
    Alert.alert(
      'Success',
      'Your password has been reset successfully',
      [
        {
          text: 'Login',
          onPress: () => router.replace('/login')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5087/5087579.png' }}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: themeColors.text }]}>
              Reset Password
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.subtext }]}>
              {step === 1 && "Enter your phone number to receive a verification code"}
              {step === 2 && "Enter the verification code sent to your phone"}
              {step === 3 && "Create a new password for your account"}
            </Text>
          </View>
          
          <View style={styles.form}>
            {step === 1 && (
              <>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  icon={<Phone size={20} color={themeColors.primary} />}
                />
                
                <Button
                  title="Send Verification Code"
                  onPress={handleSendOTP}
                  loading={isLoading}
                  icon={<ArrowRight size={18} color="#FFFFFF" />}
                  fullWidth
                  style={styles.actionButton}
                />
              </>
            )}
            
            {step === 2 && (
              <>
                <Input
                  label="Verification Code"
                  placeholder="Enter 4-digit code"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={4}
                />
                
                <TouchableOpacity 
                  style={styles.resendCode}
                  onPress={handleSendOTP}
                >
                  <Text style={[styles.resendCodeText, { color: themeColors.primary }]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
                
                <Button
                  title="Verify Code"
                  onPress={handleVerifyOTP}
                  icon={<ArrowRight size={18} color="#FFFFFF" />}
                  fullWidth
                  style={styles.actionButton}
                />
              </>
            )}
            
            {step === 3 && (
              <>
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                
                <Input
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
                
                <Button
                  title="Reset Password"
                  onPress={handleResetPassword}
                  icon={<ArrowRight size={18} color="#FFFFFF" />}
                  fullWidth
                  style={styles.actionButton}
                />
              </>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.backToLogin}
            onPress={() => router.back()}
          >
            <Text style={[styles.backToLoginText, { color: themeColors.primary }]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  actionButton: {
    marginTop: 16,
  },
  resendCode: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  resendCodeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  backToLogin: {
    alignSelf: 'center',
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
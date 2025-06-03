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
  ScrollView,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User,
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Check
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { settings } = useAppStore();
  const { register, registerWithSocial, isLoading, error } = useAuthStore();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    if (!agreeToTerms) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setErrorMessage(null);
    
    try {
      await register(name, phone, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create account. Please try again.');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSocialRegister = async (provider: string) => {
    try {
      setErrorMessage(null);
      
      if (!agreeToTerms) {
        setErrorMessage('Please agree to the Terms of Service and Privacy Policy');
        return;
      }
      
      let authUrl = '';
      
      // In a real app, these would be proper OAuth URLs
      switch (provider) {
        case 'Google':
          authUrl = 'https://accounts.google.com/o/oauth2/auth';
          break;
        case 'Facebook':
          authUrl = 'https://www.facebook.com/v12.0/dialog/oauth';
          break;
        case 'Apple':
          authUrl = 'https://appleid.apple.com/auth/authorize';
          break;
        default:
          throw new Error('Unknown provider');
      }
      
      // Open the URL in the browser
      const supported = await Linking.canOpenURL(authUrl);
      
      if (supported) {
        // In a real app, we would handle the redirect back to the app
        // and extract the auth token from the URL
        await Linking.openURL(authUrl);
        
        // For demo purposes, we'll simulate a successful registration after a delay
        setTimeout(async () => {
          try {
            await registerWithSocial(provider);
            router.replace('/(tabs)');
          } catch (error: any) {
            setErrorMessage(error.message || `${provider} registration failed`);
          }
        }, 1000);
      } else {
        Alert.alert(`Cannot open ${provider} registration page`);
      }
    } catch (error: any) {
      setErrorMessage(error.message || `${provider} registration failed`);
    }
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
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.subtext }]}>
              Sign up to get started with wemoove
            </Text>
          </View>
          
          <View style={styles.form}>
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              icon={<User size={20} color={themeColors.primary} />}
              autoCapitalize="words"
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon={<Phone size={20} color={themeColors.primary} />}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon={<Lock size={20} color={themeColors.primary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={themeColors.subtext} />
                  ) : (
                    <Eye size={20} color={themeColors.subtext} />
                  )}
                </TouchableOpacity>
              }
            />
            
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[
                styles.checkbox,
                agreeToTerms && { backgroundColor: themeColors.primary, borderColor: themeColors.primary }
              ]}>
                {agreeToTerms && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.termsText, { color: themeColors.text }]}>
                I agree to the <Text style={{ color: themeColors.primary }}>Terms of Service</Text> and <Text style={{ color: themeColors.primary }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              icon={<ArrowRight size={18} color="#FFFFFF" />}
              fullWidth
            />
          </View>
          
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
            <Text style={[styles.dividerText, { color: themeColors.subtext }]}>
              Or sign up with
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
          </View>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border
              }]}
              onPress={() => handleSocialRegister('Google')}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border
              }]}
              onPress={() => handleSocialRegister('Facebook')}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png' }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border
              }]}
              onPress={() => handleSocialRegister('Apple')}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: themeColors.subtext }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={[styles.footerLink, { color: themeColors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  },
  form: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  termsText: {
    fontSize: 14,
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    borderWidth: 1,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    marginRight: 4,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
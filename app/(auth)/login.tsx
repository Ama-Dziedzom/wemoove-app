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
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { settings } = useAppStore();
  const { login, loginWithSocial, isLoading, error } = useAuthStore();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  const handleLogin = async () => {
    if (!phone || !password) {
      setErrorMessage('Please enter both phone number and password');
      return;
    }
    
    setErrorMessage(null);
    
    try {
      await login(phone, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setErrorMessage(null);
      
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
        
        // For demo purposes, we'll simulate a successful login after a delay
        setTimeout(async () => {
          try {
            await loginWithSocial(provider);
            router.replace('/(tabs)');
          } catch (error: any) {
            setErrorMessage(error.message || `${provider} login failed`);
          }
        }, 1000);
      } else {
        Alert.alert(`Cannot open ${provider} login page`);
      }
    } catch (error: any) {
      setErrorMessage(error.message || `${provider} login failed`);
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
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.subtext }]}>
              Sign in to continue to wemoove
            </Text>
          </View>
          
          <View style={styles.form}>
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
            
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
              placeholder="Enter your password"
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
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: themeColors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            
            <Button
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              icon={<ArrowRight size={18} color="#FFFFFF" />}
              fullWidth
            />
          </View>
          
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
            <Text style={[styles.dividerText, { color: themeColors.subtext }]}>
              Or continue with
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
          </View>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: themeColors.card,
                borderColor: themeColors.border
              }]}
              onPress={() => handleSocialLogin('Google')}
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
              onPress={() => handleSocialLogin('Facebook')}
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
              onPress={() => handleSocialLogin('Apple')}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: themeColors.subtext }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={[styles.footerLink, { color: themeColors.primary }]}>
                Sign Up
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
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
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle,
  TextStyle
} from 'react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'white';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  textColor
}) => {
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];

  const getButtonStyles = () => {
    let buttonStyles: any = [styles.button];
    
    // Size
    if (size === 'small') buttonStyles.push(styles.buttonSmall);
    if (size === 'large') buttonStyles.push(styles.buttonLarge);
    
    // Width
    if (fullWidth) buttonStyles.push(styles.buttonFullWidth);
    
    // Variant
    if (variant === 'primary') {
      buttonStyles.push({ backgroundColor: themeColors.primary });
    } else if (variant === 'outline') {
      buttonStyles.push({ 
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: themeColors.border
      });
    } else if (variant === 'white') {
      buttonStyles.push({ 
        backgroundColor: '#FFFFFF',
      });
    }
    
    // Disabled
    if (disabled || loading) {
      buttonStyles.push({ opacity: 0.6 });
    }
    
    return buttonStyles;
  };

  const getTextColor = () => {
    if (textColor) return textColor;
    
    if (variant === 'primary') {
      return '#FFFFFF';
    } else if (variant === 'outline') {
      return themeColors.primary;
    } else if (variant === 'white') {
      return themeColors.primary;
    }
    
    return themeColors.text;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#FFFFFF' : themeColors.primary} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[
            styles.buttonText,
            size === 'small' && styles.buttonTextSmall,
            size === 'large' && styles.buttonTextLarge,
            { color: getTextColor() },
            icon && styles.buttonTextWithIcon,
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  buttonTextWithIcon: {
    marginLeft: 8,
  },
});

export default Button;
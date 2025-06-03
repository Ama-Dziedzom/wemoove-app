import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ActivityIndicator
} from 'react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { Location } from '@/types';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  error?: string;
  maxLength?: number;
  suggestions?: string[] | Location[];
  isLoadingSuggestions?: boolean;
  onPress?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  rightIcon,
  style,
  error,
  maxLength,
  suggestions,
  isLoadingSuggestions = false,
  onPress
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];

  const handleFocus = () => {
    setIsFocused(true);
    if (suggestions && suggestions.length > 0) {
      setShowSuggestions(true);
    }
    
    if (onPress) {
      onPress();
      return;
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionSelect = (suggestion: string | Location) => {
    // Handle both string and Location object suggestions
    if (typeof suggestion === 'string') {
      onChangeText(suggestion);
    } else if (suggestion && typeof suggestion === 'object' && 'name' in suggestion) {
      onChangeText(suggestion.name);
    }
    setShowSuggestions(false);
  };

  // Filter suggestions based on input value
  const getFilteredSuggestions = () => {
    if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) return [];
    
    return suggestions.filter(suggestion => {
      if (!suggestion) return false;
      
      let suggestionText = '';
      if (typeof suggestion === 'string') {
        suggestionText = suggestion;
      } else if (typeof suggestion === 'object' && 'name' in suggestion && suggestion.name) {
        suggestionText = suggestion.name;
      } else {
        return false; // Skip invalid suggestions
      }
      
      // Ensure suggestionText is defined and a string before calling toLowerCase()
      return suggestionText && typeof suggestionText === 'string' && 
             suggestionText.toLowerCase().includes((value || '').toLowerCase());
    });
  };

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: themeColors.text }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && [styles.inputContainerFocused, { borderColor: themeColors.primary }],
        error && [styles.inputContainerError, { borderColor: themeColors.error }],
        { backgroundColor: themeColors.card, borderColor: themeColors.border }
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            { color: themeColors.text }
          ]}
          placeholder={placeholder}
          placeholderTextColor={themeColors.subtext}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          editable={!onPress}
        />
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: themeColors.error }]}>
          {error}
        </Text>
      )}
      
      {showSuggestions && (
        <View style={[styles.suggestionsContainer, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          {isLoadingSuggestions ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={themeColors.primary} />
              <Text style={[styles.loadingText, { color: themeColors.subtext }]}>
                Loading locations...
              </Text>
            </View>
          ) : filteredSuggestions.length > 0 ? (
            filteredSuggestions.slice(0, 5).map((suggestion, index) => {
              // Safely extract suggestion text and details
              let suggestionText = '';
              let locationDetails = '';
              
              if (typeof suggestion === 'string') {
                suggestionText = suggestion;
              } else if (suggestion && typeof suggestion === 'object' && 'name' in suggestion) {
                suggestionText = suggestion.name || '';
                
                if (suggestion.state) {
                  locationDetails = suggestion.state;
                  if (suggestion.country) {
                    locationDetails += `, ${suggestion.country}`;
                  }
                } else if (suggestion.country) {
                  locationDetails = suggestion.country;
                }
              }
              
              // Skip rendering if suggestionText is undefined or empty
              if (!suggestionText) return null;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionItem, { 
                    borderBottomColor: index < filteredSuggestions.length - 1 ? themeColors.border : 'transparent'
                  }]}
                  onPress={() => handleSuggestionSelect(suggestion)}
                >
                  <Text style={[styles.suggestionText, { color: themeColors.text }]}>
                    {suggestionText}
                  </Text>
                  {locationDetails ? (
                    <Text style={[styles.suggestionSubtext, { color: themeColors.subtext }]}>
                      {locationDetails}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={[styles.noResultsText, { color: themeColors.subtext }]}>
                No matching locations found
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative', // Important for suggestion dropdown positioning
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderWidth: 2,
  },
  inputContainerError: {
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80, // Position below the input
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 250,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
  },
});

export default Input;
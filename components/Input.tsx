// components/Input.tsx

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/styles';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  icon?: string;
  iconPosition?: 'left' | 'right';
  onIconPress?: () => void;
  style?: any;
  maxLength?: number;
  required?: boolean;
};

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  icon,
  iconPosition = 'right',
  onIconPress,
  style,
  maxLength,
  required = false,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine if this is a password input that should show the visibility toggle
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {icon && iconPosition === 'left' && (
          <TouchableOpacity 
            style={styles.leftIcon} 
            onPress={onIconPress}
            disabled={!onIconPress}
          >
            <FontAwesome5 name={icon} size={18} color={COLORS.grey} />
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[
            styles.input,
            isFocused && styles.focusedInput,
            error && styles.errorInput,
            multiline && styles.multilineInput,
            icon && iconPosition === 'left' && styles.inputWithLeftIcon,
            (icon || isPassword) && iconPosition === 'right' && styles.inputWithRightIcon,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {isPassword && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={togglePasswordVisibility}
          >
            <FontAwesome5 
              name={isPasswordVisible ? 'eye-slash' : 'eye'} 
              size={18} 
              color={COLORS.grey} 
            />
          </TouchableOpacity>
        )}
        
        {icon && iconPosition === 'right' && !isPassword && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={onIconPress}
            disabled={!onIconPress}
          >
            <FontAwesome5 name={icon} size={18} color={COLORS.grey} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing_md,
    width: '100%',
  },
  label: {
    ...FONTS.body2,
    marginBottom: SIZES.spacing_xs,
    color: COLORS.dark,
  },
  required: {
    color: COLORS.danger,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius_sm,
    paddingHorizontal: SIZES.spacing_md,
    paddingVertical: SIZES.spacing_sm,
    fontSize: SIZES.md,
    color: COLORS.dark,
  },
  focusedInput: {
    borderColor: COLORS.primary,
  },
  errorInput: {
    borderColor: COLORS.danger,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SIZES.spacing_md,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    position: 'absolute',
    left: SIZES.spacing_md,
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: SIZES.spacing_md,
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
  errorText: {
    ...FONTS.caption,
    color: COLORS.danger,
    marginTop: SIZES.spacing_xs,
  },
});

export default Input;
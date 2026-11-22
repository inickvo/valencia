// components/Button.tsx

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/styles';

// Import icons
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type ButtonProps = {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
};

const Button = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  // Determine button style based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryButton;
      case 'accent':
        return styles.accentButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine text color based on button type
  const getTextStyle = () => {
    if (type === 'outline') {
      return styles.darkText;
    }
    return styles.lightText;
  };

  // Determine button size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determine icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 22;
      default:
        return 18;
    }
  };

  // Render icon if provided
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <FontAwesome5 
        name={icon} 
        size={getIconSize()} 
        color={type === 'outline' ? COLORS.primary : COLORS.white} 
        style={iconPosition === 'left' ? styles.leftIcon : styles.rightIcon} 
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'outline' ? COLORS.primary : COLORS.white} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && renderIcon()}
          <Text 
            style={[
              styles.buttonText, 
              getTextStyle(),
              getSizeStyle(),
              disabled && styles.disabledText
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius_sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  accentButton: {
    backgroundColor: COLORS.accent,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  successButton: {
    backgroundColor: COLORS.success,
  },
  smallButton: {
    paddingVertical: SIZES.spacing_xs,
    paddingHorizontal: SIZES.spacing_md,
  },
  mediumButton: {
    paddingVertical: SIZES.spacing_sm,
    paddingHorizontal: SIZES.spacing_lg,
  },
  largeButton: {
    paddingVertical: SIZES.spacing_md,
    paddingHorizontal: SIZES.spacing_xl,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.lightGrey,
    ...SHADOWS.none,
  },
  buttonText: {
    textAlign: 'center',
    ...FONTS.button,
  },
  lightText: {
    color: COLORS.white,
  },
  darkText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.grey,
  },
  leftIcon: {
    marginRight: SIZES.spacing_sm,
  },
  rightIcon: {
    marginLeft: SIZES.spacing_sm,
  },
});

export default Button;
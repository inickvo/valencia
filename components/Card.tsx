// components/Card.tsx

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/styles';

type CardProps = {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
  style?: any;
  elevation?: 'none' | 'small' | 'medium' | 'large';
};

const Card = ({
  title,
  children,
  footer,
  onPress,
  style,
  elevation = 'small',
}: CardProps) => {
  // Get shadow style based on elevation
  const getElevationStyle = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'medium':
        return styles.mediumShadow;
      case 'large':
        return styles.largeShadow;
      default:
        return styles.smallShadow;
    }
  };

  const cardContent = (
    <>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, getElevationStyle(), style]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, getElevationStyle(), style]}>
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius_md,
    padding: SIZES.spacing_md,
    marginVertical: SIZES.spacing_sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  smallShadow: {
    ...SHADOWS.small,
  },
  mediumShadow: {
    ...SHADOWS.medium,
  },
  largeShadow: {
    ...SHADOWS.large,
  },
  title: {
    ...FONTS.h3,
    marginBottom: SIZES.spacing_md,
  },
  content: {
    // Content container if needed
  },
  footer: {
    marginTop: SIZES.spacing_md,
    paddingTop: SIZES.spacing_sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default Card;
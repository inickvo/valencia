// constants/styles.js
// Centralized style constants for the app

export const COLORS = {
    primary: '#1E5F8A',      // Deeper blue for primary actions
    secondary: '#4DA1D8',    // Tennis blue for secondary elements
    accent: '#F0C14B',       // Warm yellow for accents and highlights
    success: '#4CAF50',      // Green for success states
    danger: '#E74C3C',       // Red for errors and important actions
    warning: '#F39C12',      // Orange for warnings
    info: '#3498DB',         // Light blue for info
    dark: '#002147',         // Deep navy for text
    grey: '#757575',         // Mid grey for secondary text
    lightGrey: '#EEEEEE',    // Light grey for backgrounds
    white: '#FFFFFF',        // White
    black: '#000000',        // Black
    background: '#F9F9F9',   // Subtle off-white for backgrounds
    card: '#FFFFFF',         // Card background
    border: '#E0E0E0',       // Border color
    shadow: 'rgba(0, 0, 0, 0.1)', // Shadow color
  };
  
  export const SIZES = {
    // Font sizes
    xxxs: 8,
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    
    // Spacing
    spacing_xs: 4,
    spacing_sm: 8,
    spacing_md: 16,
    spacing_lg: 24,
    spacing_xl: 32,
    spacing_xxl: 48,
    
    // Border radius
    radius_xs: 4,
    radius_sm: 8,
    radius_md: 12,
    radius_lg: 16,
    radius_xl: 24,
    radius_xxl: 32,
    
    // Button sizes
    buttonHeight: 48,
    iconSize: 24,
    smallIconSize: 16,
    largeIconSize: 32,
  };
  
  export const FONTS = {
    regular: {
      fontWeight: '400',
    },
    medium: {
      fontWeight: '500',
    },
    bold: {
      fontWeight: '700',
    },
    light: {
      fontWeight: '300',
    },
    
    // Heading styles
    h1: {
      fontSize: SIZES.xxxl,
      fontWeight: '700',
      color: COLORS.dark,
    },
    h2: {
      fontSize: SIZES.xxl,
      fontWeight: '700',
      color: COLORS.dark,
    },
    h3: {
      fontSize: SIZES.xl,
      fontWeight: '600',
      color: COLORS.dark,
    },
    h4: {
      fontSize: SIZES.lg,
      fontWeight: '600',
      color: COLORS.dark,
    },
    
    // Body text styles
    body1: {
      fontSize: SIZES.md,
      fontWeight: '400',
      color: COLORS.dark,
    },
    body2: {
      fontSize: SIZES.sm,
      fontWeight: '400',
      color: COLORS.dark,
    },
    caption: {
      fontSize: SIZES.xs,
      fontWeight: '400',
      color: COLORS.grey,
    },
    button: {
      fontSize: SIZES.md,
      fontWeight: '600',
      color: COLORS.white,
    },
  };
  
  export const SHADOWS = {
    small: {
      shadowColor: COLORS.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: COLORS.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 6,
    },
    large: {
      shadowColor: COLORS.shadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
    },
  };
  
  // Common component styles
  export const CARD_STYLES = {
    container: {
      backgroundColor: COLORS.card,
      borderRadius: SIZES.radius_md,
      padding: SIZES.spacing_md,
      ...SHADOWS.small,
      marginVertical: SIZES.spacing_sm,
    },
    title: {
      ...FONTS.h3,
      marginBottom: SIZES.spacing_sm,
    },
    content: {
      ...FONTS.body1,
    },
    footer: {
      marginTop: SIZES.spacing_md,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  };
  
  export const BUTTON_STYLES = {
    primaryButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: SIZES.spacing_md,
      paddingHorizontal: SIZES.spacing_lg,
      borderRadius: SIZES.radius_sm,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.small,
    },
    secondaryButton: {
      backgroundColor: COLORS.secondary,
      paddingVertical: SIZES.spacing_md,
      paddingHorizontal: SIZES.spacing_lg,
      borderRadius: SIZES.radius_sm,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.small,
    },
    accentButton: {
      backgroundColor: COLORS.accent,
      paddingVertical: SIZES.spacing_md,
      paddingHorizontal: SIZES.spacing_lg,
      borderRadius: SIZES.radius_sm,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.small,
    },
    outlineButton: {
      backgroundColor: COLORS.white,
      paddingVertical: SIZES.spacing_md,
      paddingHorizontal: SIZES.spacing_lg,
      borderRadius: SIZES.radius_sm,
      borderWidth: 1,
      borderColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.small,
    },
    buttonText: {
      ...FONTS.button,
    },
    buttonTextDark: {
      ...FONTS.button,
      color: COLORS.dark,
    },
    buttonIcon: {
      marginRight: SIZES.spacing_sm,
    },
  };
  
  export const INPUT_STYLES = {
    container: {
      marginBottom: SIZES.spacing_md,
    },
    label: {
      ...FONTS.body2,
      marginBottom: SIZES.spacing_xs,
    },
    input: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SIZES.radius_sm,
      paddingHorizontal: SIZES.spacing_md,
      paddingVertical: SIZES.spacing_md,
      fontSize: SIZES.md,
    },
    focusedInput: {
      borderColor: COLORS.primary,
    },
    errorInput: {
      borderColor: COLORS.danger,
    },
    errorText: {
      ...FONTS.caption,
      color: COLORS.danger,
      marginTop: SIZES.spacing_xs,
    },
  };
  
  // Layout styles
  export const CONTAINER_STYLES = {
    pageContainer: {
      flex: 1,
      backgroundColor: COLORS.background,
      padding: SIZES.spacing_md,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.background,
      padding: SIZES.spacing_md,
    },
    sectionContainer: {
      marginBottom: SIZES.spacing_lg,
    },
    sectionTitle: {
      ...FONTS.h2,
      marginBottom: SIZES.spacing_md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  };
// src/styles/DesignSystem.ts - Design System Premium
export const DesignSystem = {
  // Palette de couleurs premium
  colors: {
    // Couleurs primaires
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE', 
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6', // Bleu principal
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
      950: '#172554',
    },
    
    // Couleurs accent (or élégant)
    accent: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Or principal
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
    
    // Couleurs de succès (vert premium)
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
    
    // Couleurs d'erreur
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    
    // Couleurs neutres (palette sophistiquée)
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    
    // Couleurs spéciales
    background: {
      primary: '#FAFAFA',
      secondary: '#FFFFFF',
      tertiary: '#F8FAFC',
      dark: '#0F172A',
    },
    
    // Gradients premium
    gradients: {
      primary: ['#3B82F6', '#1D4ED8'],
      accent: ['#F59E0B', '#D97706'],
      success: ['#10B981', '#047857'],
      sunset: ['#F59E0B', '#EF4444'],
      ocean: ['#3B82F6', '#06B6D4'],
      midnight: ['#1E3A8A', '#0F172A'],
    }
  },
  
  // Typography premium
  typography: {
    // Tailles de police
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
    },
    
    // Poids de police
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    // Hauteur de ligne
    lineHeight: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    // Espacement des lettres
    letterSpacing: {
      tighter: -0.05,
      tight: -0.025,
      normal: 0,
      wide: 0.025,
      wider: 0.05,
      widest: 0.1,
    },
  },
  
  // Espacement (système 8pt)
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },
  
  // Bordures et rayons
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  // Ombres premium
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  
  // Animations et transitions
  animation: {
    timing: {
      fast: 150,
      normal: 250,
      slow: 350,
      slower: 500,
    },
    
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  // Points de rupture (responsive)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

// Composants de base réutilisables
export const BaseComponents = {
  // Bouton premium
  button: {
    primary: {
      backgroundColor: DesignSystem.colors.primary[500],
      borderRadius: DesignSystem.borderRadius.md,
      paddingVertical: DesignSystem.spacing[4],
      paddingHorizontal: DesignSystem.spacing[6],
      ...DesignSystem.shadows.md,
    },
    
    accent: {
      backgroundColor: DesignSystem.colors.accent[500],
      borderRadius: DesignSystem.borderRadius.md,
      paddingVertical: DesignSystem.spacing[4],
      paddingHorizontal: DesignSystem.spacing[6],
      ...DesignSystem.shadows.md,
    },
    
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: DesignSystem.colors.primary[500],
      borderRadius: DesignSystem.borderRadius.md,
      paddingVertical: DesignSystem.spacing[3],
      paddingHorizontal: DesignSystem.spacing[6],
    },
  },
  
  // Carte premium
  card: {
    base: {
      backgroundColor: DesignSystem.colors.background.secondary,
      borderRadius: DesignSystem.borderRadius.xl,
      padding: DesignSystem.spacing[6],
      ...DesignSystem.shadows.base,
    },
    
    elevated: {
      backgroundColor: DesignSystem.colors.background.secondary,
      borderRadius: DesignSystem.borderRadius.xl,
      padding: DesignSystem.spacing[6],
      ...DesignSystem.shadows.lg,
    },
    
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: DesignSystem.borderRadius.xl,
      padding: DesignSystem.spacing[6],
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      ...DesignSystem.shadows.base,
    },
  },
  
  // Input premium
  input: {
    base: {
      borderWidth: 2,
      borderColor: DesignSystem.colors.neutral[200],
      borderRadius: DesignSystem.borderRadius.md,
      paddingVertical: DesignSystem.spacing[4],
      paddingHorizontal: DesignSystem.spacing[4],
      fontSize: DesignSystem.typography.fontSize.base,
      backgroundColor: DesignSystem.colors.background.secondary,
    },
    
    focused: {
      borderColor: DesignSystem.colors.primary[500],
      ...DesignSystem.shadows.base,
    },
    
    error: {
      borderColor: DesignSystem.colors.error[500],
    },
  },
};

// Utilitaires pour gradients
export const createGradient = (colors: string[], direction = '135deg') => ({
  background: `linear-gradient(${direction}, ${colors.join(', ')})`,
});

// Utilitaires pour animations
export const createAnimation = (
  property: string,
  duration = DesignSystem.animation.timing.normal,
  easing = DesignSystem.animation.easing.easeInOut
) => ({
  transition: `${property} ${duration}ms ${easing}`,
});

// Thème dark mode
export const DarkTheme = {
  ...DesignSystem,
  colors: {
    ...DesignSystem.colors,
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
      dark: '#020617',
    },
  },
};
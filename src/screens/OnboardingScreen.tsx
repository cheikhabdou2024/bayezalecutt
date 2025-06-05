// src/screens/OnboardingScreen.tsx - Design Premium Responsive
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Fonction pour déterminer le type d'écran
const getScreenType = () => {
  const ratio = height / width;
  if (width < 400) return 'small'; // Petits écrans
  if (ratio < 1.6) return 'tablet'; // Tablettes ou écrans larges
  if (ratio > 2.1) return 'tall'; // Écrans très hauts (iPhone X+)
  return 'normal'; // Écrans normaux
};

interface OnboardingData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string[];
  features: Array<{
    icon: string;
    text: string;
    highlight: boolean;
  }>;
}

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const screenType = getScreenType();

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentPage]);

  const onboardingData: OnboardingData[] = [
    {
      id: 1,
      title: 'Baye Zale Cutt',
      subtitle: 'L\'Excellence en Coiffure',
      description: 'Découvrez l\'art de la coiffure moderne avec Baye Zale, votre expert en style et élégance à Dakar.',
      icon: '💫',
      gradient: ['#667eea', '#764ba2'],
      features: [
        { icon: '⚡', text: 'Réservation Express', highlight: true },
        { icon: '🎨', text: 'Styles Personnalisés', highlight: false },
        { icon: '⭐', text: 'Service Premium', highlight: true }
      ]
    },
    {
      id: 2,
      title: 'Réservation Intelligente',
      subtitle: 'Simple. Rapide. Efficace.',
      description: 'Réservez votre créneau en quelques secondes avec notre système intelligent de gestion des files d\'attente.',
      icon: '🚀',
      gradient: ['#f093fb', '#f5576c'],
      features: [
        { icon: '📱', text: 'Interface Intuitive', highlight: true },
        { icon: '🔔', text: 'Notifications Temps Réel', highlight: false },
        { icon: '💰', text: 'Paiement Sécurisé', highlight: true }
      ]
    },
    {
      id: 3,
      title: 'Votre Style, Notre Passion',
      subtitle: 'Prêt à Briller ?',
      description: 'Rejoignez des centaines de clients satisfaits et transformez votre style avec Baye Zale Cutt.',
      icon: '✨',
      gradient: ['#4facfe', '#00f2fe'],
      features: [
        { icon: '👑', text: 'Expertise Reconnue', highlight: true },
        { icon: '📸', text: 'Galerie Inspirante', highlight: false },
        { icon: '🏆', text: 'Satisfaction Garantie', highlight: true }
      ]
    }
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollPosition / width);
    
    if (pageIndex !== currentPage) {
      setCurrentPage(pageIndex);
      
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      // Trigger animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const goToNext = () => {
    if (currentPage < onboardingData.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentPage + 1) * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  // Styles dynamiques basés sur le type d'écran
  const dynamicStyles = StyleSheet.create({
    // Ajustements pour petits écrans
    ...(screenType === 'small' && {
      iconContainer: {
        marginBottom: 24,
      },
      iconBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
      },
      mainIcon: {
        fontSize: 32,
      },
      title: {
        fontSize: 24,
      },
      subtitle: {
        fontSize: 16,
      },
      description: {
        fontSize: 14,
        paddingHorizontal: 8,
      },
      contentContainer: {
        paddingTop: height * 0.15, // 15% du haut
        paddingHorizontal: 16,
      },
      actionButtonText: {
        fontSize: 16,
      },
    }),

    // Ajustements pour tablettes
    ...(screenType === 'tablet' && {
      iconContainer: {
        marginBottom: 48,
      },
      iconBackground: {
        width: 140,
        height: 140,
        borderRadius: 70,
      },
      mainIcon: {
        fontSize: 64,
      },
      title: {
        fontSize: 42,
      },
      subtitle: {
        fontSize: 24,
      },
      description: {
        fontSize: 18,
        paddingHorizontal: 32,
      },
      contentContainer: {
        paddingTop: height * 0.2,
        paddingHorizontal: 64,
      },
      featuresContainer: {
        paddingHorizontal: 32,
      },
    }),

    // Ajustements pour écrans très hauts
    ...(screenType === 'tall' && {
      contentContainer: {
        paddingTop: height * 0.25, // Plus d'espace en haut
        paddingHorizontal: 32,
      },
      textContainer: {
        marginBottom: 64,
      },
    }),

    // Ajustements pour écrans normaux
    ...(screenType === 'normal' && {
      contentContainer: {
        paddingTop: height * 0.2,
        paddingHorizontal: 32,
      },
    }),
  });

  const renderFloatingElements = () => (
    <View style={styles.floatingElements}>
      {[...Array(screenType === 'small' ? 10 : 15)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.floatingElement,
            {
              left: Math.random() * width,
              top: Math.random() * height,
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, screenType === 'small' ? 0.05 : 0.1],
              }),
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            }
          ]}
        />
      ))}
    </View>
  );

  const renderPage = (item: OnboardingData, index: number) => (
    <View key={item.id} style={styles.page}>
      <LinearGradient
        colors={item.gradient}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Éléments flottants décoratifs */}
        {renderFloatingElements()}

        {/* Contenu principal */}
        <View style={[styles.contentContainer, dynamicStyles.contentContainer]}>
          {/* Icône principale avec animation */}
          <Animated.View 
            style={[
              styles.iconContainer,
              dynamicStyles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={[styles.iconBackground, dynamicStyles.iconBackground]}>
              <Text style={[styles.mainIcon, dynamicStyles.mainIcon]}>{item.icon}</Text>
            </View>
            <View style={[styles.iconGlow, {
              width: (dynamicStyles.iconBackground?.width || 120) + 20,
              height: (dynamicStyles.iconBackground?.height || 120) + 20,
              borderRadius: ((dynamicStyles.iconBackground?.width || 120) + 20) / 2,
              top: -10,
              left: -10,
            }]} />
          </Animated.View>

          {/* Titre et sous-titre */}
          <Animated.View 
            style={[
              styles.textContainer,
              dynamicStyles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={[styles.title, dynamicStyles.title]}>{item.title}</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{item.subtitle}</Text>
            <Text style={[styles.description, dynamicStyles.description]}>{item.description}</Text>
          </Animated.View>

          {/* Features avec animations décalées */}
          <Animated.View 
            style={[
              styles.featuresContainer,
              dynamicStyles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {item.features.map((feature, featureIndex) => (
              <Animated.View
                key={featureIndex}
                style={[
                  styles.featureItem,
                  feature.highlight && styles.featureHighlight,
                  {
                    opacity: fadeAnim,
                    transform: [{ 
                      translateX: new Animated.Value(-30).interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 0],
                      }) 
                    }],
                  }
                ]}
              >
                <View style={[styles.featureIconContainer, {
                  width: screenType === 'small' ? 32 : 40,
                  height: screenType === 'small' ? 32 : 40,
                  borderRadius: screenType === 'small' ? 16 : 20,
                }]}>
                  <Text style={[styles.featureIcon, {
                    fontSize: screenType === 'small' ? 16 : 20,
                  }]}>{feature.icon}</Text>
                </View>
                <Text style={[
                  styles.featureText,
                  feature.highlight && styles.featureTextHighlight,
                  { fontSize: screenType === 'small' ? 14 : 16 }
                ]}>
                  {feature.text}
                </Text>
                {feature.highlight && (
                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightBadgeText}>Premium</Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderProgressIndicator = () => (
    <View style={[styles.progressContainer, {
      top: screenType === 'small' ? 80 : 120,
    }]}>
      {onboardingData.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.progressDot,
            index === currentPage && styles.progressDotActive,
            {
              transform: [{
                scale: index === currentPage ? 1.2 : 1,
              }],
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Bouton Skip élégant */}
      <TouchableOpacity style={[styles.skipButton, {
        top: screenType === 'small' ? 40 : 60,
      }]} onPress={onComplete}>
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
          style={styles.skipButtonGradient}
        >
          <Text style={[styles.skipText, {
            fontSize: screenType === 'small' ? 12 : 14,
          }]}>Passer</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Indicateur de progression */}
      {renderProgressIndicator()}

      {/* Contenu principal */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderPage(item, index))}
      </ScrollView>

      {/* Bouton d'action avec design premium */}
      <View style={[styles.bottomContainer, {
        bottom: screenType === 'small' ? 40 : 60,
        paddingHorizontal: screenType === 'small' ? 16 : 24,
      }]}>
        <TouchableOpacity style={styles.actionButton} onPress={goToNext}>
          <LinearGradient
            colors={currentPage === onboardingData.length - 1 
              ? ['#4facfe', '#00f2fe'] 
              : ['#667eea', '#764ba2']
            }
            style={styles.actionButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.actionButtonText, dynamicStyles.actionButtonText]}>
              {currentPage === onboardingData.length - 1 ? 'Commencer l\'Aventure' : 'Suivant'}
            </Text>
            <View style={[styles.actionButtonIcon, {
              width: screenType === 'small' ? 24 : 32,
              height: screenType === 'small' ? 24 : 32,
              borderRadius: screenType === 'small' ? 12 : 16,
            }]}>
              <Text style={[styles.actionButtonIconText, {
                fontSize: screenType === 'small' ? 12 : 16,
              }]}>
                {currentPage === onboardingData.length - 1 ? '🚀' : '→'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Texte d'encouragement */}
        {currentPage === onboardingData.length - 1 && (
          <Animated.View style={[styles.encouragementContainer, { opacity: fadeAnim }]}>
            <Text style={[styles.encouragementText, {
              fontSize: screenType === 'small' ? 12 : 14,
            }]}>
              Rejoignez la communauté Baye Zale Cutt
            </Text>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    zIndex: 1000,
    borderRadius: 25,
    overflow: 'hidden',
  },
  skipButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  skipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
    width: 32,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    height: height,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 48,
    alignItems: 'center',
    position: 'relative',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  iconGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  mainIcon: {
    fontSize: 56,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureHighlight: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  featureIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  featureTextHighlight: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  highlightBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highlightBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 12,
  },
  actionButtonIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIconText: {
    color: '#FFFFFF',
  },
  encouragementContainer: {
    alignItems: 'center',
  },
  encouragementText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
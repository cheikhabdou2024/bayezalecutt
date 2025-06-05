// src/screens/OnboardingScreen.tsx - Design Premium
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

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

  const renderPage = (item: OnboardingData, index: number) => (
    <View key={item.id} style={styles.page}>
      <LinearGradient
        colors={item.gradient}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Motif de fond décoratif */}
        <View style={styles.decorativePattern}>
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.decorativeCircle,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: 0.1,
                  transform: [{ scale: Math.random() * 0.8 + 0.2 }],
                }
              ]}
            />
          ))}
        </View>

        {/* Contenu principal */}
        <View style={styles.contentContainer}>
          {/* Icône principale avec animation */}
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.iconBackground}>
              <Text style={styles.mainIcon}>{item.icon}</Text>
            </View>
            <View style={styles.iconGlow} />
          </Animated.View>

          {/* Titre et sous-titre */}
          <Animated.View 
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>

          {/* Features avec animations décalées */}
          <Animated.View 
            style={[
              styles.featuresContainer,
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
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                </View>
                <Text style={[
                  styles.featureText,
                  feature.highlight && styles.featureTextHighlight
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
    <View style={styles.progressContainer}>
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
      <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
          style={styles.skipButtonGradient}
        >
          <Text style={styles.skipText}>Passer</Text>
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
      <View style={styles.bottomContainer}>
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
            <Text style={styles.actionButtonText}>
              {currentPage === onboardingData.length - 1 ? 'Commencer l\'Aventure' : 'Suivant'}
            </Text>
            <View style={styles.actionButtonIcon}>
              <Text style={styles.actionButtonIconText}>
                {currentPage === onboardingData.length - 1 ? '🚀' : '→'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Texte d'encouragement */}
        {currentPage === onboardingData.length - 1 && (
          <Animated.View style={[styles.encouragementContainer, { opacity: fadeAnim }]}>
            <Text style={styles.encouragementText}>
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
    top: 60,
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
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    top: 120,
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
  decorativePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 200,
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
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -10,
    left: -10,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    bottom: 60,
    left: 24,
    right: 24,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  encouragementContainer: {
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
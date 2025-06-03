// src/screens/OnboardingScreen.tsx - Version avec Vidéo
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const videoRef = useRef<Video>(null);

  const handleSkip = () => {
    onComplete(); // Aller directement à l'auth
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollPosition / width);
    setCurrentPage(pageIndex);

    // Pause video when not on page 2 (index 1)
    if (pageIndex !== 1 && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  };

  const onboardingData = [
    {
      id: 1,
      type: 'image',
      media: require('../../assets/barber-onboarding.png'),
      badge: 'Baye Zale Cutt',
      title: 'Réservez Votre\nCoupe Parfaite',
      description: 'Trouvez les meilleurs coiffeurs dans votre région et réservez des rendez-vous en quelques clics avec Baye Zale',
      features: [
        { icon: '⚡', text: 'Réservation rapide' },
        { icon: '💳', text: 'Paiement sécurisé' },
        { icon: '⭐', text: 'Service de qualité' }
      ]
    },
    {
      id: 2,
      type: 'video',
      media: require('../../assets/client-testimonial.mp4'), // Votre vidéo ici
      badge: 'Témoignage Client',
      title: 'Qualité &\nRapidité Garantie',
      description: 'Découvrez l\'expérience de nos clients satisfaits et la qualité exceptionnelle de nos services',
      features: [
        { icon: '🕐', text: 'Gain de temps' },
        { icon: '✨', text: 'Résultat professionnel' },
        { icon: '😊', text: 'Satisfaction garantie' }
      ]
    },
    {
      id: 3,
      type: 'image',
      media: require('../../assets/booking-process.png'),
      badge: 'Système Simple',
      title: 'Réservation\nEn 3 Clics',
      description: 'Notre système innovant vous permet de réserver votre rendez-vous en quelques secondes, où que vous soyez',
      features: [
        { icon: '📱', text: 'Interface intuitive' },
        { icon: '🔔', text: 'Notifications en temps réel' },
        { icon: '💰', text: 'Options de paiement flexibles' }
      ]
    }
  ];

  const renderMediaContent = (item: typeof onboardingData[0]) => {
    if (item.type === 'video') {
      return (
        <>
          <Video
            ref={videoRef}
            style={styles.videoPlayer}
            source={item.media}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay={currentPage === 1} // Auto-play seulement sur la page 2
            isLooping
            isMuted={false}
            volume={0.8}
          />
          
          {/* Contrôles vidéo personnalisés */}
          <View style={styles.videoControls}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => {
                if (videoRef.current) {
                  videoRef.current.getStatusAsync().then(status => {
                    if (status.isLoaded) {
                      if (status.isPlaying) {
                        videoRef.current?.pauseAsync();
                      } else {
                        videoRef.current?.playAsync();
                      }
                    }
                  });
                }
              }}
            >
              <Text style={styles.playButtonText}>⏯️</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      return (
        <Image
          source={item.media}
          style={styles.barberImage}
          resizeMode="cover"
        />
      );
    }
  };

  const renderPage = (item: typeof onboardingData[0]) => (
    <View key={item.id} style={styles.page}>
      {/* Media Container (Image ou Vidéo) */}
      <View style={styles.imageContainer}>
        {renderMediaContent(item)}
        
        {/* Overlay avec badge Instagram style */}
        <View style={styles.imageOverlay}>
          <View style={styles.instagramBadge}>
            <Text style={styles.instagramText}>{item.badge}</Text>
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Description */}
      <Text style={styles.description}>{item.description}</Text>

      {/* Features */}
      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <View key={index} style={styles.feature}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureText}>{feature.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.progressContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index === currentPage && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  const renderBottomContent = () => {
    if (currentPage === onboardingData.length - 1) {
      // Dernière page - Afficher le bouton "Commencer"
      return (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton} 
            onPress={onComplete} // Rediriger vers l'auth
          >
            <Text style={styles.getStartedText}>Commencer</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onComplete}>
            <Text style={styles.loginText}>
              Vous avez déjà un compte ? <Text style={styles.loginLink}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      // Pages 1 et 2 - Afficher l'indicateur de swipe
      return (
        <View style={styles.swipeIndicatorContainer}>
          <Text style={styles.swipeText}>Glissez pour continuer</Text>
          <Text style={styles.swipeArrow}>👉</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button - Top Right */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Ignorer</Text>
      </TouchableOpacity>

      {/* Progress Indicator */}
      {renderDots()}

      {/* Swipeable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map(renderPage)}
      </ScrollView>

      {/* Bottom Content */}
      {renderBottomContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4F7FEE',
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width * 0.85,
    height: height * 0.45,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    position: 'relative',
  },
  barberImage: {
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoControls: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  // Badge Instagram Style
  instagramBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  instagramText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'System', // Utilisera la police système
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  swipeIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  swipeText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 8,
    fontStyle: 'italic',
  },
  swipeArrow: {
    fontSize: 16,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#4F7FEE',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#4F7FEE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    color: '#4F7FEE',
    fontWeight: '600',
  },
});
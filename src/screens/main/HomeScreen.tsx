// src/screens/main/HomeScreen.tsx - Version Ultra-Moderne avec Design Inspiré d'Onboarding
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const services = [
    {
      id: 'homme',
      title: 'Coupe Homme',
      subtitle: 'Style moderne & élégant',
      standardPrice: 8000,
      expressPrice: 10000,
      icon: '✂️',
      gradient: ['#667eea', '#764ba2'],
      popular: true,
    },
    {
      id: 'femme', 
      title: 'Coupe Femme',
      subtitle: 'Élégance & sophistication',
      standardPrice: 8000,
      expressPrice: 10000,
      icon: '💇‍♀️',
      gradient: ['#f093fb', '#f5576c'],
      popular: false,
    },
    {
      id: 'enfant',
      title: 'Coupe Enfant',
      subtitle: 'Tout en douceur',
      standardPrice: 5000,
      expressPrice: 7000,
      icon: '👶',
      gradient: ['#4facfe', '#00f2fe'],
      popular: false,
    },
    {
      id: 'domicile',
      title: 'À Domicile',
      subtitle: 'Service premium chez vous',
      standardPrice: 30000,
      expressPrice: 30000,
      icon: '🏠',
      gradient: ['#43e97b', '#38f9d7'],
      popular: true,
    },
  ];

  const stats = [
    { label: 'Clients Satisfaits', value: '500+', icon: '😊', color: '#10B981' },
    { label: 'Années d\'Expérience', value: '5+', icon: '⭐', color: '#F59E0B' },
    { label: 'Note Moyenne', value: '4.9', icon: '🏆', color: '#EF4444' },
  ];

  const renderFloatingElements = () => (
    <View style={styles.floatingElements}>
      {[...Array(15)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.floatingElement,
            {
              left: Math.random() * width,
              top: Math.random() * 800,
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Éléments flottants décoratifs */}
        {renderFloatingElements()}

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Header Premium */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <BlurView intensity={40} style={styles.headerBlur}>
              <View style={styles.headerContent}>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greeting}>Bonjour 👋</Text>
                  <Text style={styles.userName}>Prêt pour une nouvelle coupe ?</Text>
                  <Text style={styles.dateTime}>
                    {new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.notificationButton} 
                  onPress={() => Alert.alert('🔔 Notifications', 'Vous avez 3 nouvelles notifications')}
                >
                  <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.notificationGradient}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>3</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>

          {/* Hero Section - Baye Zale */}
          <Animated.View style={[styles.heroSection, { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
          }]}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => Alert.alert('🔥 Baye Zale', 'Le maître coiffeur professionnel de Dakar')}
            >
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.heroGradient}>
                <BlurView intensity={20} style={styles.heroBlur}>
                  <View style={styles.heroContent}>
                    <View style={styles.avatarContainer}>
                      <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.avatarGradient}>
                        <Text style={styles.avatarIcon}>👨‍💼</Text>
                      </LinearGradient>
                      <View style={styles.avatarGlow} />
                    </View>
                    
                    <View style={styles.heroInfo}>
                      <Text style={styles.heroName}>Baye Zale</Text>
                      <Text style={styles.heroTitle}>Maître Coiffeur Professionnel</Text>
                      
                      <View style={styles.ratingContainer}>
                        <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
                        <Text style={styles.rating}>4.9</Text>
                        <Text style={styles.reviewCount}>(156 avis)</Text>
                      </View>
                      
                      <View style={styles.statusContainer}>
                        <Animated.View 
                          style={[
                            styles.statusDot,
                            {
                              transform: [{
                                scale: fadeAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.5, 1],
                                }),
                              }],
                            }
                          ]}
                        />
                        <Text style={styles.statusText}>Disponible maintenant</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.contactButton} 
                      onPress={() => Alert.alert('📞 Contact', 'Appel en cours vers Baye Zale...')}
                    >
                      <LinearGradient colors={['#25D366', '#128C7E']} style={styles.contactGradient}>
                        <Text style={styles.contactIcon}>📞</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Statistiques Premium */}
          <Animated.View style={[styles.statsSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>🏆 Excellence Reconnue</Text>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.statCard,
                    {
                      transform: [{
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      }],
                    }
                  ]}
                >
                  <BlurView intensity={40} style={styles.statBlur}>
                    <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                      <Text style={styles.statIcon}>{stat.icon}</Text>
                    </View>
                    <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </BlurView>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Quick Booking Premium */}
          <Animated.View style={[styles.quickBookingSection, { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }]}>
            <Text style={styles.sectionTitle}>⚡ Réservation Express</Text>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => Alert.alert('⚡ Express', 'Redirection vers réservation express')}
            >
              <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.quickBookingGradient}>
                <View style={styles.quickBookingContent}>
                  <View style={styles.quickBookingIcon}>
                    <Animated.Text 
                      style={[
                        styles.quickBookingEmoji,
                        {
                          transform: [{
                            rotate: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg'],
                            }),
                          }],
                        }
                      ]}
                    >
                      ⚡
                    </Animated.Text>
                  </View>
                  <View style={styles.quickBookingText}>
                    <Text style={styles.quickBookingTitle}>Réserver Maintenant</Text>
                    <Text style={styles.quickBookingSubtitle}>Prochain créneau dans 30 min</Text>
                    <Text style={styles.quickBookingTime}>14:30 - 15:00 disponible</Text>
                  </View>
                  <View style={styles.quickBookingArrow}>
                    <Text style={styles.quickBookingArrowText}>→</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Services Premium Grid */}
          <Animated.View style={[styles.servicesSection, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💫 Nos Services Premium</Text>
              <TouchableOpacity onPress={() => Alert.alert('📋 Navigation', 'Voir tous les services')}>
                <BlurView intensity={20} style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Voir tout</Text>
                </BlurView>
              </TouchableOpacity>
            </View>
            
            <View style={styles.servicesGrid}>
              {services.map((service, index) => (
                <Animated.View
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    {
                      transform: [{
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      }],
                    }
                  ]}
                >
                  <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => Alert.alert(
                      `${service.icon} ${service.title}`, 
                      `Réserver ce service ?\n\n💰 Prix: ${service.standardPrice.toLocaleString()} FCFA\n⚡ Express: ${service.expressPrice.toLocaleString()} FCFA`
                    )}
                  >
                    <LinearGradient colors={service.gradient} style={styles.serviceGradient}>
                      {service.popular && (
                        <Animated.View 
                          style={[
                            styles.popularBadge,
                            {
                              transform: [{
                                scale: fadeAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 1],
                                }),
                              }],
                            }
                          ]}
                        >
                          <Text style={styles.popularBadgeText}>🔥 Populaire</Text>
                        </Animated.View>
                      )}

                      <View style={styles.serviceIconContainer}>
                        <View style={styles.serviceIconBackground}>
                          <Text style={styles.serviceIcon}>{service.icon}</Text>
                        </View>
                        <View style={styles.serviceIconGlow} />
                      </View>

                      <View style={styles.serviceContent}>
                        <Text style={styles.serviceTitle}>{service.title}</Text>
                        <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>

                        <View style={styles.priceContainer}>
                          <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>📋 Standard</Text>
                            <Text style={styles.priceValue}>{service.standardPrice.toLocaleString()}</Text>
                          </View>
                          <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>⚡ Express</Text>
                            <Text style={styles.priceValueExpress}>{service.expressPrice.toLocaleString()}</Text>
                          </View>
                        </View>

                        <TouchableOpacity style={styles.serviceButton}>
                          <BlurView intensity={30} style={styles.serviceButtonBlur}>
                            <Text style={styles.serviceButtonText}>Réserver</Text>
                            <Text style={styles.serviceButtonIcon}>→</Text>
                          </BlurView>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Recent Bookings Premium */}
          <Animated.View style={[styles.recentSection, { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📅 Mes Rendez-vous</Text>
              <TouchableOpacity onPress={() => Alert.alert('📋 Navigation', 'Voir l\'historique complet')}>
                <BlurView intensity={20} style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Historique</Text>
                </BlurView>
              </TouchableOpacity>
            </View>
            
            <View style={styles.bookingCard}>
              <BlurView intensity={40} style={styles.bookingBlur}>
                <View style={styles.bookingContent}>
                  <View style={styles.bookingIconContainer}>
                    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.bookingIconGradient}>
                      <Text style={styles.bookingIcon}>✂️</Text>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingService}>Coupe Homme Premium</Text>
                    <Text style={styles.bookingDate}>Aujourd'hui - 14:30</Text>
                    <Text style={styles.bookingPrice}>8,000 FCFA</Text>
                  </View>
                  
                  <View style={styles.bookingStatus}>
                    <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.statusGradient}>
                      <Text style={styles.statusTextBooking}>Confirmé</Text>
                    </LinearGradient>
                  </View>
                </View>
              </BlurView>
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  backgroundGradient: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1 
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
  
  // Header Premium
  header: { 
    marginTop: 20, 
    marginHorizontal: 24, 
    borderRadius: 24, 
    overflow: 'hidden' 
  },
  headerBlur: { 
    padding: 24 
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  greetingContainer: { 
    flex: 1 
  },
  greeting: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.9)', 
    marginBottom: 4, 
    fontWeight: '500' 
  },
  userName: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    marginBottom: 4 
  },
  dateTime: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.7)', 
    textTransform: 'capitalize' 
  },
  notificationButton: { 
    borderRadius: 20, 
    overflow: 'hidden' 
  },
  notificationGradient: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative' 
  },
  notificationIcon: { 
    fontSize: 18 
  },
  notificationBadge: { 
    position: 'absolute', 
    top: -2, 
    right: -2, 
    backgroundColor: '#FF3B30', 
    borderRadius: 10, 
    minWidth: 20, 
    height: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#FFFFFF' 
  },
  notificationBadgeText: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    fontWeight: '700' 
  },

  // Hero Section Premium
  heroSection: { 
    marginTop: 24, 
    marginHorizontal: 24, 
    borderRadius: 28, 
    overflow: 'hidden' 
  },
  heroGradient: { 
    borderRadius: 28 
  },
  heroBlur: { 
    padding: 24 
  },
  heroContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatarContainer: { 
    marginRight: 20,
    position: 'relative',
  },
  avatarGradient: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  avatarGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    top: -10,
    left: -10,
  },
  avatarIcon: { 
    fontSize: 32 
  },
  heroInfo: { 
    flex: 1 
  },
  heroName: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    marginBottom: 4 
  },
  heroTitle: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.8)', 
    marginBottom: 12, 
    fontWeight: '500' 
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8, 
    gap: 8 
  },
  stars: { 
    fontSize: 14 
  },
  rating: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#FFD700' 
  },
  reviewCount: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.7)' 
  },
  statusContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#43e97b', 
    marginRight: 8 
  },
  statusText: { 
    fontSize: 14, 
    color: '#43e97b', 
    fontWeight: '600' 
  },
  contactButton: { 
    borderRadius: 25, 
    overflow: 'hidden' 
  },
  contactGradient: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  contactIcon: { 
    fontSize: 20 
  },

  // Stats Premium
  statsSection: { 
    marginTop: 32, 
    paddingHorizontal: 24 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  statsContainer: { 
    flexDirection: 'row', 
    gap: 16 
  },
  statCard: { 
    flex: 1, 
    borderRadius: 20, 
    overflow: 'hidden' 
  },
  statBlur: { 
    padding: 20, 
    alignItems: 'center' 
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIcon: { 
    fontSize: 24 
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: '800', 
    marginBottom: 4 
  },
  statLabel: { 
    fontSize: 12, 
    color: 'rgba(255,255,255,0.8)', 
    textAlign: 'center', 
    fontWeight: '500' 
  },

  // Quick Booking Premium
  quickBookingSection: { 
    marginTop: 32, 
    paddingHorizontal: 24 
  },
  quickBookingGradient: { 
    borderRadius: 24, 
    padding: 24 
  },
  quickBookingContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  quickBookingIcon: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 20 
  },
  quickBookingEmoji: { 
    fontSize: 28 
  },
  quickBookingText: { 
    flex: 1 
  },
  quickBookingTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    marginBottom: 4 
  },
  quickBookingSubtitle: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.8)', 
    marginBottom: 4 
  },
  quickBookingTime: { 
    fontSize: 12, 
    color: 'rgba(255,255,255,0.7)', 
    fontWeight: '500' 
  },
  quickBookingArrow: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  quickBookingArrowText: { 
    fontSize: 20, 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },

  // Services Premium
  servicesSection: { 
    marginTop: 32, 
    paddingHorizontal: 24 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  seeAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: { 
    fontSize: 14, 
    color: '#FFFFFF', 
    fontWeight: '600' 
  },
  servicesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16 
  },
  serviceCard: { 
    width: (width - 64) / 2, 
    borderRadius: 24, 
    overflow: 'hidden' 
  },
  serviceGradient: { 
    padding: 20, 
    minHeight: 220, 
    position: 'relative' 
  },
  popularBadge: { 
    position: 'absolute', 
    top: 16, 
    right: 16, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12, 
    zIndex: 2 
  },
  popularBadgeText: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: '#FFFFFF' 
  },
  serviceIconContainer: { 
    alignItems: 'center', 
    marginBottom: 16,
    position: 'relative',
  },
  serviceIconBackground: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  serviceIconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -10,
    left: -10,
  },
  serviceIcon: { 
    fontSize: 28 
  },
  serviceContent: { 
    flex: 1 
  },
  serviceTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    marginBottom: 4, 
    textAlign: 'center' 
  },
  serviceSubtitle: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.8)', 
    textAlign: 'center', 
    marginBottom: 16 
  },
  priceContainer: { 
    marginBottom: 16 
  },
  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  priceLabel: { 
    fontSize: 12, 
    color: 'rgba(255,255,255,0.8)', 
    fontWeight: '500' 
  },
  priceValue: { 
    fontSize: 14, 
    color: '#FFFFFF', 
    fontWeight: '600' 
  },
  priceValueExpress: { 
    fontSize: 14, 
    color: '#FFD700', 
    fontWeight: '700' 
  },
  serviceButton: { 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  serviceButtonBlur: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 16 
  },
  serviceButtonText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginRight: 8 
  },
  serviceButtonIcon: { 
    fontSize: 16, 
    color: '#FFFFFF' 
  },

  // Recent Bookings Premium
  recentSection: { 
    marginTop: 32, 
    paddingHorizontal: 24 
  },
  bookingCard: { 
    borderRadius: 20, 
    overflow: 'hidden' 
  },
  bookingBlur: { 
    padding: 20 
  },
  bookingContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  bookingIconContainer: { 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginRight: 16 
  },
  bookingIconGradient: { 
    width: 50, 
    height: 50, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  bookingIcon: { 
    fontSize: 20 
  },
  bookingInfo: { 
    flex: 1 
  },
  bookingService: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginBottom: 4 
  },
  bookingDate: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.8)', 
    marginBottom: 4 
  },
  bookingPrice: { 
    fontSize: 14, 
    color: '#FFD700', 
    fontWeight: '600' 
  },
  bookingStatus: { 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  statusGradient: { 
    paddingHorizontal: 12, 
    paddingVertical: 6 
  },
  statusTextBooking: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
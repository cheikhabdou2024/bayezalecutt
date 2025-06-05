// src/screens/main/HomeScreen.tsx - FINAL COMPLET
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

  useEffect(() => {
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
  }, []);

  const services = [
    {
      id: 'homme',
      title: 'Coupe Homme',
      subtitle: 'Style moderne',
      standardPrice: 8000,
      expressPrice: 10000,
      icon: '✂️',
      gradient: ['#667eea', '#764ba2'],
      popular: true,
    },
    {
      id: 'femme', 
      title: 'Coupe Femme',
      subtitle: 'Élégance pure',
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
      subtitle: 'Service premium',
      standardPrice: 30000,
      expressPrice: 30000,
      icon: '🏠',
      gradient: ['#43e97b', '#38f9d7'],
      popular: true,
    },
  ];

  const stats = [
    { label: 'Clients Satisfaits', value: '500+', icon: '😊' },
    { label: 'Années d\'Expérience', value: '5+', icon: '⭐' },
    { label: 'Note Moyenne', value: '4.9', icon: '🏆' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <BlurView intensity={40} style={styles.headerBlur}>
              <View style={styles.headerContent}>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greeting}>Bonjour 👋</Text>
                  <Text style={styles.userName}>Prêt pour une nouvelle coupe ?</Text>
                  <Text style={styles.dateTime}>
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.notificationButton} onPress={() => Alert.alert('Notifications', 'Vous avez 3 nouvelles notifications')}>
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
          <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => Alert.alert('Baye Zale', 'Contactez le maître coiffeur')}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.heroGradient}>
                <BlurView intensity={20} style={styles.heroBlur}>
                  <View style={styles.heroContent}>
                    <View style={styles.avatarContainer}>
                      <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.avatarGradient}>
                        <Text style={styles.avatarIcon}>👨‍💼</Text>
                      </LinearGradient>
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
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Disponible maintenant</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Contact', 'Appel en cours...')}>
                      <LinearGradient colors={['#25D366', '#128C7E']} style={styles.contactGradient}>
                        <Text style={styles.contactIcon}>📞</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Statistiques */}
          <Animated.View style={[styles.statsSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>🏆 Excellence Reconnue</Text>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <BlurView intensity={40} style={styles.statBlur}>
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </BlurView>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Quick Booking */}
          <Animated.View style={[styles.quickBookingSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.sectionTitle}>⚡ Réservation Express</Text>
            <TouchableOpacity activeOpacity={0.9} onPress={() => Alert.alert('Réservation', 'Redirection vers réservation')}>
              <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.quickBookingGradient}>
                <View style={styles.quickBookingContent}>
                  <View style={styles.quickBookingIcon}>
                    <Text style={styles.quickBookingEmoji}>⚡</Text>
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

          {/* Services */}
          <Animated.View style={[styles.servicesSection, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💫 Nos Services Premium</Text>
              <TouchableOpacity onPress={() => Alert.alert('Navigation', 'Voir tous les services')}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.servicesGrid}>
              {services.map((service, index) => (
                <View key={service.id} style={styles.serviceCard}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => Alert.alert(service.title, `Réserver ce service ?\nPrix: ${service.standardPrice.toLocaleString()} FCFA`)}>
                    <LinearGradient colors={service.gradient} style={styles.serviceGradient}>
                      {service.popular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>🔥 Populaire</Text>
                        </View>
                      )}

                      <View style={styles.serviceIconContainer}>
                        <View style={styles.serviceIconBackground}>
                          <Text style={styles.serviceIcon}>{service.icon}</Text>
                        </View>
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
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Recent Bookings */}
          <Animated.View style={[styles.recentSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📅 Mes Rendez-vous</Text>
              <TouchableOpacity onPress={() => Alert.alert('Navigation', 'Voir l\'historique')}>
                <Text style={styles.seeAllText}>Historique</Text>
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
                      <Text style={styles.statusText}>Confirmé</Text>
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
  container: { flex: 1 },
  backgroundGradient: { flex: 1 },
  scrollView: { flex: 1 },
  
  header: { marginTop: 20, marginHorizontal: 24, borderRadius: 24, overflow: 'hidden' },
  headerBlur: { padding: 24 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingContainer: { flex: 1 },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 4, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  dateTime: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' },
  notificationButton: { borderRadius: 20, overflow: 'hidden' },
  notificationGradient: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationIcon: { fontSize: 18 },
  notificationBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#FF3B30', borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  notificationBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  heroSection: { marginTop: 24, marginHorizontal: 24, borderRadius: 28, overflow: 'hidden' },
  heroGradient: { borderRadius: 28 },
  heroBlur: { padding: 24 },
  heroContent: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { marginRight: 20 },
  avatarGradient: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarIcon: { fontSize: 32 },
  heroInfo: { flex: 1 },
  heroName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  heroTitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 12, fontWeight: '500' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  stars: { fontSize: 14 },
  rating: { fontSize: 16, fontWeight: '700', color: '#FFD700' },
  reviewCount: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  statusContainer: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#43e97b', marginRight: 8 },
  statusText: { fontSize: 14, color: '#43e97b', fontWeight: '600' },
  contactButton: { borderRadius: 25, overflow: 'hidden' },
  contactGradient: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  contactIcon: { fontSize: 20 },

  statsSection: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 20, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', gap: 16 },
  statCard: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  statBlur: { padding: 20, alignItems: 'center' },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontWeight: '500' },

  quickBookingSection: { marginTop: 32, paddingHorizontal: 24 },
  quickBookingGradient: { borderRadius: 24, padding: 24 },
  quickBookingContent: { flexDirection: 'row', alignItems: 'center' },
  quickBookingIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  quickBookingEmoji: { fontSize: 28 },
  quickBookingText: { flex: 1 },
  quickBookingTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  quickBookingSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  quickBookingTime: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  quickBookingArrow: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  quickBookingArrowText: { fontSize: 20, color: '#FFFFFF', fontWeight: '700' },

  servicesSection: { marginTop: 32, paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  seeAllText: { fontSize: 16, color: '#FFFFFF', fontWeight: '600', opacity: 0.8 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  serviceCard: { width: (width - 64) / 2, borderRadius: 24, overflow: 'hidden' },
  serviceGradient: { padding: 20, minHeight: 200, position: 'relative' },
  popularBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 2 },
  popularBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  serviceIconContainer: { alignItems: 'center', marginBottom: 16 },
  serviceIconBackground: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  serviceIcon: { fontSize: 28 },
  serviceContent: { flex: 1 },
  serviceTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, textAlign: 'center' },
  serviceSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 16 },
  priceContainer: { marginBottom: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  priceLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  priceValue: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  priceValueExpress: { fontSize: 14, color: '#FFD700', fontWeight: '700' },
  serviceButton: { borderRadius: 16, overflow: 'hidden' },
  serviceButtonBlur: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  serviceButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginRight: 8 },
  serviceButtonIcon: { fontSize: 16, color: '#FFFFFF' },

  recentSection: { marginTop: 32, paddingHorizontal: 24 },
  bookingCard: { borderRadius: 20, overflow: 'hidden' },
  bookingBlur: { padding: 20 },
  bookingContent: { flexDirection: 'row', alignItems: 'center' },
  bookingIconContainer: { borderRadius: 16, overflow: 'hidden', marginRight: 16 },
  bookingIconGradient: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  bookingIcon: { fontSize: 20 },
  bookingInfo: { flex: 1 },
  bookingService: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  bookingDate: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  bookingPrice: { fontSize: 14, color: '#FFD700', fontWeight: '600' },
  bookingStatus: { borderRadius: 16, overflow: 'hidden' },
  statusGradient: { paddingHorizontal: 12, paddingVertical: 6 },
});
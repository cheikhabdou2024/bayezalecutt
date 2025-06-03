// src/screens/main/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const services = [
    {
      id: 'homme',
      title: 'Coupe Homme',
      price: '8.000',
      urgentPrice: '10.000',
      icon: '✂️',
      color: '#4F7FEE',
    },
    {
      id: 'femme',
      title: 'Coupe Femme',
      price: '8.000',
      urgentPrice: '10.000',
      icon: '💇‍♀️',
      color: '#8B5CF6',
    },
    {
      id: 'enfant',
      title: 'Coupe Enfant',
      price: '5.000',
      urgentPrice: '7.000',
      icon: '👶',
      color: '#10B981',
    },
    {
      id: 'domicile',
      title: 'À Domicile',
      price: '30.000',
      urgentPrice: '30.000',
      icon: '🏠',
      color: '#F59E0B',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.userName}>Prêt pour une nouvelle coupe ?</Text>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Baye Zale Card */}
        <View style={styles.section}>
          <View style={styles.barberCard}>
            <View style={styles.barberImageContainer}>
              <Text style={styles.barberImagePlaceholder}>👨‍💼</Text>
            </View>
            
            <View style={styles.barberInfo}>
              <Text style={styles.barberName}>Baye Zale</Text>
              <Text style={styles.barberTitle}>Coiffeur Professionnel</Text>
              
              <View style={styles.ratingContainer}>
                <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
                <Text style={styles.rating}>4.9 (127 avis)</Text>
              </View>
              
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Disponible maintenant</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Booking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réservation Rapide</Text>
          
          <TouchableOpacity style={styles.quickBookingCard}>
            <View style={styles.quickBookingContent}>
              <View style={styles.quickBookingIcon}>
                <Text style={styles.quickBookingEmoji}>⚡</Text>
              </View>
              <View style={styles.quickBookingText}>
                <Text style={styles.quickBookingTitle}>Réserver Maintenant</Text>
                <Text style={styles.quickBookingSubtitle}>Prochain créneau disponible</Text>
              </View>
              <Text style={styles.quickBookingArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nos Services</Text>
          
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
                  <Text style={styles.serviceEmoji}>{service.icon}</Text>
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>{service.price} FCFA</Text>
                <Text style={styles.serviceUrgent}>Urgent: {service.urgentPrice} FCFA</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes Rendez-vous</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bookingCard}>
            <View style={styles.bookingIcon}>
              <Text>📅</Text>
            </View>
            
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingService}>Coupe Homme</Text>
              <Text style={styles.bookingDate}>Aujourd'hui - 14:30</Text>
            </View>
            
            <View style={styles.confirmedStatus}>
              <Text style={styles.confirmedText}>Confirmé</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F7FEE',
    fontWeight: '600',
  },
  barberCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  barberImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  barberImagePlaceholder: {
    fontSize: 30,
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  barberTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    fontSize: 12,
    marginRight: 8,
  },
  rating: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#4F7FEE',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIcon: {
    fontSize: 20,
  },
  quickBookingCard: {
    backgroundColor: '#4F7FEE',
    borderRadius: 16,
    padding: 20,
  },
  quickBookingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickBookingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickBookingEmoji: {
    fontSize: 24,
  },
  quickBookingText: {
    flex: 1,
  },
  quickBookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickBookingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickBookingArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceEmoji: {
    fontSize: 28,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  servicePrice: {
    fontSize: 14,
    color: '#4F7FEE',
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceUrgent: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  confirmedStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
  },
  confirmedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
});
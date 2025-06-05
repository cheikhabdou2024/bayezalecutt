// src/screens/admin/AdminScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Linking,
  Switch,
} from 'react-native';

// Import statiques Firebase
import { getTodayBookings } from '../../config/firebase';

interface AdminBooking {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  time: string;
  type: 'standard' | 'express';
  status: 'pending' | 'confirmed' | 'completed';
  price: number;
}

export default function AdminScreen() {
  const [isOpen, setIsOpen] = useState(true);
  const [todayBookings, setTodayBookings] = useState<AdminBooking[]>([]);
  const [dailyStats, setDailyStats] = useState({
    totalBookings: 0,
    standardQueue: 0,
    expressQueue: 0,
    revenue: 0,
    pendingConfirmations: 0
  });

  // Charger données Firebase + Mock pour Sprint 1
  useEffect(() => {
    const loadBookings = async () => {
    try {
        // Essayer de charger depuis Firebase
        const firebaseBookings = await getTodayBookings();
        
        if (firebaseBookings && firebaseBookings.length > 0) {
          // Convertir format Firebase vers format AdminBooking
          const adminBookings: AdminBooking[] = firebaseBookings.map(booking => ({
            id: booking.id,
            clientName: `Client ${booking.id.slice(-4)}`, // En production, récupérer vrais noms
            phone: '+221 77 XXX XX XX', // En production, récupérer vrais téléphones
            service: booking.serviceId.replace('_', ' '),
            time: booking.time,
            type: booking.type as 'standard' | 'express', // Assertion de type
            status: booking.status as 'pending' | 'confirmed' | 'completed', // Assertion de type
            price: booking.totalPrice
          }));
          
          setTodayBookings(adminBookings);
          updateStats(adminBookings);
        } else {
          // Fallback vers données mock
          setMockData();
        }
      } catch (error) {
        console.error('Error loading Firebase bookings:', error);
        // Fallback vers données mock
        setMockData();
      }
    };

    // Recalculer stats après chargement
    const updateStats = (bookings: AdminBooking[]) => {
      const stats = {
        totalBookings: bookings.length,
        standardQueue: bookings.filter(b => b.type === 'standard' && b.status !== 'completed').length,
        expressQueue: bookings.filter(b => b.type === 'express' && b.status !== 'completed').length,
        revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0),
        pendingConfirmations: bookings.filter(b => b.status === 'pending').length
      };
      setDailyStats(stats);
    };

    const setMockData = () => {
      const mockBookings: AdminBooking[] = [
        {
          id: '1',
          clientName: 'Mamadou Sarr',
          phone: '+221 77 123 45 67',
          service: 'Service Complet Homme',
          time: '14:30',
          type: 'express',
          status: 'pending',
          price: 15000
        },
        {
          id: '2',
          clientName: 'Fatou Diop',
          phone: '+221 76 987 65 43',
          service: 'Coupe Femme Moderne',
          time: '15:00',
          type: 'standard',
          status: 'confirmed',
          price: 8000
        },
        {
          id: '3',
          clientName: 'Ibrahima Fall',
          phone: '+221 78 456 78 90',
          service: 'Coupe Enfant Spécialisée',
          time: '15:30',
          type: 'standard',
          status: 'pending',
          price: 5000
        }
      ];
      setTodayBookings(mockBookings);
      updateStats(mockBookings);
    };

    loadBookings();
  }, []);

  const handleCall = (phone: string, clientName: string) => {
    Alert.alert(
      `Appeler ${clientName}`,
      `Voulez-vous appeler ${phone} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Appeler', 
          onPress: () => {
            Linking.openURL(`tel:${phone}`);
          }
        }
      ]
    );
  };

  const confirmBooking = (bookingId: string) => {
    setTodayBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'confirmed' as const }
          : booking
      )
    );
    
    Alert.alert('✅ Confirmation', 'Réservation confirmée avec succès !');
  };

  const completeBooking = (bookingId: string) => {
    setTodayBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'completed' as const }
          : booking
      )
    );
    
    Alert.alert('🎉 Service Terminé', 'Merci pour votre excellent travail !');
  };

  const toggleShopStatus = () => {
    setIsOpen(!isOpen);
    Alert.alert(
      isOpen ? '🔒 Salon Fermé' : '🔓 Salon Ouvert',
      isOpen 
        ? 'Les nouvelles réservations sont désactivées'
        : 'Les clients peuvent à nouveau réserver'
    );
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#4F7FEE';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'À confirmer';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'express' ? '⚡' : '📋';
  };

  const getTypeColor = (type: string) => {
    return type === 'express' ? '#F59E0B' : '#10B981';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Admin */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Dashboard Admin</Text>
            <Text style={styles.subtitle}>Baye Zale Cutt • {getCurrentTime()}</Text>
          </View>
          
          <View style={styles.shopStatus}>
            <Text style={styles.statusLabel}>Salon {isOpen ? 'Ouvert' : 'Fermé'}</Text>
            <Switch
              value={isOpen}
              onValueChange={toggleShopStatus}
              trackColor={{ false: '#EF4444', true: '#10B981' }}
              thumbColor={isOpen ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Stats du jour */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Statistiques du jour</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dailyStats.totalBookings}</Text>
              <Text style={styles.statLabel}>RDV Total</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dailyStats.pendingConfirmations}</Text>
              <Text style={styles.statLabel}>À Confirmer</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dailyStats.standardQueue}</Text>
              <Text style={styles.statLabel}>File Standard</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dailyStats.expressQueue}</Text>
              <Text style={styles.statLabel}>File Express</Text>
            </View>
          </View>
          
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>💰 Revenus du jour</Text>
            <Text style={styles.revenueAmount}>{dailyStats.revenue.toLocaleString()} FCFA</Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>⚡ Actions Rapides</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>Planning</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Paiements</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📸</Text>
              <Text style={styles.actionText}>Galerie</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Paramètres</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Liste des réservations */}
        <View style={styles.bookingsContainer}>
          <Text style={styles.sectionTitle}>📋 Réservations d'aujourd'hui</Text>
          
          {todayBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>Aucune réservation aujourd'hui</Text>
              <Text style={styles.emptySubtext}>Les nouvelles réservations apparaîtront ici</Text>
            </View>
          ) : (
            todayBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.clientName}>{booking.clientName}</Text>
                    <Text style={styles.serviceInfo}>
                      {booking.service} • {booking.time}
                    </Text>
                  </View>
                  
                  <View style={styles.bookingBadges}>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(booking.type) }]}>
                      <Text style={styles.typeBadgeText}>
                        {getTypeIcon(booking.type)} {booking.type === 'express' ? 'Express' : 'Standard'}
                      </Text>
                    </View>
                    
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text style={styles.statusBadgeText}>{getStatusText(booking.status)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <Text style={styles.phoneNumber}>📞 {booking.phone}</Text>
                  <Text style={styles.priceInfo}>💰 {booking.price.toLocaleString()} FCFA</Text>
                </View>

                <View style={styles.bookingActions}>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCall(booking.phone, booking.clientName)}
                  >
                    <Text style={styles.callButtonText}>📞 Appeler</Text>
                  </TouchableOpacity>
                  
                  {booking.status === 'pending' && (
                    <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={() => confirmBooking(booking.id)}
                    >
                      <Text style={styles.confirmButtonText}>✅ Confirmer</Text>
                    </TouchableOpacity>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <TouchableOpacity 
                      style={styles.completeButton}
                      onPress={() => completeBooking(booking.id)}
                    >
                      <Text style={styles.completeButtonText}>🎉 Terminer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Alertes importantes */}
        {dailyStats.pendingConfirmations > 0 && (
          <View style={styles.alertContainer}>
            <View style={styles.alert}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Confirmations en attente</Text>
                <Text style={styles.alertText}>
                  {dailyStats.pendingConfirmations} client(s) attendent votre confirmation
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Horaires du jour */}
        <View style={styles.scheduleContainer}>
          <Text style={styles.sectionTitle}>🕐 Horaires du jour</Text>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Matin :</Text>
              <Text style={styles.scheduleTime}>8h00 - 12h30</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Pause :</Text>
              <Text style={styles.scheduleTime}>4h00 - 13h00 (Auto)</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleLabel}>Après-midi :</Text>
              <Text style={styles.scheduleTime}>13h00 - 20h30</Text>
            </View>
          </View>
        </View>

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
  content: {
    flex: 1,
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  shopStatus: {
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F7FEE',
  },
  
  // Stats
  statsContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F7FEE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: '#4F7FEE',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Actions rapides
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  
  // Réservations
  bookingsContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookingBadges: {
    gap: 8,
    alignItems: 'flex-end',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#4F7FEE',
    fontWeight: '600',
  },
  priceInfo: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: 'bold',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    backgroundColor: '#4F7FEE',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Alertes
  alertContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  alert: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#DC2626',
  },
  
  // Horaires
  scheduleContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  scheduleLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
});
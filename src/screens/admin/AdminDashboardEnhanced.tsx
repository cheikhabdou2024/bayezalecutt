// src/screens/admin/AdminDashboardEnhanced.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Import services
import bookingService from '../../services/bookingService';
import userService from '../../services/userService';
import type { Booking, QueueStatus } from '../../services/bookingService';
import type { User } from '../../services/userService';

const { width } = Dimensions.get('window');

interface DashboardStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageRating: number;
  newCustomers: number;
  returningCustomers: number;
  topServices: Array<{ name: string; count: number }>;
}

export default function AdminDashboardEnhanced() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Real-time subscriptions
  const bookingUnsubscribe = useRef<(() => void) | null>(null);

  useEffect(() => {
    loadDashboardData();
    startAnimations();
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Subscribe to real-time updates
    const dateStr = selectedDate.toISOString().split('T')[0];
    bookingUnsubscribe.current = bookingService.subscribeToBookingUpdates(
      dateStr,
      handleBookingUpdates
    );

    return () => {
      clearInterval(timer);
      if (bookingUnsubscribe.current) {
        bookingUnsubscribe.current();
      }
    };
  }, [selectedDate]);

  const startAnimations = () => {
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
    ]).start();
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load today's bookings
      const todayBookings = await bookingService.getTodayBookings();
      setBookings(todayBookings);
      
      // Load queue status
      const queue = await bookingService.getQueueStatus();
      setQueueStatus(queue);
      
      // Calculate statistics
      const dashboardStats = await calculateDashboardStats(todayBookings);
      setStats(dashboardStats);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingUpdates = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
    // Recalculate stats with new data
    calculateDashboardStats(updatedBookings).then(setStats);
  };

  const calculateDashboardStats = async (bookings: Booking[]): Promise<DashboardStats> => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Today's stats
    const todayCompleted = bookings.filter(b => b.status === 'completed');
    const todayRevenue = todayCompleted.reduce((sum, b) => sum + b.totalPrice, 0);
    const todayCancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    // Calculate ratings
    const ratings = todayCompleted
      .filter(b => b.rating)
      .map(b => b.rating!);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : 0;

    // Count unique customers
    const uniqueCustomers = new Set(bookings.map(b => b.userId));
    const newCustomers = await countNewCustomers(Array.from(uniqueCustomers));
    
    // Top services
    const serviceCount: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.serviceName) {
        serviceCount[b.serviceName] = (serviceCount[b.serviceName] || 0) + 1;
      }
    });
    
    const topServices = Object.entries(serviceCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return {
      todayRevenue,
      weekRevenue: todayRevenue * 5, // Placeholder - implement actual calculation
      monthRevenue: todayRevenue * 22, // Placeholder - implement actual calculation
      todayBookings: bookings.length,
      completedBookings: todayCompleted.length,
      cancelledBookings: todayCancelled,
      averageRating,
      newCustomers,
      returningCustomers: uniqueCustomers.size - newCustomers,
      topServices
    };
  };

  const countNewCustomers = async (userIds: string[]): Promise<number> => {
    let newCount = 0;
    for (const userId of userIds) {
      const user = await userService.getUserById(userId);
      if (user && user.totalAppointments <= 1) {
        newCount++;
      }
    }
    return newCount;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status, {
        adminNotes: adminNotes || undefined
      });
      
      Alert.alert('✅ Succès', 'Statut mis à jour');
      setShowBookingDetails(false);
      setSelectedBooking(null);
      setAdminNotes('');
    } catch (error) {
      Alert.alert('❌ Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const handleStartService = async (booking: Booking) => {
    Alert.alert(
      '🚀 Démarrer le service',
      `Commencer le service pour ${booking.userName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Démarrer', 
          onPress: () => updateBookingStatus(booking.id, 'in-progress')
        }
      ]
    );
  };

  const handleCompleteService = async (booking: Booking) => {
    Alert.alert(
      '✅ Terminer le service',
      `Marquer comme terminé pour ${booking.userName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Terminer', 
          onPress: () => updateBookingStatus(booking.id, 'completed')
        }
      ]
    );
  };

  const renderBookingCard = (booking: Booking) => {
    const statusColors = {
      'pending': '#F59E0B',
      'confirmed': '#3B82F6',
      'in-progress': '#8B5CF6',
      'completed': '#10B981',
      'cancelled': '#EF4444',
      'no-show': '#6B7280'
    };

    const isLate = booking.status === 'confirmed' && 
      new Date(`${booking.date} ${booking.time}`) < currentTime;

    return (
      <TouchableOpacity
        key={booking.id}
        style={[styles.bookingCard, isLate && styles.lateBooking]}
        onPress={() => {
          setSelectedBooking(booking);
          setShowBookingDetails(true);
        }}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.timeContainer}>
            <Text style={styles.bookingTime}>{booking.time}</Text>
            {booking.type === 'express' && (
              <View style={styles.expressBadge}>
                <Text style={styles.expressBadgeText}>⚡ Express</Text>
              </View>
            )}
          </View>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: statusColors[booking.status] + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: statusColors[booking.status] }
            ]}>
              {booking.status === 'pending' && '⏳ En attente'}
              {booking.status === 'confirmed' && '✅ Confirmé'}
              {booking.status === 'in-progress' && '✂️ En cours'}
              {booking.status === 'completed' && '✓ Terminé'}
              {booking.status === 'cancelled' && '✕ Annulé'}
              {booking.status === 'no-show' && '⚠️ Absent'}
            </Text>
          </View>
        </View>

        <View style={styles.bookingContent}>
          <Text style={styles.clientName}>{booking.userName || 'Client'}</Text>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          
          <View style={styles.bookingFooter}>
            <Text style={styles.priceText}>{booking.totalPrice.toLocaleString()} FCFA</Text>
            
            {booking.status === 'confirmed' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleStartService(booking)}
              >
                <Text style={styles.actionButtonText}>Démarrer</Text>
              </TouchableOpacity>
            )}
            
            {booking.status === 'in-progress' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleCompleteService(booking)}
              >
                <Text style={styles.actionButtonText}>Terminer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isLate && (
          <View style={styles.lateIndicator}>
            <Text style={styles.lateText}>⚠️ En retard</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F7FEE" />
        <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4F7FEE']}
          />
        }
      >
        {/* Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <LinearGradient
            colors={['#4F7FEE', '#3B82F6']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Bonjour Baye Zale 👋</Text>
                <Text style={styles.currentDate}>
                  {currentTime.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </Text>
              </View>
              
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>En ligne</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Revenue Cards */}
        <Animated.View style={[
          styles.revenueSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.sectionTitle}>💰 Revenus</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.revenueCard}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.revenueGradient}
              >
                <Text style={styles.revenueLabel}>Aujourd'hui</Text>
                <Text style={styles.revenueAmount}>
                  {stats?.todayRevenue.toLocaleString() || 0} FCFA
                </Text>
                <Text style={styles.revenueSubtext}>
                  {stats?.completedBookings || 0} services
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.revenueCard}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.revenueGradient}
              >
                <Text style={styles.revenueLabel}>Cette semaine</Text>
                <Text style={styles.revenueAmount}>
                  {stats?.weekRevenue.toLocaleString() || 0} FCFA
                </Text>
                <Text style={styles.revenueSubtext}>
                  +15% vs semaine dernière
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.revenueCard}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.revenueGradient}
              >
                <Text style={styles.revenueLabel}>Ce mois</Text>
                <Text style={styles.revenueAmount}>
                  {stats?.monthRevenue.toLocaleString() || 0} FCFA
                </Text>
                <Text style={styles.revenueSubtext}>
                  Objectif: 2M FCFA
                </Text>
              </LinearGradient>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Queue Status */}
        {queueStatus && (
          <Animated.View style={[
            styles.queueSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <Text style={styles.sectionTitle}>👥 File d'attente</Text>
            
            <View style={styles.queueCards}>
              <View style={[styles.queueCard, styles.standardQueue]}>
                <Text style={styles.queueType}>📋 Standard</Text>
                <Text style={styles.queueCount}>{queueStatus.standardQueue.count}</Text>
                <Text style={styles.queueWait}>
                  ~{queueStatus.standardQueue.estimatedWait} min
                </Text>
              </View>

              <View style={[styles.queueCard, styles.expressQueue]}>
                <Text style={styles.queueType}>⚡ Express</Text>
                <Text style={styles.queueCount}>{queueStatus.expressQueue.count}</Text>
                <Text style={styles.queueWait}>
                  ~{queueStatus.expressQueue.estimatedWait} min
                </Text>
              </View>
            </View>

            {queueStatus.currentlyServing && (
              <View style={styles.currentlyServing}>
                <Text style={styles.currentlyServingTitle}>✂️ En cours</Text>
                <Text style={styles.currentlyServingName}>
                  {queueStatus.currentlyServing.userName}
                </Text>
                <Text style={styles.currentlyServingService}>
                  {queueStatus.currentlyServing.service}
                </Text>
                <Text style={styles.currentlyServingTime}>
                  Depuis {queueStatus.currentlyServing.startTime}
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Quick Stats */}
        <Animated.View style={[
          styles.statsGrid,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statValue}>{stats?.todayBookings || 0}</Text>
            <Text style={styles.statLabel}>RDV Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{stats?.averageRating.toFixed(1) || 0}</Text>
            <Text style={styles.statLabel}>Note Moyenne</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👤</Text>
            <Text style={styles.statValue}>{stats?.newCustomers || 0}</Text>
            <Text style={styles.statLabel}>Nouveaux</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>❌</Text>
            <Text style={styles.statValue}>{stats?.cancelledBookings || 0}</Text>
            <Text style={styles.statLabel}>Annulés</Text>
          </View>
        </Animated.View>

        {/* Today's Bookings */}
        <View style={styles.bookingsSection}>
          <View style={styles.bookingsSectionHeader}>
            <Text style={styles.sectionTitle}>📋 Rendez-vous du jour</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Filtrer</Text>
            </TouchableOpacity>
          </View>

          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>Aucun rendez-vous aujourd'hui</Text>
            </View>
          ) : (
            bookings.map(renderBookingCard)
          )}
        </View>

        {/* Top Services */}
        {stats && stats.topServices.length > 0 && (
          <View style={styles.topServicesSection}>
            <Text style={styles.sectionTitle}>🏆 Services populaires</Text>
            
            {stats.topServices.map((service, index) => (
              <View key={index} style={styles.topServiceItem}>
                <Text style={styles.topServiceRank}>#{index + 1}</Text>
                <Text style={styles.topServiceName}>{service.name}</Text>
                <Text style={styles.topServiceCount}>{service.count} fois</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Booking Details Modal */}
      <Modal
        visible={showBookingDetails}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBooking && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Détails de la réservation</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowBookingDetails(false);
                      setSelectedBooking(null);
                    }}
                  >
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Client</Text>
                    <Text style={styles.detailValue}>{selectedBooking.userName}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Téléphone</Text>
                    <TouchableOpacity>
                      <Text style={[styles.detailValue, styles.phoneLink]}>
                        {selectedBooking.userPhone}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Service</Text>
                    <Text style={styles.detailValue}>{selectedBooking.serviceName}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <View style={[
                      styles.typeBadge,
                      selectedBooking.type === 'express' && styles.expressTypeBadge
                    ]}>
                      <Text style={styles.typeBadgeText}>
                        {selectedBooking.type === 'express' ? '⚡ Express' : '📋 Standard'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Heure</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.time} - {selectedBooking.endTime}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Prix</Text>
                    <Text style={[styles.detailValue, styles.priceValue]}>
                      {selectedBooking.totalPrice.toLocaleString()} FCFA
                    </Text>
                  </View>

                  {selectedBooking.specialRequests && (
                    <View style={styles.specialRequests}>
                      <Text style={styles.detailLabel}>Demandes spéciales</Text>
                      <Text style={styles.specialRequestsText}>
                        {selectedBooking.specialRequests}
                      </Text>
                    </View>
                  )}

                  <View style={styles.adminNotesContainer}>
                    <Text style={styles.detailLabel}>Notes admin</Text>
                    <TextInput
                      style={styles.adminNotesInput}
                      placeholder="Ajouter des notes..."
                      value={adminNotes}
                      onChangeText={setAdminNotes}
                      multiline
                    />
                  </View>

                  <View style={styles.modalActions}>
                    {selectedBooking.status === 'pending' && (
                      <>
                        <TouchableOpacity
                          style={[styles.modalButton, styles.confirmButton]}
                          onPress={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                        >
                          <Text style={styles.modalButtonText}>✅ Confirmer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.modalButton, styles.cancelButton]}
                          onPress={() => {
                            Alert.prompt(
                              'Annuler la réservation',
                              'Raison de l\'annulation:',
                              (reason) => {
                                if (reason) {
                                  bookingService.cancelBooking(
                                    selectedBooking.id,
                                    reason,
                                    'admin'
                                  );
                                }
                              }
                            );
                          }}
                        >
                          <Text style={styles.modalButtonText}>❌ Annuler</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {selectedBooking.status === 'confirmed' && (
                      <TouchableOpacity
                        style={[styles.modalButton, styles.startButton]}
                        onPress={() => {
                          updateBookingStatus(selectedBooking.id, 'in-progress');
                        }}
                      >
                        <Text style={styles.modalButtonText}>🚀 Démarrer</Text>
                      </TouchableOpacity>
                    )}

                    {selectedBooking.status === 'in-progress' && (
                      <TouchableOpacity
                        style={[styles.modalButton, styles.completeModalButton]}
                        onPress={() => {
                          updateBookingStatus(selectedBooking.id, 'completed');
                        }}
                      >
                        <Text style={styles.modalButtonText}>✓ Terminer</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  
  // Header
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'capitalize',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Revenue Section
  revenueSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  revenueCard: {
    width: width * 0.7,
    marginRight: 16,
    marginLeft: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  revenueGradient: {
    padding: 24,
  },
  revenueLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  revenueSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  // Queue Section
  queueSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  queueCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  queueCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  standardQueue: {
    borderTopColor: '#3B82F6',
    borderTopWidth: 3,
  },
  expressQueue: {
    borderTopColor: '#F59E0B',
    borderTopWidth: 3,
  },
  queueType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  queueCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  queueWait: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  currentlyServing: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  currentlyServingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  currentlyServingName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  currentlyServingService: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  currentlyServingTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Bookings Section
  bookingsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  bookingsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  filterButtonText: {
    color: '#4F7FEE',
    fontSize: 14,
    fontWeight: '600',
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
  lateBooking: {
    borderLeftColor: '#EF4444',
    borderLeftWidth: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expressBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expressBadgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingContent: {
    gap: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  serviceName: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  actionButton: {
    backgroundColor: '#4F7FEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  lateIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lateText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  // Top Services
  topServicesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  topServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  topServiceRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F7FEE',
    marginRight: 16,
  },
  topServiceName: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  topServiceCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  phoneLink: {
    color: '#4F7FEE',
    textDecorationLine: 'underline',
  },
  typeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  expressTypeBadge: {
    backgroundColor: '#FEF3C7',
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F7FEE',
  },
  priceValue: {
    color: '#10B981',
    fontSize: 18,
  },
  specialRequests: {
    marginTop: 16,
    marginBottom: 16,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  adminNotesContainer: {
    marginTop: 16,
  },
  adminNotesInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  startButton: {
    backgroundColor: '#8B5CF6',
  },
  completeModalButton: {
    backgroundColor: '#10B981',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
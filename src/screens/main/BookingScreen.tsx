// src/screens/main/BookingScreen.tsx - Version Améliorée
import React, { useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Alert,
    Modal,
  } from 'react-native';

// Import statique Firebase
import { saveBooking } from '../../config/firebase';
  
  const { width } = Dimensions.get('window');
  
  export default function BookingScreen() {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingType, setBookingType] = useState('standard');
    const [showBookingModal, setShowBookingModal] = useState(false);
  
    const services = [
      {
        id: 'homme',
        title: 'Coupe Homme Moderne',
        duration: 30,
        standardPrice: 8000,
        expressPrice: 10000,
        icon: '✂️',
        description: 'Coupe professionnelle avec finition parfaite',
        category: 'homme',
      },
      {
        id: 'femme',
        title: 'Coupe Femme Élégante',
        duration: 45,
        standardPrice: 8000,
        expressPrice: 10000,
        icon: '💇‍♀️',
        description: 'Coupe et mise en forme moderne et stylée',
        category: 'femme',
      },
      {
        id: 'enfant',
        title: 'Coupe Enfant Adaptée',
        duration: 25,
        standardPrice: 5000,
        expressPrice: 7000,
        icon: '👶',
        description: 'Coupe douce spécialement conçue pour les enfants',
        category: 'enfant',
      },
      {
        id: 'domicile',
        title: 'Service Premium à Domicile',
        duration: 60,
        standardPrice: 30000,
        expressPrice: 30000,
        icon: '🏠',
        description: 'Service complet dans le confort de votre domicile',
        category: 'domicile',
      },
    ];
  
    // Générer les dates pour les 7 prochains jours
    const generateDates = () => {
      type DateItem = {
        date: Date;
        day: number;
        dayName: string;
        fullDate: string;
        isToday: boolean;
      };
      
      const dates: DateItem[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
          date: date,
          day: date.getDate(),
          dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('fr-FR'),
          isToday: i === 0,
        });
      }
      return dates;
    };
  
    // Créneaux horaires avec gestion automatique 4h-13h fermé
    const generateTimeSlots = () => {
      const morningSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30'
      ];
      
      const afternoonSlots = [
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00', '20:30'
      ];
      
      return [...morningSlots, ...afternoonSlots];
    };
  
    const timeSlots = generateTimeSlots();
  
    const handleBooking = () => {
      if (!selectedService || !selectedDate || !selectedTime) {
        Alert.alert('Information manquante', 'Veuillez sélectionner un service, une date et une heure.');
        return;
      }
      setShowBookingModal(true);
    };
  
    const confirmBooking = () => {
      setShowBookingModal(false);
      Alert.alert(
        '🎉 Réservation Confirmée !',
        `Votre rendez-vous ${bookingType === 'express' ? 'Express ⚡' : 'Standard'} a été enregistré avec succès.\n\nBaye Zale vous contactera sous peu pour confirmation.\n\n📱 Vous recevrez un SMS de rappel.`,
        [{ text: 'Parfait !', onPress: resetForm }]
      );
    };
  
    const resetForm = () => {
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setBookingType('standard');
    };
  
    const dates = generateDates();
    const selectedServiceData = services.find(s => s.id === selectedService);
    const totalPrice = selectedServiceData ? 
      (bookingType === 'express' ? selectedServiceData.expressPrice : selectedServiceData.standardPrice) : 0;
  
    // Simuler créneaux occupés (en production, viendrait de Firebase)
    const getSlotStatus = (time: string) => {
      const occupiedSlots = ['09:30', '14:00', '16:00', '18:30'];
      if (occupiedSlots.includes(time)) return 'occupied';
      
      // Slots fermés de 4h à 13h (pas dans notre liste mais pour exemple)
      const hour = parseInt(time.split(':')[0]);
      if (hour >= 4 && hour < 13 && !timeSlots.includes(time)) return 'closed';
      
      return 'available';
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header avec badge professionnel */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Réservation Professionnelle</Text>
              <Text style={styles.subtitle}>Choisissez votre service et créneau préféré</Text>
            </View>
            <View style={styles.bayeZaleBadge}>
              <Text style={styles.badgeText}>Baye Zale Cutt</Text>
              <Text style={styles.badgeSubtext}>Coiffeur Expert</Text>
            </View>
          </View>
  
          {/* Service Selection avec design amélioré */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.stepNumber}>1.</Text> Sélectionnez votre service
            </Text>
            <View style={styles.servicesContainer}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceOption,
                    selectedService === service.id && styles.selectedServiceOption
                  ]}
                  onPress={() => setSelectedService(service.id as any)}
                >
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                    {selectedService === service.id && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>✓</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                    
                    <View style={styles.serviceMetrics}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricIcon}>⏱</Text>
                        <Text style={styles.metricText}>{service.duration} min</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricIcon}>💰</Text>
                        <Text style={styles.metricText}>{service.standardPrice.toLocaleString()} FCFA</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
  
          {/* Type de réservation avec terminologie professionnelle */}
          {selectedService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Text style={styles.stepNumber}>2.</Text> Choisissez votre formule
              </Text>
              <View style={styles.bookingTypeContainer}>
                {/* Réservation Standard */}
                <TouchableOpacity
                  style={[
                    styles.bookingTypeOption,
                    styles.standardOption,
                    bookingType === 'standard' && styles.selectedBookingType
                  ]}
                  onPress={() => setBookingType('standard')}
                >
                  <View style={styles.bookingTypeHeader}>
                    <View style={styles.typeIconContainer}>
                      <Text style={styles.typeIcon}>📋</Text>
                    </View>
                    <View style={styles.standardBadge}>
                      <Text style={styles.standardBadgeText}>Standard</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.bookingTypeTitle}>Réservation Standard</Text>
                  <Text style={styles.bookingTypePrice}>
                    {selectedServiceData?.standardPrice.toLocaleString()} FCFA
                  </Text>
                  <Text style={styles.bookingTypeDescription}>
                    • File d'attente normale{'\n'}
                    • Horaire flexible{'\n'}
                    • Service de qualité garantie
                  </Text>
                  
                  {bookingType === 'standard' && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIndicatorText}>✓ Sélectionné</Text>
                    </View>
                  )}
                </TouchableOpacity>
  
                {/* Service Express */}
                <TouchableOpacity
                  style={[
                    styles.bookingTypeOption,
                    styles.expressOption,
                    bookingType === 'express' && styles.selectedBookingType
                  ]}
                  onPress={() => setBookingType('express')}
                >
                  <View style={styles.bookingTypeHeader}>
                    <View style={styles.typeIconContainer}>
                      <Text style={styles.typeIcon}>⚡</Text>
                    </View>
                    <View style={styles.expressBadge}>
                      <Text style={styles.expressBadgeText}>Express</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.bookingTypeTitle}>Service Express</Text>
                  <Text style={styles.bookingTypePrice}>
                    {selectedServiceData?.expressPrice.toLocaleString()} FCFA
                  </Text>
                  <Text style={styles.bookingTypeDescription}>
                    • Priorité absolue ⚡{'\n'}
                    • Passage immédiat{'\n'}
                    • Service premium garanti
                  </Text>
                  
                  {bookingType === 'express' && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIndicatorText}>✓ Sélectionné</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Info supplémentaire */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoIcon}>💡</Text>
                <Text style={styles.infoText}>
                  {bookingType === 'express' 
                    ? "Le Service Express vous place en priorité, idéal pour les urgences !"
                    : "La Réservation Standard suit l'ordre d'arrivée, parfait pour une planification normale."
                  }
                </Text>
              </View>
            </View>
          )}
  
          {/* Date Selection avec design amélioré */}
          {selectedService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Text style={styles.stepNumber}>3.</Text> Sélectionnez la date
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
                {dates.map((dateItem, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateOption,
                      selectedDate === dateItem.fullDate && styles.selectedDateOption
                    ]}
                    onPress={() => setSelectedDate(dateItem.fullDate as any)}
                  >
                    <Text style={[
                      styles.dayName,
                      selectedDate === dateItem.fullDate && styles.selectedDateText
                    ]}>
                      {dateItem.isToday ? 'Aujourd\'hui' : dateItem.dayName}
                    </Text>
                    <Text style={[
                      styles.dayNumber,
                      selectedDate === dateItem.fullDate && styles.selectedDateText
                    ]}>
                      {dateItem.day}
                    </Text>
                    {dateItem.isToday && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayBadgeText}>•</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Time Selection avec statuts visuels */}
          {selectedDate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Text style={styles.stepNumber}>4.</Text> Choisissez l'heure
              </Text>
              
              {/* Légende des statuts */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>Disponible</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendText}>Occupé</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4F7FEE' }]} />
                  <Text style={styles.legendText}>Sélectionné</Text>
                </View>
              </View>
              
              <View style={styles.timeSlotsContainer}>
                {timeSlots.map((time) => {
                  const slotStatus = getSlotStatus(time);
                  const isSelected = selectedTime === time;
                  const isDisabled = slotStatus === 'occupied' || slotStatus === 'closed';
                  
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        isSelected && styles.selectedTimeSlot,
                        slotStatus === 'occupied' && styles.occupiedTimeSlot,
                        slotStatus === 'closed' && styles.closedTimeSlot
                      ]}
                      onPress={() => {
                        if (!isDisabled) {
                          setSelectedTime(time as any);
                        }
                      }}
                      disabled={isDisabled}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        isSelected && styles.selectedTimeSlotText,
                        isDisabled && styles.disabledTimeSlotText
                      ]}>
                        {time}
                      </Text>
                      {slotStatus === 'occupied' && (
                        <Text style={styles.slotStatusText}>Occupé</Text>
                      )}
                      {slotStatus === 'closed' && (
                        <Text style={styles.slotStatusText}>Fermé</Text>
                      )}
                      {isSelected && (
                        <View style={styles.selectedTimeIndicator}>
                          <Text style={styles.selectedTimeIndicatorText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {/* Info horaires */}
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleInfoText}>
                  📍 Horaires: 8h00-12h30 • 13h00-20h30 | Pause: 4h00-13h00
                </Text>
              </View>
            </View>
          )}

          {/* Summary et Book Button avec design premium */}
          {selectedService && selectedDate && selectedTime && (
            <View style={styles.section}>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>📋 Résumé de votre réservation</Text>
                  {bookingType === 'express' && (
                    <View style={styles.expressIndicator}>
                      <Text style={styles.expressIndicatorText}>⚡ EXPRESS</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Service:</Text>
                    <Text style={styles.summaryValue}>{selectedServiceData?.title}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Date:</Text>
                    <Text style={styles.summaryValue}>{selectedDate}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Heure:</Text>
                    <Text style={styles.summaryValue}>{selectedTime}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Durée:</Text>
                    <Text style={styles.summaryValue}>{selectedServiceData?.duration} minutes</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Formule:</Text>
                    <Text style={styles.summaryValue}>
                      {bookingType === 'express' ? 'Service Express ⚡' : 'Réservation Standard 📋'}
                    </Text>
                  </View>
                  
                  <View style={styles.summaryDivider} />
                  
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total à payer:</Text>
                    <Text style={styles.totalValue}>{totalPrice.toLocaleString()} FCFA</Text>
                  </View>
                  
                  {bookingType === 'express' && (
                    <Text style={styles.priorityNote}>
                      ⚡ Votre réservation Express sera traitée en priorité absolue !
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.bookButton,
                  bookingType === 'express' && styles.expressBookButton
                ]} 
                onPress={handleBooking}
              >
                <Text style={styles.bookButtonText}>
                  {bookingType === 'express' ? '⚡ Réserver en Express' : '📋 Confirmer la Réservation'}
                </Text>
                <Text style={styles.bookButtonSubtext}>
                  {bookingType === 'express' ? 'Priorité garantie' : 'Paiement sur place'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Modal de confirmation amélioré */}
        <Modal
          visible={showBookingModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirmer votre réservation</Text>
                {bookingType === 'express' && (
                  <View style={styles.modalExpressBadge}>
                    <Text style={styles.modalExpressBadgeText}>⚡ EXPRESS</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.modalText}>
                Voulez-vous confirmer cette réservation chez Baye Zale ?
              </Text>
              
              <View style={styles.modalDetails}>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailIcon}>📅</Text>
                  <Text style={styles.modalDetailText}>{selectedDate} à {selectedTime}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailIcon}>{selectedServiceData?.icon}</Text>
                  <Text style={styles.modalDetailText}>{selectedServiceData?.title}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailIcon}>💰</Text>
                  <Text style={styles.modalPrice}>{totalPrice.toLocaleString()} FCFA</Text>
                </View>
                
                {bookingType === 'express' && (
                  <View style={styles.modalExpressInfo}>
                    <Text style={styles.modalExpressText}>
                      ⚡ SERVICE EXPRESS - Vous passerez en priorité absolue !
                    </Text>
                  </View>
                )}
                
                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoText}>
                    📞 Baye Zale vous contactera sous peu pour confirmer votre rendez-vous.
                    {'\n'}📱 Vous recevrez un SMS de rappel avant votre RDV.
                  </Text>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowBookingModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.confirmButton,
                    bookingType === 'express' && styles.expressConfirmButton
                  ]}
                  onPress={confirmBooking}
                >
                  <Text style={styles.confirmButtonText}>
                    {bookingType === 'express' ? '⚡ Confirmer Express' : '✓ Confirmer'}
                  </Text>
                </TouchableOpacity>
              </View>
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
  bayeZaleBadge: {
    backgroundColor: '#4F7FEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  stepNumber: {
    color: '#4F7FEE',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Services améliorés
  servicesContainer: {
    gap: 16,
  },
  serviceOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedServiceOption: {
    borderColor: '#4F7FEE',
    backgroundColor: '#EEF2FF',
    transform: [{ scale: 1.02 }],
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    fontSize: 32,
  },
  selectedBadge: {
    backgroundColor: '#4F7FEE',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceDetails: {
    gap: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  serviceMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricIcon: {
    fontSize: 14,
  },
  metricText: {
    fontSize: 14,
    color: '#4F7FEE',
    fontWeight: '600',
  },
  
  // Types de réservation
  bookingTypeContainer: {
    gap: 16,
  },
  bookingTypeOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  standardOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  expressOption: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  selectedBookingType: {
    borderColor: '#4F7FEE',
    backgroundColor: '#EEF2FF',
    transform: [{ scale: 1.02 }],
  },
  bookingTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIconContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIcon: {
    fontSize: 18,
  },
  standardBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  standardBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expressBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expressBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  bookingTypePrice: {
    fontSize: 20,
    color: '#4F7FEE',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bookingTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4F7FEE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4F7FEE',
    lineHeight: 20,
  },
  
  // Dates
  datesContainer: {
    paddingLeft: 24,
    marginHorizontal: -24,
  },
  dateOption: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 90,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  selectedDateOption: {
    borderColor: '#4F7FEE',
    backgroundColor: '#EEF2FF',
    transform: [{ scale: 1.05 }],
  },
  dayName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  selectedDateText: {
    color: '#4F7FEE',
  },
  todayBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadgeText: {
    color: '#FFFFFF',
    fontSize: 6,
  },
  
  // Créneaux horaires
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minWidth: 80,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  selectedTimeSlot: {
    borderColor: '#4F7FEE',
    backgroundColor: '#EEF2FF',
    transform: [{ scale: 1.05 }],
  },
  occupiedTimeSlot: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  closedTimeSlot: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  selectedTimeSlotText: {
    color: '#4F7FEE',
    fontWeight: 'bold',
  },
  disabledTimeSlotText: {
    color: '#9CA3AF',
  },
  slotStatusText: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 2,
    fontWeight: '500',
  },
  selectedTimeIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#4F7FEE',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTimeIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scheduleInfo: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  scheduleInfoText: {
    fontSize: 12,
    color: '#4F7FEE',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Summary
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  expressIndicator: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expressIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalRow: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 22,
    color: '#4F7FEE',
    fontWeight: 'bold',
  },
  priorityNote: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
  },
  
  // Bouton de réservation
  bookButton: {
    backgroundColor: '#4F7FEE',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#4F7FEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  expressBookButton: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  modalExpressBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalExpressBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalDetailIcon: {
    fontSize: 18,
    width: 24,
  },
  modalDetailText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  modalPrice: {
    fontSize: 20,
    color: '#4F7FEE',
    fontWeight: 'bold',
  },
  modalExpressInfo: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  modalExpressText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalInfoBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#4F7FEE',
    lineHeight: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#4F7FEE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  expressConfirmButton: {
    backgroundColor: '#F59E0B',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
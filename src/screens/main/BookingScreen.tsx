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
  
  const { width } = Dimensions.get('window');
  
  export default function BookingScreen() {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookingType, setBookingType] = useState('normal');
    const [showBookingModal, setShowBookingModal] = useState(false);
  
    const services = [
      {
        id: 'homme',
        title: 'Coupe Homme',
        duration: 30,
        normalPrice: 8000,
        urgentPrice: 10000,
        icon: '✂️',
        description: 'Coupe classique avec finition parfaite',
      },
      {
        id: 'femme',
        title: 'Coupe Femme',
        duration: 45,
        normalPrice: 8000,
        urgentPrice: 10000,
        icon: '💇‍♀️',
        description: 'Coupe et mise en forme moderne',
      },
      {
        id: 'enfant',
        title: 'Coupe Enfant',
        duration: 25,
        normalPrice: 5000,
        urgentPrice: 7000,
        icon: '👶',
        description: 'Coupe adaptée aux plus jeunes',
      },
      {
        id: 'domicile',
        title: 'Service à Domicile',
        duration: 60,
        normalPrice: 30000,
        urgentPrice: 30000,
        icon: '🏠',
        description: 'Service complet chez vous',
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
  
    // Créneaux horaires disponibles
    const timeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00'
    ];
  
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
        'Réservation Confirmée ! 🎉',
        `Votre rendez-vous a été réservé avec succès.\n\nVous recevrez une confirmation par SMS.`,
        [{ text: 'Parfait !', onPress: resetForm }]
      );
    };
  
    const resetForm = () => {
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setBookingType('normal');
    };
  
    const dates = generateDates();
    const selectedServiceData = services.find(s => s.id === selectedService);
    const totalPrice = selectedServiceData ? 
      (bookingType === 'urgent' ? selectedServiceData.urgentPrice : selectedServiceData.normalPrice) : 0;
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Réservation</Text>
            <Text style={styles.subtitle}>Choisissez votre service et créneau</Text>
          </View>
  
          {/* Service Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Choisissez votre service</Text>
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
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                    <Text style={styles.serviceDuration}>{service.duration} min</Text>
                    <Text style={styles.servicePrice}>
                      {service.normalPrice.toLocaleString()} FCFA
                    </Text>
                  </View>
                  {selectedService === service.id && (
                    <Text style={styles.selectedIcon}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
  
          {/* Booking Type */}
          {selectedService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Type de réservation</Text>
              <View style={styles.bookingTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.bookingTypeOption,
                    bookingType === 'normal' && styles.selectedBookingType
                  ]}
                  onPress={() => setBookingType('normal')}
                >
                  <Text style={styles.bookingTypeTitle}>Normal</Text>
                  <Text style={styles.bookingTypePrice}>
                    {selectedServiceData?.normalPrice.toLocaleString()} FCFA
                  </Text>
                  <Text style={styles.normalNote}>File d'attente standard</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[
                    styles.bookingTypeOption,
                    bookingType === 'urgent' && styles.selectedBookingType
                  ]}
                  onPress={() => setBookingType('urgent')}
                >
                  <Text style={styles.bookingTypeTitle}>Urgent ⚡</Text>
                  <Text style={styles.bookingTypePrice}>
                    {selectedServiceData?.urgentPrice.toLocaleString()} FCFA
                  </Text>
                  <Text style={styles.urgentNote}>Priorité dans la file</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
  
          {/* Date Selection */}
          {selectedService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Choisissez la date</Text>
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
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
  
          {/* Time Selection */}
          {selectedDate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Choisissez l'heure</Text>
              <View style={styles.timeSlotsContainer}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot,
                      // Simuler quelques créneaux occupés
                      ['09:30', '14:00', '16:00'].includes(time) && styles.unavailableTimeSlot
                    ]}
                    onPress={() => {
                      if (!['09:30', '14:00', '16:00'].includes(time)) {
                        setSelectedTime(time as any); // Type assertion to fix type error
                      }
                    }}
                    disabled={['09:30', '14:00', '16:00'].includes(time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText,
                      ['09:30', '14:00', '16:00'].includes(time) && styles.unavailableTimeSlotText
                    ]}>
                      {time}
                    </Text>
                    {['09:30', '14:00', '16:00'].includes(time) && (
                      <Text style={styles.unavailableLabel}>Occupé</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
  
          {/* Summary and Book Button */}
          {selectedService && selectedDate && selectedTime && (
            <View style={styles.section}>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Résumé de votre réservation</Text>
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
                  <Text style={styles.summaryValue}>{selectedServiceData?.duration} min</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Type:</Text>
                  <Text style={styles.summaryValue}>
                    {bookingType === 'urgent' ? 'Urgent ⚡' : 'Normal'}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{totalPrice.toLocaleString()} FCFA</Text>
                </View>
              </View>
  
              <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                <Text style={styles.bookButtonText}>Réserver Maintenant</Text>
              </TouchableOpacity>
            </View>
          )}
  
          <View style={{ height: 100 }} />
        </ScrollView>
  
        {/* Booking Confirmation Modal */}
        <Modal
          visible={showBookingModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmer la réservation</Text>
              <Text style={styles.modalText}>
                Voulez-vous confirmer cette réservation ?
              </Text>
              
              <View style={styles.modalDetails}>
                <Text style={styles.modalDetailText}>
                  📅 {selectedDate} à {selectedTime}
                </Text>
                <Text style={styles.modalDetailText}>
                  {selectedServiceData?.icon} {selectedServiceData?.title}
                </Text>
                <Text style={styles.modalPrice}>
                  {totalPrice.toLocaleString()} FCFA
                </Text>
                {bookingType === 'urgent' && (
                  <Text style={styles.urgentBadge}>⚡ URGENT - Priorité garantie</Text>
                )}
              </View>
  
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowBookingModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={confirmBooking}
                >
                  <Text style={styles.confirmButtonText}>Confirmer</Text>
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
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#6B7280',
    },
    section: {
      paddingHorizontal: 24,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 16,
    },
    servicesContainer: {
      gap: 12,
    },
    serviceOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: 'transparent',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    selectedServiceOption: {
      borderColor: '#4F7FEE',
      backgroundColor: '#EEF2FF',
    },
    serviceIcon: {
      fontSize: 32,
      marginRight: 16,
    },
    serviceDetails: {
      flex: 1,
    },
    serviceTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 4,
    },
    serviceDescription: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 4,
    },
    serviceDuration: {
      fontSize: 13,
      color: '#9CA3AF',
      marginBottom: 4,
    },
    servicePrice: {
      fontSize: 16,
      color: '#4F7FEE',
      fontWeight: '600',
    },
    selectedIcon: {
      fontSize: 24,
      color: '#4F7FEE',
    },
    bookingTypeContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    bookingTypeOption: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    selectedBookingType: {
      borderColor: '#4F7FEE',
      backgroundColor: '#EEF2FF',
    },
    bookingTypeTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 8,
    },
    bookingTypePrice: {
      fontSize: 18,
      color: '#4F7FEE',
      fontWeight: 'bold',
      marginBottom: 4,
    },
    normalNote: {
      fontSize: 12,
      color: '#6B7280',
      fontStyle: 'italic',
    },
    urgentNote: {
      fontSize: 12,
      color: '#F59E0B',
      fontStyle: 'italic',
      fontWeight: '600',
    },
    datesContainer: {
      paddingLeft: 24,
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
    },
    selectedDateOption: {
      borderColor: '#4F7FEE',
      backgroundColor: '#EEF2FF',
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
      borderColor: 'transparent',
      minWidth: 80,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    selectedTimeSlot: {
      borderColor: '#4F7FEE',
      backgroundColor: '#EEF2FF',
    },
    unavailableTimeSlot: {
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
    },
    unavailableTimeSlotText: {
      color: '#9CA3AF',
    },
    unavailableLabel: {
      fontSize: 10,
      color: '#EF4444',
      marginTop: 2,
    },
    summaryContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    summaryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 16,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 16,
      color: '#6B7280',
    },
    summaryValue: {
      fontSize: 16,
      color: '#1F2937',
      fontWeight: '600',
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      paddingTop: 12,
      marginTop: 8,
    },
    totalLabel: {
      fontSize: 18,
      color: '#1F2937',
      fontWeight: 'bold',
    },
    totalValue: {
      fontSize: 20,
      color: '#4F7FEE',
      fontWeight: 'bold',
    },
    bookButton: {
      backgroundColor: '#4F7FEE',
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#4F7FEE',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    bookButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      width: '100%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 12,
    },
    modalText: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 20,
    },
    modalDetails: {
      alignItems: 'center',
      marginBottom: 24,
      padding: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      width: '100%',
    },
    modalDetailText: {
      fontSize: 16,
      color: '#1F2937',
      marginBottom: 8,
      textAlign: 'center',
    },
    modalPrice: {
      fontSize: 24,
      color: '#4F7FEE',
      fontWeight: 'bold',
      marginTop: 8,
    },
    urgentBadge: {
      fontSize: 14,
      color: '#F59E0B',
      fontWeight: 'bold',
      marginTop: 8,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: '#6B7280',
      fontSize: 16,
      fontWeight: '600',
    },
    confirmButton: {
      flex: 1,
      backgroundColor: '#4F7FEE',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
});

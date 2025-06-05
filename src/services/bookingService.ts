// src/services/bookingService.ts - Enhanced Booking Management
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import userService from './userService';

// Enhanced Booking Interface
export interface Booking {
  id: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  barberId: string;
  barberName?: string;
  serviceId: string;
  serviceName?: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  endTime?: string; // Calculated based on service duration
  type: 'standard' | 'express';
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  totalPrice: number;
  depositPaid: number;
  remainingAmount: number;
  paymentMethod: 'orange_money' | 'wave' | 'cash' | 'card';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  specialRequests?: string;
  gallerySelection?: string[];
  queuePosition?: number;
  estimatedWaitTime?: number; // En minutes
  actualStartTime?: string;
  actualEndTime?: string;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  adminNotes?: string;
  reminders: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Time Slot Interface
export interface TimeSlot {
  time: string;
  available: boolean;
  bookingId?: string;
  isBreak?: boolean;
  capacity: number; // Pour gérer plusieurs coiffeurs
  currentBookings: number;
}

// Queue Management Interface
export interface QueueStatus {
  standardQueue: {
    count: number;
    estimatedWait: number;
    nextAvailable: string;
  };
  expressQueue: {
    count: number;
    estimatedWait: number;
    nextAvailable: string;
  };
  currentlyServing?: {
    bookingId: string;
    userName: string;
    service: string;
    startTime: string;
    estimatedEndTime: string;
  };
}

class BookingService {
  private listeners: Map<string, () => void> = new Map();

  // Create new booking with validation
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Validate time slot availability
      const isAvailable = await this.checkTimeSlotAvailability(
        bookingData.date,
        bookingData.time,
        bookingData.barberId
      );
      
      if (!isAvailable) {
        throw new Error('Ce créneau n\'est plus disponible');
      }

      // Get user details
      const user = await userService.getUserById(bookingData.userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Calculate end time based on service duration
      const endTime = this.calculateEndTime(bookingData.time, bookingData.serviceId);
      
      // Calculate queue position
      const queuePosition = await this.calculateQueuePosition(
        bookingData.date,
        bookingData.type
      );
      
      // Calculate estimated wait time
      const estimatedWaitTime = await this.calculateEstimatedWaitTime(
        bookingData.date,
        bookingData.time,
        queuePosition,
        bookingData.type
      );

      // Create booking document
      const bookingRef = doc(collection(db, 'bookings'));
      const booking: Booking = {
        ...bookingData,
        id: bookingRef.id,
        userName: user.name,
        userPhone: user.phone,
        barberName: 'Baye Zale', // En production, récupérer depuis la DB
        serviceName: this.getServiceName(bookingData.serviceId),
        endTime,
        queuePosition,
        estimatedWaitTime,
        depositPaid: 0,
        remainingAmount: bookingData.totalPrice,
        reminders: {
          sms: true,
          email: true,
          push: true
        },
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };

      await setDoc(bookingRef, booking);

      // Update user stats
      await this.updateUserBookingStats(bookingData.userId);

      // Send confirmation notification
      await this.sendBookingNotification(bookingRef.id, 'confirmation');

      // Schedule reminders
      await this.scheduleReminders(bookingRef.id);

      return bookingRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Check time slot availability with real-time updates
  async checkTimeSlotAvailability(
    date: string,
    time: string,
    barberId: string
  ): Promise<boolean> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('date', '==', date),
        where('time', '==', time),
        where('barberId', '==', barberId),
        where('status', 'in', ['pending', 'confirmed', 'in-progress'])
      );
      
      const snapshot = await getDocs(q);
      
      // Check capacity (assuming 1 barber for now)
      return snapshot.empty;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  // Get available time slots for a date
  async getAvailableTimeSlots(date: string, barberId: string = 'baye_zale'): Promise<TimeSlot[]> {
    try {
      // Define working hours
      const morningSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30'
      ];
      
      const afternoonSlots = [
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00', '20:30'
      ];
      
      const allSlots = [...morningSlots, ...afternoonSlots];
      
      // Get existing bookings for the date
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('date', '==', date),
        where('barberId', '==', barberId),
        where('status', 'in', ['pending', 'confirmed', 'in-progress'])
      );
      
      const snapshot = await getDocs(q);
      const bookedSlots = new Set(snapshot.docs.map(doc => doc.data().time));
      
      // Check if date is today and filter past slots
      const now = new Date();
      const isToday = date === now.toISOString().split('T')[0];
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      return allSlots.map(time => {
        const [hour, minute] = time.split(':').map(Number);
        const slotTime = hour * 60 + minute;
        
        // Mark as unavailable if in the past (for today)
        if (isToday && slotTime <= currentTime) {
          return {
            time,
            available: false,
            capacity: 1,
            currentBookings: 1,
            isBreak: false
          };
        }
        
        // Check if it's a break time (4h-13h)
        if (hour >= 4 && hour < 13 && !allSlots.includes(time)) {
          return {
            time,
            available: false,
            isBreak: true,
            capacity: 0,
            currentBookings: 0
          };
        }
        
        return {
          time,
          available: !bookedSlots.has(time),
          capacity: 1,
          currentBookings: bookedSlots.has(time) ? 1 : 0
        };
      });
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (bookingDoc.exists()) {
        return { id: bookingId, ...bookingDoc.data() } as Booking;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  // Update booking status
  async updateBookingStatus(
    bookingId: string, 
    status: Booking['status'],
    additionalData?: Partial<Booking>
  ): Promise<void> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
        ...additionalData
      };
      
      // Add specific fields based on status
      if (status === 'in-progress') {
        updateData.actualStartTime = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.actualEndTime = new Date().toISOString();
      }
      
      await updateDoc(bookingRef, updateData);
      
      // Update user stats if completed
      if (status === 'completed') {
        const booking = await this.getBookingById(bookingId);
        if (booking) {
          await this.updateUserAfterCompletion(booking);
        }
      }
      
      // Send status notification
      await this.sendBookingNotification(bookingId, status);
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Cancel booking with reason
  async cancelBooking(bookingId: string, reason: string, cancelledBy: 'user' | 'admin'): Promise<void> {
    try {
      const booking = await this.getBookingById(bookingId);
      if (!booking) throw new Error('Booking not found');
      
      await this.updateBookingStatus(bookingId, 'cancelled', {
        cancellationReason: reason,
        adminNotes: cancelledBy === 'admin' ? `Annulé par l'admin: ${reason}` : undefined
      });
      
      // Handle refund if payment was made
      if (booking.depositPaid > 0) {
        await this.processRefund(bookingId, booking.depositPaid);
      }
      
      // Update user cancellation stats
      if (cancelledBy === 'user') {
        await this.updateUserCancellationStats(booking.userId);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Get user booking history
  async getUserBookings(
    userId: string, 
    status?: Booking['status'][], 
    maxResults: number = 20
  ): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      let q = query(
        bookingsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      if (status && status.length > 0) {
        q = query(q, where('status', 'in', status));
      }
      
      if (maxResults > 0) {
        q = query(q, limit(maxResults));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  // Get today's bookings for admin
  async getTodayBookings(barberId?: string): Promise<Booking[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bookingsRef = collection(db, 'bookings');
      
      let q = query(
        bookingsRef,
        where('date', '==', today),
        orderBy('time', 'asc')
      );
      
      if (barberId) {
        q = query(q, where('barberId', '==', barberId));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error getting today bookings:', error);
      return [];
    }
  }

  // Get queue status
  async getQueueStatus(date?: string): Promise<QueueStatus> {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const bookings = await this.getTodayBookings();
      
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Filter pending/confirmed bookings
      const pendingBookings = bookings.filter(b => 
        ['pending', 'confirmed'].includes(b.status)
      );
      
      const standardQueue = pendingBookings.filter(b => b.type === 'standard');
      const expressQueue = pendingBookings.filter(b => b.type === 'express');
      
      // Find currently serving
      const inProgress = bookings.find(b => b.status === 'in-progress');
      
      // Calculate wait times
      const avgServiceTime = 35; // minutes
      const standardWait = standardQueue.length * avgServiceTime;
      const expressWait = expressQueue.length * avgServiceTime * 0.5; // Express is faster
      
      return {
        standardQueue: {
          count: standardQueue.length,
          estimatedWait: standardWait,
          nextAvailable: this.calculateNextAvailable(currentTime, standardWait)
        },
        expressQueue: {
          count: expressQueue.length,
          estimatedWait: expressWait,
          nextAvailable: this.calculateNextAvailable(currentTime, expressWait)
        },
        currentlyServing: inProgress ? {
          bookingId: inProgress.id,
          userName: inProgress.userName || 'Client',
          service: inProgress.serviceName || 'Service',
          startTime: inProgress.actualStartTime || inProgress.time,
          estimatedEndTime: inProgress.endTime || this.addMinutesToTime(inProgress.time, 35)
        } : undefined
      };
    } catch (error) {
      console.error('Error getting queue status:', error);
      return {
        standardQueue: { count: 0, estimatedWait: 0, nextAvailable: 'N/A' },
        expressQueue: { count: 0, estimatedWait: 0, nextAvailable: 'N/A' }
      };
    }
  }

  // Subscribe to real-time booking updates
  subscribeToBookingUpdates(
    date: string,
    callback: (bookings: Booking[]) => void
  ): () => void {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('date', '==', date),
      orderBy('time', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Booking));
      callback(bookings);
    });
    
    // Store unsubscribe function
    const listenerId = `bookings_${date}`;
    this.listeners.set(listenerId, unsubscribe);
    
    return () => {
      unsubscribe();
      this.listeners.delete(listenerId);
    };
  }

  // Rate and review booking
  async rateBooking(
    bookingId: string, 
    rating: number, 
    review?: string
  ): Promise<void> {
    try {
      const booking = await this.getBookingById(bookingId);
      if (!booking || booking.status !== 'completed') {
        throw new Error('Impossible de noter cette réservation');
      }
      
      await updateDoc(doc(db, 'bookings', bookingId), {
        rating,
        review,
        updatedAt: serverTimestamp()
      });
      
      // Update barber rating
      await this.updateBarberRating(booking.barberId);
    } catch (error) {
      console.error('Error rating booking:', error);
      throw error;
    }
  }

  // Private helper methods
  private calculateEndTime(startTime: string, serviceId: string): string {
    const serviceDurations: Record<string, number> = {
      'homme_classic': 30,
      'homme_barbe': 20,
      'homme_complet': 45,
      'enfant_coupe': 25,
      'femme_coupe': 40,
      'domicile_service': 60
    };
    
    const duration = serviceDurations[serviceId] || 30;
    return this.addMinutesToTime(startTime, duration);
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }

  private calculateNextAvailable(currentMinutes: number, waitMinutes: number): string {
    const totalMinutes = currentMinutes + waitMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private async calculateQueuePosition(date: string, type: 'standard' | 'express'): Promise<number> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('date', '==', date),
        where('type', '==', type),
        where('status', 'in', ['pending', 'confirmed']),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size + 1;
    } catch (error) {
      console.error('Error calculating queue position:', error);
      return 1;
    }
  }

  private async calculateEstimatedWaitTime(
    date: string,
    time: string,
    queuePosition: number,
    type: 'standard' | 'express'
  ): Promise<number> {
    const avgServiceTime = 35; // minutes
    const factor = type === 'express' ? 0.5 : 1;
    return Math.round((queuePosition - 1) * avgServiceTime * factor);
  }

  private getServiceName(serviceId: string): string {
    const serviceNames: Record<string, string> = {
      'homme_classic': 'Coupe Classique Homme',
      'homme_barbe': 'Taille de Barbe Premium',
      'homme_complet': 'Service Complet Homme',
      'enfant_coupe': 'Coupe Enfant Spécialisée',
      'femme_coupe': 'Coupe Femme Moderne',
      'domicile_service': 'Service Premium à Domicile'
    };
    
    return serviceNames[serviceId] || 'Service';
  }

  private async updateUserBookingStats(userId: string): Promise<void> {
    try {
      const user = await userService.getUserById(userId);
      if (user) {
        await userService.createOrUpdateUser(userId, {
          totalAppointments: (user.totalAppointments || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error updating user booking stats:', error);
    }
  }

  private async updateUserAfterCompletion(booking: Booking): Promise<void> {
    try {
      const user = await userService.getUserById(booking.userId);
      if (user) {
        await userService.createOrUpdateUser(booking.userId, {
          totalSpent: (user.totalSpent || 0) + booking.totalPrice
        });
        
        // Add loyalty points (10% of spent amount)
        const points = Math.floor(booking.totalPrice / 100);
        await userService.updateLoyaltyPoints(
          booking.userId, 
          points, 
          `Réservation ${booking.id}`
        );
      }
    } catch (error) {
      console.error('Error updating user after completion:', error);
    }
  }

  private async updateUserCancellationStats(userId: string): Promise<void> {
    // Track cancellations for future reference
    try {
      const cancellationsRef = collection(db, 'userCancellations');
      await setDoc(doc(cancellationsRef), {
        userId,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating cancellation stats:', error);
    }
  }

  private async updateBarberRating(barberId: string): Promise<void> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('barberId', '==', barberId),
        where('rating', '>', 0)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;
      
      let totalRating = 0;
      let count = 0;
      
      snapshot.docs.forEach(doc => {
        const rating = doc.data().rating;
        if (rating) {
          totalRating += rating;
          count++;
        }
      });
      
      const avgRating = count > 0 ? totalRating / count : 0;
      
      // Update barber document (if exists)
      // This would be implemented when barber management is added
    } catch (error) {
      console.error('Error updating barber rating:', error);
    }
  }

  private async sendBookingNotification(bookingId: string, type: string): Promise<void> {
    // Implement notification sending logic
    // This would integrate with a notification service
    console.log(`Sending ${type} notification for booking ${bookingId}`);
  }

  private async scheduleReminders(bookingId: string): Promise<void> {
    // Implement reminder scheduling logic
    // This would integrate with a job scheduling service
    console.log(`Scheduling reminders for booking ${bookingId}`);
  }

  private async processRefund(bookingId: string, amount: number): Promise<void> {
    // Implement refund processing logic
    // This would integrate with payment providers
    console.log(`Processing refund of ${amount} for booking ${bookingId}`);
  }

  // Cleanup all listeners
  cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }
}

export default new BookingService();
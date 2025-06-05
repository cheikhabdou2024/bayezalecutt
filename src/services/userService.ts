// src/services/userService.ts - Enhanced User Management
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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImageUrl?: string;
  memberSince: Timestamp;
  lastVisit: Timestamp;
  totalAppointments: number;
  totalSpent: number;
  avgRating: number;
  isAdmin: boolean;
  isActive: boolean;
  preferredServices: string[];
  preferredBarber?: string;
  notificationPreferences: {
    sms: boolean;
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  tags: string[]; // VIP, Regular, New, etc.
  notes?: string; // Admin notes
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Statistics Interface
export interface UserStats {
  userId: string;
  monthlyVisits: number;
  lastMonthSpent: number;
  favoriteService: string;
  averageSpend: number;
  cancellationRate: number;
  punctualityScore: number; // Based on arrival times
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

class UserService {
  private currentUser: User | null = null;

  // Create or update user profile
  async createOrUpdateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing user
        const updatedData = {
          ...userData,
          updatedAt: serverTimestamp(),
          lastVisit: serverTimestamp()
        };
        await updateDoc(userRef, updatedData);
        
        const updatedDoc = await getDoc(userRef);
        return { id: userId, ...updatedDoc.data() } as User;
      } else {
        // Create new user
        const referralCode = this.generateReferralCode(userId);
        const newUser: Partial<User> = {
          ...userData,
          id: userId,
          memberSince: serverTimestamp() as Timestamp,
          lastVisit: serverTimestamp() as Timestamp,
          totalAppointments: 0,
          totalSpent: 0,
          avgRating: 0,
          isAdmin: userData.email === 'bayezale@gmail.com',
          isActive: true,
          preferredServices: [],
          notificationPreferences: {
            sms: true,
            email: true,
            push: true,
            marketing: false
          },
          loyaltyPoints: 0,
          referralCode,
          tags: ['New'],
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp
        };
        
        await setDoc(userRef, newUser);
        return { id: userId, ...newUser } as User;
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }

  // Get user by ID with caching
  async getUserById(userId: string): Promise<User | null> {
    try {
      // Check cache first
      if (this.currentUser?.id === userId) {
        return this.currentUser;
      }

      // Check local storage
      const cachedUser = await AsyncStorage.getItem(`user_${userId}`);
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        const cacheTime = user._cacheTime || 0;
        const now = Date.now();
        
        // Cache valid for 5 minutes
        if (now - cacheTime < 5 * 60 * 1000) {
          this.currentUser = user;
          return user;
        }
      }

      // Fetch from Firestore
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const user = { id: userId, ...userDoc.data() } as User;
        
        // Update cache
        await AsyncStorage.setItem(`user_${userId}`, JSON.stringify({
          ...user,
          _cacheTime: Date.now()
        }));
        
        this.currentUser = user;
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Get user's bookings for the last 30 days
      const q = query(
        bookingsRef,
        where('userId', '==', userId),
        where('createdAt', '>=', thirtyDaysAgo),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      interface Booking {
        id: string;
        status: string;
        totalPrice?: number;
        serviceId?: string;
        createdAt?: Date | Timestamp;
        // add other fields as needed
      }
      const bookings: Booking[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          status: data.status ?? '',
          totalPrice: data.totalPrice,
          serviceId: data.serviceId,
          createdAt: data.createdAt,
          // add other fields as needed
        } as Booking;
      });
      
      // Calculate statistics
      const monthlyVisits = bookings.filter(b => b.status === 'completed').length;
      const lastMonthSpent = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      
      // Get favorite service
      const serviceCount: Record<string, number> = {};
      bookings.forEach(b => {
        if (b.serviceId) {
          serviceCount[b.serviceId] = (serviceCount[b.serviceId] || 0) + 1;
        }
      });
      
      const favoriteService = Object.entries(serviceCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Aucun';
      
      const averageSpend = monthlyVisits > 0 ? lastMonthSpent / monthlyVisits : 0;
      
      // Calculate cancellation rate
      const totalBookings = bookings.length;
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
      const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;
      
      // Calculate loyalty tier based on total spent
      const user = await this.getUserById(userId);
      const totalSpent = user?.totalSpent || 0;
      let loyaltyTier: UserStats['loyaltyTier'] = 'Bronze';
      
      if (totalSpent >= 500000) loyaltyTier = 'Platinum';
      else if (totalSpent >= 200000) loyaltyTier = 'Gold';
      else if (totalSpent >= 100000) loyaltyTier = 'Silver';
      
      return {
        userId,
        monthlyVisits,
        lastMonthSpent,
        favoriteService,
        averageSpend,
        cancellationRate,
        punctualityScore: 95, // Placeholder - implement based on arrival times
        loyaltyTier
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Search users (admin feature)
  async searchUsers(searchTerm: string, filters?: {
    isActive?: boolean;
    tags?: string[];
    minSpent?: number;
    loyaltyTier?: string;
  }): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      let q = query(usersRef);
      
      // Apply filters
      if (filters?.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', filters.tags));
      }
      
      if (filters?.minSpent) {
        q = query(q, where('totalSpent', '>=', filters.minSpent));
      }
      
      const snapshot = await getDocs(q);
      let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      
      // Filter by search term (client-side)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        users = users.filter(user => 
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.phone.includes(term)
        );
      }
      
      // Apply loyalty tier filter (client-side)
      if (filters?.loyaltyTier) {
        const stats = await Promise.all(
          users.map(user => this.getUserStats(user.id))
        );
        
        users = users.filter((user, index) => 
          stats[index].loyaltyTier === filters.loyaltyTier
        );
      }
      
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Update user loyalty points
  async updateLoyaltyPoints(userId: string, points: number, reason: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentPoints = userDoc.data().loyaltyPoints || 0;
        const newPoints = Math.max(0, currentPoints + points);
        
        await updateDoc(userRef, {
          loyaltyPoints: newPoints,
          updatedAt: serverTimestamp()
        });
        
        // Log transaction
        await this.logLoyaltyTransaction(userId, points, reason, newPoints);
        
        // Clear cache
        await AsyncStorage.removeItem(`user_${userId}`);
        this.currentUser = null;
      }
    } catch (error) {
      console.error('Error updating loyalty points:', error);
      throw error;
    }
  }

  // Log loyalty transaction
  private async logLoyaltyTransaction(
    userId: string, 
    points: number, 
    reason: string, 
    balance: number
  ): Promise<void> {
    try {
      const transactionRef = collection(db, 'loyaltyTransactions');
      await setDoc(doc(transactionRef), {
        userId,
        points,
        reason,
        balance,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging loyalty transaction:', error);
    }
  }

  // Add tag to user (admin feature)
  async addUserTag(userId: string, tag: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentTags = userDoc.data().tags || [];
        if (!currentTags.includes(tag)) {
          await updateDoc(userRef, {
            tags: [...currentTags, tag],
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error adding user tag:', error);
      throw error;
    }
  }

  // Remove tag from user (admin feature)
  async removeUserTag(userId: string, tag: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentTags = userDoc.data().tags || [];
        const newTags = currentTags.filter((t: string) => t !== tag);
        
        await updateDoc(userRef, {
          tags: newTags,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error removing user tag:', error);
      throw error;
    }
  }

  // Update user preferences
  async updateUserPreferences(
    userId: string, 
    preferences: Partial<User['notificationPreferences']>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        notificationPreferences: preferences,
        updatedAt: serverTimestamp()
      });
      
      // Clear cache
      await AsyncStorage.removeItem(`user_${userId}`);
      this.currentUser = null;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Generate referral code
  private generateReferralCode(userId: string): string {
    const prefix = 'BZ';
    const suffix = userId.slice(-4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${random}${suffix}`;
  }

  // Apply referral
  async applyReferral(userId: string, referralCode: string): Promise<boolean> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referralCode', '==', referralCode));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const referrer = snapshot.docs[0];
        const referrerId = referrer.id;
        
        // Update referred user
        await updateDoc(doc(db, 'users', userId), {
          referredBy: referrerId,
          updatedAt: serverTimestamp()
        });
        
        // Give loyalty points to both users
        await this.updateLoyaltyPoints(userId, 50, 'Bonus de parrainage');
        await this.updateLoyaltyPoints(referrerId, 100, 'Parrainage réussi');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error applying referral:', error);
      return false;
    }
  }

  // Clear all caches
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => key.startsWith('user_'));
      await AsyncStorage.multiRemove(userKeys);
      this.currentUser = null;
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default new UserService();
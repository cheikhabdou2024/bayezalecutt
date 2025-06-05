// src/config/firebase.ts - Configuration sans Storage pour Sprint 1
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'; // Désactivé temporairement
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Firebase - Remplacez par vos vraies clés
const firebaseConfig = {
  apiKey: "AIzaSyBC_5XQxlvq5g2rq5-8LQYvwhkD9LKev5Y",
  authDomain: "baye-zale-cutt.firebaseapp.com",
  projectId: "baye-zale-cutt",
  storageBucket: "baye-zale-cutt.appspot.com", // Garde pour plus tard
  messagingSenderId: "45635702844",
  appId: "1:45635702844:android:b5e77f19e8a345c0fcb339"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Auth (persistance personnalisée désactivée pour compatibilité web)
const auth = getAuth(app);

// Initialiser Firestore
const db = getFirestore(app);

// Storage sera ajouté en Sprint 2 quand plan Blaze activé
// const storage = getStorage(app);

export { auth, db };
// export { auth, db, storage }; // Pour plus tard

// Types pour les données (inchangés)
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  memberSince: string;
  totalAppointments: number;
  totalSpent: number;
  avgRating: number;
  isAdmin?: boolean;
  profileImageUrl?: string; // Placeholder pour Sprint 2
}

export interface Barber {
  id: string;
  name: string;
  shopName: string;
  email: string;
  phone: string;
  rating: number;
  reviews: number;
  experience: number;
  happyClients: number;
  distance: string;
  imageUrl?: string; // Placeholder pour Sprint 2
  available: boolean;
  services: Service[];
  gallery: GalleryItem[];
  workingHours: {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
  };
}

export interface Service {
  id: string;
  name: string;
  category: 'homme' | 'femme' | 'enfant' | 'domicile';
  description: string;
  duration: number; // en minutes
  standardPrice: number; // Changé de normalPrice
  expressPrice: number;   // Changé de urgentPrice
  icon: string;
}

export interface GalleryItem {
  id: string;
  category: 'homme' | 'femme' | 'enfant';
  imageUrl?: string; // Optional pour Sprint 1
  title: string;
  description?: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  featured: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  type: 'standard' | 'express'; // Changé de normal/urgent
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  paymentMethod: 'orange_money' | 'wave' | 'cash';
  paymentStatus: 'pending' | 'paid';
  specialRequests?: string;
  gallerySelection?: string;
  createdAt: string;
  updatedAt: string;
  queuePosition?: number; // Nouvelle propriété
  estimatedWaitTime?: number; // En minutes
}

// Services par défaut de Baye Zale avec nouvelle terminologie
export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'homme_classic',
    name: 'Coupe Classique Homme',
    category: 'homme',
    description: 'Coupe professionnelle avec styling moderne',
    duration: 30,
    standardPrice: 8000,
    expressPrice: 10000,
    icon: '✂️'
  },
  {
    id: 'homme_barbe',
    name: 'Taille de Barbe Premium',
    category: 'homme',
    description: 'Taille et mise en forme professionnelle de la barbe',
    duration: 20,
    standardPrice: 5000,
    expressPrice: 7000,
    icon: '🧔'
  },
  {
    id: 'homme_complet',
    name: 'Service Complet Homme',
    category: 'homme',
    description: 'Coupe + barbe + finition parfaite',
    duration: 45,
    standardPrice: 8000,
    expressPrice: 10000,
    icon: '👨'
  },
  {
    id: 'enfant_coupe',
    name: 'Coupe Enfant Spécialisée',
    category: 'enfant',
    description: 'Coupe douce adaptée aux plus jeunes',
    duration: 25,
    standardPrice: 5000,
    expressPrice: 7000,
    icon: '👶'
  },
  {
    id: 'femme_coupe',
    name: 'Coupe Femme Moderne',
    category: 'femme',
    description: 'Coupe et styling élégant pour femmes',
    duration: 40,
    standardPrice: 8000,
    expressPrice: 10000,
    icon: '👩'
  },
  {
    id: 'domicile_service',
    name: 'Service Premium à Domicile',
    category: 'domicile',
    description: 'Service complet dans le confort de votre domicile',
    duration: 60,
    standardPrice: 30000,
    expressPrice: 30000, // Pas de majoration pour domicile
    icon: '🏠'
  }
];

// Fonctions utilitaires Firebase
export const createUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('User profile created successfully');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Fonction améliorée pour les créneaux avec gestion pause 4h-13h
export const getAvailableTimeSlots = (date: string, barberId: string = 'baye_zale') => {
  // Heures ouvertes : 8h-12h30 puis 13h-20h30
  const morningSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30'
  ];
  
  const afternoonSlots = [
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30'
  ];
  
  // Simuler créneaux occupés (viendra de Firestore en vrai)
  const occupiedSlots = ['09:30', '14:00', '16:00', '18:30'];
  
  const availableSlots = [...morningSlots, ...afternoonSlots].filter(
    slot => !occupiedSlots.includes(slot)
  );
  
  return {
    morning: morningSlots.filter(slot => !occupiedSlots.includes(slot)),
    afternoon: afternoonSlots.filter(slot => !occupiedSlots.includes(slot)),
    all: availableSlots,
    occupied: occupiedSlots
  };
};

// Calcul prix avec nouvelle terminologie
export const calculateTotalPrice = (serviceId: string, type: 'standard' | 'express'): number => {
  const service = DEFAULT_SERVICES.find(s => s.id === serviceId);
  if (!service) return 0;
  
  const basePrice = type === 'express' ? service.expressPrice : service.standardPrice;
  
  // Frais de service et taxes
  const serviceFee = 2000; // Frais de service
  const tax = Math.round(basePrice * 0.08); // TVA 8%
  
  return basePrice + serviceFee + tax;
};

// Fonction pour calculer position dans la file
export const calculateQueuePosition = async (bookingType: 'standard' | 'express'): Promise<number> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('type', '==', bookingType),
      where('status', '==', 'confirmed'),
      where('date', '==', new Date().toDateString()),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size + 1; // Position suivante
  } catch (error) {
    console.error('Error calculating queue position:', error);
    return 1; // Fallback
  }
};

// Fonction pour estimer temps d'attente
export const estimateWaitTime = (queuePosition: number, bookingType: 'standard' | 'express'): number => {
  const avgServiceTime = 35; // minutes moyennes par service
  const expressBonus = bookingType === 'express' ? 0.5 : 1; // Express 50% plus rapide
  
  return Math.round((queuePosition - 1) * avgServiceTime * expressBonus);
};

// États de réservation avec nouvelle terminologie
export const BOOKING_STATUS = {
  pending: 'En attente de confirmation',
  confirmed: 'Confirmé par Baye Zale',
  completed: 'Service terminé',
  cancelled: 'Annulé'
} as const;

export const BOOKING_TYPES = {
  standard: 'Réservation Standard',
  express: 'Service Express ⚡'
} as const;

export const PAYMENT_METHODS = {
  orange_money: 'Orange Money',
  wave: 'Wave',
  cash: 'Espèces (sur place)'
} as const;

// Données par défaut de Baye Zale
export const BAYE_ZALE_INFO = {
  id: 'baye_zale',
  name: 'Baye Zale',
  shopName: 'Baye Zale Cutt',
  email: 'contact@bayezalecutt.com',
  phone: '+221 XX XXX XX XX',
  rating: 4.9,
  reviews: 127,
  experience: 3,
  happyClients: 156,
  distance: '0 km',
  available: true,
  services: DEFAULT_SERVICES,
  gallery: [], // Sera rempli en Sprint 2
  workingHours: {
    start: '08:00',
    end: '20:30',
    breakStart: '04:00',
    breakEnd: '13:00'
  }
};

// Mock data pour galerie (Sprint 1)
export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'h1',
    category: 'homme',
    title: 'Fade Classique',
    description: 'Dégradé parfait avec finition nette',
    difficulty: 'Moyen',
    featured: true
  },
  {
    id: 'h2',
    category: 'homme',
    title: 'Undercut Moderne',
    description: 'Style contemporain avec contraste marqué',
    difficulty: 'Difficile',
    featured: true
  },
  {
    id: 'f1',
    category: 'femme',
    title: 'Bob Asymétrique',
    description: 'Coupe moderne avec volume',
    difficulty: 'Moyen',
    featured: true
  },
  {
    id: 'e1',
    category: 'enfant',
    title: 'Coupe Junior',
    description: 'Adaptée aux plus jeunes',
    difficulty: 'Facile',
    featured: false
  }
];

// Helper pour vérifier si l'horaire est ouvert
export const isOpenHour = (time: string): boolean => {
  const hour = parseInt(time.split(':')[0]);
  // Fermé de 4h à 13h
  return !(hour >= 4 && hour < 13);
};

// Fonctions Firebase améliorées pour Sprint 1
export const saveBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      queuePosition: await calculateQueuePosition(bookingData.type),
      estimatedWaitTime: 0 // Sera calculé côté admin
    });
    
    console.log('Booking saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const getTodayBookings = async (): Promise<Booking[]> => {
  try {
    const today = new Date().toDateString();
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('date', '==', today),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
  } catch (error) {
    console.error('Error fetching today bookings:', error);
    return []; // Fallback vers données mock
  }
};
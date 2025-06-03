// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Firebase - Remplacez par vos vraies clés
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "baye-zale-cutt.firebaseapp.com",
  projectId: "baye-zale-cutt",
  storageBucket: "baye-zale-cutt.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Auth avec persistance AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialiser Firestore
const db = getFirestore(app);

// Initialiser Storage
const storage = getStorage(app);

export { auth, db, storage };

// Types pour les données
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
  image: string;
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
  normalPrice: number;
  urgentPrice: number;
  icon: string;
}

export interface GalleryItem {
  id: string;
  category: 'homme' | 'femme' | 'enfant';
  imageUrl: string;
  title: string;
  description?: string;
}

export interface Booking {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  type: 'normal' | 'urgent';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  paymentMethod: 'orange_money' | 'wave' | 'cash';
  paymentStatus: 'pending' | 'paid';
  specialRequests?: string;
  gallerySelection?: string; // ID de la coiffure choisie
  createdAt: string;
  updatedAt: string;
}

// Services par défaut de Baye Zale
export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'homme_classic',
    name: 'Coupe Classique Homme',
    category: 'homme',
    description: 'Coupe professionnelle avec styling',
    duration: 30,
    normalPrice: 8000,
    urgentPrice: 10000,
    icon: 'content-cut'
  },
  {
    id: 'homme_barbe',
    name: 'Taille de Barbe',
    category: 'homme',
    description: 'Taille et mise en forme professionnelle de la barbe',
    duration: 20,
    normalPrice: 5000,
    urgentPrice: 7000,
    icon: 'face'
  },
  {
    id: 'homme_complet',
    name: 'Coupe + Barbe',
    category: 'homme',
    description: 'Service complet coupe et barbe',
    duration: 45,
    normalPrice: 12000,
    urgentPrice: 15000,
    icon: 'face'
  },
  {
    id: 'enfant_coupe',
    name: 'Coupe Enfant',
    category: 'enfant',
    description: 'Coupe adaptée aux enfants',
    duration: 25,
    normalPrice: 5000,
    urgentPrice: 7000,
    icon: 'child-care'
  },
  {
    id: 'femme_coupe',
    name: 'Coupe Femme',
    category: 'femme',
    description: 'Coupe et styling pour femmes',
    duration: 40,
    normalPrice: 8000,
    urgentPrice: 10000,
    icon: 'face'
  },
  {
    id: 'domicile_service',
    name: 'Service à Domicile',
    category: 'domicile',
    description: 'Service de coiffure à votre domicile',
    duration: 60,
    normalPrice: 30000,
    urgentPrice: 30000, // Pas de majoration urgent pour domicile
    icon: 'home'
  }
];

// Fonctions utilitaires pour Firebase
export const createUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    // Cette fonction sera implémentée pour créer un profil utilisateur
    console.log('Creating user profile:', userId, userData);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getAvailableTimeSlots = (date: string, barberId: string = 'baye_zale') => {
  // Heures de travail: 8h-13h puis 17h-21h (pause 13h-17h comme demandé)
  const morningSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30'
  ];
  
  const eveningSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30'
  ];
  
  return {
    morning: morningSlots,
    evening: eveningSlots
  };
};

export const calculateTotalPrice = (serviceId: string, type: 'normal' | 'urgent'): number => {
  const service = DEFAULT_SERVICES.find(s => s.id === serviceId);
  if (!service) return 0;
  
  const basePrice = type === 'urgent' ? service.urgentPrice : service.normalPrice;
  const serviceFee = 2000; // Frais de service
  const tax = Math.round(basePrice * 0.08); // TVA 8%
  
  return basePrice + serviceFee + tax;
};

// États de réservation avec textes en français
export const BOOKING_STATUS = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  cancelled: 'Annulé'
} as const;

export const PAYMENT_METHODS = {
  orange_money: 'Orange Money',
  wave: 'Wave',
  cash: 'Espèces (sur place)'
} as const;
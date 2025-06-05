// src/config/auth.ts - Système d'authentification FONCTIONNEL
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Configuration Google Auth
WebBrowser.maybeCompleteAuthSession();

const googleAuthConfig = {
  androidClientId: "45635702844-xxxxxxxxxx.apps.googleusercontent.com", // À remplacer
  iosClientId: "45635702844-xxxxxxxxxx.apps.googleusercontent.com", // À remplacer
  webClientId: "45635702844-xxxxxxxxxx.apps.googleusercontent.com", // À remplacer
};

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;
  profileImage?: string;
  phone?: string;
  createdAt: string;
}

// Hook Google Auth
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest(googleAuthConfig);
  
  return { request, response, promptAsync };
};

// Créer profil utilisateur
const createUserProfile = async (user: User, additionalData: any = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const { email, displayName, photoURL } = user;
    const userData = {
      uid: user.uid,
      email: email || '',
      name: displayName || additionalData.name || 'Utilisateur',
      isAdmin: email === 'bayezale@gmail.com', // Email admin de Baye Zale
      profileImage: photoURL || '',
      phone: additionalData.phone || '',
      createdAt: new Date().toISOString(),
      totalBookings: 0,
      totalSpent: 0
    };
    
    await setDoc(userRef, userData);
    return userData;
  }
  
  return userDoc.data();
};

// Inscription Email/Password
export const signUpWithEmail = async (email: string, password: string, name: string): Promise<AuthUser> => {
  try {
    // Vérifier format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format email invalide');
    }
    
    // Vérifier mot de passe
    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }
    
    // Créer utilisateur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData = await createUserProfile(userCredential.user, { name });
    
    console.log('✅ Inscription réussie:', userData.email);
    return userData as AuthUser;
    
  } catch (error: any) {
    console.error('❌ Erreur inscription:', error.message);
    
    // Messages d'erreur en français
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('Cette adresse email est déjà utilisée');
      case 'auth/weak-password':
        throw new Error('Le mot de passe est trop faible');
      case 'auth/invalid-email':
        throw new Error('Adresse email invalide');
      default:
        throw new Error('Erreur lors de l\'inscription: ' + error.message);
    }
  }
};

// Connexion Email/Password
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await createUserProfile(userCredential.user);
    
    console.log('✅ Connexion réussie:', userData.email);
    return userData as AuthUser;
    
  } catch (error: any) {
    console.error('❌ Erreur connexion:', error.message);
    
    // Messages d'erreur en français
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('Aucun compte trouvé avec cette adresse email');
      case 'auth/wrong-password':
        throw new Error('Mot de passe incorrect');
      case 'auth/invalid-email':
        throw new Error('Adresse email invalide');
      case 'auth/too-many-requests':
        throw new Error('Trop de tentatives. Réessayez plus tard');
      default:
        throw new Error('Erreur de connexion: ' + error.message);
    }
  }
};

// Connexion Google
export const signInWithGoogle = async (idToken: string): Promise<AuthUser> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const userData = await createUserProfile(userCredential.user);
    
    console.log('✅ Connexion Google réussie:', userData.email);
    return userData as AuthUser;
    
  } catch (error: any) {
    console.error('❌ Erreur Google Auth:', error.message);
    throw new Error('Erreur connexion Google: ' + error.message);
  }
};

// Déconnexion
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('✅ Déconnexion réussie');
  } catch (error: any) {
    console.error('❌ Erreur déconnexion:', error.message);
    throw new Error('Erreur lors de la déconnexion');
  }
};

// Écouter changements d'authentification
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userData = await createUserProfile(user);
        callback(userData as AuthUser);
      } catch (error) {
        console.error('Erreur récupération profil:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Vérifier si utilisateur est admin
export const checkAdminStatus = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.isAdmin || user.email === 'bayezale@gmail.com';
};

// Validation formulaires
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Au moins 6 caractères requis' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Majuscule et minuscule requises' };
  }
  return { isValid: true, message: 'Mot de passe valide' };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};
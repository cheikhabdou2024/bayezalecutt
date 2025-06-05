// src/screens/AuthScreen.tsx - Avec Google Auth Fonctionnel
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Import Firebase Auth
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

// Import Google Sign-In
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const { width, height } = Dimensions.get('window');

interface AuthScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function AuthScreen({ onComplete, onSkip }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Configuration Google Sign-In
    configureGoogleSignIn();

    // Animation d'entrée spectaculaire avec rotation du logo
    Animated.sequence([
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
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Animation de rotation du logo après l'entrée
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Configuration Google Sign-In
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      // Remplacez par votre Web Client ID depuis Firebase Console
      webClientId: 'VOTRE_WEB_CLIENT_ID_FIREBASE.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });
  };

  // Animation de rotation continue pour le logo
  const startLogoAnimation = () => {
    logoRotation.setValue(0);
    Animated.loop(
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start();
  };

  // Validation des données
  const validateForm = () => {
    if (!email || !password) {
      Alert.alert('🔥 Champs manquants', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('📧 Email invalide', 'Veuillez entrer une adresse email valide');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('🔒 Mot de passe trop court', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert('👤 Nom manquant', 'Veuillez entrer votre nom complet');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('🔒 Mots de passe différents', 'Les mots de passe ne correspondent pas');
        return false;
      }
    }

    return true;
  };

  // Authentification Email/Password
  const handleEmailAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Connexion
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Connexion réussie:', userCredential.user.uid);
        
        Alert.alert(
          '🎉 Connexion réussie !',
          `Bienvenue ${userCredential.user.displayName || userCredential.user.email} !`,
          [{ text: 'Continuer', onPress: onComplete }]
        );
      } else {
        // Inscription
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Mettre à jour le profil avec le nom
        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });

        console.log('Inscription réussie:', userCredential.user.uid);
        
        Alert.alert(
          '🎉 Compte créé !',
          `Bienvenue dans la famille Baye Zale, ${name} !`,
          [{ text: 'Continuer', onPress: onComplete }]
        );
      }
    } catch (error: any) {
      console.error('Erreur Auth:', error);
      
      let errorMessage = 'Une erreur est survenue';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Un compte existe déjà avec cet email';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard.';
          break;
        default:
          errorMessage = error.message || 'Erreur de connexion';
      }
      
      Alert.alert('❌ Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Authentification Google FONCTIONNELLE
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Début de l\'authentification Google...');
      
      // Vérifier si Google Play Services sont disponibles
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      
      console.log('✅ Google Play Services disponibles');
      
      // Déconnexion préalable pour éviter les conflits
      await GoogleSignin.signOut();
      
      // Lancer la connexion Google
      const userInfo = await GoogleSignin.signIn();
      console.log('📧 Utilisateur Google connecté:', userInfo.user.email);
      
      // Créer les credentials Firebase
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      
      // Authentifier avec Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      console.log('🎉 Authentification Firebase réussie:', userCredential.user.uid);
      
      Alert.alert(
        '🎉 Connexion Google réussie !',
        `Bienvenue ${userCredential.user.displayName || userCredential.user.email} !`,
        [{ text: 'Continuer', onPress: onComplete }]
      );
      
    } catch (error: any) {
      console.error('❌ Erreur Google Auth:', error);
      
      let errorMessage = 'Impossible de se connecter avec Google';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('ℹ️ Connexion Google annulée par l\'utilisateur');
        return; // Ne pas afficher d'erreur si l'utilisateur annule
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Connexion en cours, veuillez patienter...';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services non disponible';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Un compte existe déjà avec cette adresse email';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credentials Google invalides';
      } else {
        console.log('🔍 Code d\'erreur Google:', error.code);
        console.log('🔍 Message d\'erreur:', error.message);
      }
      
      Alert.alert('❌ Erreur Google', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Mot de passe oublié
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('📧 Email requis', 'Veuillez entrer votre email pour réinitialiser votre mot de passe');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        '📧 Email envoyé',
        'Un lien de réinitialisation a été envoyé à votre adresse email'
      );
    } catch (error: any) {
      Alert.alert('❌ Erreur', 'Impossible d\'envoyer l\'email de réinitialisation');
    }
  };

  const toggleAuthMode = () => {
    // Animation de transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLogin(!isLogin);
    // Reset fields
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const spin = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Éléments flottants décoratifs */}
        <View style={styles.floatingElements}>
          {[...Array(12)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.floatingElement,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.1],
                  }),
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                }
              ]}
            />
          ))}
        </View>

        {/* Bouton Skip élégant */}
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <BlurView intensity={20} style={styles.skipButtonBlur}>
            <Text style={styles.skipText}>Passer</Text>
          </BlurView>
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ],
                }
              ]}
            >
              {/* Glassmorphism Card */}
              <BlurView intensity={40} style={styles.glassCard}>
                {/* Header avec votre logo */}
                <View style={styles.header}>
                  <Animated.View 
                    style={[
                      styles.logoContainer,
                      {
                        transform: [{ rotate: spin }],
                      }
                    ]}
                    onTouchStart={startLogoAnimation}
                  >
                    {/* Votre logo - remplacez cette Image par votre fichier logo */}
                    <View style={styles.logoBackground}>
                      <Image
                        source={require('../../assets/logo.png')} // Remplacez par le chemin vers votre logo
                        style={styles.logoImage}
                        resizeMode="contain"
                        onError={() => {
                          // Fallback en cas d'erreur de chargement
                          console.log('Logo non trouvé, utilisation du placeholder');
                        }}
                      />
                      {/* Fallback si l'image ne charge pas */}
                      <View style={styles.logoFallback}>
                        <Text style={styles.logoText}>BZ</Text>
                        <Text style={styles.logoSubtext}>CUTT</Text>
                      </View>
                    </View>
                  </Animated.View>
                  
                  <Text style={styles.title}>
                    {isLogin ? 'Bon Retour !' : 'Rejoignez-nous'}
                  </Text>
                  <Text style={styles.subtitle}>
                    {isLogin 
                      ? 'Reconnectez-vous pour accéder à votre style' 
                      : 'Créez votre compte et découvrez l\'excellence'
                    }
                  </Text>
                </View>

                {/* Form avec animations */}
                <Animated.View 
                  style={[
                    styles.form,
                    { opacity: fadeAnim }
                  ]}
                >
                  {/* Name Input (signup only) */}
                  {!isLogin && (
                    <Animated.View 
                      style={[
                        styles.inputContainer,
                        {
                          transform: [{
                            translateX: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-50, 0],
                            }),
                          }],
                        }
                      ]}
                    >
                      <Text style={styles.label}>Nom complet</Text>
                      <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                          <Text style={styles.inputIconText}>👤</Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="Entrez votre nom complet"
                          placeholderTextColor="rgba(255,255,255,0.6)"
                          value={name}
                          onChangeText={setName}
                          autoCapitalize="words"
                        />
                      </View>
                    </Animated.View>
                  )}

                  {/* Email Input */}
                  <Animated.View 
                    style={[
                      styles.inputContainer,
                      {
                        transform: [{
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0],
                          }),
                        }],
                      }
                    ]}
                  >
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <Text style={styles.inputIconText}>📧</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="votre@email.com"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                      />
                    </View>
                  </Animated.View>

                  {/* Password Input */}
                  <Animated.View 
                    style={[
                      styles.inputContainer,
                      {
                        transform: [{
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0],
                          }),
                        }],
                      }
                    ]}
                  >
                    <Text style={styles.label}>Mot de passe</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <Text style={styles.inputIconText}>🔒</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoComplete="password"
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={styles.eyeIcon}>
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>

                  {/* Confirm Password (signup only) */}
                  {!isLogin && (
                    <Animated.View 
                      style={[
                        styles.inputContainer,
                        {
                          transform: [{
                            translateX: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-50, 0],
                            }),
                          }],
                        }
                      ]}
                    >
                      <Text style={styles.label}>Confirmer le mot de passe</Text>
                      <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                          <Text style={styles.inputIconText}>🔐</Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="••••••••"
                          placeholderTextColor="rgba(255,255,255,0.6)"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!showPassword}
                        />
                      </View>
                    </Animated.View>
                  )}

                  {/* Forgot Password (login only) */}
                  {isLogin && (
                    <TouchableOpacity 
                      style={styles.forgotPassword}
                      onPress={handleForgotPassword}
                    >
                      <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                  )}

                  {/* Auth Button avec gradient animé */}
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={handleEmailAuth}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={isLoading 
                        ? ['#9CA3AF', '#6B7280'] 
                        : ['#4facfe', '#00f2fe']
                      }
                      style={styles.authButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View 
                            style={[
                              styles.loadingSpinner,
                              {
                                transform: [{
                                  rotate: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                  }),
                                }],
                              }
                            ]}
                          >
                            <Text style={styles.loadingIcon}>⚡</Text>
                          </Animated.View>
                          <Text style={styles.authButtonText}>
                            {isLogin ? 'Connexion...' : 'Création...'}
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.authButtonText}>
                            {isLogin ? 'Se connecter' : 'Créer mon compte'}
                          </Text>
                          <View style={styles.authButtonIcon}>
                            <Text style={styles.authButtonIconText}>🚀</Text>
                          </View>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Divider élégant */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <BlurView intensity={20} style={styles.dividerTextContainer}>
                      <Text style={styles.dividerText}>Ou continuer avec</Text>
                    </BlurView>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Google Login Button FONCTIONNEL */}
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={isLoading 
                        ? ['#9CA3AF', '#6B7280']
                        : ['#4285F4', '#34A853']
                      }
                      style={styles.googleButtonGradient}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View 
                            style={[
                              styles.loadingSpinner,
                              {
                                transform: [{
                                  rotate: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                  }),
                                }],
                              }
                            ]}
                          >
                            <Text style={styles.loadingIcon}>🔄</Text>
                          </Animated.View>
                          <Text style={styles.googleButtonText}>Connexion Google...</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.googleIcon}>G</Text>
                          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </BlurView>
            </Animated.View>

            {/* Switch Auth Mode */}
            <Animated.View 
              style={[
                styles.footer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <BlurView intensity={30} style={styles.footerBlur}>
                <TouchableOpacity onPress={toggleAuthMode}>
                  <Text style={styles.switchText}>
                    {isLogin 
                      ? "Vous n'avez pas de compte ? " 
                      : "Vous avez déjà un compte ? "
                    }
                    <Text style={styles.switchLink}>
                      {isLogin ? "S'inscrire" : "Se connecter"}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1000,
    borderRadius: 25,
    overflow: 'hidden',
  },
  skipButtonBlur: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  formContainer: {
    marginVertical: 20,
  },
  glassCard: {
    borderRadius: 32,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoFallback: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F7FEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  logoSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -4,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  inputIcon: {
    width: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIconText: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  eyeButton: {
    width: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.8,
  },
  authButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
  },
  authButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
  },
  authButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonIconText: {
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginRight: 12,
  },
  loadingIcon: {
    fontSize: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerTextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  dividerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  googleButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  googleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  googleIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerBlur: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
  },
  switchText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  switchLink: {
    color: '#FFFFFF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
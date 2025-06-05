// src/screens/AuthScreen.tsx - Design Ultra-Moderne
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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

  useEffect(() => {
    // Animation d'entrée spectaculaire
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
    ]).start();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('🔥 Attention', 'Veuillez remplir tous les champs pour continuer');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('🔥 Attention', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    
    // Animation du bouton pendant le loading
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulation authentification
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '🎉 Succès !', 
        isLogin ? 'Connexion réussie ! Bienvenue chez Baye Zale Cutt' : 'Compte créé avec succès ! Bienvenue dans la famille',
        [{ 
          text: 'Continuer', 
          onPress: onComplete,
          style: 'default'
        }]
      );
    }, 1500);
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

  const renderFloatingElements = () => (
    <View style={styles.floatingElements}>
      {[...Array(15)].map((_, i) => (
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
  );

  const renderSocialButton = (icon: string, label: string, colors: string[]) => (
    <TouchableOpacity style={styles.socialButton}>
      <LinearGradient
        colors={colors}
        style={styles.socialButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.socialIcon}>{icon}</Text>
        <Text style={styles.socialLabel}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Éléments flottants décoratifs */}
        {renderFloatingElements()}

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
                {/* Header avec logo animé */}
                <View style={styles.header}>
                  <Animated.View 
                    style={[
                      styles.logoContainer,
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
                    <LinearGradient
                      colors={['#FFD700', '#FFA500']}
                      style={styles.logoGradient}
                    >
                      <Text style={styles.logoIcon}>✂️</Text>
                    </LinearGradient>
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
                      onPress={() => Alert.alert('🔄 Récupération', 'Fonctionnalité bientôt disponible')}
                    >
                      <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                  )}

                  {/* Auth Button avec gradient animé */}
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={handleAuth}
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

                  {/* Social Login Buttons */}
                  <View style={styles.socialButtonsContainer}>
                    {renderSocialButton('G', 'Google', ['#4285F4', '#34A853'])}
                    {renderSocialButton('🍎', 'Apple', ['#000000', '#1c1c1e'])}
                    {renderSocialButton('📱', 'Téléphone', ['#25D366', '#128C7E'])}
                  </View>
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
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  logoIcon: {
    fontSize: 32,
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
  socialButtonsContainer: {
    gap: 12,
  },
  socialButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  socialButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  socialLabel: {
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
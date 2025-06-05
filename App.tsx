// App.tsx - Version Corrigée avec Admin
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

// Import des écrans
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import MainNavigation from './src/navigation/MainNavigation';

interface User {
  name: string;
  isAdmin: boolean;
  email?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'auth' | 'main'>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Simuler vérification premier lancement
    const checkFirstLaunch = async () => {
      // En production: vérifier AsyncStorage
      const hasLaunched = false; // await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        setCurrentScreen('auth');
      }
    };

    checkFirstLaunch();
  }, []);

  const handleOnboardingComplete = () => {
    setCurrentScreen('auth');
  };

  const handleAuthComplete = () => {
    // Par défaut, créer un utilisateur client
    setUser({ name: 'Utilisateur', isAdmin: false });
    setCurrentScreen('main');
  };

  const handleSkipAuth = () => {
    // Utilisateur anonyme
    setUser({ name: 'Invité', isAdmin: false });
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminMode(false);
    setCurrentScreen('auth');
  };

  // Mode développement : raccourci admin
  const showAdminLoginOption = () => {
    Alert.alert(
      '🔑 Mode de Connexion',
      'Choisissez votre mode d\'accès (Développement)',
      [
        {
          text: '👤 Client Normal',
          onPress: () => {
            setUser({ name: 'Client Test', isAdmin: false });
            setIsAdminMode(false);
            setCurrentScreen('main');
          }
        },
        {
          text: '👨‍💼 Admin (Baye Zale)',
          onPress: () => {
            setUser({ name: 'Baye Zale', isAdmin: true });
            setIsAdminMode(true);
            setCurrentScreen('main');
          }
        },
        {
          text: 'Annuler',
          style: 'cancel'
        }
      ]
    );
  };

  const toggleAdminMode = () => {
    if (user?.isAdmin) {
      Alert.alert(
        '🔄 Changer de Mode',
        'Voulez-vous basculer entre les modes ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: isAdminMode ? '👤 Mode Client' : '👨‍💼 Mode Admin',
            onPress: () => setIsAdminMode(!isAdminMode)
          }
        ]
      );
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        );
      
      case 'auth':
        return (
          <View style={styles.authContainer}>
            <AuthScreen 
              onComplete={handleAuthComplete}
              onSkip={handleSkipAuth}
            />
            
            {/* Bouton développement - À retirer en production */}
            <TouchableOpacity
              style={styles.devButton}
              onPress={showAdminLoginOption}
            >
              <Text style={styles.devButtonText}>🔧 Mode Dev</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'main':
        return (
          <MainNavigation
            isAdminMode={isAdminMode}
            onLogout={handleLogout}
            userInfo={user ?? undefined}
          />
        );
      
      default:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      {renderCurrentScreen()}
      
      {/* Bouton flottant pour basculer mode admin (dev) */}
      {currentScreen === 'main' && user?.isAdmin && (
        <TouchableOpacity
          style={styles.floatingToggle}
          onPress={toggleAdminMode}
        >
          <Text style={styles.floatingToggleText}>
            {isAdminMode ? '👤' : '👨‍💼'}
          </Text>
        </TouchableOpacity>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    position: 'relative',
  },
  devButton: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  devButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  floatingToggle: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F7FEE',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  floatingToggleText: {
    fontSize: 24,
  },
});
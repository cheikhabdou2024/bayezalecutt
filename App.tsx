// App.tsx - Fichier Principal
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Import des écrans
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import MainNavigation from './src/navigation/MainNavigation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'auth' | 'main'>('onboarding');

  const handleOnboardingComplete = () => {
    setCurrentScreen('auth');
  };

  const handleAuthComplete = () => {
    setCurrentScreen('main');
  };

  const handleSkipAuth = () => {
    setCurrentScreen('main');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        );
      case 'auth':
        return (
          <AuthScreen 
            onComplete={handleAuthComplete}
            onSkip={handleSkipAuth}
          />
        );
      case 'main':
        return <MainNavigation />;
      default:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />
      {renderCurrentScreen()}
    </NavigationContainer>
  );
}
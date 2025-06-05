// src/navigation/MainNavigation.tsx - Navigation Ultra-Moderne avec Bottom Tab Premium
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Import des écrans
import HomeScreen from '../screens/main/HomeScreen';
import BookingScreen from '../screens/main/BookingScreen';
import GalleryScreen from '../screens/main/GalleryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AdminScreen from '../screens/admin/AdminDashboardEnhanced';
import FirebaseTestScreen from '../screens/tests/FirebaseTestScreen';

const { width } = Dimensions.get('window');

interface MainNavigationProps {
  isAdminMode?: boolean;
  onLogout?: () => void;
  userInfo?: {
    name: string;
    isAdmin: boolean;
  };
}

export default function MainNavigation({ 
  isAdminMode = false, 
  onLogout, 
  userInfo 
}: MainNavigationProps) {
  const [activeTab, setActiveTab] = useState(isAdminMode ? 'admin' : 'home');
  const animatedValues = useRef<{[key: string]: Animated.Value}>({});
  const scaleAnimations = useRef<{[key: string]: Animated.Value}>({});

  // Configuration des onglets clients avec icônes modernes
  const clientTabs = [
    { 
      key: 'home', 
      label: 'Accueil', 
      icon: '🏠', 
      modernIcon: '⌂',
      gradient: ['#667eea', '#764ba2'],
      description: 'Tableau de bord'
    },
    { 
      key: 'booking', 
      label: 'Réserver', 
      icon: '📅', 
      modernIcon: '◉',
      gradient: ['#f093fb', '#f5576c'],
      description: 'Prendre RDV'
    },
    { 
      key: 'gallery', 
      label: 'Galerie', 
      icon: '📸', 
      modernIcon: '◈',
      gradient: ['#4facfe', '#00f2fe'],
      description: 'Portfolio'
    },
    { 
      key: 'profile', 
      label: 'Profil', 
      icon: '👤', 
      modernIcon: '◐',
      gradient: ['#43e97b', '#38f9d7'],
      description: 'Mon compte'
    },
  ];

  // Configuration des onglets admin avec icônes modernes
  const adminTabs = [
    { 
      key: 'admin', 
      label: 'Dashboard', 
      icon: '📊', 
      modernIcon: '◎',
      gradient: ['#FF6B6B', '#4ECDC4'],
      description: 'Vue d\'ensemble'
    },
    { 
      key: 'bookings', 
      label: 'RDV', 
      icon: '📋', 
      modernIcon: '◈',
      gradient: ['#A8E6CF', '#88D8A3'],
      description: 'Réservations'
    },
    { 
      key: 'payments', 
      label: 'Paiements', 
      icon: '💰', 
      modernIcon: '◇',
      gradient: ['#FFD93D', '#FF6B6B'],
      description: 'Finances'
    },
    { 
      key: 'settings', 
      label: 'Paramètres', 
      icon: '⚙️', 
      modernIcon: '◑',
      gradient: ['#667eea', '#764ba2'],
      description: 'Configuration'
    },
  ];

  const tabs = isAdminMode ? adminTabs : clientTabs;

  // Initialiser les animations
  useEffect(() => {
    tabs.forEach(tab => {
      if (!animatedValues.current[tab.key]) {
        animatedValues.current[tab.key] = new Animated.Value(tab.key === activeTab ? 1 : 0);
      }
      if (!scaleAnimations.current[tab.key]) {
        scaleAnimations.current[tab.key] = new Animated.Value(tab.key === activeTab ? 1.2 : 1);
      }
    });
  }, [tabs, activeTab]);

  // Animation lors du changement d'onglet
  const animateTabChange = (newTab: string) => {
    // Animer l'ancien onglet vers l'état inactif
    if (animatedValues.current[activeTab]) {
      Animated.parallel([
        Animated.timing(animatedValues.current[activeTab], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnimations.current[activeTab], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Animer le nouvel onglet vers l'état actif
    if (animatedValues.current[newTab]) {
      Animated.parallel([
        Animated.timing(animatedValues.current[newTab], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnimations.current[newTab], {
          toValue: 1.2,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }

    setActiveTab(newTab);
  };

  const renderContent = () => {
    if (isAdminMode) {
      switch (activeTab) {
        case 'admin':
          return <AdminScreen />;
        case 'bookings':
          return <AdminScreen />; // Temporaire
        case 'payments':
          return <AdminScreen />; // Temporaire
        case 'settings':
          return <ProfileScreen />;
        default:
          return <AdminScreen />;
      }
    } else {
      switch (activeTab) {
        case 'home':
          return <HomeScreen />;
        case 'booking':
          return <BookingScreen />;
        case 'gallery':
          return <GalleryScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <HomeScreen />;
      }
    }
  };

  const showModeSwitch = () => {
    if (!userInfo?.isAdmin) return;
    
    Alert.alert(
      '🔄 Changer de Mode',
      'Voulez-vous changer de mode ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: isAdminMode ? '👤 Mode Client' : '👨‍💼 Mode Admin',
          onPress: () => {
            if (onLogout) onLogout();
          }
        }
      ]
    );
  };

  // Trouver l'onglet actuel pour récupérer ses informations
  const currentTab = tabs.find(tab => tab.key === activeTab);

  return (
    <View style={styles.container}>
      {/* Header Mode Premium */}
      {userInfo && (
        <View style={[styles.modeHeader, isAdminMode ? styles.adminHeader : styles.clientHeader]}>
          <LinearGradient
            colors={isAdminMode ? ['#FF6B6B', '#4ECDC4'] : ['#667eea', '#764ba2']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <BlurView intensity={20} style={styles.headerBlur}>
              <View style={styles.headerContent}>
                <View style={styles.headerInfo}>
                  <Text style={styles.modeText}>
                    {isAdminMode ? '👨‍💼 Mode Admin' : '👤 Mode Client'}
                  </Text>
                  <Text style={styles.userText}>{userInfo.name}</Text>
                  {currentTab && (
                    <Text style={styles.currentTabText}>{currentTab.description}</Text>
                  )}
                </View>
                
                <View style={styles.headerActions}>
                  {userInfo.isAdmin && (
                    <TouchableOpacity style={styles.switchButton} onPress={showModeSwitch}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                        style={styles.actionButtonGradient}
                      >
                        <Text style={styles.switchButtonText}>🔄</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  
                  {onLogout && (
                    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                        style={styles.actionButtonGradient}
                      >
                        <Text style={styles.logoutButtonText}>🚪</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </BlurView>
          </LinearGradient>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Tab Bar Premium avec Glassmorphism */}
      <View style={styles.tabBarContainer}>
        <BlurView intensity={50} style={styles.tabBarBlur}>
          <LinearGradient
            colors={isAdminMode 
              ? ['rgba(255, 107, 107, 0.1)', 'rgba(78, 205, 196, 0.1)'] 
              : ['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
            style={styles.tabBarGradient}
          >
            <View style={styles.tabBar}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const animatedValue = animatedValues.current[tab.key] || new Animated.Value(0);
                const scaleValue = scaleAnimations.current[tab.key] || new Animated.Value(1);

                return (
                  <TouchableOpacity 
                    key={tab.key}
                    style={styles.tabItem}
                    onPress={() => animateTabChange(tab.key)}
                    activeOpacity={0.7}
                  >
                    {/* Background animé pour l'onglet actif */}
                    <Animated.View
                      style={[
                        styles.tabActiveBackground,
                        {
                          opacity: animatedValue,
                          transform: [{ scale: scaleValue }],
                        }
                      ]}
                    >
                      <LinearGradient
                        colors={tab.gradient}
                        style={styles.tabActiveGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    </Animated.View>

                    {/* Icône avec animation */}
                    <Animated.View
                      style={[
                        styles.tabIconContainer,
                        {
                          transform: [{ scale: scaleValue }],
                        }
                      ]}
                    >
                      <Text style={[
                        styles.tabIcon,
                        isActive && styles.activeTabIcon
                      ]}>
                        {isActive ? tab.modernIcon : tab.icon}
                      </Text>
                    </Animated.View>

                    {/* Label avec animation */}
                    <Animated.Text 
                      style={[
                        styles.tabLabel,
                        isActive && styles.activeTabLabel,
                        {
                          opacity: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.7, 1],
                          }),
                          transform: [{
                            translateY: animatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [2, 0],
                            }),
                          }],
                        }
                      ]}
                    >
                      {tab.label}
                    </Animated.Text>

                    {/* Indicateur de notification (exemple) */}
                    {tab.key === 'booking' && !isAdminMode && (
                      <View style={styles.notificationDot}>
                        <Text style={styles.notificationDotText}>•</Text>
                      </View>
                    )}
                    {tab.key === 'admin' && isAdminMode && (
                      <View style={styles.notificationDot}>
                        <Text style={styles.notificationDotText}>•</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header Mode Premium
  modeHeader: {
    overflow: 'hidden',
  },
  clientHeader: {
    // Styles spécifiques au mode client
  },
  adminHeader: {
    // Styles spécifiques au mode admin
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerBlur: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  modeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  currentTabText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  switchButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  logoutButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  
  content: {
    flex: 1,
  },
  
  // Tab Bar Premium avec Glassmorphism
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabBarBlur: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  tabBarGradient: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabActiveBackground: {
    position: 'absolute',
    top: 4,
    left: 8,
    right: 8,
    bottom: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tabActiveGradient: {
    flex: 1,
    borderRadius: 20,
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    zIndex: 2,
  },
  tabIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabIcon: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    zIndex: 2,
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  notificationDotText: {
    color: '#FFFFFF',
    fontSize: 6,
    fontWeight: '700',
  },
});
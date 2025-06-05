// src/navigation/MainNavigation.tsx - Version avec Admin
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Import des écrans
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/main/HomeScreen';
import BookingScreen from '../screens/main/BookingScreen';
import GalleryScreen from '../screens/main/GalleryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import FirebaseTestScreen from '../screens/tests/FirebaseTestScreen';

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

  const renderContent = () => {
    if (isAdminMode) {
      switch (activeTab) {
        case 'admin':
          return <AdminScreen />;
        case 'bookings':
          return <AdminScreen />; // Temporaire
        case 'payments':
          return <AdminScreen />; // Temporaire
        case 'test':
          return <FirebaseTestScreen />;
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
        case 'test':
          return <FirebaseTestScreen />;
        default:
          return <HomeScreen />;
      }
    }
  };

  const clientTabs = [
    { key: 'home', label: 'Accueil', icon: '🏠' },
    { key: 'booking', label: 'Réserver', icon: '📅' },
    { key: 'gallery', label: 'Galerie', icon: '📸' },
    { key: 'profile', label: 'Profil', icon: '👤' },
    { key: 'test', label: 'Test', icon: '🧪' }, // Ajout temporaire pour tests
  ];

  const adminTabs = [
    { key: 'admin', label: 'Dashboard', icon: '📊' },
    { key: 'bookings', label: 'RDV', icon: '📋' },
    { key: 'payments', label: 'Paiements', icon: '💰' },
    { key: 'test', label: 'Test', icon: '🧪' }, // Ajout temporaire pour tests
    { key: 'settings', label: 'Paramètres', icon: '⚙️' },
  ];

  const tabs = isAdminMode ? adminTabs : clientTabs;

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
            // Cette fonction sera appelée depuis App.tsx
            if (onLogout) onLogout();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Mode */}
      {userInfo && (
        <View style={[styles.modeHeader, isAdminMode ? styles.adminHeader : styles.clientHeader]}>
          <View style={styles.headerInfo}>
            <Text style={[styles.modeText, isAdminMode ? styles.adminModeText : styles.clientModeText]}>
              {isAdminMode ? '👨‍💼 Mode Admin' : '👤 Mode Client'}
            </Text>
            <Text style={[styles.userText, isAdminMode ? styles.adminUserText : styles.clientUserText]}>
              {userInfo.name}
            </Text>
          </View>
          
          {userInfo.isAdmin && (
            <TouchableOpacity style={styles.switchButton} onPress={showModeSwitch}>
              <Text style={styles.switchButtonText}>🔄</Text>
            </TouchableOpacity>
          )}
          
          {onLogout && (
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutButtonText}>🚪</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, isAdminMode ? styles.adminTabBar : styles.clientTabBar]}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[
              styles.tabIcon, 
              activeTab === tab.key && (isAdminMode ? styles.activeAdminTabIcon : styles.activeClientTabIcon)
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.tabLabel, 
              activeTab === tab.key && (isAdminMode ? styles.activeAdminTabLabel : styles.activeClientTabLabel)
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Mode Header
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  clientHeader: {
    backgroundColor: '#4F7FEE',
  },
  adminHeader: {
    backgroundColor: '#F59E0B',
  },
  headerInfo: {
    flex: 1,
  },
  modeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  clientModeText: {
    color: '#FFFFFF',
  },
  adminModeText: {
    color: '#1F2937',
  },
  userText: {
    fontSize: 12,
    opacity: 0.8,
  },
  clientUserText: {
    color: '#FFFFFF',
  },
  adminUserText: {
    color: '#1F2937',
  },
  switchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  switchButtonText: {
    fontSize: 16,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
  },
  
  content: {
    flex: 1,
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  clientTabBar: {
    backgroundColor: '#FFFFFF',
  },
  adminTabBar: {
    backgroundColor: '#1F2937',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    // Style pour l'onglet actif
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeClientTabIcon: {
    opacity: 1,
  },
  activeAdminTabIcon: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeClientTabLabel: {
    color: '#4F7FEE',
  },
  activeAdminTabLabel: {
    color: '#F59E0B',
  },
});


const altStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#4F7FEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
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
  },
  devButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Mode Headers
  modeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 12,
    zIndex: 1000,
  },
  clientModeHeader: {
    backgroundColor: 'rgba(79, 127, 238, 0.9)',
  },
  adminModeHeader: {
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
  },
  modeInfo: {
    flex: 1,
  },
  modeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  clientModeText: {
    color: '#FFFFFF',
  },
  adminModeText: {
    color: '#1F2937',
  },
  userName: {
    fontSize: 12,
    opacity: 0.8,
  },
  clientUserName: {
    color: '#FFFFFF',
  },
  adminUserName: {
    color: '#1F2937',
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientLogoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  adminLogoutButton: {
    backgroundColor: 'rgba(31, 41, 55, 0.2)',
  },
  logoutButtonText: {
    fontSize: 16,
  },
  
  // Tab Icons
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabIconActive: {
    backgroundColor: '#EEF2FF',
    transform: [{ scale: 1.1 }],
  },
  adminTabIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  adminTabIconActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    transform: [{ scale: 1.1 }],
  },
  tabIconText: {
    fontSize: 20,
  },
});
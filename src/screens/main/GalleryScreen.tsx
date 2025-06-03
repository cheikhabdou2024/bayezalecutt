// src/screens/main/GalleryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

type Category = 'homme' | 'femme' | 'enfant';

type GalleryItem = {
  id: string;
  category: Category;
  title: string;
  description: string;
  image: string;
  price: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  duration: number;
};

export default function GalleryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('homme');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  // Portfolio de coiffures (pour l'instant avec placeholders)
  const galleryItems: GalleryItem[] = [
    // Coiffures Homme
    {
      id: 'h1',
      category: 'homme',
      title: 'Coupe Fade Classique',
      description: 'Dégradé parfait avec finition nette',
      image: 'placeholder-homme-1',
      price: 8000,
      difficulty: 'Moyen',
      duration: 30,
    },
    {
      id: 'h2',
      category: 'homme',
      title: 'Undercut Moderne',
      description: 'Style contemporain avec contraste marqué',
      image: 'placeholder-homme-2',
      price: 10000,
      difficulty: 'Difficile',
      duration: 45,
    },
    {
      id: 'h3',
      category: 'homme',
      title: 'Coupe Afro Sculptée',
      description: 'Mise en forme spécialisée cheveux afro',
      image: 'placeholder-homme-3',
      price: 12000,
      difficulty: 'Difficile',
      duration: 60,
    },
    {
      id: 'h4',
      category: 'homme',
      title: 'Buzz Cut Stylé',
      description: 'Coupe courte avec finitions précises',
      image: 'placeholder-homme-4',
      price: 6000,
      difficulty: 'Facile',
      duration: 20,
    },

    // Coiffures Femme
    {
      id: 'f1',
      category: 'femme',
      title: 'Coupe Bob Moderne',
      description: 'Bob asymétrique avec volume',
      image: 'placeholder-femme-1',
      price: 15000,
      difficulty: 'Moyen',
      duration: 50,
    },
    {
      id: 'f2',
      category: 'femme',
      title: 'Dégradé Long',
      description: 'Coupe en couches avec mouvement',
      image: 'placeholder-femme-2',
      price: 12000,
      difficulty: 'Moyen',
      duration: 45,
    },
    {
      id: 'f3',
      category: 'femme',
      title: 'Pixie Cut Élégant',
      description: 'Coupe courte féminine et moderne',
      image: 'placeholder-femme-3',
      price: 18000,
      difficulty: 'Difficile',
      duration: 60,
    },
    {
      id: 'f4',
      category: 'femme',
      title: 'Tresses Protectrices',
      description: 'Coiffure traditionnelle protectrice',
      image: 'placeholder-femme-4',
      price: 25000,
      difficulty: 'Difficile',
      duration: 120,
    },

    // Coiffures Enfant
    {
      id: 'e1',
      category: 'enfant',
      title: 'Coupe Enfant Classique',
      description: 'Coupe adaptée aux plus jeunes',
      image: 'placeholder-enfant-1',
      price: 5000,
      difficulty: 'Facile',
      duration: 25,
    },
    {
      id: 'e2',
      category: 'enfant',
      title: 'Style Junior Moderne',
      description: 'Coupe tendance pour enfants',
      image: 'placeholder-enfant-2',
      price: 6000,
      difficulty: 'Facile',
      duration: 30,
    },
    {
      id: 'e3',
      category: 'enfant',
      title: 'Coupe Afro Enfant',
      description: 'Soin spécialisé cheveux texturés',
      image: 'placeholder-enfant-3',
      price: 7000,
      difficulty: 'Moyen',
      duration: 35,
    },
  ];

  const categories = [
    { key: 'homme' as Category, label: 'Homme', icon: '👨', count: galleryItems.filter(item => item.category === 'homme').length },
    { key: 'femme' as Category, label: 'Femme', icon: '👩', count: galleryItems.filter(item => item.category === 'femme').length },
    { key: 'enfant' as Category, label: 'Enfant', icon: '👶', count: galleryItems.filter(item => item.category === 'enfant').length },
  ];

  const filteredItems = galleryItems.filter(item => item.category === selectedCategory);

  const handleImagePress = (item: GalleryItem) => {
    setSelectedImage(item);
    setShowImageModal(true);
  };

  const handleSelectHaircut = (item: GalleryItem) => {
    setShowImageModal(false);
    Alert.alert(
      'Coiffure Sélectionnée ! ✨',
      `Vous avez choisi: ${item.title}\n\nRedirection vers la réservation avec cette coiffure présélectionnée.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réserver', onPress: () => {
          // Ici on pourrait naviguer vers BookingScreen avec la coiffure présélectionnée
          Alert.alert('Info', 'Fonctionnalité de réservation avec coiffure présélectionnée à venir !');
        }}
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return '#10B981';
      case 'Moyen': return '#F59E0B';
      case 'Difficile': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderPlaceholderImage = (item: GalleryItem) => (
    <View style={styles.placeholderImage}>
      <Text style={styles.placeholderEmoji}>
        {item.category === 'homme' ? '✂️' : item.category === 'femme' ? '💇‍♀️' : '👶'}
      </Text>
      <Text style={styles.placeholderText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Galerie</Text>
        <Text style={styles.subtitle}>Portfolio de Baye Zale - Choisissez votre style</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryTab,
              selectedCategory === category.key && styles.categoryTabActive
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category.key && styles.categoryTabTextActive
            ]}>
              {category.label}
            </Text>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountText}>{category.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Gallery Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.galleryGrid}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.galleryItem}
              onPress={() => handleImagePress(item)}
            >
              {/* Image Placeholder */}
              {renderPlaceholderImage(item)}

              {/* Overlay Info */}
              <View style={styles.itemOverlay}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(item.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>{item.difficulty}</Text>
                  </View>
                </View>
                
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>{item.price.toLocaleString()} FCFA</Text>
                  <Text style={styles.itemDuration}>{item.duration} min</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Statistiques de Baye Zale</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Clients Satisfaits</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9⭐</Text>
              <Text style={styles.statLabel}>Note Moyenne</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3+</Text>
              <Text style={styles.statLabel}>Années d'Expérience</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Image Detail Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedImage && (
              <>
                {/* Large Image Placeholder */}
                <View style={styles.modalImage}>
                  {renderPlaceholderImage(selectedImage)}
                </View>

                {/* Details */}
                <View style={styles.modalDetails}>
                  <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                  <Text style={styles.modalDescription}>{selectedImage.description}</Text>
                  
                  <View style={styles.modalInfo}>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Prix:</Text>
                      <Text style={styles.modalInfoValue}>{selectedImage.price.toLocaleString()} FCFA</Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Durée:</Text>
                      <Text style={styles.modalInfoValue}>{selectedImage.duration} minutes</Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Difficulté:</Text>
                      <Text style={[
                        styles.modalInfoValue,
                        { color: getDifficultyColor(selectedImage.difficulty) }
                      ]}>
                        {selectedImage.difficulty}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelectHaircut(selectedImage)}
                  >
                    <Text style={styles.selectButtonText}>Choisir cette coiffure</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    position: 'relative',
  },
  categoryTabActive: {
    backgroundColor: '#EEF2FF',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#4F7FEE',
  },
  categoryCount: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#4F7FEE',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  galleryItem: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  placeholderImage: {
    height: 150,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  itemOverlay: {
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#4F7FEE',
    fontWeight: 'bold',
  },
  itemDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statsSection: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F7FEE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    height: 250,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalDetails: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalInfo: {
    marginBottom: 24,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalInfoLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalInfoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  selectButton: {
    backgroundColor: '#4F7FEE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#4F7FEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
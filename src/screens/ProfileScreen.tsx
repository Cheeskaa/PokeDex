import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { getCurrentUser, signOut } from '../config/firebase';

// 1. Define your Theme Colors
const COLORS = {
  primaryGreen: '#16a134ff',
  secondaryBlue: '#7581b6ff',
  buttonGreen: '#35bd28ff',
  shadowRed: '#c53b1dff',
  background: '#ffffff',
  gray: '#f5f5f5',
};

// 2. Define Props to include navigation (Back button)
interface ProfileProps {
  onBack?: () => void;
  navigation?: any;
}

export default function ProfileScreen({ onBack }: ProfileProps) {
  const user = getCurrentUser();
  
  const [stats, setStats] = useState({
    discovered: 12, 
    seen: 45,
    rank: 'Novice Trainer'
  });

  // Updated Mock Data with Images
  const discoveredPokemon = [
    { id: '1', name: 'Bulbasaur', type: 'Grass', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
    { id: '4', name: 'Charmander', type: 'Fire', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { id: '7', name: 'Squirtle', type: 'Water', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
    { id: '25', name: 'Pikachu', type: 'Electric', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* 1. Header with Back Button (if needed) */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Pokedex</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.pageTitle}>Trainer Profile</Text>
      </View>

      {/* 2. Trainer Card (New Design) */}
      <View style={styles.trainerCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.email ? user.email[0].toUpperCase() : 'T'}
          </Text>
        </View>
        
        <View style={styles.trainerInfo}>
          <Text style={styles.emailText}>{user?.email || 'Pokemon Trainer'}</Text>
          <Text style={styles.rankText}>{stats.rank}</Text>
          <Text style={styles.idText}>ID: {user?.uid?.slice(0, 8) || '0000'}</Text>
        </View>

        {/* Decorative Logo Watermark */}
        <Image 
          source={{ uri: 'https://sgfoodlifestyle.com/wp-content/uploads/2019/08/pex-logo.png' }} 
          style={styles.cardWatermark}
          resizeMode="contain"
        />
      </View>

      {/* 3. Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.discovered}</Text>
          <Text style={styles.statLabel}>Caught</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.seen}</Text>
          <Text style={styles.statLabel}>Seen</Text>
        </View>
      </View>

      {/* 4. Recent Discoveries List */}
      <Text style={styles.sectionTitle}>Recent Catches</Text>

      <FlatList
        data={discoveredPokemon}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image source={{ uri: item.image }} style={styles.pokemonImage} />
            <View style={styles.pokemonInfo}>
              <Text style={styles.pokemonName}>{item.name}</Text>
              <Text style={styles.pokemonType}>{item.type}</Text>
            </View>
            <Text style={styles.pokemonId}>#{item.id.padStart(3, '0')}</Text>
          </View>
        )}
      />

      {/* 5. Logout Button (Green Theme) */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 5,
  },
  backText: {
    color: COLORS.secondaryBlue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryGreen,
  },
  // TRAINER CARD STYLES
  trainerCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    // Theme Border
    borderWidth: 2,
    borderColor: COLORS.primaryGreen,
    // Red Shadow
    shadowColor: COLORS.shadowRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden', // Crops the watermark
  },
  cardWatermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    opacity: 0.1, // Faint logo in background
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.secondaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  trainerInfo: {
    flex: 1,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  rankText: {
    fontSize: 14,
    color: COLORS.primaryGreen,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  idText: {
    fontSize: 12,
    color: '#999',
  },
  // STATS STYLES
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#ddd',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryGreen,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    fontWeight: '600',
  },
  // LIST STYLES
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    // Slight shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pokemonImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  pokemonInfo: {
    flex: 1,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pokemonType: {
    fontSize: 12,
    color: '#888',
  },
  pokemonId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccc',
  },
  // BUTTON STYLES
  logoutButton: {
    backgroundColor: COLORS.buttonGreen,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    // Red Shadow
    shadowColor: COLORS.shadowRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
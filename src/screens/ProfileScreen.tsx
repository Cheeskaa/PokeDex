import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { getCurrentUser, signOut } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

interface ProfileProps {
  onBack?: () => void;
}

type PokemonData = {
  id: number;
  name: string;
  type?: string;
  imageUrl?: string;
};

export default function ProfileScreen({ onBack }: ProfileProps) {
  const user = getCurrentUser();
  const isFocused = useIsFocused();

  const [stats, setStats] = useState({ caught: 0, seen: 0, rank: 'Novice Trainer' });
  const [recentCatches, setRecentCatches] = useState<PokemonData[]>([]);

  // Load stats and recent catches
  useEffect(() => {
    if (!user || !isFocused) return;

    const loadStats = async () => {
      const STORAGE_KEY = `@caught_pokemon_${user.uid}`;
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const caught: PokemonData[] = stored ? JSON.parse(stored) : [];

        // Update stats
        setStats({
          caught: caught.length,
          seen: caught.length,
          rank:
            caught.length >= 50
              ? 'Elite Trainer'
              : caught.length >= 20
              ? 'Advanced Trainer'
              : 'Novice Trainer',
        });

        // Take last 5 catches
        const recent = [...caught].slice(-5).reverse();

        // Fetch type if not stored
        const recentWithType = await Promise.all(
          recent.map(async p => {
            if (p.type) return p; // already has type
            try {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`);
              const data = await res.json();
              return {
                ...p,
                type: data.types[0]?.type?.name || 'Unknown',
                imageUrl:
                  p.imageUrl ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
              };
            } catch {
              return { ...p, type: 'Unknown' };
            }
          })
        );

        setRecentCatches(recentWithType);
      } catch (err) {
        console.error('Failed to load caught Pokémon:', err);
      }
    };

    loadStats();
  }, [user, isFocused]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ position: 'absolute', left: 0 }}>
            <Text>← Pokedex</Text>
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Trainer Profile</Text>
      </View>

      {/* Trainer Info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#7581b6ff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}
        >
          <Text style={{ fontSize: 28, color: 'white', fontWeight: 'bold' }}>
            {user?.email ? user.email[0].toUpperCase() : 'T'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{user?.email || 'Pokemon Trainer'}</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#16a134ff' }}>{stats.rank}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>ID: {user?.uid?.slice(0, 8) || '0000'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#16a134ff' }}>{stats.caught}</Text>
          <Text>Caught</Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#ddd' }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#16a134ff' }}>{stats.seen}</Text>
          <Text>Seen</Text>
        </View>
      </View>

      {/* Recent Catches */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Recent Catches</Text>
      <FlatList
        data={recentCatches}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 12,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#eee',
            }}
          >
            <Image
              source={{
                uri:
                  item.imageUrl ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`,
              }}
              style={{ width: 50, height: 50, marginRight: 15 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#888' }}>{item.type || 'Unknown'}</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#ccc' }}>
              #{item.id.toString().padStart(3, '0')}
            </Text>
          </View>
        )}
      />

      {/* Logout */}
      <TouchableOpacity
        style={{
          backgroundColor: '#35bd28ff',
          padding: 15,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 10,
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

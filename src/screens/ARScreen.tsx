import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../config/firebase';

type PokemonData = {
  id: number;
  name: string;
  imageUrl?: string;
};

type Post = {
  id: string;
  username: string;
  content: string;
  timestamp: number;
  imageUrl: string;
  pokemonId?: number;
  liked?: boolean;
};

const USER_KEY = (userId: string) => `@caught_pokemon_${userId}`;
const GLOBAL_KEY = "@global_pokemon_feed";

export default function ARScreen() {
  const route = useRoute();
  const selectedPokemon = route.params?.pokemon as PokemonData;

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const cameraRef = useRef<Camera>(null);

  const [caughtPokemonIds, setCaughtPokemonIds] = useState<Set<number>>(new Set());
  const user = getCurrentUser();

  // Load caught Pokémon for this user
  useEffect(() => {
    const loadCaught = async () => {
      if (!user) return;
      const stored = await AsyncStorage.getItem(USER_KEY(user.uid));
      if (stored) {
        const caught: PokemonData[] = JSON.parse(stored);
        setCaughtPokemonIds(new Set(caught.map(p => p.id)));
      }
    };
    loadCaught();
  }, [user]);

  // Request camera permission if needed
  useEffect(() => {
    if (hasPermission === false) requestPermission();
  }, [hasPermission]);

  // Capture Pokémon
  const capturePokemon = async () => {
    if (!selectedPokemon || !user) return;

    try {
      // Take photo (optional)
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({ flash: "off" });
        console.log("Photo saved at:", photo.path);
      }

      // --- Update user-specific caught Pokémon ---
      const key = USER_KEY(user.uid);
      const stored = await AsyncStorage.getItem(key);
      let caught: PokemonData[] = stored ? JSON.parse(stored) : [];
      if (!caught.find(p => p.id === selectedPokemon.id)) {
        caught.push({
          id: selectedPokemon.id,
          name: selectedPokemon.name,
          imageUrl: selectedPokemon.imageUrl
        });
        await AsyncStorage.setItem(key, JSON.stringify(caught));
      }
      setCaughtPokemonIds(prev => new Set(prev).add(selectedPokemon.id));

      // --- Update global feed ---
      const globalStored = await AsyncStorage.getItem(GLOBAL_KEY);
      let feedPosts: Post[] = globalStored ? JSON.parse(globalStored) : [];
      feedPosts.push({
        id: `caught-${selectedPokemon.id}-${Date.now()}`,
        username: user.email || "Anonymous",
        content: `Caught ${selectedPokemon.name}!`,
        timestamp: Date.now(),
        imageUrl: selectedPokemon.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`,
        pokemonId: selectedPokemon.id,
        liked: false,
      });
      await AsyncStorage.setItem(GLOBAL_KEY, JSON.stringify(feedPosts));

      Alert.alert("Captured!", `${selectedPokemon.name} has been caught!`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to capture Pokémon.");
    }
  };

  if (!device || hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffdc00" />
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission required. Please enable it in settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        ref={cameraRef}
      />

      {selectedPokemon && (
        <View style={styles.pokemonContainer}>
          <Image
            source={{
              uri: selectedPokemon.imageUrl ||
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`,
            }}
            style={styles.sprite}
          />
          <Text style={styles.pokemonName}>{selectedPokemon.name.toUpperCase()}</Text>
          {caughtPokemonIds.has(selectedPokemon.id) && (
            <Text style={styles.caughtText}>✓ CAUGHT</Text>
          )}
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.captureBtn,
            selectedPokemon && caughtPokemonIds.has(selectedPokemon.id) && styles.captureCaught,
          ]}
          onPress={capturePokemon}
          disabled={selectedPokemon && caughtPokemonIds.has(selectedPokemon.id)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {selectedPokemon && caughtPokemonIds.has(selectedPokemon.id)
              ? "ALREADY CAUGHT"
              : "CAPTURE"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  text: { color: "#fff", fontSize: 16 },
  pokemonContainer: { position: "absolute", top: "25%", left: 0, right: 0, alignItems: "center" },
  sprite: { width: 200, height: 200 },
  pokemonName: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 8 },
  caughtText: { color: "#4caf50", fontSize: 16, fontWeight: "bold", marginTop: 4 },
  controls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
  captureBtn: { backgroundColor: "#ef5350", paddingHorizontal: 40, paddingVertical: 12, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  captureCaught: { backgroundColor: "#4caf50", opacity: 0.8 },
});

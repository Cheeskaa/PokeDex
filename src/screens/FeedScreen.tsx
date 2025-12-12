import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrentUser } from '../config/firebase';

type Post = {
  id: string;
  username: string;
  content: string;
  timestamp: number;
  imageUrl: string;
  pokemonId?: number;
  likes?: number;
};

const GLOBAL_KEY = "@global_pokemon_feed";

export default function FeedScreen() {
  const navigation = useNavigation();
  const user = getCurrentUser();

  // ✅ Hooks are unconditional
  const [posts, setPosts] = useState<Post[]>([]);
  const [userLikedPosts, setUserLikedPosts] = useState<Set<string>>(new Set());

  const USER_LIKED_KEY = user ? `@liked_posts_${user.uid}` : null;

  const loadPosts = async () => {
    try {
      const stored = await AsyncStorage.getItem(GLOBAL_KEY);
      const feedPosts: Post[] = stored ? JSON.parse(stored) : [];
      feedPosts.sort((a, b) => b.timestamp - a.timestamp);
      setPosts(feedPosts);

      if (user && USER_LIKED_KEY) {
        const likedStored = await AsyncStorage.getItem(USER_LIKED_KEY);
        const likedIds: string[] = likedStored ? JSON.parse(likedStored) : [];
        setUserLikedPosts(new Set(likedIds));
      } else {
        setUserLikedPosts(new Set());
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    loadPosts();
    const unsubscribe = navigation.addListener('focus', loadPosts);
    return unsubscribe;
  }, [navigation, user]); // dependency on user is safe

  const saveUserLikes = async (likedIds: string[]) => {
    if (!user || !USER_LIKED_KEY) return;
    try {
      await AsyncStorage.setItem(USER_LIKED_KEY, JSON.stringify(likedIds));
    } catch (err) {
      console.error("Failed to save user likes:", err);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return; // safety check

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = !userLikedPosts.has(postId);
        return {
          ...post,
          likes: post.likes !== undefined ? post.likes + (isLiked ? 1 : -1) : isLiked ? 1 : 0
        };
      }
      return post;
    });

    const newLikedPosts = new Set(userLikedPosts);
    if (newLikedPosts.has(postId)) newLikedPosts.delete(postId);
    else newLikedPosts.add(postId);

    setUserLikedPosts(newLikedPosts);
    setPosts(updatedPosts);
    saveUserLikes(Array.from(newLikedPosts));

    try {
      await AsyncStorage.setItem(GLOBAL_KEY, JSON.stringify(updatedPosts));
    } catch (err) {
      console.error("Failed to save global posts:", err);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.contentRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.pokemonName}>{item.content}</Text>
          <Text style={styles.likesText}>{item.likes || 0} {item.likes === 1 ? 'like' : 'likes'}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Icon
            name={userLikedPosts.has(item.id) ? 'heart' : 'heart-outline'}
            size={28}
            color={userLikedPosts.has(item.id) ? '#e74c3c' : '#555'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Feed</Text>
      </View>

      <StatusBar barStyle="dark-content" backgroundColor="#16a134ff" />

      {posts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#888' }}>No posts yet. Go catch some Pokémon!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={{ padding: 10, paddingTop: 0 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#16a134ff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#f7f7f7',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  likesText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

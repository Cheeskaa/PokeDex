import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistanceToNow } from 'date-fns';
import * as ImagePicker from 'react-native-image-picker';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@pokedex_feed_v7';

interface Post {
  id: string;
  username: string;
  handle: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: string[];
  imageUrl?: string;
  isStatic?: boolean;
  isGif?: boolean;
  trainerClass?: string;
}

const INITIAL_STATIC_POSTS: Post[] = [
  {
    id: 'static-1',
    username: 'Professor Oak',
    handle: '@kanto_research',
    content: 'A shiny Gyarados has been spotted! 🔴',
    timestamp: Date.now() - 3600000,
    likes: 5420,
    comments: [],
    imageUrl: 'https://media.giphy.com/media/ydU6Wf0rCqO52/giphy.gif',
    isStatic: true,
    isGif: true,
    trainerClass: 'Professor',
  },
  {
    id: 'static-2',
    username: 'Cynthia',
    handle: '@sinnoh_champ',
    content: 'Garchomp senses something strange nearby!',
    timestamp: Date.now() - 7200000,
    likes: 8900,
    comments: [],
    imageUrl: 'https://img.pokemondb.net/artwork/large/garchomp.jpg',
    isStatic: true,
    trainerClass: 'Champion',
  },
];

// ---------------- PostCard Component ----------------
const PostCard = ({
  post,
  onLike,
  onDelete,
  onShare,
  onAddComment,
  likedPosts,
}: {
  post: Post;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (post: Post) => void;
  onAddComment: (id: string, comment: string) => void;
  likedPosts: string[];
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <View style={[styles.card, { backgroundColor: '#FFF7E6', borderColor: '#FFD700' }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1024px-Pok%C3%A9_Ball_icon.svg.png',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.username, { color: '#FF4500' }]}>{post.username}</Text>
            <Text style={[styles.handle, { color: '#FF8C00' }]}>
              {post.trainerClass} •{' '}
              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
            </Text>
          </View>
        </View>
        {!post.isStatic && (
          <TouchableOpacity onPress={() => onDelete(post.id)}>
            <Icon name="delete" size={24} color="#FF6347" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {post.content ? (
        <Text style={[styles.postText, { color: '#1E3A8A', fontWeight: '700' }]}>{post.content}</Text>
      ) : null}

      {/* Image */}
      {post.imageUrl && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          {post.isGif && <Text style={styles.gifBadge}>GIF</Text>}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FFB6C1' }]}
          onPress={() => onLike(post.id)}
        >
          <Icon
            name={likedPosts.includes(post.id) ? "heart" : "heart-outline"}
            size={22}
            color={likedPosts.includes(post.id) ? "#FF1493" : "#C71585"}
          />
          <Text style={[styles.actionText, { color: '#C71585' }]}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#ADD8E6' }]}
          onPress={() => setShowComments(!showComments)}
        >
          <Icon name="comment-outline" size={22} color="#1E90FF" />
          <Text style={[styles.actionText, { color: '#1E90FF' }]}>{post.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#90EE90' }]}
          onPress={() => onShare(post)}
        >
          <Icon name="share-variant" size={22} color="#32CD32" />
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {showComments && (
        <View style={styles.commentSection}>
          {post.comments.map((c, idx) => (
            <Text key={idx} style={styles.commentText}>
              • {c}
            </Text>
          ))}

          <View style={styles.commentInputWrapper}>
            <TextInput
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Icon name="send" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// ---------------- FeedScreen Component ----------------
const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPosts([...INITIAL_STATIC_POSTS, ...parsed]);
      } else {
        setPosts(INITIAL_STATIC_POSTS);
      }
    } catch (e) {}
  };

  const savePosts = async (current: Post[]) => {
    try {
      const userPosts = current.filter(p => !p.isStatic);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));
    } catch (e) {}
  };

  const handlePickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setNewPostImage(response.assets[0].uri || '');
      }
    });
  };

  const handlePost = () => {
    if (!newPostText.trim() && !newPostImage) return;

    const newPost: Post = {
      id: Date.now().toString(),
      username: 'WPlayer',
      handle: '@hunter_status',
      content: newPostText || '',
      timestamp: Date.now(),
      likes: 0,
      comments: [],
      imageUrl: newPostImage || undefined,
      trainerClass: 'Trainer',
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);
    setNewPostText('');
    setNewPostImage('');
  };

  const handleLike = (id: string) => {
    const updatedLikes = posts.map(p => {
      if (p.id === id) {
        if (likedPosts.includes(id)) {
          return { ...p, likes: p.likes - 1 };
        } else {
          return { ...p, likes: p.likes + 1 };
        }
      }
      return p;
    });

    setPosts(updatedLikes);

    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }

    savePosts(updatedLikes);
  };

  const handleAddComment = (id: string, comment: string) => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, comments: [...p.comments, comment] } : p,
    );
    setPosts(updated);
    savePosts(updated);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Remove entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = posts.filter(p => p.id !== id);
          setPosts(updated);
          savePosts(updated);
        },
      },
    ]);
  };

  const handleShare = async (post: Post) => {
    try {
      await Share.open({
        message: `PokeLog: "${post.content}" - ${post.username}`,
        url: post.imageUrl,
        failOnCancel: false,
      });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFAF0" barStyle="dark-content" />

      <View style={[styles.screenHeader, { backgroundColor: '#FFD700' }]}>
        <Text style={[styles.headerTitle, { color: '#FF4500' }]}>PokeFeed</Text>
        <Icon name="pokeball" size={28} color="#FF0000" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onLike={handleLike}
              onDelete={handleDelete}
              onShare={handleShare}
              onAddComment={handleAddComment}
              likedPosts={likedPosts}
            />
          )}
          ListHeaderComponent={
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="What's new in your Pokedex?"
                  placeholderTextColor="#999"
                  value={newPostText}
                  onChangeText={setNewPostText}
                  multiline
                />

                {newPostImage ? (
                  <View style={{ marginVertical: 8 }}>
                    <Image source={{ uri: newPostImage }} style={{ width: width - 50, height: 200, borderRadius: 15 }} />
                  </View>
                ) : null}

                <View style={styles.toolBar}>
                  <TouchableOpacity onPress={handlePickImage} style={styles.toolIcon}>
                    <Icon name="camera-iris" size={26} color="#FF4500" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.postBtn, (!newPostText && !newPostImage) && styles.disabledBtn]}
                    onPress={handlePost}
                    disabled={!newPostText && !newPostImage}
                  >
                    <Text style={styles.postBtnText}>POST</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8DC' },
  screenHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: '#FFA500',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 1 },

  inputWrapper: { padding: 15 },
  inputContainer: {
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#333',
    minHeight: 40,
    textAlignVertical: 'top',
    padding: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
  },
  toolBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  toolIcon: { marginRight: 10 },
  postBtn: { backgroundColor: '#FF4500', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  disabledBtn: { opacity: 0.5 },
  postBtnText: { color: '#FFF', fontWeight: 'bold' },

  card: { marginBottom: 15, borderRadius: 20, paddingBottom: 10, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 50, marginRight: 10 },
  username: { fontWeight: '900', fontSize: 16 },
  handle: { fontSize: 12 },
  postText: { fontSize: 16, paddingHorizontal: 12, marginBottom: 10 },
  postImage: { width: width - 20, height: 250, borderRadius: 20, alignSelf: 'center' },
  imageWrapper: { position: 'relative' },
  gifBadge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#FF69B4', color: '#FFF', fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },

  actionBar: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', marginRight: 15, alignItems: 'center', padding: 6, borderRadius: 15 },
  actionText: { marginLeft: 6, fontWeight: '700' },

  commentSection: { paddingHorizontal: 15, paddingTop: 10 },
  commentText: { marginBottom: 5 },
  commentInputWrapper: { flexDirection: 'row', borderWidth: 1, borderColor: '#FF69B4', borderRadius: 15, padding: 8, marginTop: 8, alignItems: 'center', backgroundColor: '#FFF0F5' },
  commentInput: { flex: 1, fontSize: 14 },
});

export default FeedScreen;
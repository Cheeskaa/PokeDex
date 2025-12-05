import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, Animated } from 'react-native';

interface LandingPageProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
}

export default function LandingPage({ onLoginPress, onSignUpPress }: LandingPageProps) {
  // 1. Setup the animation value (starts at scale 1)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 2. Start the infinite loop when screen loads
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        // Grow slightly
        Animated.timing(pulseAnim, {
          toValue: 1.1, 
          duration: 800,
          useNativeDriver: true,
        }),
        // Shrink back
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Section with Title */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://sgfoodlifestyle.com/wp-content/uploads/2019/08/pex-logo.png' }} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* 3. Apply the Animation to the Title */}
        <Animated.Text 
          style={[
            styles.title, 
            { transform: [{ scale: pulseAnim }] } // Connects the heartbeat
          ]}
        >
          PokeExplorer
        </Animated.Text>
        
        <Text style={styles.subtitle}>Gotta discover 'em all!</Text>
      </View>

      {/* Description */}
      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          Explore the real world, find hidden Pokémon, and build your ultimate collection.
        </Text>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={onSignUpPress}>
          <Text style={styles.signupText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 350,
    height: 450,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#16a134ff', // Maintained your Green color
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7581b6ff', // Maintained your Blue-ish color
    fontWeight: '500',
  },
  infoContainer: {
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  loginButton: {
    backgroundColor: '#35bd28ff', // Maintained Green Button
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#c53b1dff', // Maintained Red Shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4fb925ff', // Maintained Green Border
  },
  signupText: {
    color: '#14e30dff', // Maintained Green Text
    fontSize: 18,
    fontWeight: 'bold',
  },
});
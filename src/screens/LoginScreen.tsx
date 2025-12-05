import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image 
} from 'react-native';
import { signIn, signUp } from '../config/firebase'; 

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); 

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    let result;

    if (isLoginMode) {
      result = await signIn(email, password);
    } else {
      result = await signUp(email, password);
    }

    setLoading(false);

    if (result.success) {
       Alert.alert('Success', `Welcome! You are now ${isLoginMode ? 'logged in' : 'registered'}.`);
    } else {
      Alert.alert('Authentication Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerContainer}>
        {/* LOGO */}
        <Image 
          source={{ uri: 'https://sgfoodlifestyle.com/wp-content/uploads/2019/08/pex-logo.png' }} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>PokeExplorer</Text>
        <Text style={styles.subtitle}>Discover. Catch. Learn.</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.headerText}>{isLoginMode ? 'Login' : 'Create Account'}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isLoginMode ? 'Start Pokedex' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setIsLoginMode(!isLoginMode)}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isLoginMode 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  logo: {
    // FIXED DIMENSIONS HERE
    width: 300,  
    height: 300, 
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a134ff', 
  },
  subtitle: {
    fontSize: 16,
    color: '#7581b6ff', 
    marginTop: 5,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, 
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#35bd28ff', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#c53b1dff', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#7581b6ff', 
    fontSize: 14,
    fontWeight: '600',
  }
});
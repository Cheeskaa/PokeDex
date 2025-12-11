import React from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// CHANGED: Using MaterialCommunityIcons for better, more thematic options
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomePageScreen from '../screens/HomePageScreen';
import HuntScreen from '../screens/HuntScreen';
import PokedexScreen from '../screens/PokedexScreen';
import ARScreen from '../screens/ARScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- POKEDEX STACK (Nested Navigation) ---
function PokedexStack() {
  return (
    <Stack.Navigator initialRouteName="PokedexMain">
      <Stack.Screen
        name="PokedexMain"
        component={PokedexScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Entry Data',
          headerStyle: { backgroundColor: '#DC0A2D' }, // Classic Pokedex Red
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800', fontSize: 20 },
          headerShadowVisible: false, 
        }}
      />
    </Stack.Navigator>
  );
}

// --- MAIN TAB NAVIGATOR ---
export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Keep labels hidden for clean look
        tabBarStyle: styles.floatingTabBar,
        
        // Custom Icon Renderer
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let iconColor = focused ? '#ffffff' : '#9CA3AF'; // White if active, Gray if inactive

          // --- THEMATIC ICON SELECTION (MaterialCommunityIcons) ---
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'pokeball' : 'pokeball'; // It's a Pokemon app, let's use the ball!
              break;
            case 'Hunt':
              iconName = focused ? 'paw' : 'paw-off'; // Tracking paws
              break;
            case 'Pokedex':
              iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline';
              break;
            case 'AR':
              iconName = 'camera-iris';
              break;
            case 'Feed':
              iconName = focused ? 'forum' : 'forum-outline';
              break;
            case 'Profile':
              iconName = 'account-cowboy-hat'; // Fits the "Hunter" theme
              break;
            default:
              iconName = 'help';
          }

          // The "Super Pop" Container
          return (
            <View style={[
              styles.iconContainer, 
              focused && styles.activeIconContainer
            ]}>
              <MaterialCommunityIcons name={iconName} size={26} color={iconColor} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePageScreen} />
      <Tab.Screen name="Hunt" component={HuntScreen} />
      <Tab.Screen name="Pokedex" component={PokedexStack} />
      <Tab.Screen name="AR" component={ARScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- EXCITING STYLES ---
const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    height: 70, // Slightly taller
    backgroundColor: '#ffffff',
    borderRadius: 35,
    borderTopWidth: 0,
    
    // Deep Shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    
    paddingHorizontal: 5,
    paddingBottom: 0, 
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'transparent', // Transparent when inactive
  },
  // THE "POP" EFFECT
  activeIconContainer: {
    backgroundColor: '#4CAF50', // Vibrant Hunter Green
    // Moves up drastically AND scales up
    transform: [
        { translateY: -15 },
        { scale: 1.15 } 
    ], 
    
    // Intense "Glow" Shadow
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#ffffff', // White border to make it pop off the green
  }
});
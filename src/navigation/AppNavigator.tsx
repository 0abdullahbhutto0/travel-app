import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SavedJourneysScreen from '../screens/SavedJourneysScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const EmptyScreen = () => <View style={{flex: 1, backgroundColor: '#FAF9F6'}} />;

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'person-outline';
          if (route.name === 'Discover') iconName = 'compass-outline';
          else if (route.name === 'Saved') iconName = 'bookmark-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.45)',
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarStyle: {
          backgroundColor: 'rgba(45, 90, 100, 0.88)',
          position: 'absolute',
          bottom: 20,
          left: 24,
          right: 24,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          borderRadius: 28,
          height: 60,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
      })}
    >
      <Tab.Screen name="Discover" component={HomeScreen} />
      <Tab.Screen name="Saved" component={SavedJourneysScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="PlaceDetails" 
        component={PlaceDetailsScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

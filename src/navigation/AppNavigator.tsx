import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SavedJourneysScreen from '../screens/SavedJourneysScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const EmptyScreen = () => <View style={{flex: 1, backgroundColor: '#FAF9F6'}} />;

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon = '•';
          if (route.name === 'Discover') icon = '🧭';
          else if (route.name === 'Saved') icon = '🔖';
          else if (route.name === 'Profile') icon = '👤';
          
          return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
        },
        tabBarActiveTintColor: '#3B6877',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#FAF9F6',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
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
        options={{ headerShown: true, title: 'Details', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
};

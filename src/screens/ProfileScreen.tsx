import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const user = auth().currentUser;

  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user?.photoURL || 'https://ui-avatars.com/api/?name=' + (user?.displayName || 'User') + '&background=EAE1CE&color=8A7A5D' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user?.displayName || 'Traveler'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    alignItems: 'center',
    paddingTop: 80,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    color: '#002D3A',
    fontWeight: '500',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ProfileScreen;

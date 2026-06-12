import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const user = auth().currentUser;

  const handleLogout = () => {
    auth().signOut();
  };

  const getMemberSince = () => {
    if (!user || !user.metadata || !user.metadata.creationTime) return 'Member since recently';
    const date = new Date(user.metadata.creationTime);
    return `Member since ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}`;
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.glassCard}>
          <Image 
            source={{ uri: user?.photoURL || 'https://ui-avatars.com/api/?name=' + (user?.displayName || 'User') + '&background=EAE1CE&color=8A7A5D' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{user?.displayName || 'Traveler'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>{getMemberSince()}</Text>
          </View>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Aether v1.0</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 45, 58, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 26,
    color: '#002D3A',
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#516169',
    marginBottom: 20,
  },
  statsRow: {
    backgroundColor: 'rgba(234, 225, 206, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 40,
  },
  statsText: {
    color: '#8A7A5D',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    borderColor: '#3B6877',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#3B6877',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
  }
});

export default ProfileScreen;

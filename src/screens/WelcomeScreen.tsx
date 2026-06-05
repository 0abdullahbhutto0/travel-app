import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BG_IMAGE_URL = 'https://img.magnific.com/free-photo/wonderful-polynesian-landscape_23-2151913445.jpg?semt=ais_hybrid&w=740&q=80';

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground source={{ uri: BG_IMAGE_URL }} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.topTitle}>Aether</Text>
          
          <Text style={styles.mainHeading}>Find Your Peace</Text>
          
          <Text style={styles.description}>
            Discover hidden gems and plan your next mindful journey. Leave behind the
            frenzy and embrace the serenity of meaningful discovery.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.buttonText}>Get Started {'\u2192'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>Already a traveler? Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    backgroundColor: 'rgba(251, 249, 244, 0.85)',
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    paddingHorizontal: 32,
    paddingTop: 64,
    paddingBottom: 48,
    alignItems: 'center',
    transform: [{ scaleX: 1.2 }],
  },
  topTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4e635a',
    marginBottom: 24,
    transform: [{ scaleX: 0.833 }],
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1b1c19',
    marginBottom: 16,
    transform: [{ scaleX: 0.833 }],
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#516169',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    transform: [{ scaleX: 0.833 }],
  },
  button: {
    backgroundColor: '#4e635a',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    transform: [{ scaleX: 0.833 }],
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    transform: [{ scaleX: 0.833 }],
  },
  loginLinkText: {
    color: '#1b1c19',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WelcomeScreen;

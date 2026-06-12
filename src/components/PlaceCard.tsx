import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Place } from '../services/googlePlaces';

interface PlaceCardProps {
  place: Place;
  onPress: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onPress, onSave, isSaved }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: place.photoUrl || 'https://picsum.photos/seed/' + place.id + '/400/300' }} 
          style={styles.image} 
        />
        {onSave && (
          <TouchableOpacity style={styles.heartBtn} onPress={onSave}>
            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={isSaved ? "#E74C3C" : "#fff"} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{place.name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {place.vicinity?.split(',')[0] || place.types?.[0]?.replace(/_/g, ' ') || 'Destination'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
  },
  heartBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  heartIcon: {
    fontSize: 24,
  },
  info: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    color: '#002D3A',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#8A959E',
    marginTop: 4,
    textTransform: 'uppercase',
  }
});

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Place } from '../services/googlePlaces';

interface SavedPlaceCardProps {
  place: Place;
  onPress: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const SavedPlaceCard: React.FC<SavedPlaceCardProps> = ({ place, onPress, onSave, isSaved }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: place.photoUrl || 'https://picsum.photos/seed/' + place.id + '/150' }} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{place.name}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {place.vicinity || 'Beautiful destination'}
        </Text>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{place.types?.[0]?.replace(/_/g, ' ') || 'Place'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionContainer}>
        {onSave && (
          <TouchableOpacity onPress={onSave}>
            <Text style={styles.heartIcon}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: '#002D3A',
    fontWeight: '500',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#EAE1CE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#8A7A5D',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actionContainer: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  heartIcon: {
    fontSize: 24,
  }
});

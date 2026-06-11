import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Place } from '../services/googlePlaces';
import { firestoreService } from '../services/firestoreService';
import { SavedPlaceCard } from '../components/SavedPlaceCard';
import { SearchBar } from '../components/SearchBar';

const SavedJourneysScreen = ({ navigation }: any) => {
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSavedPlaces = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const places = await firestoreService.getSavedPlaces(currentUser.uid);
        setSavedPlaces(places);
      }
      setLoading(false);
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSavedPlaces();
    });

    fetchSavedPlaces();
    return unsubscribe;
  }, [navigation]);

  const handleUnsave = async (place: Place) => {
    const user = auth().currentUser;
    if (user) {
      await firestoreService.unsavePlace(user.uid, place.id);
      setSavedPlaces(prev => prev.filter(p => p.id !== place.id));
    }
  };

  const filteredPlaces = savedPlaces.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.vicinity && p.vicinity.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Saved Journeys</Text>
      <Text style={styles.headerSubtitle}>Your handpicked collection of tranquil escapes.</Text>
      
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={() => {}}
        placeholder="Search saved places..."
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SavedPlaceCard 
              place={item} 
              isSaved={true}
              onSave={() => handleUnsave(item)}
              onPress={() => navigation.navigate('PlaceDetails', { placeId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No saved places found.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: '#3B6877',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  }
});

export default SavedJourneysScreen;

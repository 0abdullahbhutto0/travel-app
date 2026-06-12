import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { googlePlacesApi, Place } from '../services/googlePlaces';
import { firestoreService } from '../services/firestoreService';
import { SearchBar } from '../components/SearchBar';
import { PlaceCard } from '../components/PlaceCard';

const FILTERS = ['Pizza', 'Coffee', 'Hotels', 'Museums', 'Parks'];

const INITIAL_QUERIES = [
  { query: 'pizza in new york', title: 'Pizza in New York' },
  { query: 'coffee in paris', title: 'Coffee in Paris' },
  { query: 'sushi in tokyo', title: 'Sushi in Tokyo' },
  { query: 'museums in london', title: 'Museums in London' },
  { query: 'parks in sydney', title: 'Parks in Sydney' },
];

const HERO_DATA = [
  {
    quote: "Find clarity among the clouds in a landscape untouched by time.",
    image: "https://picsum.photos/seed/mountains/800/400",
    query: "hidden gem retreat",
    title: "Hidden Gems"
  },
  {
    quote: "Discover serenity where the ocean meets the endless sky.",
    image: "https://picsum.photos/seed/ocean/800/400",
    query: "secluded beach",
    title: "Secluded Beaches"
  },
  {
    quote: "Lose yourself in the vibrant heart of the neon city.",
    image: "https://picsum.photos/seed/tokyo/800/400",
    query: "tokyo night life",
    title: "Neon Cities"
  },
  {
    quote: "Embrace the wild whispers of ancient forests.",
    image: "https://picsum.photos/seed/forest/800/400",
    query: "forest cabin",
    title: "Forest Escapes"
  }
];

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedTitle, setFeedTitle] = useState('Daily Inspiration');
  const [places, setPlaces] = useState<Place[]>([]);
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [heroContent, setHeroContent] = useState(() => HERO_DATA[Math.floor(Math.random() * HERO_DATA.length)]);

  const user = auth().currentUser;

  const loadFeed = async (query: string, title: string) => {
    setLoading(true);
    setFeedTitle(title);
    const results = await googlePlacesApi.getPlacesByCategory(query);
    setPlaces(results);
    setLoading(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const randomStart = INITIAL_QUERIES[Math.floor(Math.random() * INITIAL_QUERIES.length)];
      setFeedTitle(randomStart.title);
      
      const [initialPlaces, saved] = await Promise.all([
        googlePlacesApi.getPlacesByCategory(randomStart.query),
        user ? firestoreService.getSavedPlaces(user.uid) : Promise.resolve([])
      ]);
      setPlaces(initialPlaces);
      setSavedPlaceIds(new Set(saved.map(p => p.id)));
      setLoading(false);
    };

    fetchInitialData();
  }, [user]);

  const handleSave = async (place: Place) => {
    if (!user) {
      Alert.alert("Login Required", "Please log in from the Profile tab to save places.");
      return;
    }
    
    const isCurrentlySaved = savedPlaceIds.has(place.id);

    // Update UI immediately
    setSavedPlaceIds(prev => {
      const newSet = new Set(prev);
      if (isCurrentlySaved) newSet.delete(place.id);
      else newSet.add(place.id);
      return newSet;
    });

    try {
      if (isCurrentlySaved) {
        await firestoreService.unsavePlace(user.uid, place.id);
      } else {
        await firestoreService.savePlace(user.uid, place);
      }
    } catch (error) {
      // Revert on error
      setSavedPlaceIds(prev => {
        const newSet = new Set(prev);
        if (isCurrentlySaved) newSet.add(place.id);
        else newSet.delete(place.id);
        return newSet;
      });
      console.error(error);
    }
  };

  const navigateToDetails = (placeId: string) => {
    navigation.navigate('PlaceDetails', { placeId });
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aether</Text>
      </View>

      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={() => {
          if(searchQuery.trim()) {
             loadFeed(searchQuery, `Results for "${searchQuery}"`);
          }
        }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {FILTERS.map((filter, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.filterChip}
            onPress={() => loadFeed(filter, filter)}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ImageBackground 
        source={{ uri: heroContent.image }} 
        style={styles.heroCard}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>{heroContent.quote}</Text>
          <TouchableOpacity 
            style={styles.heroButton} 
            onPress={() => {
              loadFeed(heroContent.query, heroContent.title);
              // Pick a new random hero card different from the current one
              const otherHeroes = HERO_DATA.filter(h => h.query !== heroContent.query);
              const nextHero = otherHeroes[Math.floor(Math.random() * otherHeroes.length)];
              setHeroContent(nextHero);
            }}
          >
            <Text style={styles.heroButtonText}>Begin Journey</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{feedTitle}</Text>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#3B6877" style={{ marginTop: 20, marginBottom: 20 }} />
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderHeader()}
      data={loading ? [] : places}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <PlaceCard 
          place={item}
          isSaved={savedPlaceIds.has(item.id)}
          onSave={() => handleSave(item)}
          onPress={() => navigateToDetails(item.id)}
        />
      )}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={!loading ? <Text style={{color: '#8A959E', marginTop: 10}}>No destinations found. Try another search.</Text> : null}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9F6' },
  container: { flex: 1, backgroundColor: '#FAF9F6', paddingHorizontal: 20 },
  header: { marginTop: 40, marginBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#5A6F62', letterSpacing: 1 },
  filterScroll: { marginBottom: 30 },
  filterChip: { backgroundColor: '#EAE1CE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  filterText: { color: '#8A7A5D', fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  sectionTitle: { fontSize: 24, fontWeight: '500', color: '#002D3A', marginTop: 10, marginBottom: 15 },
  exploreAll: { color: '#3B6877', fontWeight: '500', marginBottom: 15 },
  heroCard: { width: '100%', height: 200, marginBottom: 30, justifyContent: 'center' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 20, justifyContent: 'space-between' },
  heroText: { color: '#fff', fontSize: 16, fontWeight: '500', width: '80%' },
  heroButton: { backgroundColor: '#FAF9F6', alignSelf: 'center', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 24 },
  heroButtonText: { color: '#3B6877', fontWeight: '600' },
  listContainer: { paddingBottom: 40 }
});

export default HomeScreen;

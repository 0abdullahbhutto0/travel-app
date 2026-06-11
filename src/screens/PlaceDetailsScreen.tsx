import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { googlePlacesApi } from '../services/googlePlaces';
import { firestoreService, Review } from '../services/firestoreService';

const PlaceDetailsScreen = ({ route, navigation }: any) => {
  const { placeId } = route.params;
  const [details, setDetails] = useState<any>(null);
  const [appReviews, setAppReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newReviewText, setNewReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
    const fetchAllData = async () => {
      const pDetails = await googlePlacesApi.getPlaceDetails(placeId);
      const aReviews = await firestoreService.getAppReviews(placeId);
      
      setDetails(pDetails);
      setAppReviews(aReviews);
      setLoading(false);
    };

    fetchAllData();
  }, [placeId]);

  const handleSubmitReview = async () => {
    if (!newReviewText.trim() || !user) return;
    setSubmitting(true);
    
    await firestoreService.addAppReview(
      placeId, 
      user.uid, 
      user.displayName || 'Anonymous', 
      5, // Hardcoded 5 stars for simplicity as per "no overengineering"
      newReviewText.trim()
    );

    const updatedReviews = await firestoreService.getAppReviews(placeId);
    setAppReviews(updatedReviews);
    setNewReviewText('');
    setSubmitting(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.centered}>
        <Text>Failed to load place details.</Text>
      </View>
    );
  }

  const photoUrl = details.photos && details.photos.length > 0 
    ? `https://places.googleapis.com/v1/${details.photos[0].photo_name}/media?maxHeightPx=800&maxWidthPx=800&key=AIzaSyAy5qtdjhREiKj0qTXT811NEABShqRWtH8` 
    : 'https://picsum.photos/seed/' + placeId + '/800/600';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: photoUrl }} style={styles.heroImage} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{details.name}</Text>
        <Text style={styles.address}>{details.formatted_address}</Text>
        
        {details.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {details.rating} on Google</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>App Community Reviews</Text>
        {appReviews.length === 0 ? (
          <Text style={styles.noReviews}>No community reviews yet. Be the first!</Text>
        ) : (
          appReviews.map(r => (
            <View key={r.id} style={styles.reviewCard}>
              <Text style={styles.reviewerName}>{r.userName}</Text>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))
        )}

        <View style={styles.addReviewContainer}>
          <TextInput
            style={styles.reviewInput}
            placeholder="Write a review..."
            value={newReviewText}
            onChangeText={setNewReviewText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.submitButton, !newReviewText.trim() && styles.disabledButton]} 
            onPress={handleSubmitReview}
            disabled={!newReviewText.trim() || submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Post Review'}
            </Text>
          </TouchableOpacity>
        </View>

        {details.reviews && details.reviews.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Google Reviews</Text>
            {details.reviews.map((r: any, index: number) => (
              <View key={index.toString()} style={styles.reviewCard}>
                <Text style={styles.reviewerName}>{r.author_name}</Text>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  heroImage: { width: '100%', height: 300 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#002D3A', marginBottom: 8 },
  address: { fontSize: 16, color: '#666', marginBottom: 16 },
  ratingBadge: { backgroundColor: '#EAE1CE', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 24 },
  ratingText: { color: '#8A7A5D', fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#002D3A', marginTop: 10, marginBottom: 16 },
  noReviews: { color: '#888', fontStyle: 'italic', marginBottom: 20 },
  reviewCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EFEFEF' },
  reviewerName: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
  reviewText: { color: '#666', lineHeight: 20 },
  addReviewContainer: { marginTop: 10, marginBottom: 30 },
  reviewInput: { backgroundColor: '#fff', borderRadius: 12, padding: 16, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#EFEFEF', marginBottom: 12 },
  submitButton: { backgroundColor: '#3B6877', padding: 16, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default PlaceDetailsScreen;

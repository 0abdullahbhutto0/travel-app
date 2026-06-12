import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
import auth from '@react-native-firebase/auth';
import { googlePlacesApi, buildPhotoUrl } from '../services/googlePlaces';
import { firestoreService, Review } from '../services/firestoreService';

const PlaceDetailsScreen = ({ route, navigation }: any) => {
  const { placeId } = route.params;
  const [details, setDetails] = useState<any>(null);
  const [appReviews, setAppReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newReviewText, setNewReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

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
      5,
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
        <ActivityIndicator size="large" color="#3B6877" />
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

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '\u2605'.repeat(full) + (half ? '\u00BD' : '') + '\u2606'.repeat(5 - full - half);
  };

  const renderHeroImages = () => {
    if (!details.photos || details.photos.length === 0) {
      return <Image source={{ uri: 'https://picsum.photos/seed/' + placeId + '/800/600' }} style={styles.heroImage} />;
    }

    if (details.photos.length === 1) {
      return <Image source={{ uri: buildPhotoUrl(details.photos[0].photo_name, 800, 800) }} style={styles.heroImage} />;
    }

    return (
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setActivePhotoIndex(newIndex);
          }}
        >
          {details.photos.map((photo: any, index: number) => (
            <Image
              key={index.toString()}
              source={{ uri: buildPhotoUrl(photo.photo_name, 800, 800) }}
              style={styles.heroImage}
            />
          ))}
        </ScrollView>
        <View style={styles.dotContainer}>
          {details.photos.map((_: any, index: number) => (
            <View
              key={index.toString()}
              style={[
                styles.dot,
                activePhotoIndex === index ? styles.activeDot : null
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#002D3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {renderHeroImages()}

        {/* Content Card overlapping the image */}
        <View style={styles.card}>
          <Text style={styles.placeName}>{details.name}</Text>
          <Text style={styles.tagline}>Serenity in the Heart of Nature</Text>

          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={16} color="#E74C3C" style={styles.pinIcon} />
              <Text style={styles.addressText} numberOfLines={2}>{details.formatted_address}</Text>
            </View>
            {details.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingNumber}>{details.rating}</Text>
                <Ionicons name="star" size={16} color="#DAA520" style={styles.ratingStar} />
                <Text style={styles.ratingLabel}>{'on Google\n(Verified)'}</Text>
              </View>
            )}
          </View>

          {/* Traveler Community Reviews */}
          <Text style={styles.sectionTitle}>Traveler Community Reviews</Text>
          {appReviews.length === 0 ? (
            <View style={styles.emptyReview}>
              <Ionicons name="leaf-outline" size={16} color="#8A959E" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Awaits its first story. Share your tranquil moments below.</Text>
            </View>
          ) : (
            appReviews.map(r => (
              <View key={r.id} style={styles.appReviewCard}>
                <Text style={styles.appReviewName}>{r.userName}</Text>
                <Text style={styles.appReviewText}>{r.text}</Text>
              </View>
            ))
          )}

          {/* Review Input */}
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your travel memory..."
            placeholderTextColor="#999"
            value={newReviewText}
            onChangeText={setNewReviewText}
          />
          <TouchableOpacity 
            style={[styles.submitButton, (!newReviewText.trim() || submitting) && styles.disabledButton]} 
            onPress={handleSubmitReview}
            disabled={!newReviewText.trim() || submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : '\u2726 Share Your Experience'}
            </Text>
          </TouchableOpacity>

          {/* Google Reviews - Horizontal */}
          {details.reviews && details.reviews.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Google Reviews</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.googleReviewsScroll}>
                {details.reviews.map((r: any, index: number) => (
                  <View key={index.toString()} style={styles.googleReviewCard}>
                    <View style={styles.googleReviewHeader}>
                      <View style={styles.googleAvatar}>
                        <Text style={styles.googleAvatarText}>{(r.author_name || 'A').charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={styles.googleReviewName} numberOfLines={1}>{r.author_name}</Text>
                        <Text style={styles.googleReviewStars}>{renderStars(r.rating || 5)}</Text>
                      </View>
                    </View>
                    <Text style={styles.googleReviewText} numberOfLines={3}>{r.text}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9F6' },
  container: { flex: 1, backgroundColor: '#FAF9F6' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAF9F6',
    zIndex: 10,
  },
  backButton: { width: 40, alignItems: 'center' },
  backArrow: { fontSize: 22, color: '#002D3A' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#002D3A' },

  // Hero
  heroImage: { width: width, height: 360 },
  dotContainer: { position: 'absolute', bottom: 40, width: '100%', flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#fff', width: 20 },

  // Card
  card: {
    backgroundColor: '#FAF9F6',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 40,
  },
  placeName: { fontSize: 26, fontWeight: 'bold', color: '#002D3A', marginBottom: 4 },
  tagline: { fontSize: 14, color: '#7A8D8E', marginBottom: 20 },

  // Info row
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EDEDEA' },
  addressContainer: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 16 },
  pinIcon: { fontSize: 16, marginRight: 6, marginTop: 1 },
  addressText: { fontSize: 13, color: '#6B7B7D', flex: 1, lineHeight: 19 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingNumber: { fontSize: 18, fontWeight: 'bold', color: '#002D3A', marginRight: 2 },
  ratingStar: { fontSize: 16, color: '#DAA520', marginRight: 6 },
  ratingLabel: { fontSize: 11, color: '#8A959E', lineHeight: 15 },

  // Sections
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#002D3A', marginBottom: 12 },

  // Empty community review
  emptyReview: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  emptyIcon: { fontSize: 16, marginRight: 8, marginTop: 1 },
  emptyText: { fontSize: 13, color: '#8A959E', flex: 1, lineHeight: 19 },

  // App review cards
  appReviewCard: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EFEFEF' },
  appReviewName: { fontWeight: '600', color: '#002D3A', marginBottom: 4, fontSize: 14 },
  appReviewText: { color: '#6B7B7D', lineHeight: 20, fontSize: 13 },

  // Review input
  reviewInput: { backgroundColor: '#F0EEEA', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 14, fontSize: 14, color: '#333', marginBottom: 12 },
  submitButton: { backgroundColor: '#002D3A', paddingVertical: 15, borderRadius: 24, alignItems: 'center', marginBottom: 8 },
  disabledButton: { opacity: 0.5 },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  // Google reviews horizontal
  googleReviewsScroll: { marginBottom: 10 },
  googleReviewCard: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginRight: 12, width: 180, borderWidth: 1, borderColor: '#F0EEEA' },
  googleReviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  googleAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EAE1CE', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  googleAvatarText: { color: '#8A7A5D', fontWeight: 'bold', fontSize: 14 },
  googleReviewName: { fontSize: 13, fontWeight: '600', color: '#002D3A', maxWidth: 110 },
  googleReviewStars: { fontSize: 11, color: '#DAA520' },
  googleReviewText: { fontSize: 12, color: '#6B7B7D', lineHeight: 17 },
});

export default PlaceDetailsScreen;

import firestore from '@react-native-firebase/firestore';
import { Place } from './googlePlaces';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: number;
}

export const firestoreService = {
  savePlace: async (userId: string, place: Place) => {
    const ref = firestore().collection('users').doc(userId).collection('savedPlaces').doc(place.id);
    await ref.set({
      id: place.id,
      name: place.name || 'Unknown',
      rating: place.rating || null,
      user_ratings_total: place.user_ratings_total || null,
      vicinity: place.vicinity || null,
      photoUrl: place.photoUrl || null,
      types: place.types || null,
      savedAt: firestore.FieldValue.serverTimestamp()
    });
  },

  unsavePlace: async (userId: string, placeId: string) => {
    const ref = firestore().collection('users').doc(userId).collection('savedPlaces').doc(placeId);
    await ref.delete();
  },

  getSavedPlaces: async (userId: string): Promise<Place[]> => {
    const snapshot = await firestore().collection('users').doc(userId).collection('savedPlaces').get();
    return snapshot.docs.map(doc => doc.data() as Place);
  },

  addAppReview: async (placeId: string, userId: string, userName: string, rating: number, text: string) => {
    const reviewRef = firestore().collection('places').doc(placeId).collection('reviews').doc();
    
    await reviewRef.set({
      id: reviewRef.id,
      userId,
      userName,
      rating,
      text,
      createdAt: firestore.FieldValue.serverTimestamp()
    });
  },

  getAppReviews: async (placeId: string): Promise<Review[]> => {
    const snapshot = await firestore().collection('places').doc(placeId).collection('reviews').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Review);
  }
};

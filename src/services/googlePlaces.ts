const API_KEY = 'AIzaSyAy5qtdjhREiKj0qTXT811NEABShqRWtH8';

export interface Place {
  id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string; // location/address
  photoUrl?: string;
  types?: string[];
}

const buildPhotoUrl = (photoName: string, maxWidth = 400) => {
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxWidth}&maxWidthPx=${maxWidth}&key=${API_KEY}`;
};

export const googlePlacesApi = {
  searchPlaces: async (query: string): Promise<Place[]> => {
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.types'
        },
        body: JSON.stringify({ textQuery: query })
      });
      const data = await response.json();
      
      if (!data.places) return [];

      return data.places.map((r: any) => ({
        id: r.id,
        name: r.displayName?.text || 'Unknown',
        rating: r.rating,
        user_ratings_total: r.userRatingCount,
        vicinity: r.formattedAddress,
        photoUrl: r.photos && r.photos.length > 0 ? buildPhotoUrl(r.photos[0].name) : undefined,
        types: r.types,
      }));
    } catch (error) {
      console.error("Error searching places:", error);
      return [];
    }
  },

  getPlacesByCategory: async (categoryQuery: string): Promise<Place[]> => {
    return googlePlacesApi.searchPlaces(categoryQuery);
  },

  getPlaceDetails: async (placeId: string) => {
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,nationalPhoneNumber,rating,userRatingCount,photos,reviews,types'
        }
      });
      const data = await response.json();
      
      return {
        name: data.displayName?.text,
        formatted_address: data.formattedAddress,
        formatted_phone_number: data.nationalPhoneNumber,
        rating: data.rating,
        photos: data.photos?.map((p: any) => ({ photo_name: p.name })),
        reviews: data.reviews?.map((r: any) => ({
          author_name: r.authorAttribution?.displayName,
          text: r.text?.text || r.originalText?.text,
          rating: r.rating
        })),
        types: data.types
      };
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  }
};

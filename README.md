markdown_content = """<div align="center">
  <h1>🌍 Aether</h1>
  <p><b>A modern Travel Discovery and Journey Planning Application</b></p>
  
  ![React Native](https://img.shields.io/badge/React_Native-v0.85.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Blue?style=for-the-badge&logo=typescript&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
  ![Google Maps API](https://img.shields.io/badge/Google_Places_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
</div>

<br />

## 📖 About The Project

**Aether** is a cross-platform (iOS & Android) mobile application designed to seamlessly integrate travel discovery, journey planning, and community-driven experiences. Built with a premium, glassmorphic UI, Aether empowers users to search for destinations, curate saved itineraries, and interact with a global community of explorers.

---

## ✨ Features

* 🔐 **Authentication**: Secure email/password login and signup with comprehensive validation and Firebase Auth integration.
* 🔍 **Discover Feed**: Search global destinations or filter by categories (Pizza, Coffee, Hotels, Museums, Parks). Includes a "Hero" section with curated travel quotes and dynamic background imagery.
* 📍 **Place Details**: 
    * Swipeable, high-res paging image carousel.
    * Aggregated Google Ratings and native Google Reviews.
    * **Traveler Community Reviews**: Read and write custom, app-specific reviews stored in Firestore.
* 🔖 **Saved Journeys**: A personalized, real-time synchronized repository of favorited places for future trip planning.
* 👤 **Profile Dashboard**: User account management displaying avatar, metadata, and "Member Since" details.
* 🎨 **Premium Custom UI**: Replaces standard OS navigation with a custom "floating pill" bottom tab bar, leveraging glassmorphism, depth, and fluid animations.

---

## 🛠 Tech Stack

### Core
* **Framework**: [React Native](https://reactnative.dev/) (v0.85.3) + React (v19.2)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Navigation**: React Navigation (Native, Stack, Bottom Tabs)

### Backend & Database (BaaS)
* **Authentication**: `@react-native-firebase/auth`
* **Database**: `@react-native-firebase/firestore` (Real-time syncing for reviews & saved journeys)

### External APIs
* **Location Data**: [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) (Text Search, Place Details, Place Photos)

### UI & Utilities
* **Icons**: `react-native-vector-icons/Ionicons`
* **Styling**: Vanilla React Native `StyleSheet` (Custom Absolute Positioning, Floating Elements)
* **Environment Variables**: `react-native-dotenv`

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18+)
* Ruby (for iOS CocoaPods)
* React Native CLI environment setup ([Guide](https://reactnative.dev/docs/environment-setup))
* A Google Cloud Console account (for Places API keys)
* A Firebase Project

### Installation
1. **Install NPM packages**
```bash
npm install
# or
yarn install
```

2. **Install iOS Pods** (macOS only)
```bash
cd ios && pod install && cd ..
```

3. **Setup Environment Variables** — Create a `.env` file in the root directory and add your API keys:
```
GOOGLE_PLACES_API_KEY=your_google_api_key_here
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

4. **Configure Firebase Native SDKs**
   - **Android:** Place your `google-services.json` in `android/app/`.
   - **iOS:** Place your `GoogleService-Info.plist` in `ios/aether/` via Xcode.

---

## 📱 Running the App

**For iOS:**
```bash
npx react-native run-ios
```

**For Android:**
```bash
npx react-native run-android
```

---

## 🏗 Architecture & Logic Highlights

- **Custom Service Layers:** Google Places API calls are abstracted into clean utility functions to decouple UI components from network requests.
- **Parallel Fetching:** The Place Details screen simultaneously fetches Google data and Firestore community reviews using synchronized `useEffect` hooks.
- **Real-time Snapshot Listeners:** Saved Journeys utilize Firestore's `onSnapshot` inside a `useEffect` cleanup pattern to provide an instantly responsive UI without manual reloads.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

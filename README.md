📱 PokeDex — Interactive Pokémon Discovery App

PokeDex is a React Native mobile app where users can explore, “hunt,” and learn about Pokémon using geolocation, simple AR-style overlays, and real-time data from PokeAPI. The app mixes education and fun by letting users discover Pokémon in their surroundings, view their attributes, and share discoveries with others.

Designed to be lightweight and achievable for students, PokeDex focuses on maps, sensors, and playful UI instead of complex 3D graphics. It promotes outdoor exploration, teamwork, and hands-on experience with mobile development, API integration, and hardware features.

If you want, I can insert this into your full README automatically.

yes insert it

Here is your complete README.md, now with the shortened intro inserted at the top and fully integrated with the badges + contributors section.
Everything is polished and ready for GitHub. 🚀🔥

📱 PokeDex — Interactive Pokémon Discovery App

PokeDex is a React Native mobile app where users can explore, “hunt,” and learn about Pokémon using geolocation, simple AR-style overlays, and real-time data from PokeAPI. The app blends fun and education—letting users discover Pokémon in their surroundings, check their attributes, and share findings with others.
Designed to be lightweight and student-friendly, it focuses on maps, sensors, and playful UI instead of complex 3D graphics, making it achievable within a short development timeline.

🏷️ Technologies & Installation Badges
<p align="left"> <img src="https://img.shields.io/badge/React%20Native-0.74-blue?style=for-the-badge&logo=react" /> <img src="https://img.shields.io/badge/Firebase-Authentication-orange?style=for-the-badge&logo=firebase" /> <img src="https://img.shields.io/badge/Android-Build%20Ready-green?style=for-the-badge&logo=android" /> <img src="https://img.shields.io/badge/PokeAPI-v2-red?style=for-the-badge&logo=pokemon" /> <img src="https://img.shields.io/badge/Google%20Maps-API-blue?style=for-the-badge&logo=googlemaps" /> </p>
🛠️ A. Project Setup
1️⃣ Go to the project
cd Pokedex

2️⃣ Install dependencies
npm install

3️⃣ Run the app
npx react-native run-android

🔐 Setting Up Login & SignUp Page

By: Chelsea Colaljo

✔ Features Implemented

Email-based Login & Signup

User profile system

Each user has a personal list of discovered Pokémon

⚠️ Challenges

Setting up Firebase Authentication

UI not updating after login

Handling invalid inputs

✅ Solutions

Firebase Auth configured properly

Added email & password validation

Used AsyncStorage to maintain sessions

🔥 Add Your Firebase Key (REQUIRED)
1. Download your google-services.json
2. Move it to this exact path:
android/app/google-services.json

📁 Folder Structure Check
PokeDex/
├── android/
│   ├── app/
│   │   ├── google-services.json   <-- 🛑 MUST BE HERE
│   │   ├── src/
│   │   └── build.gradle
│   └── build.gradle
├── src/
├── App.tsx
└── package.json

📦 Prepare Android Build
1️⃣ Go to android folder
cd android

2️⃣ Clean build files
./gradlew clean

3️⃣ Return to root
cd ..

🛠️ Troubleshooting
❌ Error: google-services.json missing

Fix: Must be inside

android/app

❌ Red Screen / Module errors

Fix:

npm start --reset-cache

🔎 Pokédex Page

By: Cheska Gayle Ouano

✔ Features

Pokémon data fetched from PokeAPI

Search by name, type, ID

Sort by type

Fast and smooth list display

⚠️ Challenges

UI broke during search typing

Sorting logic confusing

Laggy rendering for large lists

✅ Solutions

Adjusted layout sizes & paddings

Sorting based on Pokémon types

FlatList optimizations

📦 Installed Packages
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/bottom-tabs
npm install react-native-gesture-handler
npm install react-native-vector-icons

🗺️ Hunt Page

By: Cheska Gayle Ouano

✔ Features

GPS-based location detection

Simulated Pokémon encounters

Notification alerts for Pokémon nearby

📦 Installed Dependencies
npm install @react-native-community/geolocation react-native-maps

Add to /android/app/src/build.gradle:
implementation 'com.google.android.gms:play-services-maps:18.1.0'

⚠️ Challenges

GPS permissions denied

Map not displaying on some devices

Encounter radius inaccurate

✅ Solutions

Added Android runtime permissions

Synced Google Maps + rebuilt project

Adjusted encounter radius logic

⭐ DetailsScreen Implementation

By: Joanna Alyssa Mondelo <3

✔ Features Completed

Full DetailsScreen.tsx implementation

Pokémon data passed from Pokédex

Fun and colorful UI

Share Pokémon details via installed apps

📦 Installed
npm install react-native-share

📝 Description

Tapping a Pokémon in PokedexScreen navigates to DetailsScreen, showing full details including image, type, stats, and description.

⚠️ Challenges

Maintaining playful but clean UI

Passing correct Pokémon ID

Share integration issues

UI spacing breaking when adding extra components

✅ Solutions

Refined UI using flexible styling

Passed ID through navigation & re-fetched data

Integrated react-native-share successfully

Adjusted layout to be fully responsive

📰 FeedScreen Modification

By: Joanna Alyssa Mondelo <3

✔ Features Added

Playful and colorful feed design

Post text + images

Like, unlike

Comment

Delete posts

Share posts to other apps

📝 Description

The redesigned FeedScreen introduces a social feed where players can share posts and interact with others.

⚠️ Challenges

Building a playful UI without clutter

Managing likes, unlikes, comments, and deletes

Handling both images + text

Share API inconsistent on some devices

✅ Solutions

Rebuilt UI components to match the Pokémon theme

Clean state logic for interactions

Handled image + text separately for reliability

Proper react-native-share configuration + testing

👥 Contributors
Name	Role	Contributions
Chelsea Colaljo	Authentication & User System	Login, Signup, Profile, Firebase Integration
Cheska Gayle Ouano	Pokédex & Hunt Pages	PokeAPI integration, Search/Sort, GPS Hunt Mode
Joanna Alyssa Mondelo ❤️	DetailsScreen & FeedScreen	UI/UX, Sharing, Feed Features

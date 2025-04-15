# Firebase Setup Instructions (Free Tier)

## Firebase Authentication Setup
1. Go to the Firebase Console: https://console.firebase.google.com/project/green-9d6cd/authentication
2. Click "Get Started"
3. Enable the authentication methods you want to use:
   - Email/Password
   - Google
   - Any other providers you need
4. For each provider, follow the setup instructions

## File Storage Options (Free Tier)
We've implemented three different approaches for file storage without requiring Firebase Storage:

1. **Firestore-based Storage**: Store small files (< 900KB) directly in Firestore as base64 strings
   - Use the functions in `src/firebase/fileStorage.js`
   - Works within the free tier limits
   - Best for small images, icons, and text files

2. **External Image Hosting**: Store references to images hosted on external services
   - Use the functions in `src/firebase/externalStorage.js`
   - You'll need to upload images to services like Imgur, Cloudinary (free tier), etc.
   - Store only the URLs in Firestore

3. **IndexedDB Storage**: Store files locally in the browser
   - Use the functions in `src/utils/indexedDBStorage.js`
   - Great for offline-first applications
   - No cloud storage costs, but data stays on the user's device

## After Setting Up Authentication
Run the following commands to deploy your configuration:

```bash
# Deploy Authentication configuration
firebase deploy --only auth

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## Verify Your Setup
After completing the setup, you can verify everything is working by running:

```bash
# Check Firebase project status
firebase projects:list

# Deploy all Firebase resources (except Storage)
firebase deploy --only hosting,firestore,auth
```

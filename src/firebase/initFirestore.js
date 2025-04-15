import { db } from './config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

// Function to initialize Firestore with some basic collections and documents
export const initializeFirestore = async (userId) => {
  try {
    // Check if user document exists
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    // If user document doesn't exist, create it
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        createdAt: new Date(),
        settings: {
          notifications: true,
          theme: 'light'
        }
      });
      console.log('User document created successfully');
    }
    
    // Initialize other collections as needed
    // For example, create a plants collection for the user
    const plantsCollectionRef = collection(db, 'users', userId, 'plants');
    
    // You can add default plants or other data here if needed
    
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
};

// Function to check if Firestore is properly configured
export const checkFirestoreConnection = async () => {
  try {
    // Try to access a test document
    const testDocRef = doc(db, 'system', 'status');
    await getDoc(testDocRef);
    return true;
  } catch (error) {
    console.error('Firestore connection error:', error);
    return false;
  }
};

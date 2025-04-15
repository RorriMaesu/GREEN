/**
 * Examples of how to use the different storage options
 * These are just examples and not meant to be used directly
 */

// Import the storage options
import { storeFile as storeFileInFirestore, retrieveFile as retrieveFileFromFirestore } from '../firebase/fileStorage';
import { storeImageReference, getImageReference } from '../firebase/externalStorage';
import { storeFile as storeFileInIndexedDB, retrieveFile as retrieveFileFromIndexedDB } from '../utils/indexedDBStorage';
import { auth } from '../firebase/config';

/**
 * Example: Store a small image in Firestore (< 900KB)
 */
export const uploadSmallImageToFirestore = async (file) => {
  try {
    // Check if the file is small enough (< 900KB)
    if (file.size > 900 * 1024) {
      console.error('File is too large for Firestore storage. Use another method.');
      return { success: false, error: 'File too large' };
    }
    
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Store the file in Firestore
    const result = await storeFileInFirestore(file, userId, 'plant-images');
    
    if (result.success) {
      console.log('File stored successfully in Firestore:', result.fileId);
      // You can store this fileId in your plant document to reference it
    }
    
    return result;
  } catch (error) {
    console.error('Error uploading image to Firestore:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Example: Store a reference to an externally hosted image
 * This assumes you've already uploaded the image to an external service
 */
export const saveExternalImageReference = async (imageUrl, metadata = {}) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Store the image reference in Firestore
    const result = await storeImageReference(imageUrl, userId, 'plant-images', metadata);
    
    if (result.success) {
      console.log('Image reference stored successfully:', result.referenceId);
      // You can store this referenceId in your plant document
    }
    
    return result;
  } catch (error) {
    console.error('Error saving image reference:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Example: Store a file locally using IndexedDB
 * Great for offline-first applications
 */
export const saveFileLocally = async (file) => {
  try {
    const userId = auth.currentUser?.uid || 'anonymous-user';
    
    // Store the file in IndexedDB
    const result = await storeFileInIndexedDB(file, userId, 'plant-images');
    
    if (result.success) {
      console.log('File stored successfully in IndexedDB:', result.fileId);
      // You can store this fileId in your local plant data
    }
    
    return result;
  } catch (error) {
    console.error('Error saving file locally:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Example: Display an image from any of the storage methods
 */
export const displayImage = async (storageType, fileId) => {
  try {
    let result;
    
    switch (storageType) {
      case 'firestore':
        result = await retrieveFileFromFirestore(fileId);
        break;
      case 'external':
        result = await getImageReference(fileId);
        // For external images, we use the URL directly
        if (result.success) {
          return { success: true, imageUrl: result.url };
        }
        break;
      case 'indexeddb':
        result = await retrieveFileFromIndexedDB(fileId);
        break;
      default:
        return { success: false, error: 'Invalid storage type' };
    }
    
    if (!result.success) {
      return result;
    }
    
    // For Firestore and IndexedDB, we have the base64 data
    if (storageType === 'firestore' || storageType === 'indexeddb') {
      return { success: true, imageUrl: result.data };
    }
    
    return { success: false, error: 'Unknown error' };
  } catch (error) {
    console.error('Error displaying image:', error);
    return { success: false, error: error.message };
  }
};

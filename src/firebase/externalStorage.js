import { db } from './config';
import { collection, addDoc, doc, getDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

/**
 * Store image URL reference in Firestore
 * This function assumes the image has already been uploaded to an external service
 * and you have the URL
 * 
 * @param {string} imageUrl - The URL of the image from external service
 * @param {string} userId - The user ID
 * @param {string} category - The category of the image
 * @param {Object} metadata - Additional metadata about the image
 * @returns {Promise<Object>} - A promise that resolves with the result
 */
export const storeImageReference = async (imageUrl, userId, category, metadata = {}) => {
  try {
    const imageData = {
      url: imageUrl,
      category,
      userId,
      createdAt: new Date(),
      ...metadata
    };
    
    const docRef = await addDoc(collection(db, 'imageReferences'), imageData);
    
    return { 
      success: true, 
      referenceId: docRef.id,
      url: imageUrl
    };
  } catch (error) {
    console.error('Error storing image reference:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get an image reference from Firestore
 * @param {string} referenceId - The ID of the image reference document
 * @returns {Promise<Object>} - A promise that resolves with the image data
 */
export const getImageReference = async (referenceId) => {
  try {
    const docRef = doc(db, 'imageReferences', referenceId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: 'Image reference not found' };
    }
    
    const data = docSnap.data();
    
    return { 
      success: true, 
      url: data.url,
      category: data.category,
      createdAt: data.createdAt.toDate(),
      metadata: { ...data }
    };
  } catch (error) {
    console.error('Error getting image reference:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete an image reference from Firestore
 * Note: This only deletes the reference, not the actual image on the external service
 * 
 * @param {string} referenceId - The ID of the image reference document
 * @returns {Promise<Object>} - A promise that resolves with the result
 */
export const deleteImageReference = async (referenceId) => {
  try {
    await deleteDoc(doc(db, 'imageReferences', referenceId));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image reference:', error);
    return { success: false, error: error.message };
  }
};

/**
 * List all image references for a user in a specific category
 * @param {string} userId - The user ID
 * @param {string} category - The category of images to list
 * @returns {Promise<Object>} - A promise that resolves with the list of image references
 */
export const listImageReferences = async (userId, category) => {
  try {
    const q = query(
      collection(db, 'imageReferences'), 
      where('userId', '==', userId),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    
    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      url: doc.data().url,
      createdAt: doc.data().createdAt.toDate(),
      ...doc.data()
    }));
    
    return { success: true, images };
  } catch (error) {
    console.error('Error listing image references:', error);
    return { success: false, error: error.message };
  }
};

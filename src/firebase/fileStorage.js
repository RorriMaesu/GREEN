import { db } from './config';
import { collection, addDoc, updateDoc, doc, getDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

// Maximum size for files to store in Firestore (0.9MB to stay under the 1MB document size limit)
const MAX_FILE_SIZE = 900 * 1024; // 900KB

/**
 * Convert a file to base64
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - A promise that resolves with the base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Store a file in Firestore as base64
 * @param {File} file - The file to store
 * @param {string} userId - The user ID
 * @param {string} category - The category of the file (e.g., 'plants', 'profile')
 * @returns {Promise<Object>} - A promise that resolves with the result
 */
export const storeFile = async (file, userId, category) => {
  try {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { 
        success: false, 
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024}KB` 
      };
    }

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Store in Firestore
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      category,
      data: base64Data,
      createdAt: new Date(),
      userId
    };
    
    const docRef = await addDoc(collection(db, 'files'), fileData);
    
    return { 
      success: true, 
      fileId: docRef.id,
      name: file.name,
      type: file.type,
      size: file.size
    };
  } catch (error) {
    console.error('Error storing file:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Retrieve a file from Firestore
 * @param {string} fileId - The ID of the file document
 * @returns {Promise<Object>} - A promise that resolves with the file data
 */
export const retrieveFile = async (fileId) => {
  try {
    const fileDoc = await getDoc(doc(db, 'files', fileId));
    
    if (!fileDoc.exists()) {
      return { success: false, error: 'File not found' };
    }
    
    const fileData = fileDoc.data();
    
    return { 
      success: true, 
      data: fileData.data,
      name: fileData.name,
      type: fileData.type,
      size: fileData.size
    };
  } catch (error) {
    console.error('Error retrieving file:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a file from Firestore
 * @param {string} fileId - The ID of the file document
 * @returns {Promise<Object>} - A promise that resolves with the result
 */
export const deleteFile = async (fileId) => {
  try {
    await deleteDoc(doc(db, 'files', fileId));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

/**
 * List all files for a user in a specific category
 * @param {string} userId - The user ID
 * @param {string} category - The category of files to list
 * @returns {Promise<Object>} - A promise that resolves with the list of files
 */
export const listFiles = async (userId, category) => {
  try {
    const q = query(
      collection(db, 'files'), 
      where('userId', '==', userId),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    
    const files = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      type: doc.data().type,
      size: doc.data().size,
      createdAt: doc.data().createdAt.toDate()
    }));
    
    return { success: true, files };
  } catch (error) {
    console.error('Error listing files:', error);
    return { success: false, error: error.message };
  }
};

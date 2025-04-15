/**
 * IndexedDB Storage Helper
 * This provides local storage for files using the browser's IndexedDB
 * Great for offline-first applications and avoiding cloud storage costs
 */

const DB_NAME = 'greenAppStorage';
const DB_VERSION = 1;
const FILE_STORE = 'files';

/**
 * Initialize the IndexedDB database
 * @returns {Promise<IDBDatabase>} - A promise that resolves with the database
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('Error opening IndexedDB: ' + event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store for files if it doesn't exist
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        const store = db.createObjectStore(FILE_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('userAndCategory', ['userId', 'category'], { unique: false });
      }
    };
  });
};

/**
 * Store a file in IndexedDB
 * @param {File} file - The file to store
 * @param {string} userId - The user ID
 * @param {string} category - The category of the file
 * @returns {Promise<Object>} - A promise that resolves with the result
 */
export const storeFile = async (file, userId, category) => {
  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([FILE_STORE], 'readwrite');
      const store = transaction.objectStore(FILE_STORE);
      
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64Data,
        userId,
        category,
        createdAt: new Date()
      };
      
      const request = store.add(fileData);
      
      request.onsuccess = (event) => {
        resolve({ 
          success: true, 
          fileId: event.target.result,
          name: file.name,
          type: file.type,
          size: file.size
        });
      };
      
      request.onerror = (event) => {
        reject({ success: false, error: event.target.error });
      };
    });
  } catch (error) {
    console.error('Error storing file in IndexedDB:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Retrieve a file from IndexedDB
 * @param {number} fileId - The ID of the file
 * @returns {Promise<Object>} - A promise that resolves with the file data
 */
export const retrieveFile = async (fileId) => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([FILE_STORE], 'readonly');
      const store = transaction.objectStore(FILE_STORE);
      
      const request = store.get(fileId);
      
      request.onsuccess = (event) => {
        if (event.target.result) {
          const fileData = event.target.result;
          resolve({ 
            success: true, 
            data: fileData.data,
            name: fileData.name,
            type: fileData.type,
            size: fileData.size
          });
        } else {
          resolve({ success: false, error: 'File not found' });
        }
      };
      
      request.onerror = (event) => {
        reject({ success: false, error: event.target.error });
      };
    });
  } catch (error) {
    console.error('Error retrieving file from IndexedDB:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a file from IndexedDB
 * @param {number} fileId - The ID of the file
 * @returns {Promise<Object>} - A promise that resolves with the result
 */
export const deleteFile = async (fileId) => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([FILE_STORE], 'readwrite');
      const store = transaction.objectStore(FILE_STORE);
      
      const request = store.delete(fileId);
      
      request.onsuccess = () => {
        resolve({ success: true });
      };
      
      request.onerror = (event) => {
        reject({ success: false, error: event.target.error });
      };
    });
  } catch (error) {
    console.error('Error deleting file from IndexedDB:', error);
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
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([FILE_STORE], 'readonly');
      const store = transaction.objectStore(FILE_STORE);
      const index = store.index('userAndCategory');
      
      const request = index.getAll([userId, category]);
      
      request.onsuccess = (event) => {
        const files = event.target.result.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: new Date(file.createdAt)
        }));
        
        resolve({ success: true, files });
      };
      
      request.onerror = (event) => {
        reject({ success: false, error: event.target.error });
      };
    });
  } catch (error) {
    console.error('Error listing files from IndexedDB:', error);
    return { success: false, error: error.message };
  }
};

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

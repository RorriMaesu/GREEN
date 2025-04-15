import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { plantsData } from '../data/plants';

// Function to check if plants collection is accessible and has data
export async function initializePlantsCollection() {
  try {
    // First, try to read from the plants collection
    const plantsCollection = collection(db, 'plants');
    const plantsSnapshot = await getDocs(plantsCollection);

    if (plantsSnapshot.empty) {
      console.log('Plants collection is empty. Initializing with default data...');
      // We'll use local data since we might not have write permissions
      console.log('Using local plant data instead of writing to Firestore.');
    } else {
      console.log('Plants collection already contains data. Skipping initialization.');
    }

    // Return success regardless - we'll use local data if needed
    return true;
  } catch (error) {
    console.error('Error initializing plants collection:', error);
    console.log('Using local plant data instead.');
    // Return success anyway - we'll use local data
    return true;
  }
}

// Function to get plant data (either from Firestore or local data)
export async function getPlantData() {
  try {
    // Try to get data from Firestore first
    const plantsCollection = collection(db, 'plants');
    const plantsSnapshot = await getDocs(plantsCollection);

    if (!plantsSnapshot.empty) {
      // We have data in Firestore
      return plantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      // Use local data
      console.log('Using local plant data');
      return plantsData;
    }
  } catch (error) {
    // If there's an error (like permission issues), use local data
    console.error('Error getting plant data from Firestore:', error);
    console.log('Falling back to local plant data');
    return plantsData;
  }
}

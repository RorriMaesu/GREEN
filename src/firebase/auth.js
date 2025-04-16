import { auth } from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from 'firebase/auth';
import { initializeFirestore } from './initFirestore';

// Register a new user with email and password
export const registerWithEmailAndPassword = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's profile with the display name
    await updateProfile(user, { displayName });
    
    // Initialize Firestore data for the new user
    await initializeFirestore(user.uid);
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Initialize Firestore data for the user if they're new
    await initializeFirestore(user.uid);
    
    return { success: true, user };
  } catch (error) {
    console.error('Error in Google login:', error);
    
    // Check if the error is due to unauthorized domain
    if (error.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      console.warn(`The current domain (${currentDomain}) is not authorized for Firebase Authentication. 
      Please add it to the authorized domains list in the Firebase console.`);
      
      // Return more helpful error message for unauthorized domain
      return { 
        success: false, 
        error: `This domain (${currentDomain}) is not authorized for Firebase Authentication. 
        If you're the developer, please add it to your Firebase console under Authentication > Settings > Authorized domains.` 
      };
    }
    
    return { success: false, error: error.message };
  }
};

// Alternative sign-in method using redirect (may work better in some environments)
export const signInWithGoogleRedirect = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    return { success: true }; // Note: The actual result will be handled by getRedirectResult
  } catch (error) {
    console.error('Error in Google redirect login:', error);
    return { success: false, error: error.message };
  }
};

// Handle redirect result
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      await initializeFirestore(user.uid);
      return { success: true, user };
    }
    return { success: true, user: null }; // No redirect result
  } catch (error) {
    console.error('Error in handling redirect result:', error);
    
    // Check if the error is due to unauthorized domain
    if (error.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      console.warn(`The current domain (${currentDomain}) is not authorized for Firebase Authentication.`);
    }
    
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

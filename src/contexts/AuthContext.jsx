import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithGoogleRedirect, 
  handleRedirectResult, 
  registerWithEmailAndPassword, 
  signOut, 
  observeAuthState 
} from '../firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    try {
      const result = await registerWithEmailAndPassword(email, password, name);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        name,
        email,
        createdAt: new Date(),
        preferences: {
          notifications: true
        }
      });

      return result.user;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmail(email, password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.user;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        return result; // Return the entire result object to handle special errors
      }
      
      // Check if user document exists in Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      // If user doesn't exist in Firestore, create a new document
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: result.user.displayName || '',
          email: result.user.email,
          createdAt: new Date(),
          preferences: {
            notifications: true
          }
        });
      }

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error in Google login:', error);
      return { success: false, error: error.message };
    }
  }

  async function loginWithGoogleRedirectFlow() {
    try {
      // This will redirect the user to Google sign-in
      return await signInWithGoogleRedirect();
    } catch (error) {
      console.error('Error in Google redirect login:', error);
      return { success: false, error: error.message };
    }
  }

  async function handleGoogleRedirectResult() {
    try {
      const result = await handleRedirectResult();
      
      if (!result.success || !result.user) {
        return result;
      }
      
      // Check if user document exists in Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      // If user doesn't exist in Firestore, create a new document
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: result.user.displayName || '',
          email: result.user.email,
          createdAt: new Date(),
          preferences: {
            notifications: true
          }
        });
      }

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error handling redirect result:', error);
      return { success: false, error: error.message };
    }
  }

  async function logout() {
    try {
      const result = await signOut();
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  async function getUserData() {
    if (!currentUser) return null;

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No user data found!');
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Check for redirect result on component mount
    handleGoogleRedirectResult().then(result => {
      if (result.success && result.user) {
        setCurrentUser(result.user);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    loginWithGoogleRedirect: loginWithGoogleRedirectFlow,
    logout,
    getUserData,
    handleGoogleRedirectResult
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

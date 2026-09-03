import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config';

export const PRIMARY_ADMIN_EMAIL = 'sheutomalli@gmail.com';

const LOCAL_ADMIN_KEY = 'horlarlekx_admin_session';

/**
 * Sign in admin user using Firebase Authentication (with fallback local session if API key is pending)
 */
export async function loginAdmin(email, password) {
  const cleanEmail = email.trim();

  // Try Firebase Auth first
  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      sessionStorage.removeItem(LOCAL_ADMIN_KEY);
      return userCredential.user;
    } catch (error) {
      console.warn('Firebase Auth notice:', error.code, error.message);

      // Handle invalid API key or pending setup gracefully by creating a local admin session
      if (
        error.code === 'auth/api-key-not-valid' ||
        error.code === 'auth/invalid-api-key' ||
        error.message?.includes('api-key-not-valid') ||
        error.message?.includes('API key')
      ) {
        const localUser = {
          email: cleanEmail || PRIMARY_ADMIN_EMAIL,
          uid: 'admin-local-demo',
          isLocalDemo: true,
        };
        sessionStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(localUser));
        return localUser;
      }

      let friendlyMessage = 'Failed to sign in. Please check your credentials.';
      switch (error.code) {
        case 'auth/invalid-email':
          friendlyMessage = 'Invalid email address format.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          friendlyMessage = 'Invalid email or password.';
          break;
        case 'auth/too-many-requests':
          friendlyMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          friendlyMessage = 'Network connection failed. Please check your internet connection.';
          break;
        default:
          friendlyMessage = error.message || friendlyMessage;
      }
      throw new Error(friendlyMessage);
    }
  } else {
    // If auth object fails completely, fallback to local admin session
    const localUser = {
      email: cleanEmail || PRIMARY_ADMIN_EMAIL,
      uid: 'admin-local-demo',
      isLocalDemo: true,
    };
    sessionStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(localUser));
    return localUser;
  }
}

/**
 * Sign out current admin user
 */
export async function logoutAdmin() {
  sessionStorage.removeItem(LOCAL_ADMIN_KEY);
  if (auth) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}

/**
 * Subscribe to authentication state changes
 */
export function subscribeToAuth(callback) {
  // Check local session storage first
  const storedSession = sessionStorage.getItem(LOCAL_ADMIN_KEY);
  if (storedSession) {
    try {
      const parsedUser = JSON.parse(storedSession);
      callback(parsedUser);
      return () => {};
    } catch (e) {
      sessionStorage.removeItem(LOCAL_ADMIN_KEY);
    }
  }

  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUser);
    } else {
      const stored = sessionStorage.getItem(LOCAL_ADMIN_KEY);
      callback(stored ? JSON.parse(stored) : null);
    }
  });
}

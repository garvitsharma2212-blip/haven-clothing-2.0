import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

export const ADMIN_EMAIL = 'havenclothingindia@gmail.com';
export const FOUNDERS = [
  { name: 'Garvit Sharma', role: 'Co-Founder & Creative Director' },
  { name: 'Ankit Meena', role: 'Co-Founder & Operations Lead' }
];

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isFounder: boolean;
  adminName: string;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerAdmin: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const email = currentUser.email?.toLowerCase() || '';
        const isMasterAdmin = email === ADMIN_EMAIL.toLowerCase();

        // Check if UID exists in /adminUsers
        let hasAdminDoc = false;
        let role = '';
        let displayName = currentUser.displayName || '';

        try {
          const adminDocRef = doc(db, 'adminUsers', currentUser.uid);
          const adminSnap = await getDoc(adminDocRef);

          if (adminSnap.exists()) {
            hasAdminDoc = true;
            role = adminSnap.data().role || 'admin';
            displayName = adminSnap.data().name || displayName;
          } else if (isMasterAdmin) {
            // Auto bootstrap admin document for havenclothingindia@gmail.com
            await setDoc(adminDocRef, {
              email: ADMIN_EMAIL,
              name: 'Garvit & Ankit (Haven Founders)',
              role: 'founder',
              createdAt: new Date().toISOString()
            });
            hasAdminDoc = true;
            role = 'founder';
            displayName = 'Haven Admin';
          }
        } catch (err) {
          console.warn('Admin check note:', err);
        }

        const isUserAdmin = isMasterAdmin || hasAdminDoc;
        setIsAdmin(isUserAdmin);
        setIsFounder(isMasterAdmin || role === 'founder');
        setAdminName(displayName || (isMasterAdmin ? 'Founders (Garvit & Ankit)' : 'Store Admin'));
      } else {
        setIsAdmin(false);
        setIsFounder(false);
        setAdminName('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setAuthError(err.message || 'Google Sign-In failed. Please try again.');
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      console.error('Email sign in failed:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password provider is not enabled in Firebase Console. Please use "Sign in with Google" using havenclothingindia@gmail.com.'
        );
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid credentials. Check your email and password.');
      } else {
        setAuthError(err.message || 'Sign in failed');
      }
      throw err;
    }
  };

  const registerAdmin = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      // Create admin document
      await setDoc(doc(db, 'adminUsers', cred.user.uid), {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'founder' : 'admin',
        createdAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Admin registration failed:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password sign-up is not enabled in Firebase Console. Please use "Sign in with Google" using havenclothingindia@gmail.com.'
        );
      } else {
        setAuthError(err.message || 'Registration failed');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isFounder,
        adminName,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerAdmin,
        logout,
        authError,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

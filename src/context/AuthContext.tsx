import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

export const ADMIN_EMAIL = 'havenclothingindia@gmail.com';
export const FOUNDER_EMAIL = 'garvitsharma2212@gmail.com';
export const MASTER_ADMIN_PASS = 'haven2026';

// Approved administrator accounts with dashboard access
export const APPROVED_ADMIN_EMAILS = [
  ADMIN_EMAIL.toLowerCase(),
  FOUNDER_EMAIL.toLowerCase()
];

export const FOUNDERS = [
  { name: 'Garvit Sharma', role: 'Co-Founder & Creative Director' },
  { name: 'Ankit Meena', role: 'Co-Founder & Operations Lead' }
];

const LOCAL_SESSION_KEY = 'haven_admin_session';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isFounder: boolean;
  adminName: string;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
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

  // Check if active local admin session exists in storage
  const hasLocalSession = (): boolean => {
    try {
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          return true;
        }
      }
    } catch (e) {
      // ignore storage errors
    }
    return false;
  };

  useEffect(() => {
    // 1. Immediately verify if direct local admin session is present
    if (hasLocalSession()) {
      setIsAdmin(true);
      setIsFounder(true);
      setAdminName('Founders (Garvit & Ankit)');
      setLoading(false);
    }

    // 2. Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const email = (currentUser.email || '').toLowerCase().trim();
        const isMasterAdmin = APPROVED_ADMIN_EMAILS.includes(email);

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
            // Auto bootstrap admin document for authorized founder/admin
            const isGarvit = email === FOUNDER_EMAIL.toLowerCase();
            const fallbackName = isGarvit ? 'Garvit Sharma (Founder)' : 'HAVEN Clothing Admin';
            await setDoc(adminDocRef, {
              email: email,
              name: displayName || fallbackName,
              role: 'founder',
              createdAt: new Date().toISOString()
            }).catch(() => {});
            hasAdminDoc = true;
            role = 'founder';
            displayName = displayName || fallbackName;
          }
        } catch (err) {
          console.warn('Admin Firestore verification note:', err);
        }

        const isUserAdmin = isMasterAdmin || hasAdminDoc;

        if (isUserAdmin) {
          setUser(currentUser);
          setIsAdmin(true);
          setIsFounder(isMasterAdmin || role === 'founder');
          setAdminName(displayName || (email === ADMIN_EMAIL.toLowerCase() ? 'Founders (Garvit & Ankit)' : 'Store Admin'));
          try {
            localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
              email: email,
              name: displayName || 'HAVEN Admin',
              role: 'founder'
            }));
          } catch (e) {}
        } else {
          // If currentUser is not authorized, check if direct session exists
          if (!hasLocalSession()) {
            await firebaseSignOut(auth).catch(() => {});
            setUser(null);
            setIsAdmin(false);
            setIsFounder(false);
            setAdminName('');
            setAuthError(`Access Denied: The account (${email}) is not an authorized HAVEN administrator.`);
          }
        }
      } else {
        // currentUser is null
        if (hasLocalSession()) {
          setIsAdmin(true);
          setIsFounder(true);
          setAdminName('Founders (Garvit & Ankit)');
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsFounder(false);
          setAdminName('');
        }
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
      if (err.code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setAuthError(`UNAUTHORIZED_DOMAIN:${host}`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed before completing authentication.');
      } else {
        setAuthError(err.message || 'Google Sign-In failed. Please try again.');
      }
      throw err;
    }
  };

  const loginWithEmail = async (emailInput: string, passInput: string) => {
    setAuthError(null);
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    // =========================================================================
    // DIRECT MASTER LOGIN: havenclothingindia@gmail.com / haven2026
    // Opens admin panel immediately without requiring Firebase authentication
    // =========================================================================
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPass === MASTER_ADMIN_PASS) {
      try {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
          email: ADMIN_EMAIL,
          name: 'Founders (Garvit & Ankit)',
          role: 'founder',
          timestamp: Date.now()
        }));
      } catch (e) {}

      setIsAdmin(true);
      setIsFounder(true);
      setAdminName('Founders (Garvit & Ankit)');

      // Optional background sync with Firebase if configured (silently ignored if offline/unregistered)
      signInWithEmailAndPassword(auth, ADMIN_EMAIL, MASTER_ADMIN_PASS).catch((fbErr) => {
        console.log('Firebase background auth notice (direct admin mode active):', fbErr.message);
      });

      return;
    }

    // =========================================================================
    // Otherwise fallback to standard Firebase Email/Password check
    // =========================================================================
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, passInput);
    } catch (err: any) {
      console.error('Email sign in failed:', err);
      if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
        setAuthError('Incorrect password. For direct admin access, enter password: haven2026');
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthError('Firebase Email/Password provider disabled. Log in with havenclothingindia@gmail.com and password haven2026.');
      } else if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/wrong-password'
      ) {
        setAuthError('Invalid credentials. Log in with havenclothingindia@gmail.com and password haven2026.');
      } else {
        setAuthError(err.message || 'Sign in failed');
      }
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      console.error('Password reset failed:', err);
      setAuthError(err.message || 'Failed to send password reset email.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    } catch (e) {}
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setUser(null);
    setIsAdmin(false);
    setIsFounder(false);
    setAdminName('');
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
        sendPasswordReset,
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

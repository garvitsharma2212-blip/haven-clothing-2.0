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

// Approved administrator accounts with dashboard access
export const APPROVED_ADMIN_EMAILS = [
  ADMIN_EMAIL.toLowerCase(),
  FOUNDER_EMAIL.toLowerCase()
];

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const email = (currentUser.email || '').toLowerCase().trim();
        const isMasterAdmin = APPROVED_ADMIN_EMAILS.includes(email);

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
            // Auto bootstrap admin document for authorized founder/master admin
            const isGarvit = email === FOUNDER_EMAIL.toLowerCase();
            const fallbackName = isGarvit ? 'Garvit Sharma (Founder)' : 'HAVEN Clothing Admin';
            await setDoc(adminDocRef, {
              email: email,
              name: displayName || fallbackName,
              role: 'founder',
              createdAt: new Date().toISOString()
            });
            hasAdminDoc = true;
            role = 'founder';
            displayName = displayName || fallbackName;
          }
        } catch (err) {
          console.warn('Admin Firestore verification notice:', err);
        }

        const isUserAdmin = isMasterAdmin || hasAdminDoc;

        // Security Enforcement: Immediately reject and sign out unauthorized users
        if (!isUserAdmin) {
          console.warn(`[Security Alert] Unauthorized sign-in attempt rejected for: ${email}`);
          await firebaseSignOut(auth);
          setUser(null);
          setIsAdmin(false);
          setIsFounder(false);
          setAdminName('');
          setAuthError(`Access Denied: The account (${email}) is not an authorized HAVEN administrator. Only approved store admins can access this dashboard.`);
          setLoading(false);
          return;
        }

        setUser(currentUser);
        setIsAdmin(true);
        setIsFounder(isMasterAdmin || role === 'founder');
        setAdminName(displayName || (email === ADMIN_EMAIL.toLowerCase() ? 'Founders (Garvit & Ankit)' : 'Store Admin'));
      } else {
        setUser(null);
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
      if (err.code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setAuthError(`UNAUTHORIZED_DOMAIN:${host}`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed before completing authentication.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setAuthError(err.message || 'Google Sign-In failed. Please try again.');
      }
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
          'OPERATION_NOT_ALLOWED: Email/Password sign-in provider is disabled in Firebase Console. Please enable "Email/Password" in Firebase Authentication > Sign-in method.'
        );
      } else if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/wrong-password'
      ) {
        setAuthError(
          'INVALID_CREDENTIALS: No account found or password incorrect for this admin email. If you have not created this user in Firebase Authentication yet, follow the secure setup steps below.'
        );
      } else if (err.code === 'auth/too-many-requests') {
        setAuthError('Too many failed attempts. Access to this account has been temporarily disabled. Please reset password or try again later.');
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
      if (err.code === 'auth/user-not-found') {
        setAuthError('No Firebase user exists for this email address. Please create the user in Firebase Console first.');
      } else {
        setAuthError(err.message || 'Failed to send password reset email.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
      setIsFounder(false);
      setAdminName('');
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

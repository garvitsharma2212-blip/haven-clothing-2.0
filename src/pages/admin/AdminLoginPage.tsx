import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth, ADMIN_EMAIL, FOUNDERS } from '../../context/AuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToStore }) => {
  const { loginWithGoogle, loginWithEmail, registerAdmin, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLocalError(null);
    clearAuthError();
    try {
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      setLocalError(err.message || 'Google authentication was not completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    clearAuthError();

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerAdmin(email, password, name || 'Haven Admin');
      }
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setLocalError('Email/Password sign-in is disabled in your Firebase console. Please click "Sign in with Google" above using havenclothingindia@gmail.com.');
      } else {
        setLocalError(err.message || 'Authentication error. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#FAF9F5]">
      <div className="max-w-md w-full bg-[#FAF9F5] border border-[#E3DDD1] p-8 shadow-xl space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#1A1918] text-[#C5A880] mb-2 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#8C8375] font-semibold block">
            HAVEN CLOTHING • RESTRICTED
          </span>
          <h1 className="text-3xl font-serif text-[#1A1918]">
            Founders &amp; Admin Portal
          </h1>
          <p className="text-xs text-[#736C61]">
            Authorized access for founders <strong>Garvit Sharma</strong> &amp; <strong>Ankit Meena</strong>.
          </p>
        </div>

        {/* Founders Badge */}
        <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-3 text-xs text-[#615A50] space-y-1">
          <p className="font-semibold text-[#1A1918] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Authorized Administrator Accounts:</span>
          </p>
          <p className="font-mono text-[11px] text-[#8C6D45]">{ADMIN_EMAIL}</p>
          <p className="text-[10px] text-[#7A7367]">Protected with Firebase Auth &amp; Cloud Firestore Security Rules.</p>
        </div>

        {/* Error notice */}
        {(localError || authError) && (
          <div className="p-3.5 bg-[#FAF0F0] border border-[#F3C5C5] text-[#C53030] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Quick Google Sign In */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white border border-[#DDD5C6] hover:bg-[#F2ECE1] text-xs uppercase tracking-wider font-semibold text-[#1A1918] flex items-center justify-center gap-2.5 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E3DDD1] w-full" />
            <span className="bg-[#FAF9F5] px-3 text-[10px] uppercase tracking-widest text-[#8C8477]">
              Or with email &amp; password
            </span>
            <div className="border-t border-[#E3DDD1] w-full" />
          </div>
        </div>

        {/* Email Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                Founder / Admin Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Garvit Sharma / Ankit Meena"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
              Admin Email
            </label>
            <div className="flex items-center border border-[#DDD5C6] bg-white">
              <span className="px-3 text-[#8C8477]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="havenclothingindia@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
              Password
            </label>
            <div className="flex items-center border border-[#DDD5C6] bg-white">
              <span className="px-3 text-[#8C8477]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1A1918] hover:bg-[#33312E] disabled:bg-[#7D766C] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Authenticate Dashboard' : 'Register Admin Key'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="flex items-center justify-between text-xs text-[#7A7367] pt-2 border-t border-[#EAE4D8]">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              clearAuthError();
              setLocalError(null);
            }}
            className="hover:underline text-[#8C6D45] font-medium"
          >
            {mode === 'login' ? 'Create new admin account' : 'Already have credentials? Sign In'}
          </button>

          <button
            type="button"
            onClick={onBackToStore}
            className="hover:text-[#1A1918] transition-colors underline"
          >
            Return to Store
          </button>
        </div>

      </div>
    </div>
  );
};

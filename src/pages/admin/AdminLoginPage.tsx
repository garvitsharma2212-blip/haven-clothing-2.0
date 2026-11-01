import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Key, 
  Eye, 
  EyeOff, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL, APPROVED_ADMIN_EMAILS } from '../../context/AuthContext';
import firebaseConfig from '../../../firebase-applet-config.json';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToStore }) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    sendPasswordReset, 
    authError, 
    clearAuthError,
    user,
    isAdmin 
  } = useAuth();
  
  // Form fields
  const [email, setEmail] = useState<string>(ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // UI state
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const [loadingEmail, setLoadingEmail] = useState<boolean>(false);
  const [loadingReset, setLoadingReset] = useState<boolean>(false);
  const [resetSentMessage, setResetSentMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Detected current domain
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseProjectId = firebaseConfig.projectId;

  // If user is already authenticated as an authorized admin, trigger success
  useEffect(() => {
    if (user && isAdmin) {
      onLoginSuccess();
    }
  }, [user, isAdmin, onLoginSuccess]);

  // Check if error is unauthorized domain
  const isUnauthorizedDomain = (authError && authError.startsWith('UNAUTHORIZED_DOMAIN:')) ||
    (localError && localError.startsWith('UNAUTHORIZED_DOMAIN:'));

  const domainToAuthorize = currentHostname;

  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText(domainToAuthorize);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setLocalError(null);
    clearAuthError();
    setResetSentMessage(null);
    try {
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      console.error('Google login catch:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setLocalError(`UNAUTHORIZED_DOMAIN:${currentHostname}`);
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);
    setLocalError(null);
    clearAuthError();
    setResetSentMessage(null);

    try {
      await loginWithEmail(email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error('Email sign in catch:', err);
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/wrong-password'
      ) {
        // Automatically open the secure setup guide so they can create or check user in Firebase
        setShowSetupGuide(true);
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setLocalError('Please enter your admin email address first.');
      return;
    }
    setLoadingReset(true);
    setLocalError(null);
    clearAuthError();
    setResetSentMessage(null);
    try {
      await sendPasswordReset(email);
      setResetSentMessage(`A password reset link has been dispatched to ${email}. Please check your inbox to update your password.`);
    } catch (err: any) {
      setLocalError(err.message || 'Could not send password reset email.');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#FAF9F5]">
      <div className="max-w-md w-full bg-[#FAF9F5] border border-[#E3DDD1] p-8 sm:p-9 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#1A1918] text-[#C5A880] mb-1 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#8C8375] font-semibold block">
            HAVEN CLOTHING • ATELIER PORTAL
          </span>
          <h1 className="text-3xl font-serif text-[#1A1918] tracking-tight">
            Administrator Login
          </h1>
          <p className="text-xs text-[#736C61]">
            Restricted access for store founders and authorized management.
          </p>
        </div>

        {/* Authorized Admins Badge */}
        <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-3 text-xs text-[#615A50] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#1A1918]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Authorized Administrator Accounts:</span>
          </div>
          <div className="space-y-0.5 pt-0.5">
            {APPROVED_ADMIN_EMAILS.map((approvedEmail) => (
              <p key={approvedEmail} className="font-mono text-[11px] text-[#8C6D45] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                {approvedEmail}
              </p>
            ))}
          </div>
          <p className="text-[10px] text-[#7A7367] pt-1">
            Protected by Firebase Auth &amp; Cloud Firestore Security Rules.
          </p>
        </div>

        {/* Status Messages */}
        {resetSentMessage && (
          <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{resetSentMessage}</span>
          </div>
        )}

        {/* Standard Error Notice (non-domain error) */}
        {!isUnauthorizedDomain && (localError || authError) && (
          <div className="p-3.5 bg-[#FAF0F0] border border-[#F3C5C5] text-[#C53030] text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Authentication Notice</span>
              <span className="text-[11px] leading-relaxed block">
                {localError || authError}
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            SPECIAL: Firebase auth/unauthorized-domain Helper Card
            Fixes the exact Firebase OAuth Authorized Domains issue on Cloud Run & Vercel
            ========================================================================= */}
        {isUnauthorizedDomain && (
          <div className="p-4 bg-[#FFFBEB] border border-[#FCD34D] text-[#92400E] text-xs space-y-3 shadow-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#78350F] text-xs uppercase tracking-wider font-semibold">
                  Google Auth: Domain Authorization Required
                </strong>
                <p className="text-[11px] text-[#92400E] mt-0.5 leading-relaxed">
                  Firebase Google OAuth requires your current domain to be whitelisted in your Firebase Console.
                </p>
              </div>
            </div>

            <div className="bg-white p-2.5 border border-[#FDE68A] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-semibold text-[#78350F]">
                  Current Domain:
                </span>
                <span className="font-mono text-[11px] text-[#1A1918] bg-[#F5F2EB] px-2 py-0.5 border border-[#E3DDD1] truncate max-w-[200px]">
                  {domainToAuthorize}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="flex-1 py-1.5 px-2 bg-[#F3EFE7] hover:bg-[#EAE4D8] text-[11px] font-medium text-[#1A1918] flex items-center justify-center gap-1.5 transition-colors border border-[#DDD5C6]"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold">Domain Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#736C61]" />
                      <span>Copy Domain</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/settings`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-2 bg-[#1A1918] hover:bg-[#33312E] text-[11px] font-medium text-[#FAF9F5] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Console</span>
                  <ExternalLink className="w-3 h-3 text-[#C5A880]" />
                </a>
              </div>
            </div>

            <div className="text-[11px] space-y-1 text-[#78350F] pl-1">
              <p className="font-semibold">Quick Fix Steps (30 seconds):</p>
              <ol className="list-decimal pl-4 space-y-0.5 text-[10px]">
                <li>Click <strong>Open Console</strong> &gt; go to <strong>Authorized domains</strong>.</li>
                <li>Click <strong>Add domain</strong> and paste <code className="bg-white px-1 font-mono text-[9px]">{domainToAuthorize}</code> (also add <code className="bg-white px-1 font-mono text-[9px]">vercel.app</code> for Vercel).</li>
                <li>Click <strong>Add</strong>. Google Login will work immediately!</li>
              </ol>
            </div>

            <div className="pt-1 border-t border-[#FDE68A] text-[11px] text-[#78350F] font-medium flex items-center justify-between">
              <span>Immediate alternative:</span>
              <span className="text-[#1A1918] underline font-semibold">
                Use Email &amp; Password Login below ↓
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            METHOD 1: GOOGLE FIREBASE AUTHENTICATION
            ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#736C61] font-semibold">
              Method 1 • Quick Admin Sign-In
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle || loadingEmail}
            className="w-full py-3 px-4 bg-white border border-[#DDD5C6] hover:bg-[#F2ECE1] disabled:opacity-60 text-xs uppercase tracking-wider font-semibold text-[#1A1918] flex items-center justify-center gap-2.5 transition-colors shadow-xs"
          >
            {loadingGoogle ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#1A1918]" />
            ) : (
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
            )}
            <span>{loadingGoogle ? 'Verifying with Google...' : 'Sign in with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#E3DDD1] w-full" />
          <span className="bg-[#FAF9F5] px-3 text-[10px] uppercase tracking-widest text-[#8C8477]">
            Or With Email &amp; Password
          </span>
          <div className="border-t border-[#E3DDD1] w-full" />
        </div>

        {/* =========================================================================
            METHOD 2: EMAIL & PASSWORD FIREBASE AUTHENTICATION
            (Works on ALL domains including Vercel without domain whitelist errors)
            ========================================================================= */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                Admin Email
              </label>
              <span className="text-[10px] text-[#8C6D45] font-mono">
                Official Admin
              </span>
            </div>
            <div className="flex items-center border border-[#DDD5C6] bg-white focus-within:border-[#1A1918]">
              <span className="px-3 text-[#8C8477]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="havenclothingindia@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 py-2.5 text-xs text-[#1A1918] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-[#575147] font-semibold">
                Firebase Admin Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loadingReset}
                className="text-[10px] text-[#8C6D45] hover:underline hover:text-[#1A1918]"
              >
                {loadingReset ? 'Sending reset link...' : 'Forgot password?'}
              </button>
            </div>
            <div className="flex items-center border border-[#DDD5C6] bg-white focus-within:border-[#1A1918]">
              <span className="px-3 text-[#8C8477]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-2.5 text-xs text-[#1A1918] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-[#8C8477] hover:text-[#1A1918] transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingEmail || loadingGoogle}
            className="w-full py-3.5 bg-[#1A1918] hover:bg-[#33312E] disabled:bg-[#7D766C] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {loadingEmail ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* =========================================================================
            SECURE FIREBASE USER SETUP GUIDE
            (Explains how to securely create admin password in Firebase Console)
            ========================================================================= */}
        <div className="pt-2 border-t border-[#EAE4D8]">
          <button
            type="button"
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="w-full text-left py-2 px-3 bg-[#F5F2EB] hover:bg-[#EAE4D8] border border-[#DDD5C6] flex items-center justify-between text-xs text-[#615A50] transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Key className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>First-time setup? How to create password in Firebase</span>
            </span>
            <span className="text-[10px] text-[#8C6D45] uppercase tracking-wider font-semibold">
              {showSetupGuide ? 'Hide Guide' : 'View Steps'}
            </span>
          </button>

          {showSetupGuide && (
            <div className="mt-2.5 p-3.5 bg-white border border-[#E3DDD1] text-xs text-[#575147] space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-1.5">
                <span className="font-semibold text-[#1A1918]">Secure Firebase Authentication Setup</span>
                <span className="text-[10px] bg-[#FAF0F0] text-[#C53030] px-1.5 py-0.5 font-medium border border-[#F3C5C5]">
                  Zero Public Signup
                </span>
              </div>

              <p className="text-[11px] text-[#736C61] leading-relaxed">
                To guarantee maximum security, admin passwords are <strong>never hardcoded</strong> in JavaScript. Create your admin password directly inside Google Firebase:
              </p>

              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-[#423D36]">
                <li>
                  Open{' '}
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/users`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#8C6D45] hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    Firebase Console &gt; Authentication &gt; Users
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>.
                </li>
                <li>
                  Click the <strong>&quot;Add user&quot;</strong> button.
                </li>
                <li>
                  Enter Email: <code className="bg-[#F5F2EB] px-1 py-0.5 text-[#1A1918] font-mono text-[10px]">havenclothingindia@gmail.com</code> and set your preferred private password.
                </li>
                <li>
                  Verify under{' '}
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/providers`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#8C6D45] hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    Sign-in method
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  that <strong>Email/Password</strong> status is <strong>Enabled</strong>.
                </li>
                <li>
                  Return to this portal, enter the password you just created, and sign in.
                </li>
              </ol>

              <div className="bg-[#F8F6F0] p-2 border border-[#E8E2D5] text-[10px] text-[#7A7367]">
                <strong>Vercel Compatibility:</strong> Email/Password authentication works seamlessly on any domain (including Vercel &amp; custom domains) without needing OAuth domain allowlisting.
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs text-[#7A7367] pt-2">
          <span className="text-[10px] text-[#8C8375]">
            HAVEN CLOTHING Atelier &bull; 2026
          </span>
          <button
            type="button"
            onClick={onBackToStore}
            className="hover:text-[#1A1918] transition-colors underline font-medium"
          >
            Return to Store
          </button>
        </div>

      </div>
    </div>
  );
};

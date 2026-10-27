import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { SAMPLE_USERS } from '../../data/sampleData';
import { User, UserRole } from '../../types/auction';
import { formatCurrency } from '../../utils/formatters';
import { 
  Gavel, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Tag, 
  Layers, 
  ArrowLeft,
  KeyRound,
  LogOut,
  HelpCircle,
  X
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { 
    currentUser, 
    switchUser, 
    setCurrentRole, 
    setActiveTab, 
    setSelectedAuctionId, 
    addToast 
  } = useAuction();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('buyer');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
  );
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const avatarOptions = [
    { label: 'Elena (Collector)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Marcus (Auctioneer)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Sarah (Admin)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80' },
    { label: 'Alex (Trader)', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80' }
  ];

  const handleQuickLogin = (user: User) => {
    switchUser({ ...user, role: 'all' });
    setCurrentRole('all');
    setActiveTab('dashboard');
    setSelectedAuctionId(null);
    addToast('Signed In', `Welcome back, ${user.name}! Unified Master Access active.`, 'success');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      addToast('Validation', 'Please enter your email address to sign in.', 'warning');
      return;
    }

    // Check if matches any sample user
    const matched = SAMPLE_USERS.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (matched) {
      handleQuickLogin(matched);
      return;
    }

    // Create session with unified role
    const customUser: User = {
      id: 'user-' + Date.now(),
      name: loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: loginEmail.trim(),
      role: 'all',
      avatar: selectedAvatar,
      walletBalance: 125000,
      watchlist: [],
      autoBids: {}
    };

    switchUser(customUser);
    setCurrentRole('all');
    setActiveTab('dashboard');
    setSelectedAuctionId(null);
    addToast('Signed In Successfully', `Welcome to AuctionHub, ${customUser.name}!`, 'success');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim()) {
      addToast('Validation', 'Please enter both your full name and email address.', 'warning');
      return;
    }

    if (signUpPassword && signUpConfirmPassword && signUpPassword !== signUpConfirmPassword) {
      addToast('Password Mismatch', 'The passwords entered do not match. Please re-enter.', 'warning');
      return;
    }

    if (!agreedToTerms) {
      addToast('Terms Required', 'Please accept the auction terms and conditions to register.', 'warning');
      return;
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      role: 'all',
      avatar: selectedAvatar,
      walletBalance: 150000,
      watchlist: [],
      autoBids: {}
    };

    switchUser(newUser);
    setCurrentRole('all');
    setActiveTab('dashboard');
    setSelectedAuctionId(null);
    addToast('Account Created', `Welcome to AuctionHub, ${newUser.name}! Your unified account is ready.`, 'success');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      addToast('Email Required', 'Please enter your registered email address.', 'warning');
      return;
    }
    setShowForgotModal(false);
    addToast('Reset Link Dispatched', `A secure password recovery instructions email was sent to ${forgotEmail}.`, 'info');
    setForgotEmail('');
  };

  const handleSignOut = () => {
    addToast('Session Ended', `Signed out of ${currentUser.name}. Switched to guest mode.`, 'info');
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Live Dashboard
        </button>

        <span className="text-xs text-slate-400">
          AuctionHub Secure Authentication Gateway
        </span>
      </div>

      {/* Active Session Status Bar (if already signed in) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border-2 border-violet-600 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                Buyer · Seller · Admin
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email} · Escrow Balance: {formatCurrency(currentUser.walletBalance)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
          >
            Open Dashboard Hub
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Sign out of current account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xs space-y-6">
          
          {/* Header & Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-xs">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Auction<span className="text-violet-600 dark:text-violet-400">Hub</span> Account Access
                </h1>
                <p className="text-xs text-slate-500">Live timed bidding, proxy ceilings & consignment management</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In to Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create New Account
              </button>
            </div>
          </div>

          {/* Tab 1: Sign In */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address or Bidder Alias
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. elena.vance@example.com"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account security key"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                  />
                  <span>Keep me signed in for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Sign In to AuctionHub
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or use instant demo profile</span>
                </div>
              </div>

              {/* Quick 1-Click Profile Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickLogin(user)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 bg-slate-50/70 dark:bg-slate-800/40 text-left transition-colors flex items-center gap-2"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{user.name.split(' ')[0]}</p>
                      <p className="text-[9px] font-semibold uppercase text-violet-600 dark:text-violet-400">Unified Access</p>
                    </div>
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* Tab 2: Create Account */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Display Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Julian Hayes"
                      required
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="julian@example.com"
                      required
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>
              </div>

              {/* Unified Account Privileges */}
              <div className="p-3.5 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Unified Master Account</span>
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/60 px-2 py-0.5 rounded-full">All-in-One</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your profile includes full Buyer (live bidding, proxy auto-bids), Seller (consignment creation, fulfillment), and Administrator (taxonomy, GMV audits) capabilities unified in one.
                </p>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Choose Profile Avatar
                </label>
                <div className="flex items-center gap-3">
                  {avatarOptions.map((av, idx) => (
                    <img
                      key={idx}
                      src={av.url}
                      alt={av.label}
                      referrerPolicy="no-referrer"
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer transition-all ${
                        selectedAvatar === av.url
                          ? 'border-2 border-violet-600 ring-2 ring-violet-400/40 scale-105'
                          : 'border border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 mt-0.5 shrink-0"
                  />
                  <span>
                    I accept the AuctionHub Bidding Terms, Escrow Settlement Agreement, and Fair Auction Rules.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Create Account & Enter Platform
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Password</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Enter the email address associated with your AuctionHub account to receive password reset instructions.
            </p>
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-xs"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

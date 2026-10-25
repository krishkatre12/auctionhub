import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { SAMPLE_USERS } from '../../data/sampleData';
import { User, UserRole } from '../../types/auction';
import { X, UserCheck, Shield, PlusCircle, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, switchUser, addToast, setActiveTab: setGlobalTab } = useAuction();
  const [activeTab, setActiveTab] = useState<'switch' | 'register'>('switch');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast('Validation Error', 'Please provide a valid name and email address.', 'warning');
      return;
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80`,
      walletBalance: 25000,
      watchlist: [],
      autoBids: {}
    };

    switchUser(newUser);
    setIsAuthModalOpen(false);
    addToast('Account Created', `Welcome, ${newUser.name}! Your account has been registered.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">User Accounts & Authentication</h3>
            <p className="text-xs text-slate-500">Switch persona or create a new bidder/seller profile</p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={() => setActiveTab('switch')}
            className={`pb-2.5 text-xs font-semibold px-2 transition-colors border-b-2 ${
              activeTab === 'switch'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Switch Active Persona
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2.5 text-xs font-semibold px-2 transition-colors border-b-2 ${
              activeTab === 'register'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Register New User
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'switch' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Select one of the pre-configured platform accounts to test distinct role permissions:
              </p>
              {SAMPLE_USERS.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      switchUser(user);
                      setIsAuthModalOpen(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/40 ring-1 ring-violet-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</h4>
                          <span className="text-[10px] uppercase font-semibold text-violet-600 dark:text-violet-400">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-violet-600" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.com"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['buyer', 'seller', 'admin'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                        role === r
                          ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Create Account & Sign In
              </button>
            </form>
          )}
        </div>

        {/* Footer with link to Full Login Page */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need full account settings?</span>
          <button
            type="button"
            onClick={() => {
              setIsAuthModalOpen(false);
              setGlobalTab('login');
            }}
            className="font-bold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Open Dedicated Login Page →
          </button>
        </div>

      </div>
    </div>
  );
};

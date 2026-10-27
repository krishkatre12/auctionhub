import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { UserRole } from '../../types/auction';
import { 
  Sparkles, 
  Gavel, 
  Tag, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sliders, 
  TrendingUp, 
  Package, 
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, completeOnboarding, currentUser, updateUser } = useAuction();
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>(currentUser.name || 'Elena Vance');
  const [loadSample, setLoadSample] = useState<boolean>(true);

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    updateUser({ name: userName, role: 'all' });
    completeOnboarding('all', loadSample, userName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              AH
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">AuctionHub Onboarding</h2>
              <p className="text-xs text-slate-500">Step {step} of 4 · Unified Platform Setup</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOnboardingOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
            title="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div 
            className="bg-violet-600 h-1 transition-all duration-300 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Welcome</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome to AuctionHub
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  AuctionHub is the unified marketplace for live timed auctions, consignment selling, and platform management. Let&apos;s get your profile dialed in before you start.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  Your Public Display Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name or bidder handle"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                />
                <p className="text-xs text-slate-500">
                  This alias appears in public bid histories, consignments, and winner certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <Gavel className="w-5 h-5 text-violet-600 mb-2" />
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Live Timed Bids</h4>
                  <p className="text-xs text-slate-500">Compete with auto-bid proxying and anti-sniping protection.</p>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <ShieldCheck className="w-5 h-5 text-violet-600 mb-2" />
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Escrow Settlement</h4>
                  <p className="text-xs text-slate-500">Funds are held in secure escrow until item delivery is verified.</p>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <Sliders className="w-5 h-5 text-violet-600 mb-2" />
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">All-in-One Access</h4>
                  <p className="text-xs text-slate-500">Buyer, Seller, and Admin tools merged in a single account.</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Unified Account</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Buyer, Seller & Admin Merged in One
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  No need to switch accounts or pick a restricted role. Your profile includes full buying, selling, and administrative capabilities simultaneously.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 shadow-xs ring-1 ring-violet-600/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-600 text-white">
                        <Gavel className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">1. Bidder & Buyer Tools</h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">Active</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Browse active auctions, place live bids, set automated proxy budget ceilings, and check out won lots via secure escrow.
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 shadow-xs ring-1 ring-violet-600/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-violet-600 text-white">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">2. Consignor & Seller Tools</h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-800 dark:text-violet-300">Active</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          List new lots with the multi-step auction builder, set starting prices and bid increments, track incoming bids, and fulfill buyer shipments.
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 shadow-xs ring-1 ring-violet-600/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-amber-600 text-white">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">3. Platform Administration</h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">Active</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Oversee platform categories, analyze GMV revenue trends, manage lots, and generate certified financial audit PDF reports.
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Bidding Rules</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  How Bidding & Settlement Works
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  AuctionHub uses industry-standard fair auction rules to ensure transparency.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Minimum Bid Increments</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Every bid must exceed the current highest bid by at least the specified minimum increment. Our dynamic Bid Calculator offers instant +1x, +2x, and +5x step shortcuts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Auto-Bid (Proxy Bidding)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Enter your maximum budget ceiling. The system will automatically place the lowest possible winning bid on your behalf whenever a competitor outbids you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Escrow Settlement & Fulfillment</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Once the timer expires, the highest bidder wins the lot. Payment is secured in escrow and released to the consignor upon delivery confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Step 4 of 4 · Platform Initialization
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Choose Your Initial Catalog State
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Select how you want to start. Both options give you full Buyer, Seller, and Admin powers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Option 1: Load Sample Marketplace */}
                <button
                  type="button"
                  onClick={() => setLoadSample(true)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    loadSample 
                      ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/40 shadow-sm ring-2 ring-violet-600/30' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${loadSample ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                          {loadSample && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Load Sample Data (Recommended)
                        </span>
                      </div>
                      {loadSample && (
                        <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/60 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Prepopulates realistic auctions (Shelby GT500, Rolex Daytona, etc.), live bids, and order settlements so you can test bidding, selling, and admin reports right away.
                    </p>
                  </div>
                </button>

                {/* Option 2: Blank Slate */}
                <button
                  type="button"
                  onClick={() => setLoadSample(false)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    !loadSample 
                      ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/40 shadow-sm ring-2 ring-violet-600/30' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!loadSample ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                          {!loadSample && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Blank Slate
                        </span>
                      </div>
                      {!loadSample && (
                        <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/60 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Start completely empty with <strong>0 listed lots</strong> and 0 bids. Ready for you to list your own auction lots from scratch.
                    </p>
                  </div>
                </button>
              </div>

              {/* Profile & Wallet summary card */}
              <div className="p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {userName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{userName}</h4>
                    <p className="text-xs text-slate-500">Unified Account · Buyer · Seller · Admin</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
                  <span className="text-base font-bold font-mono text-emerald-600">$150,000.00</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shadow-xs"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shadow-sm"
            >
              <span>Launch Unified Platform</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

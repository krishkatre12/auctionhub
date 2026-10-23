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
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [userName, setUserName] = useState<string>(currentUser.name || 'Elena Vance');
  const [loadSample, setLoadSample] = useState<boolean>(false);

  if (!isOnboardingOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'seller' && (userName === 'Elena Vance' || userName === 'Sarah Chen')) {
      setUserName('Marcus Sterling');
    } else if (role === 'buyer' && (userName === 'Marcus Sterling' || userName === 'Sarah Chen')) {
      setUserName('Elena Vance');
    } else if (role === 'admin' && (userName === 'Elena Vance' || userName === 'Marcus Sterling')) {
      setUserName('Sarah Chen');
    }
  };

  const handleFinish = () => {
    // For buyers, workspace always initializes clean and empty
    const sampleChoice = selectedRole === 'buyer' ? false : loadSample;
    updateUser({ name: userName, role: selectedRole });
    completeOnboarding(selectedRole, sampleChoice, userName);
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
              <p className="text-xs text-slate-500">Step {step} of 4</p>
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
                  AuctionHub is the modern marketplace for live timed auctions, proxy bidding, and verified winning settlements. Let&apos;s get your profile dialed in before you start.
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
                  This alias appears in public bid histories and certificates of winning.
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
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Dual Mode</h4>
                  <p className="text-xs text-slate-500">Toggle between Buyer, Seller, and Admin views at any time.</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Role Setup</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Choose Your Primary Intent
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Select your primary role. You can switch personas at any point using the top navigation bar.
                </p>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => handleRoleSelect('buyer')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === 'buyer' 
                      ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 shadow-xs ring-1 ring-violet-600/30' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg ${selectedRole === 'buyer' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <Gavel className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bidder & Collector</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Browse rare lots, configure auto-bid limits, watch items ending soon, and check out won items.
                        </p>
                      </div>
                    </div>
                    {selectedRole === 'buyer' && <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0" />}
                  </div>
                </div>

                <div 
                  onClick={() => handleRoleSelect('seller')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === 'seller' 
                      ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 shadow-xs ring-1 ring-violet-600/30' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg ${selectedRole === 'seller' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Auctioneer & Seller</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          List new lots with multi-step creation, set reserve prices and bid increments, and manage buyer shipments.
                        </p>
                      </div>
                    </div>
                    {selectedRole === 'seller' && <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0" />}
                  </div>
                </div>

                <div 
                  onClick={() => handleRoleSelect('admin')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === 'admin' 
                      ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 shadow-xs ring-1 ring-violet-600/30' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg ${selectedRole === 'admin' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Platform Administrator</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Oversee platform categories, analyze GMV revenue trends, review audits, and export PDF/CSV reports.
                        </p>
                      </div>
                    </div>
                    {selectedRole === 'admin' && <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0" />}
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
                  How Bidding & Winning Works
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
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Reserve Price & Settlement</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Lots with a reserve price require bids to meet the seller&apos;s hidden threshold. Once the timer expires, the highest bidder is declared the winner and settles delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              {/* For Bidder: Clean, empty workspace without confusing sample choices */}
              {selectedRole === 'buyer' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                      Step 4 of 4 · Bidder Account Setup
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Your Bidder Workspace is Ready
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Your account is configured with a clean, empty workspace ready for live timed bidding and proxy ceilings.
                    </p>
                  </div>

                  {/* Profile & Wallet summary card */}
                  <div className="p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {userName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{userName}</h4>
                        <p className="text-xs text-slate-500">Public Bidder Handle · Escrow Protected</p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Escrow Balance</span>
                      <span className="text-base font-bold font-mono text-emerald-600">$45,000.00</span>
                    </div>
                  </div>

                  {/* Clean slate confirmation */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Clean & Empty Bidder Portfolio Initialized</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Your catalog starts fresh with 0 active bids, 0 watchlists, and clean bidding history. You can place real-time bids as new lots go live or test automated proxy limits anytime.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Live Timed Bids</span>
                        <span className="text-[11px] text-slate-500">Dynamic countdowns with anti-sniping protection</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Proxy Auto-Bidding</span>
                        <span className="text-[11px] text-slate-500">Set maximum ceiling and let the system outbid</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Escrow Checkout</span>
                        <span className="text-[11px] text-slate-500">Won lots settle securely with verified tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* For Seller: Two fully interactive options: Blank Slate vs Load Sample Lots */}
              {selectedRole === 'seller' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                      Step 4 of 4 · Seller Consignment Catalog
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Configure Your Seller Catalog
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Choose whether you want to start with clean blank consignments or load sample lots to test listing management and fulfillment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Option 1: Blank Slate */}
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
                          Start completely empty with <strong>0 listed lots</strong> and 0 order shipments. Use the multi-step auction builder to publish your first genuine consignment item.
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Load Sample Lots */}
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
                              Load Sample Lots
                            </span>
                          </div>
                          {loadSample && (
                            <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/60 px-2 py-0.5 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          Prepopulates realistic consignment lots (Shelby GT500, Rolex Daytona, etc.), live bids, and orders to immediately test shipping fulfillment and earnings reports.
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      Tip: You can switch between blank slate and sample lots anytime via &quot;Reset Data&quot; or &quot;Load Sample Data&quot; in the top bar.
                    </p>
                  </div>
                </div>
              )}

              {/* For Admin: Moderation Console */}
              {selectedRole === 'admin' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                      Step 4 of 4 · Platform Administration
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Administrator Console Ready
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Full oversight of categories, platform GMV analytics, audit trails, and PDF/CSV reporting is enabled.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Administrator Credentials Verified</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      You will have administrative permissions to modify auction categories, view all settlement transactions, and generate certified financial summaries.
                    </p>
                  </div>
                </div>
              )}
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
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shadow-sm"
            >
              {selectedRole === 'buyer' && 'Enter Bidder Portal & Start Bidding'}
              {selectedRole === 'seller' && (!loadSample ? 'Launch Clean Seller Portal' : 'Launch Seller Portal with Sample Lots')}
              {selectedRole === 'admin' && 'Enter Admin Moderation Console'}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

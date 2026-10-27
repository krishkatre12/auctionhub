import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { 
  Gavel, 
  Sun, 
  Moon, 
  RotateCcw, 
  Database, 
  HelpCircle, 
  Menu, 
  LogIn,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { 
    darkMode, 
    setDarkMode, 
    loadSampleData, 
    clearAllData, 
    currentUser, 
    setCurrentRole, 
    activeTab, 
    setActiveTab, 
    setSelectedAuctionId, 
    setIsOnboardingOpen, 
    auctions 
  } = useAuction();

  return (
    <header className="sticky top-0 z-40 w-full shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-2xs">
      <div className="flex items-center justify-between gap-3 px-4 lg:px-6 h-16">
        
        {/* Left Zone: Mobile toggle + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedAuctionId(null);
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group text-left cursor-pointer"
            title="Return to AuctionHub Live Marketplace"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-xs group-hover:bg-violet-700 transition-colors shrink-0">
              <Gavel className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white shrink-0">
              Auction<span className="text-violet-600 dark:text-violet-400">Hub</span>
            </span>
          </button>
        </div>

        {/* Center Zone: Unified Platform Navigation (Buy, Sell, Admin in One) */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('explore');
              setSelectedAuctionId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'explore'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs ring-1 ring-violet-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Browse all lots, place live bids, and use proxy bidding"
          >
            <Gavel className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Browse & Bid</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('create');
              setSelectedAuctionId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'create'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs ring-1 ring-violet-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Consign and list new auction lots with multi-step builder"
          >
            <PlusCircle className="w-3.5 h-3.5 text-violet-500 shrink-0" />
            <span>+ Consign & Sell</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admin-portal');
              setSelectedAuctionId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'admin-portal'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs ring-1 ring-violet-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Access system admin ops, category taxonomy, and audit reports"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Admin & Ops</span>
          </button>
        </div>

        {/* Right Zone: Controls & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Data State Actions: Load Demo / Clear */}
          {auctions.length === 0 ? (
            <button
              onClick={loadSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 rounded-lg transition-colors border border-violet-200 dark:border-violet-800/60 whitespace-nowrap"
              title="Prepopulate sample auctions and bids for evaluation"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Load Sample Data</span>
              <span className="md:hidden">Demo</span>
            </button>
          ) : (
            <button
              onClick={clearAllData}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors whitespace-nowrap"
              title="Reset all lots to blank database"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Data</span>
            </button>
          )}


          {/* Onboarding Help Guide Button */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Launch Onboarding Tour & Bidding Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-violet-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Dedicated Login / Sign In Button */}
          <button
            onClick={() => {
              setActiveTab('login');
              setSelectedAuctionId(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'login'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 border border-violet-200 dark:border-violet-800/60'
            }`}
            title="Open Login & Account Access Page"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In / Register</span>
            <span className="sm:hidden">Login</span>
          </button>

          {/* User Account / Persona Switcher */}
          <button
            onClick={() => {
              setActiveTab('login');
              setSelectedAuctionId(null);
            }}
            className={`flex items-center gap-2 pl-2 pr-2.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border ${
              activeTab === 'login'
                ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
            }`}
            title="Account Profile Gateway (Click to manage account or switch persona)"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-violet-500 shrink-0"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-violet-600 dark:text-violet-400 font-medium">Buyer · Seller · Admin</p>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};

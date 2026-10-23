import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { 
  Gavel, 
  Sun, 
  Moon, 
  Play, 
  Pause, 
  RotateCcw, 
  Database, 
  User as UserIcon,
  HelpCircle,
  Menu
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { 
    darkMode, 
    setDarkMode, 
    simulationActive, 
    setSimulationActive, 
    loadSampleData, 
    clearAllData, 
    currentUser, 
    currentRole, 
    setCurrentRole, 
    activeTab,
    setActiveTab,
    setSelectedAuctionId,
    setIsAuthModalOpen, 
    setIsOnboardingOpen, 
    auctions 
  } = useAuction();

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 h-16">
        
        {/* Left Zone: Mobile toggle + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="#" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-xs group-hover:bg-violet-700 transition-colors">
              <Gavel className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Auction<span className="text-violet-600 dark:text-violet-400">Hub</span>
            </span>
          </a>
        </div>

        {/* Center Zone: Role Mode Switcher with Dedicated Portal Navigation */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => {
              setCurrentRole('buyer');
              setActiveTab('bidder-portal');
              setSelectedAuctionId(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'bidder-portal'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs ring-1 ring-violet-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to dedicated Bidder Dashboard"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Bidder View</span>
            <span className="sm:hidden">Bidder</span>
          </button>
          <button
            onClick={() => {
              setCurrentRole('seller');
              setActiveTab('seller-portal');
              setSelectedAuctionId(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'seller-portal'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs ring-1 ring-violet-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to dedicated Seller Consignment Portal"
          >
            <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
            <span className="hidden sm:inline">Seller Portal</span>
            <span className="sm:hidden">Seller</span>
          </button>
          <button
            onClick={() => {
              setCurrentRole('admin');
              setActiveTab('admin-portal');
              setSelectedAuctionId(null);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'admin-portal'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs ring-1 ring-violet-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to dedicated Admin Moderation Console"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Admin</span>
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

          {/* Real-time Bid Simulation Toggle */}
          <button
            onClick={() => setSimulationActive(!simulationActive)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              simulationActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={simulationActive ? 'Simulated live bidding is running' : 'Start simulated live bidding'}
          >
            {simulationActive ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden xl:inline text-[11px] font-semibold">Live Bids ON</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Simulate Bids</span>
              </>
            )}
          </button>

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

          {/* User Account / Persona Switcher */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Switch user account or register"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-violet-500"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};

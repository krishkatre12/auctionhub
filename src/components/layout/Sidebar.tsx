import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Gavel, 
  CheckCircle, 
  FolderTree, 
  BarChart3, 
  BookOpen, 
  X, 
  Package, 
  ShieldCheck, 
  LogIn 
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    auctions, 
    settlements, 
    currentUser, 
    setIsOnboardingOpen,
    setSelectedAuctionId 
  } = useAuction();

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'detail') {
      setSelectedAuctionId(null);
    }
    onCloseMobile();
  };

  const activeAuctionCount = auctions.filter(a => a.status === 'active').length;
  const pendingSettlementCount = settlements.filter(s => s.paymentStatus === 'pending' || s.shippingStatus === 'processing').length;
  const watchlistCount = currentUser.watchlist.length;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shrink-0 h-full overflow-hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <span className="text-sm font-bold text-slate-900 dark:text-white">Navigation</span>
          <button onClick={onCloseMobile} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unified Navigation Links */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto">
          
          {/* Section: Overview */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Marketplace Hub
            </div>
            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                <span>Dashboard Overview</span>
              </div>
            </button>
          </div>

          {/* Section: Buyer Capabilities */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Bidding & Buying</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Buyer</span>
            </div>

            <button
              onClick={() => handleNav('explore')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'explore'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className={`w-4 h-4 ${activeTab === 'explore' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                <span>Explore Auctions</span>
              </div>
              {activeAuctionCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {activeAuctionCount} live
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('my-bids')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'my-bids'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Gavel className={`w-4 h-4 ${activeTab === 'my-bids' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                <span>My Bids & Lots</span>
              </div>
              {watchlistCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                  {watchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('bidder-portal')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'bidder-portal'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Gavel className="w-4 h-4 text-emerald-500" />
                <span>Bidder Hub & Auto-Bids</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('settlement')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'settlement'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-4 h-4 ${activeTab === 'settlement' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                <span>Settlement & Delivery</span>
              </div>
              {pendingSettlementCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  {pendingSettlementCount}
                </span>
              )}
            </button>
          </div>

          {/* Section: Seller Capabilities */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Selling & Consignment</span>
              <span className="text-[10px] text-violet-600 dark:text-violet-400 font-mono">Seller</span>
            </div>

            <button
              onClick={() => handleNav('create')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'create'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlusCircle className={`w-4 h-4 ${activeTab === 'create' ? 'text-violet-600 dark:text-violet-400' : 'text-violet-500'}`} />
                <span>+ Create Auction Lot</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('seller-portal')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'seller-portal'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-violet-500" />
                <span>Seller Consignments & Orders</span>
              </div>
            </button>
          </div>

          {/* Section: Platform Administration */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Platform Operations</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Admin</span>
            </div>

            <button
              onClick={() => handleNav('admin-portal')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'admin-portal'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin Console & Moderation</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'categories'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className={`w-4 h-4 ${activeTab === 'categories' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                <span>Category Management</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'reports'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className={`w-4 h-4 ${activeTab === 'reports' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                <span>Reports & Settlement Ledger</span>
              </div>
            </button>
          </div>

          {/* Section: Account & Setup */}
          <div className="space-y-1 pt-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Account & Setup
            </div>

            <button
              onClick={() => handleNav('login')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LogIn className={`w-4 h-4 ${activeTab === 'login' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                <span>Sign In / Profile</span>
              </div>
            </button>

            <button
              onClick={() => {
                setIsOnboardingOpen(true);
                onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>Onboarding Workflow</span>
            </button>
          </div>

        </div>

        {/* Sidebar Footer: Unified Role Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-violet-50/60 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                Unified Access Active
              </span>
              <span className="text-[10px] text-violet-600 dark:text-violet-400 font-mono font-semibold">All-in-One</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Full Buyer, Seller, and Administrator capabilities unified in this account.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

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
  Clock,
  Sparkles,
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
    currentRole, 
    setCurrentRole,
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

  const handlePortalNav = (tab: string, role: 'buyer' | 'seller' | 'admin') => {
    setCurrentRole(role);
    setActiveTab(tab);
    setSelectedAuctionId(null);
    onCloseMobile();
  };

  const activeAuctionCount = auctions.filter(a => a.status === 'active').length;
  const pendingSettlementCount = settlements.filter(s => s.paymentStatus === 'pending' || s.shippingStatus === 'processing').length;
  const watchlistCount = currentUser.watchlist.length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'explore',
      label: 'Explore Auctions',
      icon: Search,
      badge: activeAuctionCount > 0 ? activeAuctionCount : null
    },
    {
      id: 'create',
      label: 'Create Auction',
      icon: PlusCircle,
      badge: null
    },
    {
      id: 'my-bids',
      label: 'My Bids & Lots',
      icon: Gavel,
      badge: watchlistCount > 0 ? watchlistCount : null
    },
    {
      id: 'settlement',
      label: 'Settlement & Delivery',
      icon: CheckCircle,
      badge: pendingSettlementCount > 0 ? pendingSettlementCount : null
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderTree,
      badge: null
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'login',
      label: 'Sign In / Account',
      icon: LogIn,
      badge: null
    }
  ];

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

        {/* Primary Navigation Links */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Platform Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Dedicated Portals</span>
            <span className="text-[10px] text-violet-600 dark:text-violet-400 font-mono">Specialized</span>
          </div>

          <button
            onClick={() => handlePortalNav('bidder-portal', 'buyer')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'bidder-portal'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Gavel className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Bidder View</span>
            </div>
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono">
                {watchlistCount} watched
              </span>
            )}
          </button>

          <button
            onClick={() => handlePortalNav('seller-portal', 'seller')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'seller-portal'
                ? 'bg-violet-50 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 ring-1 ring-violet-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Seller Portal</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Hub</span>
          </button>

          <button
            onClick={() => handlePortalNav('admin-portal', 'admin')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'admin-portal'
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Admin Console</span>
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Ops</span>
          </button>

          <div className="pt-3 px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Quick Guides
          </div>

          <button
            onClick={() => {
              setIsOnboardingOpen(true);
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4 text-violet-600" />
            <span>Onboarding Workflow</span>
          </button>
        </div>

        {/* Sidebar Footer: Role Info Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white capitalize">
                {currentRole} Mode
              </span>
              <span className="text-[10px] text-violet-600 dark:text-violet-400 font-mono">Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {currentRole === 'buyer'
                ? 'Discover lots, place competitive bids, track winning items.'
                : currentRole === 'seller'
                ? 'Create auctions, configure reserve prices, fulfill orders.'
                : 'Manage categories, oversee transactions, export reports.'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatRelativeTime, calculateTimeLeft } from '../../utils/formatters';
import { 
  Gavel, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  Search, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  CheckCircle2, 
  Package,
  Layers,
  Activity,
  Tag
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    auctions, 
    bids, 
    settlements, 
    categories, 
    currentUser, 
    currentRole, 
    setCurrentRole,
    setActiveTab, 
    setSelectedAuctionId, 
    loadSampleData
  } = useAuction();

  // Metrics
  const activeAuctions = auctions.filter(a => a.status === 'active');
  const upcomingAuctions = auctions.filter(a => a.status === 'upcoming');
  const soldAuctions = auctions.filter(a => a.status === 'sold');
  
  // Platform GMV: sum of sold items currentBid + active current bids
  const platformGmv = auctions
    .filter(a => a.status === 'sold' || a.status === 'active')
    .reduce((sum, a) => sum + (a.currentBid || a.startingPrice), 0);

  const totalBidsCount = bids.length;
  const userWinningCount = bids.filter(b => b.bidderId === currentUser.id && b.status === 'winning').length;
  const userWonCount = settlements.filter(s => s.buyerId === currentUser.id).length;

  const handleSelectAuction = (id: string) => {
    setSelectedAuctionId(id);
    setActiveTab('detail');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-900 to-violet-800 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-white/20 rounded-md text-white backdrop-blur-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              UNIFIED MASTER ACCOUNT
            </span>
            <span className="text-xs text-violet-200">Welcome, {currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Unified Marketplace Hub
          </h1>
          <p className="text-xs text-violet-100 leading-relaxed">
            Live timed bidding, consignment selling, and platform management unified into a single command center.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('explore')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-700/60 hover:bg-violet-700 rounded-lg transition-colors border border-violet-500/40"
          >
            <Search className="w-4 h-4" />
            Browse Lots
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-violet-950 bg-white hover:bg-violet-50 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-violet-700" />
            Create Auction
          </button>
          <button
            onClick={() => setActiveTab('admin-portal')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-950/70 hover:bg-violet-950 rounded-lg transition-colors border border-violet-400/30"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Admin Ops
          </button>
        </div>
      </div>

      {/* Unified Functional Hub Quick Navigation */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Unified Platform Workspaces
            </h3>
            <p className="text-[11px] text-slate-500">
              Direct access to live bidding, consignment inventory, and system administration
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('bidder-portal');
              setSelectedAuctionId(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <Gavel className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Bidder Hub (Proxy Bids) →</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('seller-portal');
              setSelectedAuctionId(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>Seller Hub (Consignments) →</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admin-portal');
              setSelectedAuctionId(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Admin Console (Ops) →</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* KPI 1: Live Auctions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Live Active Lots</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {activeAuctions.length}
            </span>
            <span className="text-xs text-slate-500">
              {upcomingAuctions.length} upcoming
            </span>
          </div>
        </div>

        {/* KPI 2: Platform GMV / Value */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">Platform Volume (GMV)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(platformGmv)}
            </span>
            <span className="text-xs text-slate-500">
              {soldAuctions.length} sold
            </span>
          </div>
        </div>

        {/* KPI 3: Combined Portfolio Standing */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">
              My Portfolio Standing
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {userWinningCount} Winning
            </span>
            <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
              {auctions.filter(a => a.sellerId === currentUser.id).length} consignments
            </span>
          </div>
        </div>

      </div>

      {/* Main Content Area: If Blank State vs Populated */}
      {auctions.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-950/50 border border-violet-100 dark:border-violet-900 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-xs">
            <Gavel className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Auction Lots Currently Listed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your auction database is currently clean and blank as requested. You can create your first custom lot, or load our curated sample lots to evaluate real-time bidding immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Create First Auction
            </button>
            <button
              onClick={loadSampleData}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              Load Sample Auctions
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Auctions Feed (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Featured Auctions</h2>
                <p className="text-xs text-slate-500">Live timed lots accepting bids</p>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700"
              >
                View all ({auctions.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAuctions.slice(0, 4).map((auction) => {
                const timeLeft = calculateTimeLeft(auction.endTime);
                return (
                  <div
                    key={auction.id}
                    onClick={() => handleSelectAuction(auction.id)}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col shadow-2xs hover:shadow-xs"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={auction.images[0]}
                        alt={auction.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-[11px] font-mono text-white flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{timeLeft.formatted}</span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-violet-100 dark:bg-violet-950/90 text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-800">
                            {auction.category}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {auction.condition}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-violet-600 transition-colors">
                          {auction.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Current Bid</span>
                          <p className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                            {formatCurrency(auction.currentBid)}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-0.5 transition-transform">
                          Bid Now →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Bid Activity Stream (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Bid Stream</h2>
                <p className="text-xs text-slate-500">Chronological activity feed</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Stream
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 max-h-[500px] overflow-y-auto">
              {bids.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No bids recorded yet. Place a bid on any active lot.
                </div>
              ) : (
                bids.slice(0, 8).map((bid) => {
                  const targetAuction = auctions.find(a => a.id === bid.auctionId);
                  const isWinning = bid.status === 'winning' || bid.status === 'won';
                  return (
                    <div 
                      key={bid.id}
                      onClick={() => targetAuction && handleSelectAuction(targetAuction.id)}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{bid.bidderName}</span>
                        <span className="font-mono tabular-nums font-bold text-violet-600 dark:text-violet-400">
                          {formatCurrency(bid.amount)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {targetAuction ? targetAuction.title : 'Auction Lot'}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span className={`capitalize ${isWinning ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                          {bid.status}
                          {bid.isAutoBid && ' · Proxy Auto-Bid'}
                        </span>
                        <span>{formatRelativeTime(bid.timestamp)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* Categories Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Auction Categories</h2>
            <p className="text-xs text-slate-500">Taxonomy and catalog distribution</p>
          </div>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700"
          >
            Manage Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => {
            const count = auctions.filter(a => a.category.toLowerCase().includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(a.category.toLowerCase())).length;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveTab('explore')}
                className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-violet-500 dark:hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-slate-750 cursor-pointer transition-all text-center space-y-1.5 shadow-2xs hover:shadow-xs"
              >
                <div className="w-8 h-8 mx-auto rounded-lg bg-violet-100 dark:bg-violet-950/90 border border-violet-200 dark:border-violet-800 flex items-center justify-center text-violet-700 dark:text-violet-300 group-hover:scale-105 transition-transform">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-300 truncate">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] font-mono font-medium text-slate-500 dark:text-violet-300/90 mt-0.5">
                    {count} lot{count === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

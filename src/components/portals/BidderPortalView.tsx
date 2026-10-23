import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatRelativeTime, calculateTimeLeft, getBidStatusLabel } from '../../utils/formatters';
import { 
  Gavel, 
  Trophy, 
  Heart, 
  Clock, 
  Wallet, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Plus
} from 'lucide-react';

export const BidderPortalView: React.FC = () => {
  const { 
    currentUser, 
    auctions, 
    bids, 
    settlements, 
    placeBid, 
    setSelectedAuctionId, 
    setActiveTab, 
    updateUser, 
    addToast 
  } = useAuction();

  const myBids = bids.filter(b => b.bidderId === currentUser.id);
  const myWinningBids = myBids.filter(b => b.status === 'winning');
  const myOutbidBids = myBids.filter(b => b.status === 'outbid');
  const myWonSettlements = settlements.filter(s => s.buyerId === currentUser.id);
  const myWatchlistAuctions = auctions.filter(a => currentUser.watchlist.includes(a.id));
  const activeAuctions = auctions.filter(a => a.status === 'active');

  const handleQuickBid = (auctionId: string, minIncrement: number, currentBid: number) => {
    const nextBid = currentBid + minIncrement;
    const res = placeBid(auctionId, nextBid);
    if (!res.success) {
      addToast('Bidding Notice', res.message, 'warning');
    }
  };

  const handleSelectAuction = (id: string) => {
    setSelectedAuctionId(id);
    setActiveTab('detail');
  };

  const handleTopUp = () => {
    updateUser({ walletBalance: (currentUser.walletBalance || 0) + 10000 });
    addToast('Escrow Credit Added', 'Credited $10,000 to your bidder escrow wallet balance.', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Bidder Dedicated Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-900 via-violet-800 to-purple-900 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-white/20 rounded-md text-white backdrop-blur-xs">
              DEDICATED BIDDER PORTAL
            </span>
            <span className="text-xs text-violet-200">Logged in as {currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Bidder Command Center
          </h1>
          <p className="text-xs text-violet-100 max-w-xl">
            Live lot monitoring, real-time outbid protection, proxy auto-bidding ceilings, and one-click counter bids.
          </p>
        </div>

        {/* Escrow Balance Widget */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-violet-200 block">Available Escrow Credit</span>
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {formatCurrency(currentUser.walletBalance || 0)}
            </span>
          </div>
          <button
            onClick={handleTopUp}
            className="ml-2 px-3 py-1.5 text-xs font-bold text-violet-950 bg-white hover:bg-violet-50 rounded-lg transition-colors shadow-xs"
          >
            + $10k
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Currently Winning Lots</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
            {myWinningBids.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Highest bidder status</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Outbid Alert Lots</span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">
            {myOutbidBids.length}
          </span>
          <span className="text-[11px] text-amber-500 mt-0.5 block">Action required to regain lead</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Active Watchlist Lots</span>
          <span className="text-2xl font-bold font-mono text-violet-600 dark:text-violet-400 mt-1 block">
            {myWatchlistAuctions.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Saved auctions</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Lots Won & Settled</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 mt-1 block">
            {myWonSettlements.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Historical wins</span>
        </div>
      </div>

      {/* Outbid Action Alerts */}
      {myOutbidBids.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Urgent: You Have Been Outbid on {myOutbidBids.length} Active Lot{myOutbidBids.length > 1 ? 's' : ''}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myOutbidBids.map((b) => {
              const target = auctions.find(a => a.id === b.auctionId);
              if (!target || target.status !== 'active') return null;
              const nextBidAmount = target.currentBid + target.minIncrement;
              return (
                <div key={b.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={target.images[0]} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{target.title}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Current: {formatCurrency(target.currentBid)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickBid(target.id, target.minIncrement, target.currentBid)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg whitespace-nowrap shadow-xs"
                  >
                    Counter ({formatCurrency(nextBidAmount)})
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: My Active Bids + Watchlist + Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: My Bids Ledger (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gavel className="w-4 h-4 text-violet-600" />
              <span>My Active Bids & Standing</span>
            </h2>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Browse All Lots →
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            {myBids.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                <p>You have not placed any bids yet.</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
                >
                  Explore Active Auctions
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {myBids.map((b) => {
                  const target = auctions.find(a => a.id === b.auctionId);
                  const statusStyle = getBidStatusLabel(b.status);
                  return (
                    <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {target && (
                          <img src={target.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <h4 
                            onClick={() => target && handleSelectAuction(target.id)}
                            className="font-bold text-slate-900 dark:text-white hover:text-violet-600 cursor-pointer truncate"
                          >
                            {target ? target.title : 'Auction Lot'}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(b.timestamp)} {b.isAutoBid && '· Auto Proxy'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-slate-900 dark:text-white">
                          {formatCurrency(b.amount)}
                        </p>
                        <span className={`text-[10px] uppercase ${statusStyle.colorClass}`}>
                          {statusStyle.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick-Bid Opportunities */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-600" />
              <span>Live Speed Bidding Lots</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeAuctions.slice(0, 4).map((a) => {
                const timeLeft = calculateTimeLeft(a.endTime);
                const nextBid = a.currentBid + a.minIncrement;
                return (
                  <div key={a.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img src={a.images[0]} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{a.title}</h4>
                        <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                          <span className="text-slate-400">Current: {formatCurrency(a.currentBid)}</span>
                          <span className="text-violet-600 font-semibold">{timeLeft.formatted}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickBid(a.id, a.minIncrement, a.currentBid)}
                      className="w-full py-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 rounded-lg transition-colors border border-violet-200 dark:border-violet-800 text-center"
                    >
                      Instant Quick-Bid ({formatCurrency(nextBid)})
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Watchlist & Won Lots (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>My Watchlist ({myWatchlistAuctions.length})</span>
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            {myWatchlistAuctions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No lots on your watchlist yet. Click the heart icon on any auction card to track it.
              </div>
            ) : (
              <div className="space-y-3">
                {myWatchlistAuctions.map((a) => {
                  const timeLeft = calculateTimeLeft(a.endTime);
                  return (
                    <div 
                      key={a.id}
                      onClick={() => handleSelectAuction(a.id)}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-300 cursor-pointer transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={a.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{a.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {timeLeft.formatted}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white shrink-0">
                        {formatCurrency(a.currentBid)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Won Items Card */}
          {myWonSettlements.length > 0 && (
            <div className="p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-950 dark:text-violet-200 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-violet-600" />
                  Won Lots Requiring Settlement ({myWonSettlements.length})
                </span>
              </div>
              <button
                onClick={() => setActiveTab('settlement')}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-center shadow-xs"
              >
                Proceed to Checkout & Tracking →
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

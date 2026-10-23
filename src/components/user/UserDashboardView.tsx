import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, formatRelativeTime, calculateTimeLeft, getBidStatusLabel, getAuctionStatusLabel } from '../../utils/formatters';
import { 
  Gavel, 
  Trophy, 
  Heart, 
  Tag, 
  Wallet, 
  Plus, 
  ExternalLink, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const { 
    currentUser, 
    auctions, 
    bids, 
    settlements, 
    updateUser, 
    setSelectedAuctionId, 
    setActiveTab, 
    toggleWatchlist, 
    declareWinner, 
    cancelAuction, 
    addToast 
  } = useAuction();

  const [activeTabSub, setActiveTabSub] = useState<'bids' | 'won' | 'watchlist' | 'selling'>('bids');

  // Filter user data
  const myBids = bids.filter(b => b.bidderId === currentUser.id);
  const myWonSettlements = settlements.filter(s => s.buyerId === currentUser.id);
  const myWatchlistAuctions = auctions.filter(a => currentUser.watchlist.includes(a.id));
  const mySellingAuctions = auctions.filter(a => a.sellerId === currentUser.id);

  const handleTopUp = () => {
    updateUser({ walletBalance: (currentUser.walletBalance || 0) + 5000 });
    addToast('Funds Added', 'Simulated deposit of $5,000 credited to your wallet balance.', 'success');
  };

  const handleSelectAuction = (id: string) => {
    setSelectedAuctionId(id);
    setActiveTab('detail');
  };

  return (
    <div className="space-y-6">
      
      {/* User Profile Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover border-2 border-violet-600 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-md bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>

        {/* Mock Wallet Card */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Escrow Credit</span>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(currentUser.walletBalance || 0)}
            </span>
          </div>
          <button
            onClick={handleTopUp}
            className="ml-2 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 hover:bg-emerald-200/70 dark:bg-emerald-900/60 rounded-md transition-colors"
            title="Add test deposit"
          >
            + $5k
          </button>
        </div>
      </div>

      {/* Subtabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTabSub('bids')}
          className={`pb-3 text-xs font-bold px-4 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTabSub === 'bids'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>My Placed Bids ({myBids.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('won')}
          className={`pb-3 text-xs font-bold px-4 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTabSub === 'won'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Won Items ({myWonSettlements.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('watchlist')}
          className={`pb-3 text-xs font-bold px-4 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTabSub === 'watchlist'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Watching ({myWatchlistAuctions.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('selling')}
          className={`pb-3 text-xs font-bold px-4 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTabSub === 'selling'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>My Listed Lots ({mySellingAuctions.length})</span>
        </button>
      </div>

      {/* Tab 1: My Bids */}
      {activeTabSub === 'bids' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Bids History</h3>
          
          {myBids.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-3">
              <p>You have not placed any bids on active lots yet.</p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
              >
                Browse Auctions to Bid
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {myBids.map((bid) => {
                const target = auctions.find(a => a.id === bid.auctionId);
                const statusStyle = getBidStatusLabel(bid.status);
                return (
                  <div key={bid.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {target?.images[0] && (
                        <img
                          src={target.images[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                        />
                      )}
                      <div>
                        <h4 
                          onClick={() => target && handleSelectAuction(target.id)}
                          className="font-bold text-slate-900 dark:text-white hover:text-violet-600 cursor-pointer"
                        >
                          {target ? target.title : 'Auction Lot'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Placed {formatRelativeTime(bid.timestamp)} {bid.isAutoBid && '· Auto Proxy'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {formatCurrency(bid.amount)}
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
      )}

      {/* Tab 2: Won Items */}
      {activeTabSub === 'won' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Won Auctions & Settlements</h3>

          {myWonSettlements.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No won lots yet. When you win an auction, settlement records and tracking links appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myWonSettlements.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex gap-3">
                    <img src={s.auctionImage} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{s.auctionTitle}</h4>
                      <p className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 mt-1">
                        Won for {formatCurrency(s.amount)}
                      </p>
                      <p className="text-[10px] text-slate-400">Seller: {s.sellerName}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 uppercase text-[10px]">
                      Delivery: {s.shippingStatus}
                    </span>
                    <button
                      onClick={() => setActiveTab('settlement')}
                      className="text-xs font-semibold text-violet-600 hover:underline"
                    >
                      Checkout & Tracking →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Watchlist */}
      {activeTabSub === 'watchlist' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Watchlist Items</h3>

          {myWatchlistAuctions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <p>Your watchlist is currently empty.</p>
              <p className="text-[11px]">Click the heart icon on any auction card to follow its bidding activity.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myWatchlistAuctions.map((a) => {
                const timeLeft = calculateTimeLeft(a.endTime);
                return (
                  <div key={a.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-100">
                      <img src={a.images[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-white font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {timeLeft.formatted}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{a.title}</h4>
                      <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">
                        {formatCurrency(a.currentBid)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => toggleWatchlist(a.id)}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Unwatch
                      </button>
                      <button
                        onClick={() => handleSelectAuction(a.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-violet-600 rounded-md"
                      >
                        Bid Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Selling History */}
      {activeTabSub === 'selling' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Lots Created by You</h3>
            <button
              onClick={() => setActiveTab('create')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700"
            >
              + Create New Lot
            </button>
          </div>

          {mySellingAuctions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              You haven&apos;t listed any items for auction yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {mySellingAuctions.map((a) => {
                const statusStyle = getAuctionStatusLabel(a.status);
                return (
                  <div key={a.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={a.images[0]} alt="" referrerPolicy="no-referrer" className="w-14 h-14 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <h4 
                          onClick={() => handleSelectAuction(a.id)}
                          className="font-bold text-slate-900 dark:text-white hover:text-violet-600 cursor-pointer text-sm"
                        >
                          {a.title}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-400 mt-1">
                          <span className={statusStyle.colorClass}>{statusStyle.text}</span>
                          <span>·</span>
                          <span>Views: {a.viewsCount}</span>
                          <span>·</span>
                          <span>Starting: {formatCurrency(a.startingPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase">Current Bid</span>
                        <p className="font-mono font-bold text-base text-slate-900 dark:text-white">
                          {formatCurrency(a.currentBid)}
                        </p>
                      </div>

                      {a.status === 'active' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => declareWinner(a.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 rounded-lg"
                          >
                            Finalize
                          </button>
                          <button
                            onClick={() => cancelAuction(a.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { 
  formatCurrency, 
  formatRelativeTime, 
  calculateTimeLeft, 
  getAuctionStatusLabel,
  getBidStatusLabel 
} from '../../utils/formatters';
import { 
  ArrowLeft, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Gavel, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  Share2, 
  MapPin, 
  Tag, 
  Sparkles,
  Zap
} from 'lucide-react';

export const AuctionDetailView: React.FC = () => {
  const { 
    selectedAuctionId, 
    setSelectedAuctionId, 
    setActiveTab, 
    auctions, 
    getAuctionBids, 
    placeBid, 
    setAutoBid, 
    toggleWatchlist, 
    declareWinner, 
    currentUser, 
    currentRole,
    addToast 
  } = useAuction();

  const auction = auctions.find(a => a.id === selectedAuctionId);

  // Live countdown clock state updated every second
  const [timeLeft, setTimeLeft] = useState(() => auction ? calculateTimeLeft(auction.endTime) : null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [autoBidLimit, setAutoBidLimit] = useState<string>('');
  const [activeTabSub, setActiveTabSub] = useState<'bids' | 'specs' | 'rules'>('bids');

  useEffect(() => {
    if (!auction) return;
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(auction.endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  if (!auction) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Auction Lot Not Found</h3>
        <p className="text-xs text-slate-500">The auction you requested may have been removed or does not exist.</p>
        <button
          onClick={() => setActiveTab('explore')}
          className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700"
        >
          Back to All Auctions
        </button>
      </div>
    );
  }

  const bids = getAuctionBids(auction.id);
  const minRequiredBid = auction.currentBid + auction.minIncrement;
  const isWatched = currentUser.watchlist.includes(auction.id);
  const existingAutoBid = currentUser.autoBids[auction.id];
  const isHighestBidder = auction.winnerId === currentUser.id;
  const statusInfo = getAuctionStatusLabel(auction.status);
  const isSeller = auction.sellerId === currentUser.id;
  const canDeclareWinner = (isSeller || currentRole === 'admin') && auction.status === 'active';

  // Calculator increments
  const step1 = minRequiredBid;
  const step2 = auction.currentBid + (auction.minIncrement * 2);
  const step5 = auction.currentBid + (auction.minIncrement * 5);

  const handleQuickBid = (amount: number) => {
    const res = placeBid(auction.id, amount);
    if (!res.success) {
      addToast('Bid Error', res.message, 'warning');
    }
  };

  const handleCustomBid = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customBidAmount);
    if (isNaN(amount)) {
      addToast('Invalid Amount', 'Please enter a valid numeric bid amount.', 'warning');
      return;
    }
    const res = placeBid(auction.id, amount);
    if (res.success) {
      setCustomBidAmount('');
    } else {
      addToast('Bid Error', res.message, 'warning');
    }
  };

  const handleSetAutoBid = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(autoBidLimit);
    if (isNaN(limit)) {
      addToast('Invalid Ceiling', 'Please enter a valid maximum auto-bid ceiling.', 'warning');
      return;
    }
    const res = setAutoBid(auction.id, limit);
    if (res.success) {
      setAutoBidLimit('');
    } else {
      addToast('Auto-Bid Error', res.message, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setSelectedAuctionId(null);
            setActiveTab('explore');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Auction Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWatchlist(auction.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              isWatched
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWatched ? 'fill-current' : ''}`} />
            <span>{isWatched ? 'Watching' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery on left, Contiguous Purchase & Bid module on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Gallery & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Gallery Display */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden flex items-center justify-center">
              <img
                src={auction.images[activeImageIdx] || auction.images[0]}
                alt={auction.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-xs font-mono text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {timeLeft?.formatted}
                </span>
                <span className={`px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-xs font-semibold ${statusInfo.colorClass}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {auction.images.length > 1 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
                {auction.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx ? 'border-violet-600 ring-2 ring-violet-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lot Title & Description */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <span>{auction.category}</span>
                <span>·</span>
                <span>Condition: {auction.condition}</span>
                {auction.location && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {auction.location}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {auction.title}
              </h1>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {auction.description}
            </p>

            {/* Seller provenance trust card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-bold text-xs flex items-center justify-center">
                  {auction.sellerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{auction.sellerName}</p>
                  <p className="text-[11px] text-slate-500">Verified Auctioneer · 100% Positive Feedback</p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          {/* Subtabs: Bid History / Specifications / Rules */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => setActiveTabSub('bids')}
                className={`pb-3 text-xs font-semibold px-3 transition-colors border-b-2 ${
                  activeTabSub === 'bids'
                    ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Bid History ({bids.length})
              </button>
              <button
                onClick={() => setActiveTabSub('specs')}
                className={`pb-3 text-xs font-semibold px-3 transition-colors border-b-2 ${
                  activeTabSub === 'specs'
                    ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Specifications & Provenance
              </button>
              <button
                onClick={() => setActiveTabSub('rules')}
                className={`pb-3 text-xs font-semibold px-3 transition-colors border-b-2 ${
                  activeTabSub === 'rules'
                    ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Auction Terms
              </button>
            </div>

            <div className="p-6">
              {activeTabSub === 'bids' && (
                <div className="space-y-3">
                  {bids.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No bids have been placed yet. Be the first bidder!
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {bids.map((bid, i) => {
                        const statusStyle = getBidStatusLabel(bid.status);
                        return (
                          <div key={bid.id} className="py-3 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-slate-400 text-[11px] w-5">
                                #{bids.length - i}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white mr-2">
                                  {bid.bidderName}
                                </span>
                                {bid.isAutoBid && (
                                  <span className="text-[10px] text-violet-600 dark:text-violet-400 font-mono">
                                    [Auto-Proxy]
                                  </span>
                                )}
                                <p className="text-[10px] text-slate-400">
                                  {formatRelativeTime(bid.timestamp)}
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

              {activeTabSub === 'specs' && (
                <div className="space-y-3">
                  {auction.specifications ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {Object.entries(auction.specifications).map(([key, val]) => (
                        <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">{key}</span>
                          <span className="font-medium text-slate-900 dark:text-white mt-0.5 block">{val}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No additional technical specifications provided.</p>
                  )}
                </div>
              )}

              {activeTabSub === 'rules' && (
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3.5 rounded-lg bg-violet-50/60 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60">
                    <h5 className="font-bold text-violet-950 dark:text-violet-200 mb-1">Standard Bidding Terms</h5>
                    <p className="text-[11px] leading-relaxed">
                      All bids placed are legally binding. In the event of a winning bid, the buyer has 48 hours to complete settlement via our secure Escrow gateway.
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px]">
                    <li>Minimum bid increment: {formatCurrency(auction.minIncrement)}</li>
                    <li>Reserve price status: {auction.reservePrice ? (auction.currentBid >= auction.reservePrice ? 'Reserve Met' : 'Reserve Not Yet Met') : 'No Reserve'}</li>
                    <li>Anti-sniping protection: Bids in the final 2 minutes extend the countdown by 2 minutes.</li>
                  </ul>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Contiguous Bidding Console & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Action Box */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Price & Status Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {auction.status === 'sold' ? 'Sold Winning Price' : 'Current Highest Bid'}
                </span>
                <p className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {formatCurrency(auction.currentBid)}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>Starting: {formatCurrency(auction.startingPrice)}</span>
                  <span>·</span>
                  <span>Min increment: {formatCurrency(auction.minIncrement)}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Time Remaining
                </span>
                <span className="font-mono text-sm font-bold text-violet-600 dark:text-violet-400 block mt-0.5">
                  {timeLeft?.formatted}
                </span>
              </div>
            </div>

            {/* Winning Status Banner if User is Winning */}
            {isHighestBidder && auction.status === 'active' && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  You are currently the highest bidder on this lot!
                </p>
              </div>
            )}

            {auction.status === 'sold' && (
              <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 space-y-2">
                <div className="flex items-center gap-2 text-violet-900 dark:text-violet-200 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>Auction Closed — Winner Declared</span>
                </div>
                <p className="text-xs text-violet-800 dark:text-violet-300">
                  Winner: <strong className="font-semibold">{auction.winnerName || 'Winner'}</strong> at {formatCurrency(auction.currentBid)}
                </p>
                <button
                  onClick={() => setActiveTab('settlement')}
                  className="w-full mt-2 py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-lg transition-colors text-center"
                >
                  View Settlement & Delivery Tracker →
                </button>
              </div>
            )}

            {/* Active Bidding Controls */}
            {auction.status === 'active' && (
              <div className="space-y-5">
                
                {/* Bid Increment Calculator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Bid Increment Calculator
                    </span>
                    <span className="text-slate-400 text-[11px]">Instant 1-click step bids</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleQuickBid(step1)}
                      className="py-2.5 px-2 rounded-xl border border-violet-200 dark:border-violet-800/80 bg-violet-50/50 hover:bg-violet-100/70 dark:bg-violet-950/30 dark:hover:bg-violet-900/50 text-center transition-colors group"
                    >
                      <span className="block text-[10px] text-violet-600 dark:text-violet-400 font-semibold uppercase">
                        +1 Step
                      </span>
                      <span className="block font-mono font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(step1)}
                      </span>
                    </button>

                    <button
                      onClick={() => handleQuickBid(step2)}
                      className="py-2.5 px-2 rounded-xl border border-violet-200 dark:border-violet-800/80 bg-violet-50/50 hover:bg-violet-100/70 dark:bg-violet-950/30 dark:hover:bg-violet-900/50 text-center transition-colors group"
                    >
                      <span className="block text-[10px] text-violet-600 dark:text-violet-400 font-semibold uppercase">
                        +2 Steps
                      </span>
                      <span className="block font-mono font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(step2)}
                      </span>
                    </button>

                    <button
                      onClick={() => handleQuickBid(step5)}
                      className="py-2.5 px-2 rounded-xl border border-violet-200 dark:border-violet-800/80 bg-violet-50/50 hover:bg-violet-100/70 dark:bg-violet-950/30 dark:hover:bg-violet-900/50 text-center transition-colors group"
                    >
                      <span className="block text-[10px] text-violet-600 dark:text-violet-400 font-semibold uppercase">
                        +5 Steps
                      </span>
                      <span className="block font-mono font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(step5)}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Custom Bid Input Form */}
                <form onSubmit={handleCustomBid} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Place Custom Bid Amount
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min={minRequiredBid}
                        step={auction.minIncrement}
                        value={customBidAmount}
                        onChange={(e) => setCustomBidAmount(e.target.value)}
                        placeholder={`Min: ${minRequiredBid.toLocaleString()}`}
                        className="w-full pl-7 pr-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                    >
                      Place Bid
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Next minimum bid allowed: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatCurrency(minRequiredBid)}</strong>
                  </p>
                </form>

                {/* Auto-Bid (Proxy Bidding) Setting */}
                <form onSubmit={handleSetAutoBid} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-violet-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Auto-Bid (Proxy Bidding)</span>
                    </div>
                    {existingAutoBid && (
                      <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                        Ceiling: {formatCurrency(existingAutoBid)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Enter your maximum ceiling. The system will automatically place bids for you up to this ceiling whenever someone outbids you.
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">$</span>
                      <input
                        type="number"
                        min={minRequiredBid}
                        value={autoBidLimit}
                        onChange={(e) => setAutoBidLimit(e.target.value)}
                        placeholder="Max budget ceiling"
                        className="w-full pl-7 pr-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-violet-500 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Set Proxy
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* Seller / Admin Winner Declaration Action */}
            {canDeclareWinner && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Auctioneer Tools</span>
                <button
                  onClick={() => declareWinner(auction.id)}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Finalize Auction & Declare Winner Now
                </button>
              </div>
            )}

          </div>

          {/* Quick Assurance Badges */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-white">Escrow Payment Protection:</strong> Funds are only released to the seller once delivery and condition are acknowledged.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-white">Anti-Sniping Protocol:</strong> Last-minute bids auto-extend auction end-time by 2 minutes to allow fair counter-bids.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

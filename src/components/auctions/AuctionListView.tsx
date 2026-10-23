import React, { useState, useMemo } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { AuctionStatus } from '../../types/auction';
import { formatCurrency, calculateTimeLeft, getAuctionStatusLabel } from '../../utils/formatters';
import { 
  Search, 
  Filter, 
  Clock, 
  Heart, 
  Grid, 
  List, 
  PlusCircle, 
  Sparkles,
  MapPin,
  Tag,
  ArrowUpDown
} from 'lucide-react';

export const AuctionListView: React.FC = () => {
  const { 
    auctions, 
    categories, 
    currentUser, 
    toggleWatchlist, 
    setSelectedAuctionId, 
    setActiveTab, 
    loadSampleData,
    getAuctionBids 
  } = useAuction();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'endingSoon' | 'priceAsc' | 'priceDesc' | 'bidsCount'>('endingSoon');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredAuctions = useMemo(() => {
    return auctions.filter((a) => {
      // Search
      const matchesSearch = 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Category
      if (selectedCategory !== 'all' && a.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && a.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'endingSoon') {
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      }
      if (sortBy === 'priceAsc') {
        return a.currentBid - b.currentBid;
      }
      if (sortBy === 'priceDesc') {
        return b.currentBid - a.currentBid;
      }
      if (sortBy === 'bidsCount') {
        return getAuctionBids(b.id).length - getAuctionBids(a.id).length;
      }
      return 0;
    });
  }, [auctions, searchQuery, selectedCategory, selectedStatus, sortBy, getAuctionBids]);

  const handleSelectAuction = (id: string) => {
    setSelectedAuctionId(id);
    setActiveTab('detail');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore Auction Lots
          </h1>
          <p className="text-xs text-slate-500">
            Browse active and scheduled lots, place bids, and track item status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('create')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Create Auction
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lot title, keyword, or make..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="endingSoon">Ending Soonest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="bidsCount">Most Bids Placed</option>
            </select>

            {/* Grid / Table Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Filter Pills (Category & Status) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400 mr-1">Status:</span>
            {['all', 'active', 'upcoming', 'closed', 'sold'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                  selectedStatus === st
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Results View */}
      {filteredAuctions.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600">
            <Tag className="w-7 h-7" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Auction Lots Found</h3>
            <p className="text-xs text-slate-500">
              {auctions.length === 0
                ? 'Your auction catalog is completely blank as requested.'
                : 'No items match your active search and filter criteria.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {auctions.length === 0 ? (
              <>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                >
                  Create Listing
                </button>
                <button
                  onClick={loadSampleData}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors"
                >
                  Load Sample Lots
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 rounded-lg"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => {
            const timeLeft = calculateTimeLeft(auction.endTime);
            const bidsCount = getAuctionBids(auction.id).length;
            const isWatched = currentUser.watchlist.includes(auction.id);
            const statusInfo = getAuctionStatusLabel(auction.status);

            return (
              <div
                key={auction.id}
                onClick={() => handleSelectAuction(auction.id)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col shadow-2xs hover:shadow-xs"
              >
                {/* Image Cover */}
                <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={auction.images[0]}
                    alt={auction.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-[11px] font-mono text-white flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {timeLeft.formatted}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(auction.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors ${
                      isWatched
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-900/60 text-white hover:bg-slate-900/80'
                    }`}
                    title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWatched ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                        <span className={statusInfo.colorClass}>{statusInfo.text}</span>
                        <span>·</span>
                        <span>{auction.category}</span>
                      </div>
                      <span className="font-mono text-[11px]">{bidsCount} bids</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-violet-600 transition-colors">
                      {auction.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {auction.description}
                    </p>
                  </div>

                  {/* Pricing footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {auction.status === 'sold' ? 'Winning Bid' : 'Current Bid'}
                      </span>
                      <p className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {formatCurrency(auction.currentBid)}
                      </p>
                    </div>

                    <button className="px-3.5 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 group-hover:bg-violet-600 group-hover:text-white rounded-lg transition-all">
                      View Lot
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Auction Lot</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Current Bid</th>
                <th className="py-3 px-4 text-right">Total Bids</th>
                <th className="py-3 px-4">Time Left</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAuctions.map((auction) => {
                const timeLeft = calculateTimeLeft(auction.endTime);
                const bidsCount = getAuctionBids(auction.id).length;
                const statusInfo = getAuctionStatusLabel(auction.status);
                return (
                  <tr
                    key={auction.id}
                    onClick={() => handleSelectAuction(auction.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={auction.images[0]}
                          alt={auction.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{auction.title}</p>
                          <p className="text-[11px] text-slate-400">{auction.condition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{auction.category}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${statusInfo.colorClass}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(auction.currentBid)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">{bidsCount}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{timeLeft.formatted}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-violet-600 font-semibold hover:underline">
                        Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { ShippingStatus } from '../../types/auction';
import { formatCurrency, calculateTimeLeft, getAuctionStatusLabel } from '../../utils/formatters';
import { 
  Tag, 
  PlusCircle, 
  Truck, 
  CheckCircle2, 
  DollarSign, 
  Eye, 
  Clock, 
  Package, 
  ShieldCheck, 
  Gavel, 
  XCircle,
  TrendingUp
} from 'lucide-react';

export const SellerPortalView: React.FC = () => {
  const { 
    currentUser, 
    auctions, 
    settlements, 
    setActiveTab, 
    setSelectedAuctionId, 
    declareWinner, 
    cancelAuction, 
    updateShipping, 
    addToast 
  } = useAuction();

  const [activeTabSub, setActiveTabSub] = useState<'listings' | 'shipments' | 'earnings'>('listings');

  // Filter listings by current seller (by ID, or matching seller persona)
  const myAuctions = auctions.filter(a => 
    a.sellerId === currentUser.id || 
    (currentUser.role === 'seller' && (a.sellerId === 'user-auctioneer-marcus' || a.sellerName === currentUser.name))
  );
  const activeLots = myAuctions.filter(a => a.status === 'active');
  const soldLots = myAuctions.filter(a => a.status === 'sold');
  
  // Settlements where current user is seller
  const mySalesSettlements = settlements.filter(s => 
    s.sellerId === currentUser.id || 
    (currentUser.role === 'seller' && (s.sellerId === 'user-auctioneer-marcus' || s.sellerName === currentUser.name))
  );
  const pendingShipments = mySalesSettlements.filter(s => s.shippingStatus === 'processing' || s.shippingStatus === 'pending');

  const totalSoldValue = soldLots.reduce((sum, a) => sum + a.currentBid, 0);
  const totalViews = myAuctions.reduce((sum, a) => sum + a.viewsCount, 0);

  const handleSelectAuction = (id: string) => {
    setSelectedAuctionId(id);
    setActiveTab('detail');
  };

  const handleMarkShipped = (settlementId: string) => {
    const tracking = `AH-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;
    updateShipping(settlementId, 'shipped', tracking);
  };

  return (
    <div className="space-y-6">
      
      {/* Seller Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950 via-purple-900 to-violet-900 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-white/20 rounded-md text-white backdrop-blur-xs">
              DEDICATED SELLER PORTAL
            </span>
            <span className="text-xs text-violet-200">Auctioneer: {currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Seller & Consignment Hub
          </h1>
          <p className="text-xs text-violet-100 max-w-xl">
            Create multi-step lot listings, set confidential reserves, monitor bidder views, and fulfill buyer shipments.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-violet-950 bg-white hover:bg-violet-50 rounded-lg transition-colors shadow-sm self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4 text-violet-700" />
          Create New Auction Lot
        </button>
      </div>

      {/* Seller KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Sold Earnings</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
            {formatCurrency(totalSoldValue)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{soldLots.length} lots settled</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Active Listed Lots</span>
          <span className="text-2xl font-bold font-mono text-violet-600 dark:text-violet-400 mt-1 block">
            {activeLots.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Accepting live bids</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Pending Order Shipments</span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">
            {pendingShipments.length}
          </span>
          <span className="text-[11px] text-amber-500 mt-0.5 block">Awaiting tracking dispatch</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Lot Impressions</span>
          <span className="text-2xl font-bold font-mono text-indigo-600 mt-1 block">
            {totalViews}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Bidder traffic</span>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTabSub('listings')}
          className={`pb-3 text-xs font-bold px-4 transition-colors border-b-2 flex items-center gap-2 ${
            activeTabSub === 'listings'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>My Auction Listings ({myAuctions.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('shipments')}
          className={`pb-3 text-xs font-bold px-4 transition-colors border-b-2 flex items-center gap-2 ${
            activeTabSub === 'shipments'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Fulfillment & Shipments ({mySalesSettlements.length})</span>
        </button>
      </div>

      {/* Tab 1: Listings Table */}
      {activeTabSub === 'listings' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Active & Past Auction Listings</h2>
              <p className="text-xs text-slate-500">Manage lot timers, declare winners, and inspect reserve status</p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-xs"
            >
              + Create Listing
            </button>
          </div>

          {myAuctions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-3">
              <p>You have not listed any items for auction yet.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
              >
                List Your First Item
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Lot Particulars</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Current Bid</th>
                    <th className="py-3 px-3">Reserve Status</th>
                    <th className="py-3 px-3">Time Left</th>
                    <th className="py-3 px-3 text-right">Views</th>
                    <th className="py-3 px-3 text-right">Auction Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myAuctions.map((a) => {
                    const timeLeft = calculateTimeLeft(a.endTime);
                    const statusStyle = getAuctionStatusLabel(a.status);
                    const reserveMet = !a.reservePrice || a.currentBid >= a.reservePrice;

                    return (
                      <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img src={a.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                            <div className="min-w-0 max-w-xs">
                              <h4 
                                onClick={() => handleSelectAuction(a.id)}
                                className="font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-violet-600"
                              >
                                {a.title}
                              </h4>
                              <p className="text-[11px] text-slate-400">{a.category} · {a.condition}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-semibold ${statusStyle.colorClass}`}>
                            {statusStyle.text}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {formatCurrency(a.currentBid)}
                        </td>
                        <td className="py-3 px-3">
                          {a.reservePrice ? (
                            <span className={`font-semibold ${reserveMet ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {reserveMet ? 'Reserve Met' : `Reserve ${formatCurrency(a.reservePrice)}`}
                            </span>
                          ) : (
                            <span className="text-slate-400">No Reserve</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {timeLeft.formatted}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-500">
                          {a.viewsCount}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          {a.status === 'active' ? (
                            <>
                              <button
                                onClick={() => declareWinner(a.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 rounded-md shadow-xs"
                                title="Conclude auction and declare winner"
                              >
                                Finalize
                              </button>
                              <button
                                onClick={() => cancelAuction(a.id)}
                                className="px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md"
                                title="Cancel this lot"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSelectAuction(a.id)}
                              className="text-violet-600 font-semibold hover:underline"
                            >
                              View Lot →
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Shipments Fulfillment */}
      {activeTabSub === 'shipments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Fulfillment & Delivery Dispatch Queue</h2>
            <p className="text-xs text-slate-500">Assign shipping carriers, generate tracking codes, and complete escrow payouts</p>
          </div>

          {mySalesSettlements.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No won orders in your fulfillment queue yet.
            </div>
          ) : (
            <div className="space-y-3">
              {mySalesSettlements.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={s.auctionImage} alt="" referrerPolicy="no-referrer" className="w-14 h-14 rounded-lg object-cover" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-violet-600">{s.id}</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{s.auctionTitle}</h4>
                      <p className="text-xs text-slate-500">Buyer: <strong>{s.buyerName}</strong> · Amount: <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(s.amount)}</strong></p>
                      {s.shippingAddress && (
                        <p className="text-[11px] text-slate-400 mt-0.5">Ship to: {s.shippingAddress}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 block">Shipping Status</span>
                      <span className="font-semibold text-xs text-violet-600 uppercase">
                        {s.shippingStatus}
                      </span>
                    </div>

                    {s.shippingStatus !== 'shipped' && s.shippingStatus !== 'delivered' && (
                      <button
                        onClick={() => handleMarkShipped(s.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Dispatch Order
                      </button>
                    )}

                    {s.shippingStatus === 'shipped' && (
                      <button
                        onClick={() => updateShipping(s.id, 'delivered')}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

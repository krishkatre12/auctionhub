import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { ShippingStatus } from '../../types/auction';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  Package, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  MapPin,
  FileText
} from 'lucide-react';

export const SettlementView: React.FC = () => {
  const { settlements, currentUser, currentRole, processPayment, updateShipping, setSelectedAuctionId, setActiveTab } = useAuction();

  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<string>('742 Evergreen Terrace, Suite 4B, Boston, MA 02108');
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');

  const selectedSettlement = settlements.find(s => s.id === (selectedSettlementId || settlements[0]?.id));

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSettlement) return;
    processPayment(selectedSettlement.id, shippingAddress);
  };

  const handleAdvanceShipping = (status: ShippingStatus) => {
    if (!selectedSettlement) return;
    const generatedTracking = selectedSettlement.trackingNumber || `AH-EXP-${Date.now().toString().slice(-8)}`;
    updateShipping(selectedSettlement.id, status, generatedTracking);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Winning & Settlement Hub
        </h1>
        <p className="text-xs text-slate-500">
          Escrow payment processing, delivery tracking, and post-auction order fulfillment.
        </p>
      </div>

      {settlements.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Won Settlements Yet</h3>
            <p className="text-xs text-slate-500">
              When an auction concludes with a winning bid, the settlement and payment escrow process appears here.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            Explore Active Auctions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Settlement List (4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Settlement Orders ({settlements.length})
            </span>

            {settlements.map((s) => {
              const isSelected = selectedSettlement?.id === s.id;
              const isPaid = s.paymentStatus === 'completed';
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSettlementId(s.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 ring-1 ring-violet-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 font-semibold">{s.id}</span>
                    <span className={`capitalize font-semibold text-[11px] ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {s.paymentStatus === 'completed' ? 'Paid' : 'Payment Required'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={s.auctionImage}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {s.auctionTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Winner: {s.buyerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(s.amount)}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-violet-600 dark:text-violet-400">
                      Shipping: {s.shippingStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Order Details & Actions (7 cols) */}
          {selectedSettlement && (
            <div className="lg:col-span-7 space-y-6">
              
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
                
                {/* Order Summary Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Order Reference #{selectedSettlement.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedSettlement.auctionTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Seller: {selectedSettlement.sellerName} · Buyer: {selectedSettlement.buyerName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-400 block">Total Due</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(selectedSettlement.amount)}
                    </span>
                  </div>
                </div>

                {/* Delivery Timeline Progress */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Fulfillment & Delivery Progress
                  </span>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { key: 'pending', label: '1. Won', done: true },
                      { key: 'processing', label: '2. Escrow Paid', done: selectedSettlement.paymentStatus === 'completed' },
                      { key: 'shipped', label: '3. Dispatched', done: selectedSettlement.shippingStatus === 'shipped' || selectedSettlement.shippingStatus === 'delivered' },
                      { key: 'delivered', label: '4. Delivered', done: selectedSettlement.shippingStatus === 'delivered' },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          step.done
                            ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {step.label}
                      </div>
                    ))}
                  </div>

                  {selectedSettlement.trackingNumber && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Carrier & Tracking</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {selectedSettlement.carrier || 'Global Express'} — {selectedSettlement.trackingNumber}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-semibold text-[10px]">
                        In Transit
                      </span>
                    </div>
                  )}
                </div>

                {/* Escrow Payment Form (If Unpaid) */}
                {selectedSettlement.paymentStatus === 'pending' ? (
                  <form onSubmit={handlePay} className="p-4 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900 space-y-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-violet-600" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Simulate Escrow Checkout & Payment
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Lock funds in AuctionHub Escrow. Funds are not disbursed to the seller until delivery is completed.
                    </p>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Shipping Address
                      </label>
                      <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      Authorize Escrow Payment ({formatCurrency(selectedSettlement.amount)})
                    </button>
                  </form>
                ) : (
                  /* Fulfillment Controls for Seller / Admin */
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Order Fulfillment Actions
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {selectedSettlement.shippingStatus !== 'shipped' && selectedSettlement.shippingStatus !== 'delivered' && (
                        <button
                          onClick={() => handleAdvanceShipping('shipped')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Mark Shipped & Assign Tracking
                        </button>
                      )}

                      {selectedSettlement.shippingStatus === 'shipped' && (
                        <button
                          onClick={() => handleAdvanceShipping('delivered')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirm Delivery & Release Escrow
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

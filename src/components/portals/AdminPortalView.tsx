import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { SAMPLE_USERS } from '../../data/sampleData';
import { formatCurrency, calculateTimeLeft, getAuctionStatusLabel } from '../../utils/formatters';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { 
  Shield, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Database, 
  RotateCcw, 
  FolderTree, 
  BarChart3, 
  Users, 
  Gavel, 
  AlertTriangle 
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const { 
    auctions, 
    bids, 
    settlements, 
    categories, 
    currentUser, 
    declareWinner, 
    cancelAuction, 
    deleteAuction, 
    loadSampleData, 
    clearAllData, 
    setActiveTab, 
    setSelectedAuctionId,
    addToast 
  } = useAuction();

  const [deleteTarget, setDeleteTarget] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: string;
    type: 'auction' | 'clear-all';
    auctionId?: string;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: '',
    type: 'auction'
  });

  const totalGMV = auctions.reduce((sum, a) => sum + (a.status === 'sold' ? a.currentBid : a.startingPrice), 0);
  const activeCount = auctions.filter(a => a.status === 'active').length;

  const handleDeleteWithPrompt = (auctionId: string, title?: string) => {
    setDeleteTarget({
      isOpen: true,
      title: 'Permanently Delete Auction Lot',
      itemName: title ? `#${auctionId} - ${title}` : `Lot #${auctionId}`,
      itemType: 'auction listing',
      type: 'auction',
      auctionId
    });
  };

  const handleResetDBPrompt = () => {
    setDeleteTarget({
      isOpen: true,
      title: 'Reset Platform Database to Blank',
      itemName: `All ${auctions.length} auctions, ${bids.length} bids, and ${settlements.length} invoices`,
      itemType: 'complete database',
      type: 'clear-all'
    });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.type === 'auction' && deleteTarget.auctionId) {
      deleteAuction(deleteTarget.auctionId);
    } else if (deleteTarget.type === 'clear-all') {
      clearAllData();
    }
    setDeleteTarget(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-white/20 rounded-md text-white backdrop-blur-xs flex items-center gap-1">
              <Shield className="w-3 h-3 text-violet-400" />
              SYSTEM ADMIN CONSOLE
            </span>
            <span className="text-xs text-slate-300">Auditor: {currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Auction Platform Moderation & Ops
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Superuser platform controls, global auction moderation, taxonomy configuration, and compliance audit.
          </p>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={loadSampleData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
          >
            <Database className="w-3.5 h-3.5" />
            Seed Demo Lots
          </button>
          <button
            onClick={handleResetDBPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 rounded-lg transition-colors border border-rose-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset DB
          </button>
        </div>
      </div>

      {/* Admin KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Platform GMV</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(totalGMV)}
          </span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Recorded volume</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">All Lots Listed</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {auctions.length}
          </span>
          <span className="text-[11px] text-violet-600 dark:text-violet-400 mt-0.5 block">{activeCount} active lots</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Bidding Transactions</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {bids.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Audit log count</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Taxonomy Categories</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {categories.length}
          </span>
          <button onClick={() => setActiveTab('categories')} className="text-[11px] text-violet-600 hover:underline mt-0.5 block">
            Manage Categories →
          </button>
        </div>
      </div>

      {/* Global Auction Moderation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Global Auction Moderation</h2>
            <p className="text-xs text-slate-500">Superuser authority to finalize, close, or delete any listing</p>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Audit Reports & Invoices →
          </button>
        </div>

        {auctions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <p>Database is empty (0 auction lots).</p>
            <button
              onClick={loadSampleData}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
            >
              Seed Sample Lots
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">Lot Details</th>
                  <th className="py-3 px-3">Seller</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Current Bid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auctions.map((a) => {
                  const statusStyle = getAuctionStatusLabel(a.status);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5 max-w-xs">
                          <img src={a.images[0]} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-md object-cover bg-slate-100 shrink-0" />
                          <div className="min-w-0">
                            <h4 
                              onClick={() => {
                                setSelectedAuctionId(a.id);
                                setActiveTab('detail');
                              }}
                              className="font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-violet-600"
                            >
                              {a.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {a.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{a.sellerName}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{a.category}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(a.currentBid)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-semibold ${statusStyle.colorClass}`}>
                          {statusStyle.text}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        {a.status === 'active' && (
                          <button
                            onClick={() => declareWinner(a.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 rounded hover:bg-emerald-100"
                            title="Force finalize and declare winner"
                          >
                            Finalize
                          </button>
                        )}
                        {a.status === 'active' && (
                          <button
                            onClick={() => cancelAuction(a.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 rounded hover:bg-amber-100"
                            title="Cancel lot"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteWithPrompt(a.id, a.title)}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          title="Permanently delete lot"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
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

      {/* User Accounts Directory */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-600" />
          <span>Platform User Directory</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_USERS.map((user) => (
            <div key={user.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover border border-violet-500" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
                  <span className="text-[10px] uppercase font-semibold text-violet-600 dark:text-violet-400">{user.role === 'all' ? 'Unified (All)' : user.role}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <p className="text-[10px] font-mono text-emerald-600 mt-0.5">Wallet: {formatCurrency(user.walletBalance)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In-app Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget.isOpen}
        title={deleteTarget.title}
        itemName={deleteTarget.itemName}
        itemType={deleteTarget.itemType}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};

import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { Settlement } from '../../types/auction';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { InvoiceModal } from './InvoiceModal';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Calendar,
  CheckCircle2,
  Trash2,
  FileText,
  Eye
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { auctions, bids, settlements, categories, deleteSettlement, deleteAuction, deleteBid, addToast } = useAuction();
  const [reportType, setReportType] = useState<'auctions' | 'bids' | 'invoices'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Settlement | null>(null);

  // In-app delete confirmation state (replaces browser window.confirm blocked by sandbox)
  const [deleteTarget, setDeleteTarget] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: string;
    type: 'invoice' | 'auction' | 'bid';
    id: string;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: '',
    type: 'invoice',
    id: ''
  });

  // Metrics
  const totalGMV = auctions.reduce((sum, a) => sum + (a.status === 'sold' ? a.currentBid : 0), 0);
  const activeValue = auctions.reduce((sum, a) => sum + (a.status === 'active' ? a.currentBid : 0), 0);
  const totalBidsCount = bids.length;
  const soldCount = auctions.filter(a => a.status === 'sold').length;
  const clearanceRate = auctions.length > 0 ? Math.round((soldCount / auctions.length) * 100) : 0;

  // Category distribution
  const categoryStats = categories.map((cat) => {
    const catAuctions = auctions.filter(a => a.category.toLowerCase().includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(a.category.toLowerCase()));
    const catBids = bids.filter(b => {
      const auc = auctions.find(a => a.id === b.auctionId);
      return auc && (auc.category.toLowerCase().includes(cat.name.toLowerCase()) || cat.name.toLowerCase().includes(auc.category.toLowerCase()));
    });
    const catTotalValue = catAuctions.reduce((sum, a) => sum + a.currentBid, 0);

    return {
      name: cat.name,
      auctionsCount: catAuctions.length,
      bidsCount: catBids.length,
      value: catTotalValue
    };
  });

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'auctions') {
      csvContent += 'ID,Title,Category,Condition,StartingPrice,CurrentBid,Status,Winner,Views\n';
      auctions.forEach((a) => {
        const cleanTitle = `"${a.title.replace(/"/g, '""')}"`;
        csvContent += `${a.id},${cleanTitle},${a.category},${a.condition},${a.startingPrice},${a.currentBid},${a.status},${a.winnerName || 'N/A'},${a.viewsCount}\n`;
      });
    } else if (reportType === 'bids') {
      csvContent += 'BidID,AuctionID,BidderName,Amount,Timestamp,Status,IsAutoBid\n';
      bids.forEach((b) => {
        csvContent += `${b.id},${b.auctionId},"${b.bidderName}",${b.amount},${b.timestamp},${b.status},${b.isAutoBid ? 'Yes' : 'No'}\n`;
      });
    } else {
      csvContent += 'InvoiceID,AuctionID,ItemTitle,Buyer,Seller,Amount,PaymentStatus,ShippingStatus,TrackingNumber,Date\n';
      settlements.forEach((s) => {
        const cleanTitle = `"${s.auctionTitle.replace(/"/g, '""')}"`;
        csvContent += `INV-${s.id},${s.auctionId},${cleanTitle},"${s.buyerName}","${s.sellerName}",${s.amount},${s.paymentStatus},${s.shippingStatus},${s.trackingNumber || 'N/A'},${s.createdAt}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AuctionHub_${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Report Exported', `Downloaded ${reportType} CSV export.`, 'success');
  };

  // Download Full PDF Summary Report
  const handleDownloadFullReport = () => {
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AuctionHub Operational Audit & Revenue Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 900px; margin: 0 auto; }
    h1 { color: #7c3aed; margin-bottom: 4px; }
    .subtitle { color: #64748b; font-size: 13px; margin-bottom: 24px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
    .kpi-card { border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; background: #f8fafc; }
    .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .kpi-value { font-size: 22px; font-weight: bold; margin-top: 6px; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 30px; }
    th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
  </style>
</head>
<body>
  <h1>AuctionHub Platform Report</h1>
  <div class="subtitle">Generated: ${new Date().toLocaleString()} · Official Ledger</div>

  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-label">Gross Settled GMV</div><div class="kpi-value">$${totalGMV.toLocaleString()}</div></div>
    <div class="kpi-card"><div class="kpi-label">Active Pipeline</div><div class="kpi-value">$${activeValue.toLocaleString()}</div></div>
    <div class="kpi-card"><div class="kpi-label">Bids Recorded</div><div class="kpi-value">${totalBidsCount}</div></div>
    <div class="kpi-card"><div class="kpi-label">Clearance Rate</div><div class="kpi-value">${clearanceRate}%</div></div>
  </div>

  <h2>All Invoices & Settlements (${settlements.length})</h2>
  <table>
    <thead>
      <tr>
        <th>Invoice ID</th>
        <th>Lot Title</th>
        <th>Buyer</th>
        <th>Seller</th>
        <th>Amount</th>
        <th>Payment</th>
        <th>Shipping</th>
      </tr>
    </thead>
    <tbody>
      ${settlements.map(s => `
        <tr>
          <td>INV-${s.id}</td>
          <td>${s.auctionTitle}</td>
          <td>${s.buyerName}</td>
          <td>${s.sellerName}</td>
          <td><strong>$${s.amount.toLocaleString()}</strong></td>
          <td>${s.paymentStatus.toUpperCase()}</td>
          <td>${s.shippingStatus.toUpperCase()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AuctionHub_Full_Report_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('PDF Report Ready', 'Downloaded printable HTML/PDF report.', 'success');
  };

  const handleDeleteSettlement = (id: string, title: string) => {
    setDeleteTarget({
      isOpen: true,
      title: 'Delete Settlement Invoice',
      itemName: `INV-${id} - ${title}`,
      itemType: 'invoice',
      type: 'invoice',
      id
    });
  };

  const handleDeleteAuction = (id: string, title: string) => {
    setDeleteTarget({
      isOpen: true,
      title: 'Delete Auction Lot',
      itemName: `#${id} - ${title}`,
      itemType: 'auction listing',
      type: 'auction',
      id
    });
  };

  const handleDeleteBid = (id: string) => {
    setDeleteTarget({
      isOpen: true,
      title: 'Delete Bid Record',
      itemName: `Transaction #${id}`,
      itemType: 'bid entry',
      type: 'bid',
      id
    });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.type === 'invoice') {
      deleteSettlement(deleteTarget.id);
    } else if (deleteTarget.type === 'auction') {
      deleteAuction(deleteTarget.id);
    } else if (deleteTarget.type === 'bid') {
      deleteBid(deleteTarget.id);
    }
    setDeleteTarget(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports & Invoices
          </h1>
          <p className="text-xs text-slate-500">
            Generate audit reports, manage customer invoices, and export CSV ledger data.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 rounded-lg transition-colors border border-violet-200 dark:border-violet-800"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handleDownloadFullReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Gross Settled GMV</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(totalGMV)}
          </span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">{soldCount} lots settled</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Active Bidding Pipeline</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(activeValue)}
          </span>
          <span className="text-[11px] text-violet-600 dark:text-violet-400 mt-0.5 block">
            {auctions.filter(a => a.status === 'active').length} live auctions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Transaction Bids</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {totalBidsCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Across all lots</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 block">Auction Clearance Rate</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {clearanceRate}%
          </span>
          <span className="text-[11px] text-indigo-600 mt-0.5 block">Sell-through performance</span>
        </div>
      </div>

      {/* Category Performance Visual Chart */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Category Volume & Bidding Distribution
        </h3>

        <div className="space-y-3">
          {categoryStats.map((cat) => {
            const maxValue = Math.max(...categoryStats.map(c => c.value), 1000);
            const percentage = Math.round((cat.value / maxValue) * 100);
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">{cat.name}</span>
                  <div className="flex items-center gap-4 text-slate-500 font-mono">
                    <span>{cat.auctionsCount} lots</span>
                    <span>{cat.bidsCount} bids</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(cat.value)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, cat.auctionsCount > 0 ? 5 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Type Selector & Table Preview */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setReportType('invoices')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                reportType === 'invoices'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Invoices ({settlements.length})
            </button>
            <button
              onClick={() => setReportType('auctions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                reportType === 'auctions'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Auction Lots ({auctions.length})
            </button>
            <button
              onClick={() => setReportType('bids')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                reportType === 'bids'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Bids Ledger ({bids.length})
            </button>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {reportType === 'invoices' ? settlements.length : reportType === 'auctions' ? auctions.length : bids.length} records ready
          </span>
        </div>

        {/* Data Table Preview with PDF Download & Working Delete */}
        <div className="overflow-x-auto">
          {reportType === 'invoices' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Item Title</th>
                  <th className="py-2.5 px-3">Buyer</th>
                  <th className="py-2.5 px-3">Seller</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {settlements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No invoices currently recorded. Won lots will appear here.
                    </td>
                  </tr>
                ) : (
                  settlements.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-violet-600">INV-{s.id.slice(-6)}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">{s.auctionTitle}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{s.buyerName}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{s.sellerName}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">{formatCurrency(s.amount)}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-semibold text-emerald-600">{s.paymentStatus}</td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedInvoice(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-violet-700 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-300 rounded hover:bg-violet-100 transition-colors"
                          title="View and download PDF invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSettlement(s.id, s.auctionTitle)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors inline-block align-middle"
                          title="Delete invoice record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {reportType === 'auctions' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Lot ID</th>
                  <th className="py-2.5 px-3">Item Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Starting</th>
                  <th className="py-2.5 px-3 text-right">Current/Sold</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auctions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No auction records found in database.
                    </td>
                  </tr>
                ) : (
                  auctions.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{a.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">{a.title}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{a.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(a.startingPrice)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(a.currentBid)}
                      </td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-semibold">{a.status}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteAuction(a.id, a.title)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          title="Delete auction lot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {reportType === 'bids' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Bid ID</th>
                  <th className="py-2.5 px-3">Auction ID</th>
                  <th className="py-2.5 px-3">Bidder</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bids.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No bid records found.
                    </td>
                  </tr>
                ) : (
                  bids.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{b.id}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{b.auctionId}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{b.bidderName}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-violet-600 dark:text-violet-400">
                        {formatCurrency(b.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{formatRelativeTime(b.timestamp)}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-semibold">{b.status}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteBid(b.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          title="Delete bid record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Modal for View / Download PDF */}
      <InvoiceModal
        settlement={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* Delete Confirmation Modal (In-App, non-blocking) */}
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

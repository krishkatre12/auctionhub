import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useAuction } from '../../context/AuctionContext';
import { Settlement } from '../../types/auction';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { InvoiceModal } from './InvoiceModal';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { 
  BarChart3, 
  Download, 
  Printer, 
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

  // Download Full PDF Summary Report
  const handleDownloadFullReport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 36;
      const printableWidth = pageWidth - margin * 2;
      let y = 36;

      // 1. Header Banner
      doc.setFillColor(109, 40, 217); // Royal violet
      doc.rect(margin, y, printableWidth, 44, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('AUCTIONHUB PLATFORM AUDIT & REVENUE REPORT', margin + 14, y + 27);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(237, 233, 254);
      doc.text('OFFICIAL SETTLEMENT LEDGER', margin + printableWidth - 14, y + 27, { align: 'right' });

      y += 56;

      // 2. Report Metadata Sub-bar
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`Generated: ${new Date().toLocaleString()}  |  Platform Audit Ledger  |  Report ID: AH-REP-${Date.now().toString().slice(-6)}`, margin, y);

      y += 18;

      // 3. KPI Cards Summary
      const cardGap = 8;
      const cardWidth = (printableWidth - cardGap * 3) / 4;
      const cardHeight = 44;
      const kpis = [
        { label: 'GROSS SETTLED GMV', val: `$${totalGMV.toLocaleString()}` },
        { label: 'ACTIVE PIPELINE', val: `$${activeValue.toLocaleString()}` },
        { label: 'BIDS RECORDED', val: `${totalBidsCount}` },
        { label: 'CLEARANCE RATE', val: `${clearanceRate}%` }
      ];

      // Pass 1: Draw all card backgrounds & borders first (avoids jsPDF fill color caching collision)
      kpis.forEach((_, idx) => {
        const x = margin + idx * (cardWidth + cardGap);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(1);
        doc.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'FD');
      });

      // Pass 2: Draw all card text content with high contrast
      kpis.forEach((kpi, idx) => {
        const x = margin + idx * (cardWidth + cardGap);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text(kpi.label, x + 8, y + 15);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12.5);
        doc.setTextColor(15, 23, 42); // Slate-900 high contrast
        doc.text(kpi.val, x + 8, y + 33);
      });

      y += 58;

      // 4. Section Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`Official Settlement Invoices (${settlements.length})`, margin, y);

      y += 12;

      // 5. Table Columns definition (total printableWidth = ~523 pt)
      const colX = {
        inv: margin + 6,        // 42
        title: margin + 68,     // 104 (width ~136)
        buyer: margin + 206,    // 242 (width ~74)
        seller: margin + 282,   // 318 (width ~74)
        amount: margin + 358,   // 394 (width ~56)
        pay: margin + 418,      // 454 (width ~52)
        ship: margin + 472      // 508 (width ~51)
      };

      const drawTableHeader = (curY: number) => {
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, curY, printableWidth, 20, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);

        doc.text('INVOICE ID', colX.inv, curY + 13);
        doc.text('LOT TITLE', colX.title, curY + 13);
        doc.text('BUYER', colX.buyer, curY + 13);
        doc.text('SELLER', colX.seller, curY + 13);
        doc.text('AMOUNT', colX.amount, curY + 13);
        doc.text('PAYMENT', colX.pay, curY + 13);
        doc.text('SHIPPING', colX.ship, curY + 13);
      };

      drawTableHeader(y);
      y += 24;

      // 6. Table Rows
      if (settlements.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text('No settled invoices recorded yet in platform ledger.', margin + 10, y + 10);
        y += 26;
      } else {
        settlements.forEach((s, idx) => {
          if (y > 750) {
            doc.addPage();
            y = 36;
            drawTableHeader(y);
            y += 24;
          }

          // Alternating row background
          if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(margin, y - 10, printableWidth, 19, 'F');
          }

          // Bottom border line
          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.75);
          doc.line(margin, y + 8, margin + printableWidth, y + 8);

          // Invoice ID formatted properly (INV-0001, etc.)
          const rawId = s.id.replace(/^settle-/, '');
          const cleanId = rawId.length <= 4 ? rawId.padStart(4, '0') : rawId.slice(0, 8);
          const displayInvId = `INV-${cleanId}`;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(30, 41, 59);
          doc.text(displayInvId, colX.inv, y);

          // Lot Title (clean truncation so it never touches buyer column)
          const truncatedTitle = s.auctionTitle.length > 22 ? s.auctionTitle.slice(0, 20) + '...' : s.auctionTitle;
          doc.text(truncatedTitle, colX.title, y);

          // Buyer & Seller
          doc.text(s.buyerName.slice(0, 11), colX.buyer, y);
          doc.text(s.sellerName.slice(0, 11), colX.seller, y);

          // Amount
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(`$${s.amount.toLocaleString()}`, colX.amount, y);

          // Payment Status
          doc.setFontSize(7.5);
          const isPaid = s.paymentStatus === 'completed';
          if (isPaid) {
            doc.setTextColor(16, 149, 93); // green
            doc.text('PAID', colX.pay, y);
          } else {
            doc.setTextColor(217, 119, 6); // amber
            doc.text(s.paymentStatus.toUpperCase().slice(0, 7), colX.pay, y);
          }

          // Shipping Status
          const isShipped = s.shippingStatus === 'shipped' || s.shippingStatus === 'delivered';
          if (isShipped) {
            doc.setTextColor(37, 99, 235); // blue
          } else {
            doc.setTextColor(100, 116, 139); // slate
          }
          doc.text(s.shippingStatus.toUpperCase().slice(0, 9), colX.ship, y);

          y += 20;
        });

        // Summary Total Row
        y += 4;
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y - 8, printableWidth, 22, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`TOTAL SETTLED REVENUE (${settlements.length} LOTS):`, colX.inv, y + 6);
        const settledSum = settlements.reduce((sum, s) => sum + s.amount, 0);
        doc.text(`$${settledSum.toLocaleString()}`, colX.amount, y + 6);
        y += 24;
      }

      // 7. Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(
          `AuctionHub Platform Audit Ledger  ·  Page ${i} of ${totalPages}  ·  Official Verification Document`,
          pageWidth / 2,
          pageHeight - 18,
          { align: 'center' }
        );
      }

      doc.save(`AuctionHub_Audit_Report_${Date.now()}.pdf`);
      addToast('PDF Report Exported', 'Official AuctionHub PDF report saved to your computer.', 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      addToast('Export Error', 'Failed to generate PDF document.', 'warning');
    }
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
            Generate audit reports, track clearance rates, and manage customer settlement invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadFullReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Download Audit PDF
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

import React from 'react';
import { Settlement } from '../../types/auction';
import { formatCurrency } from '../../utils/formatters';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  settlement: Settlement | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ settlement, onClose }) => {
  if (!settlement) return null;

  const invoiceNumber = `INV-${settlement.id.replace('settle-', '')}`;
  const subtotal = settlement.amount;
  const escrowFee = Math.round(settlement.amount * 0.03); // 3%
  const shippingFee = 0; // included
  const total = subtotal + escrowFee;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Generate standalone printable HTML file that opens and prints directly or saves as PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-size: 26px; font-weight: bold; color: #7c3aed; }
    .invoice-title { font-size: 22px; font-weight: bold; text-align: right; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .meta-col { width: 45%; }
    .meta-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
    .meta-val { font-size: 14px; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; }
    td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .totals { width: 300px; margin-left: auto; margin-bottom: 30px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .grand-total { border-top: 2px solid #7c3aed; font-size: 18px; font-weight: bold; color: #7c3aed; padding-top: 10px; margin-top: 6px; }
    .seal { background: #f5f3ff; border: 1px solid #ddd6fe; padding: 16px; border-radius: 8px; text-align: center; color: #6d28d9; font-size: 12px; font-weight: bold; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">AuctionHub</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Verified Online Auction & Escrow Clearing House</div>
    </div>
    <div>
      <div class="invoice-title">OFFICIAL INVOICE</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">#${invoiceNumber}</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-col">
      <div class="meta-label">Billed To (Winning Bidder):</div>
      <div class="meta-val"><strong>${settlement.buyerName}</strong></div>
      <div class="meta-val">${settlement.shippingAddress || 'Verified Bidding Address'}</div>
      <div class="meta-val">Account ID: ${settlement.buyerId}</div>
    </div>
    <div class="meta-col">
      <div class="meta-label">Consignment & Auctioneer:</div>
      <div class="meta-val"><strong>${settlement.sellerName}</strong></div>
      <div class="meta-val">Auction Lot ID: #${settlement.auctionId}</div>
      <div class="meta-val">Date: ${new Date(settlement.createdAt).toLocaleDateString()}</div>
      <div class="meta-val">Payment: ${settlement.paymentStatus.toUpperCase()} (Escrow Secured)</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Particulars</th>
        <th>Category / Type</th>
        <th style="text-align: right;">Hammer Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${settlement.auctionTitle}</strong></td>
        <td>Auction Settlement Lot</td>
        <td style="text-align: right; font-family: monospace; font-weight: bold;">$${subtotal.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Hammer Bid:</span><span style="font-family: monospace;">$${subtotal.toLocaleString()}</span></div>
    <div class="total-row"><span>Buyer Escrow Fee (3%):</span><span style="font-family: monospace;">$${escrowFee.toLocaleString()}</span></div>
    <div class="total-row"><span>Insured Shipping:</span><span style="font-family: monospace; color: #16a34a;">Free / Included</span></div>
    <div class="total-row grand-total"><span>Total Paid:</span><span style="font-family: monospace;">$${total.toLocaleString()}</span></div>
  </div>

  <div class="seal">
    ESCROW VERIFICATION SEAL: All funds are guaranteed and held in secure escrow until parcel delivery is confirmed.
  </div>

  <script>
    window.onload = function() {
      // Auto-trigger print dialog for convenient 1-click Save as PDF
      window.print();
    }
  </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Invoice #{invoiceNumber}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {settlement.paymentStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
              title="Download standalone printable invoice file"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF / Invoice
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md"
              title="Print invoice directly"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Brand & Invoice Header */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xl font-bold text-violet-600 dark:text-violet-400 tracking-tight">
                Auction<span className="text-slate-900 dark:text-white">Hub</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified Online Auction & Escrow Clearing House</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-white block uppercase">Official Tax Invoice</span>
              <span className="font-mono text-slate-500 block">{invoiceNumber}</span>
              <span className="text-slate-400 text-[11px] block">{new Date(settlement.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To (Winner)</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{settlement.buyerName}</p>
              <p className="text-slate-500">{settlement.shippingAddress || '742 Evergreen Terrace, Boston, MA'}</p>
              <p className="text-slate-400 font-mono text-[10px]">Buyer ID: {settlement.buyerId}</p>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Auctioneer & Seller</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{settlement.sellerName}</p>
              <p className="text-slate-500">Auction Lot ID: #{settlement.auctionId}</p>
              <p className="text-slate-400 font-mono text-[10px]">Seller ID: {settlement.sellerId}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Item Particulars</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Hammer Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {settlement.auctionTitle}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    Won Auction Lot
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown & Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Winning Hammer Bid:</span>
                <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Escrow Fee (3%):</span>
                <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(escrowFee)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Insured Freight:</span>
                <span className="font-mono text-emerald-600 font-semibold">Included</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-violet-600 dark:text-violet-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Amount:</span>
                <span className="font-mono">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Escrow Seal Card */}
          <div className="p-3.5 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-violet-600 shrink-0" />
            <p className="text-[11px] text-violet-950 dark:text-violet-200">
              <strong>Escrow Protection Active:</strong> Funds are locked in neutral escrow. Disbursed to seller only upon successful courier delivery.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

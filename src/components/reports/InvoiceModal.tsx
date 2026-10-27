import React from 'react';
import { jsPDF } from 'jspdf';
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
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = 40;

      // Header Brand
      doc.setTextColor(124, 58, 237);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('AuctionHub', margin, y + 20);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(18);
      doc.text('TAX INVOICE & RECEIPT', pageWidth - margin, y + 20, { align: 'right' });

      y += 35;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Verified Online Auction & Escrow Settlement House', margin, y);
      doc.text(`Invoice No: ${invoiceNumber}`, pageWidth - margin, y, { align: 'right' });

      y += 15;
      doc.text(`Issue Date: ${new Date(settlement.createdAt).toLocaleDateString()}`, pageWidth - margin, y, { align: 'right' });

      y += 20;
      doc.setDrawColor(124, 58, 237);
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageWidth - margin, y);

      y += 25;
      // Parties Box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('BILLED TO (WINNING BIDDER):', margin, y);
      doc.text('CONSIGNMENT & AUCTIONEER:', margin + 260, y);

      y += 14;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(settlement.buyerName, margin, y);
      doc.text(settlement.sellerName, margin + 260, y);

      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Account ID: ${settlement.buyerId}`, margin, y);
      doc.text(`Auction Lot ID: #${settlement.auctionId}  |  Payment: ${settlement.paymentStatus.toUpperCase()}`, margin + 260, y);

      y += 25;
      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('ITEM DESCRIPTION', margin + 10, y + 14);
      doc.text('TYPE', margin + 300, y + 14);
      doc.text('HAMMER PRICE', pageWidth - margin - 10, y + 14, { align: 'right' });

      y += 22;
      // Table Content
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      y += 16;
      doc.text(settlement.auctionTitle, margin + 10, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Auction Lot Settlement', margin + 300, y);
      doc.setFont('helvetica', 'bold');
      doc.text(`$${subtotal.toLocaleString()}`, pageWidth - margin - 10, y, { align: 'right' });

      y += 20;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);

      y += 25;
      // Totals
      const totalsX = pageWidth - margin - 200;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);

      doc.text('Winning Hammer Bid:', totalsX, y);
      doc.text(`$${subtotal.toLocaleString()}`, pageWidth - margin - 10, y, { align: 'right' });

      y += 16;
      doc.text('Buyer Escrow Protection (3%):', totalsX, y);
      doc.text(`$${escrowFee.toLocaleString()}`, pageWidth - margin - 10, y, { align: 'right' });

      y += 16;
      doc.text('Fully Insured Shipping:', totalsX, y);
      doc.setTextColor(22, 163, 74);
      doc.text('Included / Free', pageWidth - margin - 10, y, { align: 'right' });

      y += 18;
      doc.setDrawColor(124, 58, 237);
      doc.setLineWidth(1.5);
      doc.line(totalsX - 10, y, pageWidth - margin, y);

      y += 16;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(124, 58, 237);
      doc.text('TOTAL PAID:', totalsX, y);
      doc.text(`$${total.toLocaleString()}`, pageWidth - margin - 10, y, { align: 'right' });

      y += 45;
      // Escrow Assurance Seal Box
      doc.setFillColor(245, 243, 255);
      doc.setDrawColor(221, 214, 254);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 45, 4, 4, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(109, 40, 217);
      doc.text('ESCROW VERIFICATION & BUYER PROTECTION SEAL', margin + 14, y + 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(124, 58, 237);
      doc.text('Payment is securely escrowed. Funds are released to the consignor only after delivery tracking is verified.', margin + 14, y + 32);

      doc.save(`AuctionHub_Invoice_${invoiceNumber}.pdf`);
    } catch (err) {
      console.error('Invoice PDF error:', err);
    }
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

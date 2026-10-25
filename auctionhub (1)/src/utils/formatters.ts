import { AuctionStatus, BidStatus } from '../types/auction';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatRelativeTime = (isoString?: string): string => {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
};

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export const calculateTimeLeft = (endTimeIso?: string): TimeLeft => {
  if (!endTimeIso) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: 'Auction Ended' };
  }
  try {
    const end = new Date(endTimeIso).getTime();
    if (isNaN(end)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: 'Auction Ended' };
    }
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: 'Auction Ended' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');

    let formatted = '';
    if (days > 0) {
      formatted = `${days}d ${pad(hours)}h ${pad(minutes)}m`;
    } else {
      formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return { days, hours, minutes, seconds, isExpired: false, formatted };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: 'Auction Ended' };
  }
};

export const getAuctionStatusLabel = (status: AuctionStatus): { text: string; colorClass: string; dotClass: string } => {
  switch (status) {
    case 'active':
      return { text: 'Active', colorClass: 'text-emerald-600 dark:text-emerald-400', dotClass: 'bg-emerald-500' };
    case 'upcoming':
      return { text: 'Upcoming', colorClass: 'text-amber-600 dark:text-amber-400', dotClass: 'bg-amber-500' };
    case 'closed':
      return { text: 'Closed', colorClass: 'text-slate-600 dark:text-slate-400', dotClass: 'bg-slate-400' };
    case 'sold':
      return { text: 'Sold', colorClass: 'text-violet-600 dark:text-violet-400', dotClass: 'bg-violet-600' };
    case 'cancelled':
      return { text: 'Cancelled', colorClass: 'text-rose-600 dark:text-rose-400', dotClass: 'bg-rose-500' };
    default:
      return { text: status, colorClass: 'text-slate-500', dotClass: 'bg-slate-300' };
  }
};

export const getBidStatusLabel = (status: BidStatus): { text: string; colorClass: string } => {
  switch (status) {
    case 'winning':
      return { text: 'Winning', colorClass: 'text-emerald-600 dark:text-emerald-400 font-medium' };
    case 'won':
      return { text: 'Won Lot', colorClass: 'text-violet-600 dark:text-violet-400 font-semibold' };
    case 'outbid':
      return { text: 'Outbid', colorClass: 'text-amber-600 dark:text-amber-400' };
    case 'placed':
      return { text: 'Placed', colorClass: 'text-slate-600 dark:text-slate-300' };
    case 'lost':
      return { text: 'Lost', colorClass: 'text-rose-600 dark:text-rose-400' };
    default:
      return { text: status, colorClass: 'text-slate-500' };
  }
};

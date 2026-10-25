export type AuctionStatus = 'active' | 'upcoming' | 'closed' | 'sold' | 'cancelled';
export type BidStatus = 'placed' | 'winning' | 'outbid' | 'won' | 'lost';
export type ItemCondition = 'New' | 'Like New' | 'Excellent' | 'Good' | 'Fair' | 'Vintage/Antique';
export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Auction {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: ItemCondition;
  images: string[];
  sellerId: string;
  sellerName: string;
  startingPrice: number;
  currentBid: number;
  reservePrice?: number;
  minIncrement: number;
  startTime: string; // ISO
  endTime: string;   // ISO
  status: AuctionStatus;
  winnerId?: string;
  winnerName?: string;
  viewsCount: number;
  featured?: boolean;
  location?: string;
  specifications?: Record<string, string>;
  createdAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string; // ISO
  status: BidStatus;
  isAutoBid?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
  watchlist: string[]; // auction IDs
  autoBids: Record<string, number>; // auctionId -> maxAmount
}

export type PaymentStatus = 'pending' | 'completed' | 'refunded';
export type ShippingStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface Settlement {
  id: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  shippingAddress?: string;
  trackingNumber?: string;
  carrier?: string;
  paidAt?: string;
  createdAt: string;
}

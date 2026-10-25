import { Auction, Bid, Settlement, User } from '../types/auction';

export const SAMPLE_USERS: User[] = [
  {
    id: 'user-collector-elena',
    name: 'Elena Vance',
    email: 'elena.vance@example.com',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    walletBalance: 45000,
    watchlist: ['auc-1', 'auc-3'],
    autoBids: { 'auc-1': 160000 }
  },
  {
    id: 'user-auctioneer-marcus',
    name: 'Marcus Sterling',
    email: 'marcus.sterling@sterlingauctions.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    walletBalance: 120500,
    watchlist: [],
    autoBids: {}
  },
  {
    id: 'user-admin-sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@auctionhub.internal',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    walletBalance: 250000,
    watchlist: [],
    autoBids: {}
  }
];

export const getSampleAuctions = (): { auctions: Auction[]; bids: Bid[]; settlements: Settlement[] } => {
  const now = new Date();

  // Helper for dates
  const addHours = (hours: number) => new Date(now.getTime() + hours * 3600 * 1000).toISOString();
  const subHours = (hours: number) => new Date(now.getTime() - hours * 3600 * 1000).toISOString();

  const auctions: Auction[] = [
    {
      id: 'auc-1',
      title: '1967 Shelby GT500 Fastback in Wimbledon White',
      description: 'Numbers-matching 428ci Police Interceptor V8 with dual 4-barrel Holley carburetors and 4-speed Toploader manual transmission. Fully documented in the SAAC registry with factory build sheet and original dealer sales invoice.',
      category: 'Vehicles',
      condition: 'Excellent',
      images: [
        'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&h=800&q=80'
      ],
      sellerId: 'user-auctioneer-marcus',
      sellerName: 'Marcus Sterling',
      startingPrice: 120000,
      currentBid: 148500,
      reservePrice: 140000,
      minIncrement: 1500,
      startTime: subHours(36),
      endTime: addHours(4),
      status: 'active',
      viewsCount: 1420,
      featured: true,
      location: 'Monterey, CA',
      specifications: {
        'Engine': '428ci Dual-Quad Police Interceptor',
        'Transmission': '4-Speed Toploader Manual',
        'Mileage': '48,210 original miles',
        'VIN': '67200F2A01842',
        'SAAC Registry': 'Listed #01842'
      },
      createdAt: subHours(40)
    },
    {
      id: 'auc-2',
      title: 'Rolex Cosmograph Daytona "Paul Newman" Ref. 6239',
      description: 'Iconic vintage stainless steel chronograph featuring the coveted exotic tricolor stepped dial with art deco font and crosshairs in the subdials. Valjoux 722 manual-wind caliber in immaculate running condition.',
      category: 'Jewelry & Watches',
      condition: 'Excellent',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&h=800&q=80'
      ],
      sellerId: 'user-auctioneer-marcus',
      sellerName: 'Marcus Sterling',
      startingPrice: 85000,
      currentBid: 112000,
      reservePrice: 100000,
      minIncrement: 2000,
      startTime: subHours(18),
      endTime: addHours(14),
      status: 'active',
      viewsCount: 2310,
      featured: true,
      location: 'Geneva, Switzerland',
      specifications: {
        'Case Material': 'Stainless Steel',
        'Diameter': '37.5 mm',
        'Caliber': 'Valjoux 722 Hand-Wound',
        'Year': 'circa 1968',
        'Box & Papers': 'Original archival guarantee certificate'
      },
      createdAt: subHours(20)
    },
    {
      id: 'auc-3',
      title: 'Mid-Century Teak Credenza by Arne Vodder for Sibast',
      description: 'Masterpiece Danish modern credenza with reversible sliding tambour doors revealing colored lacquer trays in deep vermillion and canary yellow. Solid teak sculptured drawer pulls and brass key fittings.',
      category: 'Antiques & Vintage',
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&h=800&q=80'
      ],
      sellerId: 'user-auctioneer-marcus',
      sellerName: 'Marcus Sterling',
      startingPrice: 4200,
      currentBid: 6800,
      reservePrice: 5000,
      minIncrement: 200,
      startTime: subHours(48),
      endTime: addHours(26),
      status: 'active',
      viewsCount: 680,
      featured: false,
      location: 'Copenhagen, Denmark',
      specifications: {
        'Designer': 'Arne Vodder',
        'Manufacturer': 'Sibast Møbler',
        'Wood': 'Solid Burmese Teak',
        'Dimensions': '210cm x 50cm x 80cm',
        'Provenance': 'Private Estate, Hellerup'
      },
      createdAt: subHours(50)
    },
    {
      id: 'auc-4',
      title: '"Subconscious Resonance" Original Acrylic on Linen by Kaori Sano',
      description: 'Monumental 72" x 96" abstract composition featuring layered textural pigment, raw gold leaf inclusions, and meditative chromatic transitions. Exhibited in the Tokyo Contemporary Salon 2024.',
      category: 'Art & Paintings',
      condition: 'New',
      images: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&h=800&q=80'
      ],
      sellerId: 'user-auctioneer-marcus',
      sellerName: 'Marcus Sterling',
      startingPrice: 15000,
      currentBid: 15000,
      reservePrice: 18000,
      minIncrement: 500,
      startTime: addHours(6),
      endTime: addHours(78),
      status: 'upcoming',
      viewsCount: 390,
      featured: true,
      location: 'Tokyo, Japan',
      specifications: {
        'Medium': 'Acrylic & 24K Gold Leaf on Raw Linen',
        'Dimensions': '182.8 cm x 243.8 cm',
        'Signed': 'Verso with Artist Fingerprint Seal',
        'COA': 'Authenticated by Gallery Kura'
      },
      createdAt: subHours(12)
    },
    {
      id: 'auc-5',
      title: '1982 McIntosh MC2500 500W Stereo Power Amplifier',
      description: 'The legendary "Superman" laboratory-grade high current power amplifier. Dual illuminated output meters in iconic McIntosh ocean blue with walnut end panels. Serviced and recapped by certified McIntosh technician.',
      category: 'Electronics',
      condition: 'Excellent',
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&h=800&q=80',
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&h=800&q=80'
      ],
      sellerId: 'user-auctioneer-marcus',
      sellerName: 'Marcus Sterling',
      startingPrice: 3800,
      currentBid: 5400,
      reservePrice: 4500,
      minIncrement: 150,
      startTime: subHours(72),
      endTime: subHours(1),
      status: 'sold',
      winnerId: 'user-collector-elena',
      winnerName: 'Elena Vance',
      viewsCount: 1180,
      featured: false,
      location: 'Boston, MA',
      specifications: {
        'Power Output': '500 Watts per channel into 1, 2, 4, 8 ohms',
        'Weight': '129 lbs (58.5 kg)',
        'Meters': 'Dual Power Output & Peak Responsive'
      },
      createdAt: subHours(80)
    }
  ];

  const bids: Bid[] = [
    {
      id: 'bid-101',
      auctionId: 'auc-1',
      bidderId: 'user-anon-1',
      bidderName: 'VintageRacer44',
      amount: 125000,
      timestamp: subHours(30),
      status: 'outbid'
    },
    {
      id: 'bid-102',
      auctionId: 'auc-1',
      bidderId: 'user-anon-2',
      bidderName: 'ApexCollector',
      amount: 135000,
      timestamp: subHours(22),
      status: 'outbid'
    },
    {
      id: 'bid-103',
      auctionId: 'auc-1',
      bidderId: 'user-collector-elena',
      bidderName: 'Elena Vance',
      amount: 148500,
      timestamp: subHours(2),
      status: 'winning',
      isAutoBid: true
    },
    {
      id: 'bid-201',
      auctionId: 'auc-2',
      bidderId: 'user-anon-3',
      bidderName: 'HorologySwiss',
      amount: 90000,
      timestamp: subHours(15),
      status: 'outbid'
    },
    {
      id: 'bid-202',
      auctionId: 'auc-2',
      bidderId: 'user-anon-4',
      bidderName: 'MonacoLover',
      amount: 112000,
      timestamp: subHours(3),
      status: 'winning'
    },
    {
      id: 'bid-301',
      auctionId: 'auc-3',
      bidderId: 'user-anon-5',
      bidderName: 'NordicHaven',
      amount: 5200,
      timestamp: subHours(24),
      status: 'outbid'
    },
    {
      id: 'bid-302',
      auctionId: 'auc-3',
      bidderId: 'user-collector-elena',
      bidderName: 'Elena Vance',
      amount: 6800,
      timestamp: subHours(8),
      status: 'winning'
    },
    {
      id: 'bid-501',
      auctionId: 'auc-5',
      bidderId: 'user-collector-elena',
      bidderName: 'Elena Vance',
      amount: 5400,
      timestamp: subHours(2),
      status: 'won'
    }
  ];

  const settlements: Settlement[] = [
    {
      id: 'settle-1',
      auctionId: 'auc-5',
      auctionTitle: '1982 McIntosh MC2500 500W Stereo Power Amplifier',
      auctionImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&h=300&q=80',
      buyerId: 'user-collector-elena',
      buyerName: 'Elena Vance',
      sellerId: 'user-auctioneer-marcus',
      sellerName: 'Marcus Sterling',
      amount: 5400,
      paymentStatus: 'completed',
      shippingStatus: 'shipped',
      shippingAddress: '742 Evergreen Terrace, Suite 4B, Boston MA 02108',
      trackingNumber: 'AH-FEDEX-9482019482',
      carrier: 'FedEx Freight High-Value',
      paidAt: subHours(1),
      createdAt: subHours(1)
    }
  ];

  return { auctions, bids, settlements };
};
